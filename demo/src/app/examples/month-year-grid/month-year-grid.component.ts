import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-month-year-grid',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './month-year-grid.component.html'
})
export class MonthYearGridComponent {
  selected = signal<TimePeriod | null>(null);
}
