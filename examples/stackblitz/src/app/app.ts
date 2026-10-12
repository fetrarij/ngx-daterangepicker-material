import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRanges, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'app-root',
  imports: [NgxDaterangepickerMd, FormsModule, ReactiveFormsModule, JsonPipe],
  template: `
    <h1>ngx-daterangepicker-material</h1>

    <h2>Input with ranges</h2>
    <input
      ngxDaterangepickerMd
      [ranges]="ranges"
      [showCustomRangeLabel]="true"
      [alwaysShowCalendars]="true"
      [(ngModel)]="selected"
      placeholder="Choose a date range"
    />
    <pre>{{ selected() | json }}</pre>

    <h2>Inline with a form control</h2>
    <ngx-daterangepicker-material [formControl]="range"></ngx-daterangepicker-material>
    <pre>{{ range.value | json }}</pre>
  `,
  styles: `
    :host { display: block; padding: 16px; font-family: sans-serif; }
    input { width: 260px; padding: 8px; }
  `,
})
export class App {
  // Edit this file to reproduce a bug, then share the link in your issue.
  selected = signal<TimePeriod | null>(null);
  range = new FormControl<TimePeriod | null>(null);
  ranges: DateRanges = {
    Today: [dayjs(), dayjs()],
    Yesterday: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
    'Last 7 days': [dayjs().subtract(6, 'day'), dayjs()],
    'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
  };
}
