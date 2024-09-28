require('dotenv').config();

import {GameId} from '../../common/Types';
import {Database} from '../database/Database';
import {IDatabase} from '../database/IDatabase';
import {PostgreSQL} from '../database/PostgreSQL';

const db: IDatabase = Database.getInstance();

async function main() {
  await db.initialize();
  const gameIds = await db.getGameIds();
  gameIds.sort();
  for (const gameId of gameIds) {
    console.log(gameId);
    await load(gameId);
  }
}

async function load(gameId: GameId) {
  const saveIds = await db.getSaveIds(gameId);
  saveIds.sort((a, b) => b - a);
  for (const saveId of saveIds) {
    if (saveId === 0) {
      continue;
    }
    try {
      await (db as PostgreSQL).update(gameId, saveId);
    } catch (err) {
      console.log(`failed to process saveId ${saveId}: ${err}`);
    }
  }
}

main();
