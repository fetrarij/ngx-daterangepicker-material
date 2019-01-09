import { CommonModule } from '@angular/common';
import {  ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { DaterangepickerComponent } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleConfig, DefaultLocaleConfig } from './daterangepicker.config';

@NgModule({
  declarations: [
    DaterangepickerComponent,
    DaterangepickerDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  exports: [
    DaterangepickerComponent,
    DaterangepickerDirective
  ],
  entryComponents: [
    DaterangepickerComponent
  ]
})
export class NgxDaterangepickerMd {
  constructor(@Optional() @SkipSelf() parentModule: NgxDaterangepickerMd) {
    if (parentModule) {
      throw new Error('NgxDaterangepickerMd is already loaded. Import it in the root module only');
    }
  }
  static forRoot(config: LocaleConfig = DefaultLocaleConfig): ModuleWithProviders {
    return {
      ngModule: NgxDaterangepickerMd,
      providers: [
        {provide: LocaleConfig, useValue: {...DefaultLocaleConfig, ...config}}
      ]
    };
  }
}
