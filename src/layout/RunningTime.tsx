"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Localized } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";

// 2018-11-17 14:51 UTC+8
const blogStartTime = DateTime.utc(2018, 11, 17, 6, 51).toLocal();

function getDiff(now: DateTime) {
  return blogStartTime
    .diff(now)
    .negate()
    .shiftTo("years", "months", "days", "hours", "minutes", "seconds")
    .normalize();
}

interface Props {
  serverStartTime: string;
}

export const RunningTime = ({ serverStartTime }: Props) => {
  const [diff, setDiff] = useState<ReturnType<typeof getDiff>>();

  useEffect(() => {
    // Luxon's parsing and clock access stay on the client. This keeps the
    // server-rendered shell deterministic when Cache Components prerenders it.
    const startTime = DateTime.fromISO(serverStartTime);
    setDiff(getDiff(startTime));
    const timer = setInterval(() => {
      setDiff(getDiff(DateTime.now()));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!diff) {
    return null;
  }

  const args = [
    diff.years,
    diff.months,
    diff.days,
    diff.hours,
    diff.minutes,
    Math.floor(diff.seconds),
  ].map((data, i) => (
    <span key={i} className="countdown">
      {/* @ts-expect-error --value is needed for daisyui */}
      <span style={{ "--value": data }} />
    </span>
  ));

  return (
    <div className="tooltip" data-tip={formatDateTime(blogStartTime)}>
      <p>
        📅 <Localized id="footer.runningTime" args={args} />
      </p>
    </div>
  );
};
