import {
  getBreakdown,
  getContentRankings,
  getDailySeries,
  getOverview,
  parseItemParam,
  parseRange,
  presetRange,
  RankedContent,
} from "src/server/adminAnalytics";

import { AdminFilters } from "./AdminFilters";
import { BreakdownChart } from "./BreakdownChart";
import { ItemDetail } from "./ItemDetail";
import { RankingTable } from "./RankingTable";
import { StatCards } from "./StatCards";
import { TrendChart } from "./TrendChart";
import { logoutAction } from "./actions";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PRESETS = [
  { label: "今天", days: 1 },
  { label: "近 7 天", days: 7 },
  { label: "近 30 天", days: 30 },
  { label: "近 90 天", days: 90 },
];

export async function AdminDashboard({ searchParams }: Props) {
  // First read of searchParams in the tree; everything above stays static.
  const params = await searchParams;
  const first = (name: string) => {
    const value = params[name];
    return Array.isArray(value) ? value[0] : value;
  };

  const range = parseRange(first("from"), first("to"));
  const includeBots = first("bots") === "1";
  const metric = first("metric") === "uniques" ? ("uniques" as const) : ("views" as const);
  const item = parseItemParam(first("item"));

  const overview = getOverview(range, includeBots);
  const series = getDailySeries(range, includeBots);
  const rankings = await getContentRankings(range, includeBots);
  const referrers = getBreakdown(range, "referrer", includeBots);
  const browsers = getBreakdown(range, "browser", includeBots);
  const systems = getBreakdown(range, "operatingSystem", includeBots);
  const devices = getBreakdown(range, "deviceType", includeBots);

  const baseQuery = new URLSearchParams({ from: range.from, to: range.to });
  if (metric === "uniques") baseQuery.set("metric", "uniques");
  if (includeBots) baseQuery.set("bots", "1");
  const plainHref = `/admin?${baseQuery.toString()}`;
  const itemHref = (kind: "article" | "spark", id: string) => {
    const query = new URLSearchParams(baseQuery);
    query.set("item", `${kind}:${id}`);
    return `/admin?${query.toString()}`;
  };

  const presets = PRESETS.map(({ label, days }) => {
    const preset = presetRange(range, days);
    const query = new URLSearchParams(baseQuery);
    query.set("from", preset.from);
    query.set("to", preset.to);
    return {
      label,
      href: `/admin?${query.toString()}`,
      active: range.from === preset.from && range.to === preset.to,
    };
  });

  const selected: RankedContent | undefined = item
    ? (item.kind === "spark" ? rankings.sparks : rankings.articles).find(
        (entry) => entry.id === item.id,
      )
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">访问分析</h1>
          <p className="text-sm opacity-70 mt-1">
            时区：{range.zone}（{range.zoneLabel}）・{includeBots ? "包含机器人" : "已排除机器人"}
            ・独立访客按会话估算
          </p>
        </div>
        <form action={logoutAction}>
          <button className="btn btn-ghost btn-sm" type="submit">
            退出登录
          </button>
        </form>
      </header>

      <AdminFilters
        from={range.from}
        to={range.to}
        metric={metric}
        bots={includeBots}
        item={item ? `${item.kind}:${item.id}` : undefined}
        presets={presets}
      />

      <StatCards overview={overview} includeBots={includeBots} />

      <TrendChart
        title={`按天趋势（${metric === "views" ? "浏览量" : "独立访客"}）`}
        data={series}
        metric={metric}
      />

      {item && selected && (
        <ItemDetail
          item={item}
          entry={selected}
          range={range}
          includeBots={includeBots}
          metric={metric}
          closeHref={plainHref}
        />
      )}

      <RankingTable
        title="文章排行"
        items={rankings.articles}
        zone={range.zone}
        itemHref={itemHref}
      />

      <RankingTable
        title="想法排行"
        items={rankings.sparks}
        zone={range.zone}
        itemHref={itemHref}
      />

      {rankings.retired.length > 0 && (
        <RankingTable title="已下架内容" items={rankings.retired} zone={range.zone} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <BreakdownChart title="来源（Referrer）" entries={referrers} />
        <BreakdownChart title="浏览器" entries={browsers} />
        <BreakdownChart title="操作系统" entries={systems} />
        <BreakdownChart title="设备类型" entries={devices} />
      </div>
    </div>
  );
}
