import { AnalyticsOverview } from "src/server/adminAnalytics";

interface Props {
  overview: AnalyticsOverview;
  includeBots: boolean;
}

export function StatCards({ overview, includeBots }: Props) {
  const total = overview.humanViews + overview.botViews;
  const botShare = total > 0 ? Math.round((overview.botViews / total) * 100) : 0;

  return (
    <div className="stats stats-vertical sm:stats-horizontal bg-base-100 shadow-sm w-full">
      <div className="stat">
        <div className="stat-title">总浏览量</div>
        <div className="stat-value text-3xl tabular-nums">{overview.views}</div>
        <div className="stat-desc">{includeBots ? "含机器人" : "不含机器人"}</div>
      </div>
      <div className="stat">
        <div className="stat-title">独立访客</div>
        <div className="stat-value text-3xl tabular-nums">{overview.visitors}</div>
        <div className="stat-desc">按会话估算</div>
      </div>
      <div className="stat">
        <div className="stat-title">人类浏览</div>
        <div className="stat-value text-3xl tabular-nums">{overview.humanViews}</div>
        <div className="stat-desc">UA 判定为非机器人</div>
      </div>
      <div className="stat">
        <div className="stat-title">机器人浏览</div>
        <div className="stat-value text-3xl tabular-nums">{overview.botViews}</div>
        <div className="stat-desc">占全部浏览 {botShare}%</div>
      </div>
    </div>
  );
}
