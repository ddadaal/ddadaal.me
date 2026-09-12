import "server-only";

import { eq, sql } from "drizzle-orm";
import { articleViews } from "src/db/schema";
import { getDb } from "src/server/sql";

// Return BIGINT as a decimal string so counts cannot lose precision in JSON.
export async function getArticleViews(articleId: string): Promise<string> {
  const db = await getDb();
  const result = await db.select({ views: articleViews.viewCount })
    .from(articleViews)
    .where(eq(articleViews.articleId, articleId));
  return result.length ? result[0].views : "0";
}

export async function recordArticleView(articleId: string): Promise<string> {
  const db = await getDb();
  return db.transaction(async (tx) => {
    // UPDATE first takes an update/range lock under SERIALIZABLE, including
    // when no row exists yet. The insert and increment share one transaction.
    const updated = await tx.update(articleViews)
      .set({ viewCount: sql`${articleViews.viewCount} + 1`, lastViewedAt: sql`SYSUTCDATETIME()` })
      .where(eq(articleViews.articleId, articleId))
      .output({ inserted: { views: articleViews.viewCount } });

    if (updated.length) {
      return updated[0].inserted.views;
    }

    await tx.insert(articleViews).values({ articleId, viewCount: "1" });
    return "1";
  }, { isolationLevel: "serializable" });
}
