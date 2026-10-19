import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocaleConfig, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-date-time',
  imports: [FormsModule, JsonPipe, NgxDaterangepickerMd],
  templateUrl: './date-time.component.html'
})
export class DateTimeComponent {
  selected = signal<TimePeriod | null>(null);
  locale: LocaleConfig = { format: 'DD/MM/YYYY HH:mm:ss', firstDay: 1 };
}
