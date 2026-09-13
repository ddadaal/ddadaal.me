"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Localized } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";

interface Props {
  time: string;
}

export const LastUpdateTime = ({ time }: Props) => {
  const [formattedTime, setFormattedTime] = useState<string>();

  useEffect(() => {
    setFormattedTime(formatDateTime(DateTime.fromISO(time)));
  }, [time]);

  return (
    <p>
      ⏲️ <Localized id="statistics.lastUpdated" />: &nbsp;
      {formattedTime}
    </p>
  );
};
