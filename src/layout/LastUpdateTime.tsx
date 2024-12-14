"use client";

import { DateTime } from "luxon";
import { Localized } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";

interface Props {
  time: string;
}

export const LastUpdateTime = ({ time }: Props) => {
  return (
    <p>
      ⏲️
      {" "}
      <Localized id="statistics.lastUpdated" />
      : &nbsp;
      {formatDateTime(DateTime.fromISO(time))}
    </p>
  );
};
