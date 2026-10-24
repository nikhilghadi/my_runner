import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../utils/constants';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function open() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
  return db;
}

export function getDb() {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}