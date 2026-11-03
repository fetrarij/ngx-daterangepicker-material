import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideDaterangepicker } from 'ngx-daterangepicker-material';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideDaterangepicker()],
};
