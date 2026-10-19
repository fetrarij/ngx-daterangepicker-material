import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxDaterangepickerMd, TimePeriod, dateRangeRequired } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-reactive-form',
  imports: [JsonPipe, ReactiveFormsModule, MatButtonModule, NgxDaterangepickerMd],
  templateUrl: './reactive-form.component.html'
})
export class ReactiveFormComponent {
  // dateRangeRequired() also fails after Clear, unlike Validators.required.
  dates = new FormControl<TimePeriod | null>(null, dateRangeRequired());

  toggleDisabled(): void {
    if (this.dates.disabled) {
      this.dates.enable();
    } else {
      this.dates.disable();
    }
  }
}
