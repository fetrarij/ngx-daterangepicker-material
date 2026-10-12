import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), importProvidersFrom(NgxDaterangepickerMd.forRoot())],
};
