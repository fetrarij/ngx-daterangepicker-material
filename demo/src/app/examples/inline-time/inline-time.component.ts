import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { LocaleConfig, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-inline-time',
  imports: [JsonPipe, NgxDaterangepickerMd],
  templateUrl: './inline-time.component.html'
})
export class InlineTimeComponent {
  selected = signal<TimePeriod | null>(null);
  locale: LocaleConfig = { firstDay: 1 };
}
