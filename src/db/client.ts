import "server-only";

import { drizzle } from "drizzle-orm/node-mssql";
import sql from "mssql";

import { sqlConfig } from "./config";
import * as schema from "./schema";

const globalSql = globalThis as typeof globalThis & { articleViewsPool?: Promise<sql.ConnectionPool> };

export function getSqlPool(): Promise<sql.ConnectionPool> {
  if (!globalSql.articleViewsPool) {
    const pool = new sql.ConnectionPool(sqlConfig());
    pool.on("error", () => {
      console.error("Article views SQL connection pool error");
    });
    globalSql.articleViewsPool = pool.connect().catch(async (error: unknown) => {
      globalSql.articleViewsPool = undefined;
      await pool.close().catch(() => undefined);
      throw error;
    });
  }
  return globalSql.articleViewsPool;
}

export async function getDb() {
  return drizzle({ client: await getSqlPool(), schema });
}
