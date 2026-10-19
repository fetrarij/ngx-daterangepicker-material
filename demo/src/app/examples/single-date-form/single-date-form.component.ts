import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-single-date-form',
  imports: [JsonPipe, ReactiveFormsModule, NgxDaterangepickerMd],
  templateUrl: './single-date-form.component.html'
})
export class SingleDateFormComponent {
  // In single mode the starting value can be a plain date: a dayjs date, a Date or an ISO string.
  date = new FormControl<unknown>('2026-03-15');
}
