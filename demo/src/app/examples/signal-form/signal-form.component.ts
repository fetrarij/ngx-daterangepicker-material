import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormField, disabled, form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import dayjs from 'dayjs/esm';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

interface Booking {
  dates: TimePeriod;
}

@Component({
  selector: 'demo-signal-form',
  imports: [FormField, JsonPipe, MatButtonModule, NgxDaterangepickerMd],
  templateUrl: './signal-form.component.html'
})
export class SignalFormComponent {
  locked = signal(false);
  booking = signal<Booking>({ dates: { startDate: dayjs(), endDate: dayjs().add(3, 'day') } });
  // The disabled() rule disables the picker while the booking is locked.
  bookingForm = form(this.booking, (path) => disabled(path.dates, () => this.locked()));
}
