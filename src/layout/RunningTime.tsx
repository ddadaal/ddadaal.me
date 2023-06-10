"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Localized } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";

// 2018-11-17 14:51 UTC+8
const blogStartTime = DateTime.utc(2018, 11, 17, 6, 51).toLocal();

function getDiff(now: DateTime) {
  return blogStartTime.diff(now).negate()
    .shiftTo("years", "months", "days", "hours", "minutes", "seconds").normalize();
}

interface Props {
  serverStartTime: string;
}

export const RunningTime = ({ serverStartTime }: Props) => {
  const [diff, setDiff] = useState(() => {
    return getDiff(DateTime.fromISO(serverStartTime));
  });

  useEffect(() => {
    const timer = setInterval(() => setDiff(getDiff(DateTime.now())), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const args = [diff.years, diff.months, diff.days, diff.hours, diff.minutes, Math.floor(diff.seconds)]
    .map((data, i) => (
      <span key={i} className="countdown">
        {/* @ts-ignore */}
        <span style={{ "--value": data }} />
      </span>
    ));

  return (
    <div className="tooltip tooltip-right" data-tip={formatDateTime(blogStartTime)}>
      <p>
        📅 <Localized id="footer.runningTime" args={args} />
      </p>
    </div>
  );
};
