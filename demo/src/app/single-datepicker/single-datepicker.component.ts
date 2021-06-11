import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { LocaleConfig } from '../../../../src/daterangepicker';
import * as weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
dayjs.locale('fr');

@Component({
  selector: 'single-datepicker',
  templateUrl: './single-datepicker.component.html',
  styleUrls: ['./single-datepicker.component.scss']
})
export class SingleDatepickerComponent implements OnInit {
  selected = dayjs();
  locale: LocaleConfig = {
    applyLabel: 'Appliquer',
    customRangeLabel: ' - ',
    daysOfWeek: dayjs.weekdaysMin(),
    monthNames: dayjs.monthsShort(),
    firstDay: dayjs.localeData().firstDayOfWeek(),
  };
  constructor() { }
  ngOnInit() {
  }
  isInvalidDate(date) {
    return date.weekday() === 0;
  }
  isCustomDate(date) {
    return  (
      date.weekday() === 0 || date.weekday() === 6
    )  ? 'mycustomdate' : false;
  }

}
