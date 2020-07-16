import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { lang } from "@/i18n";
import { LocalizedString } from "simstate-i18n";
import { UncontrolledTooltip } from "reactstrap";
import { formatDateTime } from '@/utils/datetime';

// 2018-11-17 14:51 UTC+8
const startTime = DateTime.utc(2018, 11, 17, 6, 51).toLocal();

const root = lang.footer;

function getDiff() {
  return startTime.diffNow().negate().shiftTo('days', 'hours', 'minutes', 'seconds').normalize();
}

export function RunningTime() {
  const [diff, setDiff] = useState(getDiff);

  useEffect(() => {
    const timer = setInterval(() => setDiff(getDiff()), 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const replacements = [diff.days, diff.hours, diff.minutes, Math.floor(diff.seconds)]
    .map((data, i) => <strong key={i}>{data}</strong>);

  return (
    <p>
      <UncontrolledTooltip placement="auto-end" target="time">
        <span>{formatDateTime(startTime)}</span>
      </UncontrolledTooltip>
      <span id="time">
        📅 <LocalizedString id={root.runningTime} replacements={replacements} />
      </span>
    </p>
  );
}
