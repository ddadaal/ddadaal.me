import React, {useState, useEffect} from "react";
import {DateTime} from "luxon";
import lang from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";

// 2018-11-17 14:51
const startTime = DateTime.utc(2018, 11, 17, 6, 51);

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

  return (
    <p>
      📅 <LocalizedString id={root.runningTime} replacements={[
        diff.days,
        diff.hours,
        diff.minutes,
        Math.floor(diff.seconds)]} />
    </p>
  );
}
