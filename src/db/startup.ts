import "server-only";

import { migrate } from "drizzle-orm/node-sqlite/migrator";
import { access } from "fs/promises";
import { join } from "path";

import { getDb } from "./client";

const globalStartup = globalThis as typeof globalThis & { articleViewsStartup?: Promise<void> };

async function migrateDatabase() {
  const folder = join(process.cwd(), "drizzle");
  await access(folder);
  migrate(getDb(), { migrationsFolder: folder });
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

// SQLite needs no provisioning: the database file is created on open, so
// startup always runs pending migrations except during the production build,
// where no database file should be touched.
export async function initializeDatabaseAtStartup() {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  await ensureDatabaseReady();
}
