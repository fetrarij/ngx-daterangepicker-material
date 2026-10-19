import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-drops-opens',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './drops-opens.component.html'
})
export class DropsOpensComponent {
  selected = signal<TimePeriod | null>(null);
}
