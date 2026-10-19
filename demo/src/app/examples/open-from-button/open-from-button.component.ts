import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-open-from-button',
  imports: [FormsModule, JsonPipe, MatButtonModule, NgxDaterangepickerMd],
  templateUrl: './open-from-button.component.html'
})
export class OpenFromButtonComponent {
  selected = signal<TimePeriod | null>(null);
}
