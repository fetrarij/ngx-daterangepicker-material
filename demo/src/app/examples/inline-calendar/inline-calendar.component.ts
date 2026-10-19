import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ChosenDate, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-inline-calendar',
  imports: [JsonPipe, NgxDaterangepickerMd],
  templateUrl: './inline-calendar.component.html'
})
export class InlineCalendarComponent {
  chosen = signal<ChosenDate | null>(null);
}
