import "server-only";

import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
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

const articleViewsTag = (articleId: string) => `article-views:${articleId}`;

// Return BIGINT as a decimal string so counts cannot lose precision in JSON.
async function queryArticleView(articleId: string): Promise<string> {
  const db = await getDb();
  const [result] = await db
    .select({ views: articleViews.viewCount })
    .from(articleViews)
    .where(eq(articleViews.articleId, articleId));
  return result?.views ?? "0";
}

/**
 * Cache each article's total independently so a new visit only invalidates
 * the article that was viewed.
 */
async function getCachedArticleView(articleId: string): Promise<string> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag(articleViewsTag(articleId));
  return queryArticleView(articleId);
}

export async function getArticleViews(articleId: string): Promise<string> {
  return getCachedArticleView(articleId);
}

export async function recordArticleView(articleId: string): Promise<string> {
  const db = await getDb();
  const views = await db.transaction(
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
  revalidateTag(articleViewsTag(articleId), { expire: 0 });
  return views;
}

export async function recordVisitEvent(articleId: string, event: VisitEventInput): Promise<string> {
  const db = await getDb();
  const views = await db.transaction(
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
  revalidateTag(articleViewsTag(articleId), { expire: 0 });
  return views;
}
