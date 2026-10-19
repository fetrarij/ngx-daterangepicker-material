import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs, { type Dayjs } from 'dayjs/esm';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-tooltip-days',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './tooltip-days.component.html'
})
export class TooltipDaysComponent {
  selected = signal<TimePeriod | null>(null);
  private holidays = [
    { date: dayjs().add(3, 'days'), text: 'Team day off' },
    { date: dayjs().add(10, 'days'), text: 'Office closed' }
  ];

  // The text shows when the mouse is over the day.
  isTooltipDate = (date: Dayjs): string | false => this.holidays.find((h) => h.date.isSame(date, 'day'))?.text ?? false;
}
