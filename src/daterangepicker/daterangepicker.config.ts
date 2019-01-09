import { Injectable } from '@angular/core';
import * as _moment from 'moment';
const moment = _moment;
@Injectable()
export class LocaleConfig {
    direction?: string;
    separator?: string;
    weekLabel?: string;
    applyLabel?: string;
    cancelLabel?: string;
    customRangeLabel?: string;
    daysOfWeek?: string[];
    monthNames?:  string[];
    firstDay?: number;
    format?: string;
}
export const DefaultLocaleConfig: LocaleConfig = {
    direction: 'ltr',
    separator: ' - ',
    weekLabel: 'W',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    customRangeLabel: 'Custom range',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek()
  };