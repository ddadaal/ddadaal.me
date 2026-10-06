"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  title: string;
  entries: { label: string; views: number }[];
}

const TOOLTIP_STYLE = {
  background: "var(--color-base-100)",
  color: "var(--color-base-content)",
  border: "1px solid var(--color-base-300)",
  borderRadius: 8,
} as const;

// Horizontal bars: long categorical labels (referrer hosts, OS names) read
// better as rows than rotated ticks. Single series, so no legend.
export function BreakdownChart({ title, entries }: Props) {
  const height = Math.max(180, entries.length * 32 + 32);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-2">
        <h2 className="card-title text-base">{title}</h2>
        {entries.length === 0 ? (
          <p className="text-sm opacity-60 py-8 text-center">该范围内暂无数据。</p>
        ) : (
          <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={entries}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--color-base-300)" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-base-content)", fontSize: 12, opacity: 0.65 }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={150}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-base-content)", fontSize: 12, opacity: 0.75 }}
                />
                <Tooltip cursor={{ fill: "var(--color-base-200)" }} contentStyle={TOOLTIP_STYLE} />
                <Bar
                  dataKey="views"
                  name="浏览量"
                  fill="var(--color-primary)"
                  barSize={14}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
