import { Component, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { DaterangepickerComponent, DaterangepickerDirective } from '../../../../src/daterangepicker';

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent implements OnInit {
  selected: {startDate: dayjs.Dayjs, endDate: dayjs.Dayjs};
  constructor() {
    this.selected = {
      startDate: dayjs('2015-11-18T00:00Z'),
      endDate: dayjs('2015-11-26T00:00Z')
    }
   }

  ngOnInit() {
  }

}
