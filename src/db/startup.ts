import "server-only";

import { migrate } from "drizzle-orm/node-mssql/migrator";
import { access } from "fs/promises";
import sql from "mssql";
import { join } from "path";

import { getDb } from "./client";
import { sqlConfig } from "./config";

const globalStartup = globalThis as typeof globalThis & { articleViewsStartup?: Promise<void> };
const sqlEnvNames = ["AZURE_SQL_SERVER", "AZURE_SQL_DATABASE", "AZURE_SQL_USER", "AZURE_SQL_PASSWORD"] as const;

function quoteIdentifier(identifier: string) {
  if (!/^[A-Za-z0-9_$-]+$/.test(identifier)) throw new Error("AZURE_SQL_DATABASE contains unsupported characters");
  return `[${identifier.replaceAll("]", "]]")}]`;
}

async function createDatabaseIfMissing() {
  const target = sqlConfig();
  const master = await new sql.ConnectionPool({ ...target, database: "master" }).connect();
  try {
    const literal = target.database.replaceAll("'", "''");
    try {
      await master.request().query(`IF DB_ID(N'${literal}') IS NULL CREATE DATABASE ${quoteIdentifier(target.database)};`);
    }
    catch (error: unknown) {
      // Multiple Next.js workers may initialize at the same time. SQL Server
      // reports 1801 when another worker created the database between the
      // existence check and CREATE DATABASE; that is a successful outcome.
      if (!(error instanceof Error && "number" in error && error.number === 1801)) {
        throw error;
      }
    }
  }
  finally {
    await master.close();
  }
}

async function migrateDatabase() {
  await createDatabaseIfMissing();
  const folder = join(process.cwd(), "drizzle");
  await access(folder);
  await migrate(await getDb(), { migrationsFolder: folder });
}

export function ensureDatabaseReady() {
  if (!globalStartup.articleViewsStartup) {
    globalStartup.articleViewsStartup = migrateDatabase().catch((error: unknown) => {
      globalStartup.articleViewsStartup = undefined;
      throw error;
    });
  }
  return globalStartup.articleViewsStartup;
}

export async function initializeDatabaseAtStartup() {
  const hasAny = sqlEnvNames.some((name) => process.env[name]);
  const hasAll = sqlEnvNames.every((name) => process.env[name]);
  if (process.env.NEXT_PHASE === "phase-production-build" || !hasAny) return;
  if (!hasAll) throw new Error("Article views startup requires all AZURE_SQL_* connection variables");
  await ensureDatabaseReady();
}
