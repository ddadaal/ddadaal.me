import { DateTime } from "luxon";
import Link from "next/link";
import { RankedContent } from "src/server/adminAnalytics";

interface Props {
  title: string;
  items: RankedContent[];
  zone: string;
  /** Omit for tables whose rows have no detail view (e.g. retired content). */
  itemHref?: (kind: "article" | "spark", id: string) => string;
}

export function RankingTable({ title, items, zone, itemHref }: Props) {
  const maxViews = Math.max(1, ...items.map((item) => item.views));

  return (
    <div className="card bg-base-100 shadow-sm border border-base-content/10">
      <div className="card-body gap-3">
        <h2 className="card-title text-base">
          {title}
          <span className="badge badge-ghost badge-sm font-normal">{items.length} 项</span>
        </h2>
        <div className="overflow-x-auto max-h-[36rem] overflow-y-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>内容</th>
                <th className="w-40">分布</th>
                <th className="text-right">浏览量</th>
                <th className="text-right">独立访客</th>
                <th className="text-right">全时段累计</th>
                <th>最近浏览</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center opacity-60 py-6">
                    该范围内暂无数据。
                  </td>
                </tr>
              )}
              {items.map((item, index) => {
                const linkKind = item.kind === "spark" ? ("spark" as const) : ("article" as const);
                const href = item.href && itemHref ? itemHref(linkKind, item.id) : undefined;
                return (
                  <tr key={`${item.kind}:${item.id}`}>
                    <td className="tabular-nums opacity-60">{index + 1}</td>
                    <td className="max-w-72">
                      <div className="flex items-center gap-2 flex-wrap">
                        {href ? (
                          <Link className="link link-hover font-medium" href={href}>
                            {item.title}
                          </Link>
                        ) : (
                          <span className="font-medium">{item.title}</span>
                        )}
                        {item.kind === "about" && (
                          <span className="badge badge-ghost badge-sm">关于页</span>
                        )}
                        {item.kind === "retired" && (
                          <span className="badge badge-warning badge-sm">已下架</span>
                        )}
                      </div>
                      {item.excerpt && (
                        <div className="text-xs opacity-60 mt-0.5 truncate">{item.excerpt}</div>
                      )}
                    </td>
                    <td>
                      {item.views > 0 ? (
                        <div className="h-2 w-full min-w-24 rounded-full bg-base-300/60">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(item.views / maxViews) * 100}%` }}
                          />
                        </div>
                      ) : (
                        // An empty track would read as a real (tiny) bar.
                        <span className="opacity-40">—</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums">{item.views}</td>
                    <td className="text-right tabular-nums">{item.visitors}</td>
                    <td className="text-right tabular-nums opacity-75">{item.lifetimeViews}</td>
                    <td className="tabular-nums opacity-75 whitespace-nowrap">
                      {item.lastViewedAtMs
                        ? DateTime.fromMillis(item.lastViewedAtMs, { zone }).toFormat(
                            "yyyy-MM-dd HH:mm",
                          )
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
