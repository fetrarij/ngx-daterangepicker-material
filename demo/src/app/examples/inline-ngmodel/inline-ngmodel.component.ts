import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs/esm';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-inline-ngmodel',
  imports: [FormsModule, JsonPipe, NgxDaterangepickerMd],
  templateUrl: './inline-ngmodel.component.html'
})
export class InlineNgmodelComponent {
  selected = signal<TimePeriod | null>({
    startDate: dayjs().startOf('week'),
    endDate: dayjs().endOf('week')
  });
}
