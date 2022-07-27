import { Component, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { DaterangepickerComponent, DaterangepickerDirective } from '../../../../src/daterangepicker';
import { ChosenDate, TimePeriod } from '../../../../src/daterangepicker/daterangepicker.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'simple',
  templateUrl: './simple.component.html'
})
export class SimpleComponent implements OnInit {
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
  inlineDate: ChosenDate;
  picker: DaterangepickerComponent;
  startDate = dayjs().utc(true).subtract(5, 'days');
  endDate = dayjs().utc(true).subtract(4, 'days');
  maxDate = dayjs().utc(true).subtract(1, 'days');
  constructor() {
    this.selected = {
      startDate: dayjs('2015-11-18T00:00Z'),
      endDate: dayjs('2015-11-26T00:00Z')
    };
  }

  ngOnInit(): void {
    this.picker = this.pickerDirective.picker;
  }

  ngModelChange(e: Event): void {
    // eslint-disable-next-line no-console
    console.log({ ['ngModelChange()']: e });
  }

  change(e: TimePeriod | null): void {
    // eslint-disable-next-line no-console
    console.log({ ['change()']: e });
  }

  chosenDate(e: ChosenDate): void {
    this.inlineDate = e;
  }

  chosenDateTime(e: ChosenDate): void {
    this.selected = e;
  }

  open(e: MouseEvent): void {
    this.pickerDirective.open(e);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear(e: MouseEvent): void {
    // this.picker.clear(); // we can do
    this.selected = null; // now we can do
  }

  increaseDate(): void {
    this.selected.endDate = this.selected.endDate.clone().add(1, 'day');
  }

  increaseTime(): void {
    this.selected.endDate = this.selected.endDate.clone().add(1, 'hour');
  }
}
