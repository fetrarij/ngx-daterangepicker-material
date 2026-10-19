import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs, { type Dayjs } from 'dayjs/esm';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-custom-days',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './custom-days.component.html'
})
export class CustomDaysComponent {
  selected = signal<TimePeriod | null>(null);
  minDate = dayjs().subtract(1, 'month');
  maxDate = dayjs().add(2, 'months');

  // Sundays can't be picked.
  isInvalidDate = (date: Dayjs): boolean => date.day() === 0;

  // The class must be in a global stylesheet, the calendar is outside your component.
  isCustomDate = (date: Dayjs): string | false => (date.day() === 6 ? 'weekend-day' : false);
}
