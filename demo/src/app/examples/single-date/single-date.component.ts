import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-single-date',
  imports: [FormsModule, JsonPipe, NgxDaterangepickerMd],
  templateUrl: './single-date.component.html'
})
export class SingleDateComponent {
  selected = signal<TimePeriod | null>(null);
}
