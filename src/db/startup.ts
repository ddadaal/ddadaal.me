import "server-only";

import { migrate } from "drizzle-orm/node-mssql/migrator";
import { access } from "fs/promises";
import { join } from "path";

import { getDb } from "./client";

const globalStartup = globalThis as typeof globalThis & { articleViewsStartup?: Promise<void> };
const sqlEnvNames = [
  "AZURE_SQL_SERVER",
  "AZURE_SQL_DATABASE",
  "AZURE_SQL_USER",
  "AZURE_SQL_PASSWORD",
] as const;

async function migrateDatabase() {
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
  if (!hasAll)
    throw new Error("Article views startup requires all AZURE_SQL_* connection variables");
  await ensureDatabaseReady();
}
