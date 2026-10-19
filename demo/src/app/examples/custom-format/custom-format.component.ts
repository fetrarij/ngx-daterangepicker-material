import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocaleConfig, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-custom-format',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './custom-format.component.html'
})
export class CustomFormatComponent {
  selected = signal<TimePeriod | null>(null);
  locale: LocaleConfig = {
    displayFormat: 'D MMM YYYY',
    separator: ' to ',
    applyLabel: 'OK',
    firstDay: 1
  };
}
