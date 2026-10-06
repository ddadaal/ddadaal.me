"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  title: string;
  data: { bucket: string; views: number; visitors: number }[];
  metric: "views" | "uniques";
  granularity: "day" | "hour";
}

const METRIC_LABEL = { views: "浏览量", uniques: "独立访客" } as const;

// Single series, so no legend: the card title names the metric. Colors come
// from daisyUI theme variables, so every theme (including dark) follows
// without JS.
export function TrendChart({ title, data, metric, granularity }: Props) {
  const points = data.map((point) => ({
    bucket: point.bucket,
    value: metric === "views" ? point.views : point.visitors,
  }));

  // Hourly labels carry the date; drop it when the whole range is one day.
  const singleDay =
    granularity === "hour" && new Set(data.map((point) => point.bucket.slice(0, 10))).size === 1;
  const formatTick = (label: string) =>
    granularity === "hour" ? (singleDay ? label.slice(11) : label.slice(5)) : label.slice(5);

  return (
    <div className="card bg-base-100 shadow-sm border border-base-content/10">
      <div className="card-body gap-2">
        <h2 className="card-title text-base">{title}</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-base-300)" />
              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tick={{ fill: "var(--color-base-content)", fontSize: 12, opacity: 0.65 }}
                tickFormatter={formatTick}
              />
              <YAxis
                width={44}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-base-content)", fontSize: 12, opacity: 0.65 }}
              />
              <Tooltip
                cursor={{ stroke: "var(--color-base-content)", strokeOpacity: 0.2 }}
                contentStyle={{
                  background: "var(--color-base-100)",
                  color: "var(--color-base-content)",
                  border: "1px solid var(--color-base-300)",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={METRIC_LABEL[metric]}
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="var(--color-primary)"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
