import {expect} from 'chai';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {IN_MEMORY_SQLITE_PATH, SQLite} from '../../src/database/SQLite';
import {Database} from '../../src/database/Database';
import {restoreTestDatabase} from '../utils/setup';

describe('SQLite', () => {
  let db: SQLite;
  let firstGameSave: Promise<void> | undefined;
  beforeEach(() => {
    firstGameSave = undefined;
    db = new SQLite(IN_MEMORY_SQLITE_PATH, true);
    Database.getInstance = () => db;
    const origSaveGame = db.saveGame;
    db.saveGame = async (game) => {
      firstGameSave = origSaveGame.call(db, game);
    };
    return db.initialize();
  });

  afterEach(() => {
    restoreTestDatabase();
  });

  it('game is saved', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    Game.newInstance('game-id-1212', [player], player);
    await firstGameSave;
    await new Promise<void>((resolve) => {
      db.getGames((err, allGames) => {
        expect(err).eq(undefined);
        expect(allGames).deep.eq(['game-id-1212']);
        resolve();
      });
    });
  });
});
