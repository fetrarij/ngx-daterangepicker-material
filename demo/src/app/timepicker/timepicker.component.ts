import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DaterangepickerComponent, DaterangepickerDirective } from '../../../../src/daterangepicker';

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent implements OnInit {
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  constructor() {
    this.selected = {
      startDate: moment('2015-11-18T00:00Z'),
      endDate: moment('2015-11-26T00:00Z')
    }
   }

  ngOnInit() {
  }

}
