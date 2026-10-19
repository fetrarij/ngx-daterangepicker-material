import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-clear-cancel',
  imports: [FormsModule, JsonPipe, NgxDaterangepickerMd],
  templateUrl: './clear-cancel.component.html'
})
export class ClearCancelComponent {
  selected = signal<TimePeriod | null>(null);
}
