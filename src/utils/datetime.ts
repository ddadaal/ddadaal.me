import { DateTime } from 'luxon';

const dateTimeFormat = "yyyy-MM-dd HH:mm:ss 'UTC'Z";

export function formatDateTime(dateTime: DateTime): string {
  return dateTime.toFormat(dateTimeFormat);
}
