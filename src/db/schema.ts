import { sql } from "drizzle-orm";
import { bigint, check, datetime2, mssqlTable, nvarchar } from "drizzle-orm/mssql-core";

export const articleViews = mssqlTable("ArticleViews", {
  articleId: nvarchar("ArticleId", { length: 256 }).primaryKey(),
  viewCount: bigint("ViewCount", { mode: "string" }).notNull().default("0"),
  lastViewedAt: datetime2("LastViewedAt", { precision: 3 }).notNull().default(sql`SYSUTCDATETIME()`),
}, (table) => [
  check("ArticleViews_ViewCount_nonnegative", sql`${table.viewCount} >= 0`),
]);
