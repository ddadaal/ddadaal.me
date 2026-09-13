import { DateTime } from "luxon";

const dateTimeFormat = "yyyy-MM-dd HH:mm:ss 'UTC'Z";

const articleTimePattern = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/;

export function formatArticleTime(value: string): string {
  const match = articleTimePattern.exec(value);
  if (!match) return value;
  return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6] ?? "00"} UTC+8`;
}

export function articleTimeToMillis(value: string): number {
  const match = articleTimePattern.exec(value);
  if (!match) return Number.NaN;
  return (
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6] ?? 0),
    ) -
    8 * 60 * 60 * 1000
  );
}

export function formatDateTime(dateTime: DateTime): string {
  return dateTime.toFormat(dateTimeFormat);
}

export function fromArticleTime(dateTimeString: string): DateTime {
  // Construct the value from every component explicitly. Luxon's generic
  // fromSQL parser consults the current clock for omitted fields, which makes
  // client components non-deterministic during Cache Components prerendering.
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(dateTimeString);
  if (!match) {
    return DateTime.invalid("Invalid article date");
  }

  return DateTime.fromObject(
    {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
      second: Number(match[6] ?? 0),
      millisecond: 0,
    },
    { zone: "Asia/Shanghai" },
  );
}
