import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-basic-range',
  imports: [FormsModule, JsonPipe, NgxDaterangepickerMd],
  templateUrl: './basic-range.component.html'
})
export class BasicRangeComponent {
  selected = signal<TimePeriod | null>(null);
}
