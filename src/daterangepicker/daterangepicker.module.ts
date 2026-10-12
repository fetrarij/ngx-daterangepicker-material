import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Signal, isSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DaterangepickerComponent } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleConfig, LOCALE_CONFIG, LOCALE_CONFIG_SIGNAL } from './daterangepicker.config';
import { LocaleService } from './locale.service';

@NgModule({
  declarations: [DaterangepickerComponent, DaterangepickerDirective],
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
