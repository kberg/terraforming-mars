import {Database} from './Database';
import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {GameIdLedger, IGameLoader} from './IGameLoader';
import {MultiMap} from 'mnemonist';
import {Metrics} from '../server/metrics';
import {once} from 'events';
import {EventEmitter} from 'events';
/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export class GameLoader implements IGameLoader {
  private static instance?: GameLoader;

  private cache = new Cache();

  private constructor() {
    Metrics.INSTANCE.time('gameloader-initialize', () => {
      this.cache.load();
    });
  }

  // Exposed for testing.
  public reset(): void {
    this.cache = new Cache();
    this.cache.load();
  }

  public static getInstance(): IGameLoader {
    if (GameLoader.instance === undefined) {
      GameLoader.instance = new GameLoader();
    }
    return GameLoader.instance;
  }

  public add(game: Game): void {
    return this.cache.add(game);
  }

  public async getLoadedGameIds(): Promise<Array<GameIdLedger>> {
    const d = await this.cache.get();
    const map = new MultiMap<GameId, SpectatorId | PlayerId>();
    d.participantIds.forEach((gameId, participantId) => map.set(gameId, participantId));
    const arry: Array<[GameId, Array<PlayerId | SpectatorId>]> = Array.from(map.associations());
    return arry.map(([id, participants]) => ({id: id, participants: participants}));
  }

  public async getByGameId(gameId: GameId, bypassCache: boolean): Promise<Game | undefined> {
    const d = await this.cache.get();
    if (bypassCache === false && d.games.get(gameId) !== undefined) {
      return d.games.get(gameId);
    } else if (d.games.has(gameId)) {
      return this.loadGame(gameId, bypassCache);
    } else {
      return undefined;
    }
  }

  public async getByParticipantId(id: PlayerId | SpectatorId): Promise<Game | undefined> {
    const d = await this.cache.get();

    const gameId = d.participantIds.get(id);
    if (gameId === undefined) return undefined;

    const cachedGame = d.games.get(gameId);
    if (cachedGame !== undefined) return cachedGame;
    return this.loadGame(gameId, true);
  }

  public async restoreGameAt(gameId: GameId, saveId: number): Promise<Game> {
    const serializedGame = await Database.getInstance().restoreGame(gameId, saveId);
    const game = Game.deserialize(serializedGame);
    // TODO(kberg): make deleteGameNbrSaves return a promise.
    await Database.getInstance().deleteGameNbrSaves(gameId, 1);
    await this.add(game);
    game.undoCount++;
    return game;
  }

  public async rollbackOnce(gameId: GameId, lastSaveId: number): Promise<Game> {
    const database = Database.getInstance();
    const saveIds = await database.getSaveIds(gameId);
    saveIds.sort();
    console.log(saveIds.toString());
    let maxStoredSaveId = saveIds.pop();
    if (maxStoredSaveId === undefined) {
      // The -1 is because what's on disk is always 1 behind.
      // This can't happen. Just use the last id.
      maxStoredSaveId = lastSaveId - 1;
    }
    const serializedGame = await database.getGameVersion(gameId, maxStoredSaveId - 1);
    const game = Game.deserialize(serializedGame);
    this.add(game);
    game.undoCount++;
    return game;
  }

  private async loadGame(gameId: GameId, bypassCache: boolean): Promise<Game | undefined> {
    const d = await this.cache.get();
    if (bypassCache === false) {
      const game = d.games.get(gameId);
      if (game !== undefined) {
        return game;
      }
    }
    try {
      const serializedGame = await Database.getInstance().getGame(gameId);
      if (serializedGame === undefined) {
        console.error(`loadGameAsync: game ${gameId} not found`);
        return undefined;
      }
      const game = Game.deserialize(serializedGame);
      await this.add(game);
      console.log(`GameLoader loaded game ${gameId} into memory from database`);
      return game;
    } catch (e) {
      console.error('GameLoader:loadGame', e);
      return undefined;
    }
  }
}

class Cache extends EventEmitter {
  private loaded = false;
  private readonly games = new Map<GameId, Game | undefined>();
  private readonly participantIds = new Map<SpectatorId | PlayerId, GameId>();

  public async load(): Promise<void> {
    try {
      const allGameIds = await Database.getInstance().getGameIds();
      await this.getAllInstances(allGameIds);
    } catch (err) {
      console.error('error loading all games', err);
    }
    this.loaded = true;
    this.emit('loaded');
  }

  public async get(): Promise<{games:ReadonlyMap<GameId, Game | undefined>, participantIds:ReadonlyMap<SpectatorId | PlayerId, GameId>}> {
    if (!this.loaded) {
      await once(this, 'loaded');
    }
    return {games: this.games, participantIds: this.participantIds};
  }

  public add(game: Game): void {
    this.games.set(game.id, game);
    if (game.spectatorId !== undefined) {
      this.participantIds.set(game.spectatorId, game.id);
    }
    for (const player of game.getPlayers()) {
      this.participantIds.set(player.id, game.id);
    }
  }

  private async getInstance(gameId: GameId) : Promise<void> {
    const game = await Database.getInstance().getGame(gameId);
    // This is almost exactly the same as add(game) but deals with a SerializedGame. Still duplicates code, but worth noting.
    if (this.games.get(gameId) === undefined) {
      this.games.set(gameId, undefined);
      if (game.spectatorId !== undefined) {
        this.participantIds.set(game.spectatorId, gameId);
      }
      for (const player of game.players) {
        this.participantIds.set(player.id, gameId);
      }
    }
  }

  private async getAllInstances(allGameIds: Array<GameId>): Promise<void> {
    Metrics.INSTANCE.mark('game-ids-get-all-instances-started');
    const sliceSize = 1000;
    for (let i = 0; i < allGameIds.length; i += sliceSize) {
      const slice = allGameIds.slice(i, i + sliceSize);
      await Promise.all(slice.map((x) => this.getInstance(x))).then(() => {
        console.log(`Loaded ${i} to ${i + slice.length} of ${allGameIds.length}`);
      });
    }
    Metrics.INSTANCE.mark('game-ids-get-all-instances-finished');
  }
}
