import "server-only";

import { and, count, countDistinct, desc, eq, gte, lte, sql, type SQL } from "drizzle-orm";
import { DateTime } from "luxon";
import { articleViews, visitEvents } from "src/db/schema";
import { loadSparks, sparkIds } from "src/app/sparks/loader";
import { getArticleBasePath } from "src/data/articleBasePath";
import { articleIds, readAllArticlesCached } from "src/data/articles";
import { getDb } from "src/server/sql";
import { formatArticleTime } from "src/utils/datetime";

/** Same fixed-offset convention as content timestamps (see utils/datetime.ts). */
const DEFAULT_TIMEZONE = "Asia/Shanghai";
const DEFAULT_RANGE_DAYS = 30;
/** Upper bound for a single query window; a stray URL must not ask for years. */
const MAX_RANGE_DAYS = 366;

export interface AdminRange {
  /** Inclusive day bounds in the admin timezone, as YYYY-MM-DD. */
  from: string;
  to: string;
  startMs: number;
  /** End of the `to` day. */
  endMs: number;
  zone: string;
  /** UTC offset (minutes) at the start of the range, e.g. 480 for UTC+8. */
  offsetMinutes: number;
  /** SQLite date() modifier for day bucketing, e.g. "+480 minutes". */
  offsetModifier: string;
  zoneLabel: string;
}

