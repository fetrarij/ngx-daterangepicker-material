import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-week-numbers',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './week-numbers.component.html'
})
export class WeekNumbersComponent {
  selected = signal<TimePeriod | null>(null);
  selectedIso = signal<TimePeriod | null>(null);
}
