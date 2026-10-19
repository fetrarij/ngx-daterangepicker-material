import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-drops-auto',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './drops-auto.component.html'
})
export class DropsAutoComponent {
  selected = signal<TimePeriod | null>(null);
}
