import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs/esm';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { EndDate, StartDate } from 'ngx-daterangepicker-material';
import { LocaleConfig } from 'ngx-daterangepicker-material';

@Component({
  imports: [
    JsonPipe,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgxDaterangepickerMd
  ],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'full',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './full.component.html'
})
export class FullComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) daterangepicker: DaterangepickerDirective;
  title = 'Pure angular daterangepicker';
  options = {
    autoApply: false,
    alwaysShowCalendars: false,
    showCancel: false,
    showClearButton: false,
    linkedCalendars: true,
    singleDatePicker: false,
    showWeekNumbers: false,
    showISOWeekNumbers: false,
    customRangeDirection: false,
    lockStartDate: false,
    closeOnAutoApply: true
  };

  minDate: dayjs.Dayjs = dayjs().subtract(5, 'days');
  maxDate: dayjs.Dayjs = dayjs().add(2, 'month');
  locale: LocaleConfig = {
    format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    displayFormat: 'DD MMMM YYYY HH:mm',
    separator: ' To ',
    cancelLabel: 'Cancel',
    applyLabel: 'Okay'
  };

  opens: string;
  drops: string;
  timePicker: boolean;
  dateLimit: number;
  selected = { start: dayjs().subtract(3, 'days'), end: dayjs().add(3, 'days') };

  constructor() {
    this.timePicker = false;
    this.opens = 'right';
    this.drops = 'down';
    this.dateLimit = 30;
  }

  click(): void {}

  clear(): void {
    this.daterangepicker.clear();
  }

  eventClicked(e: StartDate | EndDate): void {
    // eslint-disable-next-line no-console
    console.log({ ['eventClicked()']: e });
  }

  eventCleared(): void {
    // eslint-disable-next-line no-console
    console.log('datepicker cleared');
  }
}
