import {Database} from '../../src/database/Database';
import {IDatabase} from '../../src/database/IDatabase';
import {SerializedGame} from '../../src/SerializedGame';

const FAKE_DATABASE: IDatabase = {
  cleanGame: () => Promise.resolve(),
  deleteGameNbrSaves: () => {},
  getPlayerCount: () => Promise.resolve(0),
  getGame: () => Promise.resolve({} as SerializedGame),
  getGameId: () => Promise.resolve('g'),
  getGameVersion: () => Promise.resolve({} as SerializedGame),
  getGameIds: () => Promise.resolve([]),
  getSaveIds: () => Promise.resolve([]),
  initialize: () => Promise.resolve(),
  restoreGame: () => Promise.reject(new Error('game not found')),
  loadCloneableGame: () => Promise.resolve({} as SerializedGame),
  saveGameResults: () => {},
  saveGame: () => Promise.resolve(),
  purgeUnfinishedGames: () => Promise.resolve(),
  stats: () => Promise.resolve({}),

  storeParticipants: () => Promise.resolve(),
  getParticipants: () => Promise.reject(new Error('Not used')),
};

let databaseUnderTest: IDatabase = FAKE_DATABASE;

export function restoreTestDatabase() {
  setTestDatabase(FAKE_DATABASE);
}

export function setTestDatabase(db: IDatabase) {
  databaseUnderTest = db;
}

Database.getInstance = () => databaseUnderTest;