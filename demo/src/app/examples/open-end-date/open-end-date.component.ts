import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-open-end-date',
  imports: [FormsModule, JsonPipe, NgxDaterangepickerMd],
  templateUrl: './open-end-date.component.html'
})
export class OpenEndDateComponent {
  // After Apply with one day, the value is { startDate, endDate: null }.
  selected = signal<TimePeriod | null>(null);
}
