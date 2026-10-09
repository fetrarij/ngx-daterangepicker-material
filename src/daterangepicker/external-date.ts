import dayjs, { Dayjs } from 'dayjs/esm';

/**
 * Internal dates are local wall-clock times tagged as UTC. This returns the same wall-clock time as a local date,
 * which is the instant consumers expect (issues #562, #547).
 */
export function toExternalDate(date: Dayjs): Dayjs;
export function toExternalDate(date: Dayjs | null): Dayjs | null;
export function toExternalDate(date: Dayjs | null): Dayjs | null {
  return date ? dayjs(date.format('YYYY-MM-DDTHH:mm:ss.SSS')) : date;
}
