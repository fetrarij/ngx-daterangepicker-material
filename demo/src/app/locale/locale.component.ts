import { Component, ChangeDetectionStrategy } from '@angular/core';
import dayjs from 'dayjs/esm';
import utc from 'dayjs/esm/plugin/utc';
import * as fr from 'dayjs/locale/fr';
import { DateRanges } from '../../../../src/daterangepicker/daterangepicker.component';
dayjs.extend(utc);

@Component({
  standalone: false,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'locale',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './locale.component.html'
})
export class LocaleComponent {
  selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
  locale = fr;
  datesRanges: DateRanges = {
    ['Today']: [dayjs(), dayjs()],
    ['Yesterday']: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    ['Last 7 days']: [dayjs().subtract(6, 'days'), dayjs()],
    ['Last 30 days']: [dayjs().subtract(29, 'days'), dayjs()],
    ['This month']: [dayjs().startOf('month'), dayjs().endOf('month')],
    ['Last month']: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  };
}
