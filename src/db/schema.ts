import { sql } from "drizzle-orm";
import { bigint, check, datetime2, index, int, mssqlTable, nvarchar } from "drizzle-orm/mssql-core";

export const articleViews = mssqlTable("ArticleViews", {
  articleId: nvarchar("ArticleId", { length: 256 }).primaryKey(),
  viewCount: bigint("ViewCount", { mode: "string" }).notNull().default("0"),
  lastViewedAt: datetime2("LastViewedAt", { precision: 3 }).notNull().default(sql`SYSUTCDATETIME()`),
}, (table) => [
  check("ArticleViews_ViewCount_nonnegative", sql`${table.viewCount} >= 0`),
]);

export const visitEvents = mssqlTable("VisitEvents", {
  id: nvarchar("Id", { length: 36 }).primaryKey(),
  occurredAt: datetime2("OccurredAt", { precision: 3 }).notNull().default(sql`SYSUTCDATETIME()`),
  sessionId: nvarchar("SessionId", { length: 64 }).notNull(),
  articleId: nvarchar("ArticleId", { length: 256 }).notNull(),
  path: nvarchar("Path", { length: 2048 }).notNull(),
  referrer: nvarchar("Referrer", { length: 2048 }),
  utmSource: nvarchar("UtmSource", { length: 256 }),
  utmMedium: nvarchar("UtmMedium", { length: 256 }),
  utmCampaign: nvarchar("UtmCampaign", { length: 256 }),
  ipHash: nvarchar("IpHash", { length: 64 }),
  browser: nvarchar("Browser", { length: 64 }),
  operatingSystem: nvarchar("OperatingSystem", { length: 64 }),
  deviceType: nvarchar("DeviceType", { length: 16 }),
  isBot: int("IsBot").notNull().default(0),
  statusCode: int("StatusCode").notNull().default(200),
  responseMs: int("ResponseMs").notNull(),
}, (table) => [
  index("VisitEvents_Article_Occurred").on(table.articleId, table.occurredAt),
  index("VisitEvents_Session_Occurred").on(table.sessionId, table.occurredAt),
]);
