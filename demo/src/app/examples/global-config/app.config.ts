import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

// app.config.ts: the same labels and format for every picker of the app.
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxDaterangepickerMd.forRoot({
        applyLabel: 'Okay',
        separator: ' to ',
        firstDay: 1
      })
    )
  ]
};
