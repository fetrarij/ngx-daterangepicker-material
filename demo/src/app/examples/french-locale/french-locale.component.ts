import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import fr from 'dayjs/esm/locale/fr';
import { LocaleConfig, NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-french-locale',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './french-locale.component.html'
})
export class FrenchLocaleComponent {
  selected = signal<TimePeriod | null>(null);
  // The dayjs locale gives the day and month names and the first day of the week.
  locale: LocaleConfig = {
    locale: fr,
    format: 'DD/MM/YYYY',
    applyLabel: 'Appliquer',
    cancelLabel: 'Annuler'
  };
}
