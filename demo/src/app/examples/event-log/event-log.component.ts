import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import dayjs, { Dayjs } from 'dayjs/esm';
import { DateRanges, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

interface LoggedEvent {
  id: number;
  name: string;
  detail: string;
}

@Component({
  selector: 'demo-event-log',
  imports: [FormsModule, MatButtonModule, NgxDaterangepickerMd],
  templateUrl: './event-log.component.html',
  styleUrl: './event-log.component.scss'
})
export class EventLogComponent {
  selected = signal<TimePeriod | null>(null);
  events = signal<LoggedEvent[]>([]);
  ranges: DateRanges = {
    Today: [dayjs(), dayjs()],
    'Last 7 days': [dayjs().subtract(6, 'days'), dayjs()]
  };

  private nextId = 0;

  log(name: string, detail = ''): void {
    this.events.update((events) => [{ id: this.nextId++, name, detail }, ...events].slice(0, 8));
  }

  day(date: Dayjs | null): string {
    return date ? date.format('MMM D, YYYY') : 'null';
  }

  range(value: TimePeriod): string {
    return `${this.day(value.startDate)} to ${this.day(value.endDate)}`;
  }
}
