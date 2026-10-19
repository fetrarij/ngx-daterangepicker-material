import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs/esm';
import { DateRange, DateRanges, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-predefined-ranges',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './predefined-ranges.component.html'
})
export class PredefinedRangesComponent {
  selected = signal<TimePeriod | null>(null);
  lastRange = signal('');
  ranges: DateRanges = {
    Today: [dayjs(), dayjs()],
    Yesterday: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
    'Last 7 days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 days': [dayjs().subtract(29, 'days'), dayjs()],
    'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  };

  rangeClicked(range: DateRange): void {
    this.lastRange.set(range.label);
  }
}