function adminZone(): string {
  const configured = process.env.ADMIN_TZ;
  if (!configured) return DEFAULT_TIMEZONE;
  try {
    return DateTime.fromMillis(Date.now(), { zone: configured }).isValid
      ? configured
      : DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

function parseDay(raw: string | undefined, zone: string): DateTime | undefined {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  const value = DateTime.fromISO(raw, { zone });
  return value.isValid ? value.startOf("day") : undefined;
}

function offsetLabel(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
}

/**
 * Accepts YYYY-MM-DD inputs from the date pickers. Invalid, reversed, or
 * future input is clamped rather than rejected, so a hand-edited URL never
 * errors the page.
 */
export function parseRange(fromRaw?: string, toRaw?: string, now = Date.now()): AdminRange {
  const zone = adminZone();
  const today = DateTime.fromMillis(now, { zone }).startOf("day");

  let to = parseDay(toRaw, zone) ?? today;
  if (to > today) to = today;
  let from = parseDay(fromRaw, zone) ?? to.minus({ days: DEFAULT_RANGE_DAYS - 1 });
  if (from > to) from = to.minus({ days: DEFAULT_RANGE_DAYS - 1 });
  const earliest = to.minus({ days: MAX_RANGE_DAYS - 1 });
  if (from < earliest) from = earliest;

  // Day buckets are computed in SQL with this fixed modifier instead of
  // SQLite's 'localtime' so the result does not depend on the process TZ (the
  // container runs UTC). A DST timezone would drift by an hour after a
  // transition; the default Asia/Shanghai has no DST.
  const offsetMinutes = from.offset;
  return {
    from: from.toFormat("yyyy-MM-dd"),
    to: to.toFormat("yyyy-MM-dd"),
    startMs: from.toMillis(),
    endMs: to.endOf("day").toMillis(),
    zone,
    offsetMinutes,
    offsetModifier: `${offsetMinutes >= 0 ? "+" : ""}${offsetMinutes} minutes`,
    zoneLabel: offsetLabel(offsetMinutes),
  };
}

/** Last `days` days (inclusive) ending today, for the quick presets. */
export function presetRange(range: AdminRange, days: number, now = Date.now()) {
  const to = DateTime.fromMillis(now, { zone: range.zone }).startOf("day");
  const from = to.minus({ days: days - 1 });
  return { from: from.toFormat("yyyy-MM-dd"), to: to.toFormat("yyyy-MM-dd") };
}

export interface ItemRef {
  kind: "article" | "spark";
  id: string;
}

export function parseItemParam(raw: string | undefined): ItemRef | null {
  if (!raw) return null;
  const match = /^(article|spark):(.{1,256})$/.exec(raw);
  if (!match) return null;
  const id = match[2];
  if (match[1] === "spark") return sparkIds.has(id) ? { kind: "spark", id } : null;
  return articleIds.has(id) ? { kind: "article", id } : null;
}

function rangeWhere(range: AdminRange, includeBots: boolean, itemId?: string): SQL | undefined {
  return and(
    gte(visitEvents.occurredAt, new Date(range.startMs)),
    lte(visitEvents.occurredAt, new Date(range.endMs)),
    includeBots ? undefined : eq(visitEvents.isBot, false),
    itemId ? eq(visitEvents.articleId, itemId) : undefined,
  );
}

export interface AnalyticsOverview {
  views: number;
  /** COUNT(DISTINCT SessionId): approximate, one 30-day cookie = one visitor. */
  visitors: number;
  botViews: number;
  humanViews: number;
}

export interface DailyPoint {
  day: string;
  views: number;
  visitors: number;
}

export interface BreakdownEntry {
  label: string;
  views: number;
}

export interface RankedContent {
  id: string;
  kind: "article" | "spark" | "about" | "retired";
  title: string;
  excerpt?: string;
  href?: string;
  views: number;
  visitors: number;
  lastViewedAtMs: number | null;
  /** All-time counter from ArticleViews, a decimal string (see schema.ts). */
  lifetimeViews: string;
}

export interface ContentRankings {
  articles: RankedContent[];
  sparks: RankedContent[];
  /** Ids in VisitEvents that no longer exist in content; kept so totals reconcile. */
  retired: RankedContent[];
}

export function getOverview(range: AdminRange, includeBots: boolean): AnalyticsOverview {
  const totals = getItemTotals(range, includeBots);
  const botSplit = getDb()
    .select({ isBot: visitEvents.isBot, views: count() })
    .from(visitEvents)
    .where(rangeWhere(range, true))
    .groupBy(visitEvents.isBot)
    .all();
  return {
    ...totals,
    botViews: botSplit.find((row) => row.isBot)?.views ?? 0,
    humanViews: botSplit.find((row) => !row.isBot)?.views ?? 0,
  };
}

export function getItemTotals(
  range: AdminRange,
  includeBots: boolean,
  itemId?: string,
): { views: number; visitors: number } {
  const row = getDb()
    .select({ views: count(), visitors: countDistinct(visitEvents.sessionId) })
    .from(visitEvents)
    .where(rangeWhere(range, includeBots, itemId))
    .all()[0];
  return { views: row?.views ?? 0, visitors: row?.visitors ?? 0 };
}

function dayBucket(range: AdminRange): SQL<string> {
  // OccurredAt / 1000 is integer division on positive values, i.e. an exact
  // floor from milliseconds to seconds.
  return sql<string>`strftime('%Y-%m-%d', ${visitEvents.occurredAt} / 1000, 'unixepoch', ${range.offsetModifier})`;
}

export function getDailySeries(
  range: AdminRange,
  includeBots: boolean,
  itemId?: string,
): DailyPoint[] {
  const bucket = dayBucket(range);
  const rows = getDb()
    .select({ day: bucket, views: count(), visitors: countDistinct(visitEvents.sessionId) })
    .from(visitEvents)
    .where(rangeWhere(range, includeBots, itemId))
    .groupBy(bucket)
    .all();

  // Zero-fill so the chart has one point per day in the range.
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const points: DailyPoint[] = [];
  const end = DateTime.fromMillis(range.endMs, { zone: range.zone });
  for (
    let cursor = DateTime.fromMillis(range.startMs, { zone: range.zone });
    cursor <= end;
    cursor = cursor.plus({ days: 1 })
  ) {
    const day = cursor.toFormat("yyyy-MM-dd");
    const row = byDay.get(day);
    points.push({ day, views: row?.views ?? 0, visitors: row?.visitors ?? 0 });
  }
  return points;
}

const breakdownColumns = {
  referrer: visitEvents.referrer,
  browser: visitEvents.browser,
  operatingSystem: visitEvents.operatingSystem,
  deviceType: visitEvents.deviceType,
} as const;

export type BreakdownDimension = keyof typeof breakdownColumns;

export function getBreakdown(
  range: AdminRange,
  dimension: BreakdownDimension,
  includeBots: boolean,
  itemId?: string,
): BreakdownEntry[] {
  const column = breakdownColumns[dimension];
  // Referrers are grouped on the raw string (SQLite cannot parse URLs), then
  // normalized to hosts in TS; the SQL-side cap bounds that work.
  const limit = dimension === "referrer" ? 200 : 15;
  const rows = getDb()
    .select({ label: column, views: count() })
    .from(visitEvents)
    .where(rangeWhere(range, includeBots, itemId))
    .groupBy(column)
    .orderBy(desc(count()))
    .limit(limit)
    .all();

  if (dimension === "referrer") {
    return normalizeReferrers(rows.map((row) => ({ label: row.label ?? "", views: row.views })));
  }
  return rows.map((row) => ({ label: row.label || "未知", views: row.views }));
}

function referrerHost(raw: string): string {
  const value = raw.trim();
  if (!value) return "（直接访问）";
  try {
    return new URL(value).hostname || "（直接访问）";
  } catch {
    // A malformed referrer is still a useful (rare) signal; keep it short.
    return value.slice(0, 100);
  }
}

function normalizeReferrers(entries: BreakdownEntry[]): BreakdownEntry[] {
  const byHost = new Map<string, number>();
  for (const entry of entries) {
    const host = referrerHost(entry.label);
    byHost.set(host, (byHost.get(host) ?? 0) + entry.views);
  }
  const sorted = [...byHost.entries()]
    .map(([label, views]) => ({ label, views }))
    .sort((a, b) => b.views - a.views);
  const top = sorted.slice(0, 10);
  const rest = sorted.slice(10).reduce((sum, entry) => sum + entry.views, 0);
  if (rest > 0) top.push({ label: "（其他）", views: rest });
  return top;
}

function byViewsThenId(a: RankedContent, b: RankedContent): number {
  return b.views - a.views || a.id.localeCompare(b.id);
}

/**
 * In-range per-content stats merged with content metadata (titles live in the
 * content system, stats in SQLite). Zero-view items are included so the tables
 * show the full catalog; the article/spark/retired split keeps the sum equal
 * to the site total even when content has been removed.
 */
export async function getContentRankings(
  range: AdminRange,
  includeBots: boolean,
): Promise<ContentRankings> {
  const rows = getDb()
    .select({
      id: visitEvents.articleId,
      views: count(),
      visitors: countDistinct(visitEvents.sessionId),
      lastViewedAt: sql<number | null>`MAX(${visitEvents.occurredAt})`,
    })
    .from(visitEvents)
    .where(rangeWhere(range, includeBots))
    .groupBy(visitEvents.articleId)
    .orderBy(desc(count()))
    .all();
  const statsById = new Map(rows.map((row) => [row.id, row]));

  const lifetimeRows = getDb()
    .select({ articleId: articleViews.articleId, viewCount: articleViews.viewCount })
    .from(articleViews)
    .all();
  const lifetimeById = new Map(lifetimeRows.map((row) => [row.articleId, row.viewCount]));

  const articles: RankedContent[] = (await readAllArticlesCached())
    .map((item) => {
      const stats = statsById.get(item.id);
      const first = item.langVersions[0];
      return {
        id: item.id,
        kind: item.langVersions.some((version) => version.absolute_path)
          ? ("about" as const)
          : ("article" as const),
        title: first?.title ?? item.id,
        href: first ? getArticleBasePath(first) : undefined,
        views: stats?.views ?? 0,
        visitors: stats?.visitors ?? 0,
        lastViewedAtMs: stats?.lastViewedAt ?? null,
        lifetimeViews: lifetimeById.get(item.id) ?? "0",
      };
    })
    .sort(byViewsThenId);

  const sparks: RankedContent[] = (await loadSparks())
    .map((spark) => {
      const stats = statsById.get(spark.id);
      return {
        id: spark.id,
        kind: "spark" as const,
        title: formatArticleTime(spark.time),
        excerpt: spark.content.replace(/\s+/g, " ").trim().slice(0, 80),
        href: `/sparks/${spark.id}`,
        views: stats?.views ?? 0,
        visitors: stats?.visitors ?? 0,
        lastViewedAtMs: stats?.lastViewedAt ?? null,
        lifetimeViews: lifetimeById.get(spark.id) ?? "0",
      };
    })
    .sort(byViewsThenId);

  const retired: RankedContent[] = rows
    .filter((row) => !articleIds.has(row.id) && !sparkIds.has(row.id))
    .map((row) => ({
      id: row.id,
      kind: "retired" as const,
      title: row.id,
      views: row.views,
      visitors: row.visitors,
      lastViewedAtMs: row.lastViewedAt,
      lifetimeViews: lifetimeById.get(row.id) ?? "0",
    }));

  return { articles, sparks, retired };
}
