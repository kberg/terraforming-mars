import {expect} from 'chai';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {IN_MEMORY_SQLITE_PATH, SQLite} from '../../src/database/SQLite';
import {Database} from '../../src/database/Database';
import {restoreTestDatabase} from '../utils/setup';

describe('SQLite', () => {
  let db: SQLite;

  beforeEach(() => {
    db = new SQLite(IN_MEMORY_SQLITE_PATH, true);
    Database.getInstance = () => db;
    return db.initialize();
  });

  afterEach(() => {
    restoreTestDatabase();
  });

  it('game is saved', (done) => {
    const player = TestPlayers.BLACK.newPlayer();
    Game.newInstance('game-id-1212', [player], player);

    db.getGames((err, allGames) => {
      expect(err).eq(undefined);
      expect(allGames).deep.eq(['game-id-1212']);
      done();
    });
  });
});
