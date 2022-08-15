import { Component } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'timepicker',
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent {
  selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
  constructor() {
    this.selected = {
      startDate: dayjs('2015-11-18T00:00Z'),
      endDate: dayjs('2015-11-26T00:00Z')
    };
  }
}
