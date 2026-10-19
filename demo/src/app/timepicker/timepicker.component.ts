import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs/esm';

@Component({
  imports: [FormsModule, MatToolbarModule, NgxDaterangepickerMd],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'timepicker',
  changeDetection: ChangeDetectionStrategy.Eager,
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
