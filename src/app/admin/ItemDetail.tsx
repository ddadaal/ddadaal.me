import { DateTime } from "luxon";
import Link from "next/link";
import {
  AdminRange,
  getBreakdown,
  getDailySeries,
  getItemTotals,
  ItemRef,
  RankedContent,
} from "src/server/adminAnalytics";

import { BreakdownChart } from "./BreakdownChart";
import { TrendChart } from "./TrendChart";

interface Props {
  item: ItemRef;
  entry: RankedContent;
  range: AdminRange;
  includeBots: boolean;
  metric: "views" | "uniques";
  closeHref: string;
}

const KIND_LABEL = { article: "文章", about: "关于页", spark: "想法", retired: "已下架" } as const;

export async function ItemDetail({ item, entry, range, includeBots, metric, closeHref }: Props) {
  const totals = getItemTotals(range, includeBots, item.id);
  const series = getDailySeries(range, includeBots, item.id);
  const referrers = getBreakdown(range, "referrer", includeBots, item.id);
  const devices = getBreakdown(range, "deviceType", includeBots, item.id);

  return (
    <section className="rounded-box border border-primary/40 p-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">内容详情</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-medium">{entry.title}</span>
            <span className="badge badge-ghost badge-sm">{KIND_LABEL[entry.kind]}</span>
            {entry.href && (
              <Link className="link link-hover text-sm" href={entry.href}>
                打开页面 ↗
              </Link>
            )}
          </div>
          {entry.excerpt && <p className="text-xs opacity-60 mt-1">{entry.excerpt}</p>}
        </div>
        <Link className="btn btn-ghost btn-sm" href={closeHref}>
          关闭详情
        </Link>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <span>
          范围内浏览 <b className="tabular-nums">{totals.views}</b>
        </span>
        <span>
          范围内独立访客 <b className="tabular-nums">{totals.visitors}</b>
        </span>
        <span>
          全时段累计 <b className="tabular-nums">{entry.lifetimeViews}</b>
        </span>
        <span>
          最近浏览{" "}
          <b className="tabular-nums">
            {entry.lastViewedAtMs
              ? DateTime.fromMillis(entry.lastViewedAtMs, { zone: range.zone }).toFormat(
                  "yyyy-MM-dd HH:mm",
                )
              : "—"}
          </b>
        </span>
      </div>
      <TrendChart title={`按天趋势 - ${entry.title}`} data={series} metric={metric} />
      <div className="grid gap-4 md:grid-cols-2">
        <BreakdownChart title="来源（Referrer）" entries={referrers} />
        <BreakdownChart title="设备类型" entries={devices} />
      </div>
    </section>
  );
}
