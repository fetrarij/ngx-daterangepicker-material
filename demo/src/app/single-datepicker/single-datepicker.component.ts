import { Component, ChangeDetectionStrategy } from '@angular/core';
import dayjs from 'dayjs/esm';
import 'dayjs/locale/fr';
import { LocaleConfig } from '../../../../src/daterangepicker';
import weekday from 'dayjs/esm/plugin/weekday';
import { Dayjs } from 'dayjs/esm';
dayjs.extend(weekday);
dayjs.locale('fr');

@Component({
  standalone: false,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'single-datepicker',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './single-datepicker.component.html'
})
export class SingleDatepickerComponent {
  selected = dayjs();
  locale: LocaleConfig = {
    applyLabel: 'Appliquer',
    customRangeLabel: ' - ',
    daysOfWeek: dayjs.weekdaysMin(),
    monthNames: dayjs.monthsShort(),
    firstDay: dayjs.localeData().firstDayOfWeek()
  };

  isInvalidDate(date: Dayjs): boolean {
    return date.weekday() === 0;
  }

  isCustomDate(date: Dayjs): 'mycustomdate' | false {
    return date.weekday() === 0 || date.weekday() === 6 ? 'mycustomdate' : false;
  }
}
