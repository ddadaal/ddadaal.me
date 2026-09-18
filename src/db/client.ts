import "server-only";

import { drizzle, NodeSQLiteDatabase } from "drizzle-orm/node-sqlite";
import { mkdirSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import { dirname } from "path";

import { sqliteDbPath } from "./config";

const globalSqlite = globalThis as typeof globalThis & {
  articleViewsDb?: NodeSQLiteDatabase & { $client: DatabaseSync };
};

export function getDb() {
  if (!globalSqlite.articleViewsDb) {
    const path = sqliteDbPath();
    mkdirSync(dirname(path), { recursive: true });
    const client = new DatabaseSync(path);
    // WAL lets readers proceed during the periodic flush; a busy timeout
    // absorbs lock contention instead of failing a request.
    client.exec("PRAGMA journal_mode = WAL");
    client.exec("PRAGMA busy_timeout = 5000");
    globalSqlite.articleViewsDb = drizzle({ client });
  }
  return globalSqlite.articleViewsDb;
}
