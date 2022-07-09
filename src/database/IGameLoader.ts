import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';

export type GameIdLedger = {id: GameId, participants: Array<SpectatorId | PlayerId>};

/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export interface IGameLoader {
  /** Called when the server creates a new game. */
  add(game: Game): void;
  getLoadedGameIds(): Promise<Array<GameIdLedger>>;
  /**
   * Gets a game from javascript memory or pulls from database if needed.
   * @param {GameId} gameId the id of the game to retrieve
   * @param {boolean} bypassCache when true just pull from the database, otherwise check the cache.
   */
  getByGameId(gameId: GameId, bypassCache: boolean): Promise<Game | undefined>;
  getByParticipantId(playerId: PlayerId | SpectatorId): Promise<Game | undefined>;
  restoreGameAt(gameId: GameId, saveId: number): Promise<Game>;
  /**
   * Roll back one step in the database and load the most recent version.
   * @param gameId the game to roll back one step.
   * @param lastSaveId the active last saved id. This is generally used for
   * validation.
   */
  rollbackOnce(gameId: GameId, lastSaveId: number): Promise<Game>;
}
