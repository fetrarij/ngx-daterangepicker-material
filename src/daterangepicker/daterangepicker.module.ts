import { CommonModule } from '@angular/common';
import { EnvironmentProviders, ModuleWithProviders, NgModule, Signal, isSignal, makeEnvironmentProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DaterangepickerComponent } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { CalendarKeyboardDirective } from './calendar-keyboard.directive';
import { LocaleConfig, LOCALE_CONFIG, LOCALE_CONFIG_SIGNAL } from './daterangepicker.config';
import { LocaleService } from './locale.service';

@NgModule({
  declarations: [DaterangepickerComponent, DaterangepickerDirective, CalendarKeyboardDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [DaterangepickerComponent, DaterangepickerDirective]
})
export class NgxDaterangepickerMd {
  constructor() {}

  static forRoot(config: LocaleConfig | Signal<LocaleConfig> = {}): ModuleWithProviders<NgxDaterangepickerMd> {
    const source = isSignal(config) ? config : null;
    return {
      ngModule: NgxDaterangepickerMd,
      providers: [
        { provide: LOCALE_CONFIG, useFactory: () => (source ? source() : config) },
        { provide: LOCALE_CONFIG_SIGNAL, useValue: source },
        { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG, LOCALE_CONFIG_SIGNAL] }
      ]
    };
  }
}

// For the providers of a standalone app, in place of importProvidersFrom(NgxDaterangepickerMd.forRoot()) (issue #624).
export function provideDaterangepicker(config: LocaleConfig | Signal<LocaleConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders(NgxDaterangepickerMd.forRoot(config).providers);
}
