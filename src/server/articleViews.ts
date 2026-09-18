import "server-only";

import { randomUUID } from "crypto";
import { eq, sql, SQLWrapper } from "drizzle-orm";
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
 * Incremental upsert keyed on the primary key, returning the committed total.
 * Increments commute, so concurrent writers never lose counts. View counts
 * are stored as decimal strings (see schema.ts) and incremented through CAST
 * to INTEGER, which stays exact up to SQLite's 64-bit limit.
 */
function incrementViewCount(articleId: string): SQLWrapper {
  return sql`
    INSERT INTO "ArticleViews" ("ArticleId", "ViewCount", "LastViewedAt")
    VALUES (${articleId}, '1', cast((julianday('now') - 2440587.5) * 86400000 as integer))
    ON CONFLICT ("ArticleId") DO UPDATE SET
      "ViewCount" = CAST("ArticleViews"."ViewCount" AS INTEGER) + 1,
      "LastViewedAt" = excluded."LastViewedAt"
    RETURNING "ViewCount" AS "viewCount"
  `;
}

// node:sqlite is synchronous, so every read and write below hits the database
// directly; the async signatures only keep the API route handlers unchanged.
export async function getArticleViews(articleId: string): Promise<string> {
  const rows = getDb()
    .select({ viewCount: articleViews.viewCount })
    .from(articleViews)
    .where(eq(articleViews.articleId, articleId))
    .all();
  return rows[0]?.viewCount ?? "0";
}

/** Record a plain view without analytics metadata (no VisitEvents row). */
export async function recordArticleView(articleId: string): Promise<string> {
  const rows = getDb().all<{ viewCount: string }>(incrementViewCount(articleId));
  return rows[0].viewCount;
}

/** Record a view together with its analytics metadata in one transaction. */
export async function recordVisitEvent(articleId: string, event: VisitEventInput): Promise<string> {
  return getDb().transaction((tx) => {
    const rows = tx.all<{ viewCount: string }>(incrementViewCount(articleId));
    tx.insert(visitEvents)
      .values({ id: randomUUID(), articleId, ...event })
      .run();
    return rows[0].viewCount;
  });
}
