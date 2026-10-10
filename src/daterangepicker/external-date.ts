import { isDevMode } from '@angular/core';
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

/**
 * Converts a date given by the consumer into an internal date (same wall-clock time, tagged as UTC).
 * Dayjs objects from another copy of dayjs (e.g. `import dayjs from 'dayjs'`) are rebuilt with ours (issues #521, #486).
 * Returns null for null, undefined or an unknown value.
 */
export function toInternalDate(value: unknown, format?: string): Dayjs | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return dayjs(value, format).utc(true);
  }
  if (value instanceof Date) {
    return dayjs(value).utc(true);
  }
  if (isDayjsLike(value)) {
    // An invalid date formats as 'Invalid Date', which parses back to an invalid date.
    return dayjs(value.format('YYYY-MM-DDTHH:mm:ss.SSS')).utc(true);
  }
  if (isDevMode()) {
    console.warn('ngx-daterangepicker-material: ignored a date that is not a dayjs object, a Date or a string:', value);
  }
  return null;
}

// Older dayjs versions (< 1.11.10) don't recognize objects from another copy with isDayjs().
function isDayjsLike(value: unknown): value is Dayjs {
  const candidate = value as Dayjs;
  return dayjs.isDayjs(value) || (typeof candidate?.format === 'function' && typeof candidate?.isValid === 'function');
}
