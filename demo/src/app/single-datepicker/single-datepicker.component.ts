import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocaleConfig } from '../../../../src/daterangepicker';
import * as weekday from 'dayjs/plugin/weekday';
import { Dayjs } from 'dayjs';
dayjs.extend(weekday);
dayjs.locale('fr');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'single-datepicker',
  templateUrl: './single-datepicker.component.html'
})
export class SingleDatepickerComponent implements OnInit {
  selected = dayjs();
  locale: LocaleConfig = {
    applyLabel: 'Appliquer',
    customRangeLabel: ' - ',
    daysOfWeek: dayjs.weekdaysMin(),
    monthNames: dayjs.monthsShort(),
    firstDay: dayjs.localeData().firstDayOfWeek()
  };

  constructor() {}
  ngOnInit(): void {}

  isInvalidDate(date: Dayjs): boolean {
    return date.weekday() === 0;
  }

  isCustomDate(date: Dayjs): 'mycustomdate' | false {
    return date.weekday() === 0 || date.weekday() === 6 ? 'mycustomdate' : false;
  }
}
