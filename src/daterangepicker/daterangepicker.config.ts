import { InjectionToken } from '@angular/core';
import dayjs from 'dayjs/esm';
import localeData from 'dayjs/esm/plugin/localeData';
dayjs.extend(localeData);

export const LOCALE_CONFIG = new InjectionToken<LocaleConfig>('daterangepicker.config');
/**
 *  LocaleConfig Interface
 */
export interface LocaleConfig {
  direction?: string;
  separator?: string;
  weekLabel?: string;
  applyLabel?: string;
  cancelLabel?: string;
  clearLabel?: string;
  customRangeLabel?: string;
  daysOfWeek?: string[];
  monthNames?: string[];
  firstDay?: number;
  format?: string;
  displayFormat?: string;
}
/**
 *  DefaultLocaleConfig
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DefaultLocaleConfig: LocaleConfig = {
  direction: 'ltr',
  separator: ' - ',
  weekLabel: 'W',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  clearLabel: 'Clear',
  customRangeLabel: 'Custom range',
  daysOfWeek: dayjs.weekdaysMin(),
  monthNames: dayjs.monthsShort(),
  firstDay: dayjs.localeData().firstDayOfWeek()
};
