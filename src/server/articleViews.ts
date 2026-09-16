import "server-only";

import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { articleViews, visitEvents } from "src/db/schema";
import { getDb } from "src/server/sql";

export interface VisitEventInput {
  sessionId: string;
  path: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ipHash?: string;
  browser?: string;
  operatingSystem?: string;
  deviceType?: string;
  isBot: boolean;
  statusCode: number;
  responseMs: number;
}

/**
 * In-memory view counter with delta-based persistence.
 *
 * Reads are served from a process-local Map (base + pending delta) and never
 * touch the database after warmup. Writes are flushed in batches as
 * *increments* (`ViewCount = ViewCount + delta`), so any number of instances
 * can flush concurrently without losing counts. In multi-instance
 * deployments each instance's read is a lower bound of the true total until
 * other instances flush; in single-instance deployments reads are exact.
 * A crash between flushes loses at most one interval's worth of visits.
 */
const bases = new Map<string, bigint>();
const deltas = new Map<string, bigint>();
const pendingEvents: (VisitEventInput & { id: string; articleId: string })[] = [];

let warmedUp = false;
let warmupPromise: Promise<void> | null = null;
let flushing: Promise<void> | null = null;
let flushTimer: ReturnType<typeof setInterval> | null = null;

const FLUSH_INTERVAL_MS = 60_000;
const MAX_PENDING_EVENTS = 500;

async function warmup() {
  if (warmedUp) return;
  warmupPromise ??= (async () => {
    const db = await getDb();
    const rows = await db
      .select({ articleId: articleViews.articleId, viewCount: articleViews.viewCount })
      .from(articleViews);
    for (const row of rows) {
      bases.set(row.articleId, BigInt(row.viewCount));
    }
    warmedUp = true;
  })();
  return warmupPromise;
}

/**
 * Load all counters from the database and start the periodic flush timer.
 * Called once from instrumentation.ts at process startup.
 */
export async function initializeArticleViews() {
  await warmup();

  flushTimer = setInterval(() => {
    void flushArticleViews().catch((error: unknown) => {
      console.error(
        "Article views periodic flush failed:",
        error instanceof Error ? error.message : String(error),
      );
    });
  }, FLUSH_INTERVAL_MS);
  flushTimer.unref(); // do not keep the process alive just for the flush timer

  const graceful = () => {
    stopArticleViews();
    void flushArticleViews()
      .catch((error: unknown) => {
        console.error(
          "Article views shutdown flush failed:",
          error instanceof Error ? error.message : String(error),
        );
      })
      .finally(() => process.exit(0));
  };
  process.once("SIGTERM", graceful);
  process.once("SIGINT", graceful);
}

/** Stop the periodic flush timer. Used by tests to let the process exit. */
export function stopArticleViews() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

/**
 * Overwrite the in-memory counter, e.g. to simulate a restart warmup after
 * the database was changed externally. Exported for tests.
 */
export function reseedArticleView(articleId: string, viewCount: string) {
  bases.set(articleId, BigInt(viewCount));
  deltas.delete(articleId);
}

/**
 * Persist pending deltas and queued visit events in one transaction.
 * Safe to call concurrently: concurrent calls share the same in-flight flush.
 */
export async function flushArticleViews(): Promise<void> {
  if (flushing) return flushing;
  flushing = (async () => {
    if (!deltas.size && !pendingEvents.length) return;
    // Snapshot state up-front so visits recorded during the flush are left
    // for the next round instead of being lost when the deltas are reduced.
    const batch = [...deltas];
    const events = pendingEvents.splice(0, pendingEvents.length);
    try {
      const db = await getDb();
      await db.transaction(async (tx) => {
        for (const [articleId, delta] of batch) {
          const value = delta.toString();
          // Incremental upsert keyed on the primary key. Increments commute,
          // so concurrent flushes from multiple instances never lose counts.
          await tx.execute(sql`
            MERGE ${articleViews} AS target
            USING (SELECT ${articleId} AS ArticleId) AS source
            ON target.ArticleId = source.ArticleId
            WHEN MATCHED THEN
              UPDATE SET ViewCount = ViewCount + ${value}, LastViewedAt = SYSUTCDATETIME()
            WHEN NOT MATCHED THEN
              INSERT (ArticleId, ViewCount, LastViewedAt)
              VALUES (${articleId}, ${value}, SYSUTCDATETIME());
          `);
        }
        if (events.length) {
          await tx.insert(visitEvents).values(
            events.map(({ id, articleId, ...event }) => ({
              id,
              articleId,
              ...event,
              isBot: event.isBot ? 1 : 0,
            })),
          );
        }
      });
      // Fold persisted deltas into the base, keeping any increments that
      // arrived while the flush was in flight.
      for (const [articleId, delta] of batch) {
        bases.set(articleId, (bases.get(articleId) ?? BigInt(0)) + delta);
        const remaining = (deltas.get(articleId) ?? BigInt(0)) - delta;
        if (remaining <= BigInt(0)) deltas.delete(articleId);
        else deltas.set(articleId, remaining);
      }
    } catch (error) {
      // Events are re-queued so the next flush retries; deltas were not
      // cleared up-front, so counts remain in memory regardless.
      pendingEvents.unshift(...events);
      throw error;
    }
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}

function record(articleId: string): string {
  const next = (deltas.get(articleId) ?? BigInt(0)) + BigInt(1);
  deltas.set(articleId, next);
  return ((bases.get(articleId) ?? BigInt(0)) + next).toString();
}

export async function getArticleViews(articleId: string): Promise<string> {
  await warmup();
  return ((bases.get(articleId) ?? BigInt(0)) + (deltas.get(articleId) ?? BigInt(0))).toString();
}

/** Record a plain view without analytics metadata (no VisitEvents row). */
export async function recordArticleView(articleId: string): Promise<string> {
  await warmup();
  return record(articleId);
}

export async function recordVisitEvent(articleId: string, event: VisitEventInput): Promise<string> {
  await warmup();
  const views = record(articleId);
  pendingEvents.push({ id: randomUUID(), articleId, ...event });
  // Prevent unbounded memory growth under heavy traffic.
  if (pendingEvents.length >= MAX_PENDING_EVENTS) {
    void flushArticleViews().catch((error: unknown) => {
      console.error(
        "Article views threshold flush failed:",
        error instanceof Error ? error.message : String(error),
      );
    });
  }
  return views;
}
