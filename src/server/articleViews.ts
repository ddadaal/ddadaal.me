import "server-only";

import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
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

// Return BIGINT as a decimal string so counts cannot lose precision in JSON.
async function queryArticleViews(): Promise<Record<string, string>> {
  const db = await getDb();
  const result = await db
    .select({ articleId: articleViews.articleId, views: articleViews.viewCount })
    .from(articleViews);
  return Object.fromEntries(result.map((row) => [row.articleId, row.views]));
}

/**
 * Read all totals in one cached query. Article lists request one total per
 * item, but they now share this snapshot and cause at most one SQL read per
 * cache lifetime across the whole application instance/cache store.
 */
async function getCachedArticleViews(): Promise<Record<string, string>> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag("article-views");
  return queryArticleViews();
}

export async function getArticleViews(articleId: string): Promise<string> {
  const views = await getCachedArticleViews();
  return views[articleId] ?? "0";
}

export async function recordArticleView(articleId: string): Promise<string> {
  const db = await getDb();
  return db.transaction(
    async (tx) => {
      // UPDATE first takes an update/range lock under SERIALIZABLE, including
      // when no row exists yet. The insert and increment share one transaction.
      const updated = await tx
        .update(articleViews)
        .set({ viewCount: sql`${articleViews.viewCount} + 1`, lastViewedAt: sql`SYSUTCDATETIME()` })
        .where(eq(articleViews.articleId, articleId))
        .output({ inserted: { views: articleViews.viewCount } });

      if (updated.length) {
        return updated[0].inserted.views;
      }

      await tx.insert(articleViews).values({ articleId, viewCount: "1" });
      return "1";
    },
    { isolationLevel: "serializable" },
  );
}

export async function recordVisitEvent(articleId: string, event: VisitEventInput): Promise<string> {
  const db = await getDb();
  return db.transaction(
    async (tx) => {
      const updated = await tx
        .update(articleViews)
        .set({ viewCount: sql`${articleViews.viewCount} + 1`, lastViewedAt: sql`SYSUTCDATETIME()` })
        .where(eq(articleViews.articleId, articleId))
        .output({ inserted: { views: articleViews.viewCount } });

      if (!updated.length) {
        await tx.insert(articleViews).values({ articleId, viewCount: "1" });
      }

      await tx.insert(visitEvents).values({
        id: randomUUID(),
        articleId,
        ...event,
        isBot: event.isBot ? 1 : 0,
      });

      if (updated.length) return updated[0].inserted.views;
      return "1";
    },
    { isolationLevel: "serializable" },
  );
}
