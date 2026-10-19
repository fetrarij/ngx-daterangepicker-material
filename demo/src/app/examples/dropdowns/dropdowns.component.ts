import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-dropdowns',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './dropdowns.component.html'
})
export class DropdownsComponent {
  selected = signal<TimePeriod | null>(null);
}
