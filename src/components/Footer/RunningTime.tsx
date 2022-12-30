import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { UncontrolledTooltip } from "reactstrap";

import { Localized } from "@/i18n";
import { formatDateTime } from "@/utils/datetime";

// 2018-11-17 14:51 UTC+8
const startTime = DateTime.utc(2018, 11, 17, 6, 51).toLocal();

function getDiff() {
  return startTime.diffNow().negate()
    .shiftTo("days", "hours", "minutes", "seconds").normalize();
}

export const RunningTime: React.FC = () => {
  const [diff, setDiff] = useState(getDiff);

  useEffect(() => {
    const timer = setInterval(() => setDiff(getDiff()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const replacements = [diff.days, diff.hours, diff.minutes, Math.floor(diff.seconds)]
    .map((data, i) => <strong key={i}>{data}</strong>);

  return (
    <p>
      <UncontrolledTooltip placement="auto-end" target="running-time">
        <span>{formatDateTime(startTime)}</span>
      </UncontrolledTooltip>
      <span id="running-time">
        📅 <Localized id="footer.runningTime" args={replacements} />
      </span>
    </p>
  );
};
