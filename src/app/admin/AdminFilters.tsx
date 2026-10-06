"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Preset {
  label: string;
  href: string;
  active: boolean;
}

interface Props {
  from: string;
  to: string;
  metric: "views" | "uniques";
  granularity: "day" | "hour";
  bots: boolean;
  /** Current detail selection, preserved across filter changes. */
  item?: string;
  presets: Preset[];
}

// Filter state lives entirely in the URL; the server re-queries on navigation.
// Current values arrive as props instead of useSearchParams, so this component
// needs no Suspense boundary of its own.
export function AdminFilters({ from, to, metric, granularity, bots, item, presets }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="card bg-base-100 shadow-sm border border-base-content/10">
      <div className="card-body py-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* key: remount when the server-provided range changes (e.g. a preset
              click) so the uncontrolled date inputs show the new values. */}
          <form
            key={`${from}:${to}:${granularity}`}
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const query = new URLSearchParams({
                from: String(data.get("from") ?? from),
                to: String(data.get("to") ?? to),
              });
              if (data.get("metric") === "uniques") query.set("metric", "uniques");
              if (data.get("gran") === "hour") query.set("gran", "hour");
              if (data.get("bots") === "on") query.set("bots", "1");
              if (item) query.set("item", item);
              startTransition(() => router.push(`/admin?${query.toString()}`));
            }}
          >
            <label className="form-control">
              <span className="label-text text-xs mb-1">起始日期</span>
              <input
                type="date"
                name="from"
                defaultValue={from}
                className="input input-bordered input-sm"
              />
            </label>
            <label className="form-control">
              <span className="label-text text-xs mb-1">结束日期</span>
              <input
                type="date"
                name="to"
                defaultValue={to}
                className="input input-bordered input-sm"
              />
            </label>
            <label className="form-control">
              <span className="label-text text-xs mb-1">指标</span>
              <select
                name="metric"
                defaultValue={metric}
                className="select select-bordered select-sm"
              >
                <option value="views">浏览量</option>
                <option value="uniques">独立访客</option>
              </select>
            </label>
            <label className="form-control">
              <span className="label-text text-xs mb-1">粒度</span>
              <select
                name="gran"
                defaultValue={granularity}
                className="select select-bordered select-sm"
              >
                <option value="day">按天</option>
                <option value="hour">按小时</option>
              </select>
            </label>
            <label className="label cursor-pointer gap-2 pb-1">
              <input
                type="checkbox"
                name="bots"
                defaultChecked={bots}
                className="checkbox checkbox-sm"
              />
              <span className="label-text text-sm">包含机器人</span>
            </label>
            <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
              {pending ? "加载中…" : "应用"}
            </button>
          </form>
          <div className="flex flex-wrap gap-1 mb-0.5">
            {presets.map((preset) => (
              <Link
                key={preset.label}
                href={preset.href}
                className={`btn btn-xs ${preset.active ? "btn-primary" : "btn-ghost"}`}
              >
                {preset.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
