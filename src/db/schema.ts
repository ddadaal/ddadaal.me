import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// View counts are decimal strings, not SQLite integers: node:sqlite throws
// when reading an INTEGER beyond 2^53 unless every statement reads bigints,
// and a decimal string is exact at any magnitude. Arithmetic goes through
// CAST(... AS INTEGER), which is exact within SQLite's 64-bit range.
export const articleViews = sqliteTable(
  "ArticleViews",
  {
    articleId: text("ArticleId").primaryKey(),
    viewCount: text("ViewCount").notNull().default("0"),
    lastViewedAt: integer("LastViewedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  },
  (table) => [
    check("ArticleViews_ViewCount_nonnegative", sql`CAST(${table.viewCount} AS INTEGER) >= 0`),
  ],
);

export const visitEvents = sqliteTable(
  "VisitEvents",
  {
    id: text("Id").primaryKey(),
    occurredAt: integer("OccurredAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
    sessionId: text("SessionId").notNull(),
    articleId: text("ArticleId").notNull(),
    path: text("Path").notNull(),
    referrer: text("Referrer"),
    utmSource: text("UtmSource"),
    utmMedium: text("UtmMedium"),
    utmCampaign: text("UtmCampaign"),
    ipHash: text("IpHash"),
    browser: text("Browser"),
    operatingSystem: text("OperatingSystem"),
    deviceType: text("DeviceType"),
    isBot: integer("IsBot", { mode: "boolean" }).notNull().default(false),
    statusCode: integer("StatusCode").notNull().default(200),
    responseMs: integer("ResponseMs").notNull(),
  },
  (table) => [
    index("VisitEvents_Article_Occurred").on(table.articleId, table.occurredAt),
    index("VisitEvents_Session_Occurred").on(table.sessionId, table.occurredAt),
  ],
);
