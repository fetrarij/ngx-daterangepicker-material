import { ApplicationConfig } from '@angular/core';
import { provideDaterangepicker } from 'ngx-daterangepicker-material';

// app.config.ts: the same labels and format for every picker of the app.
export const appConfig: ApplicationConfig = {
  providers: [
    provideDaterangepicker({
      applyLabel: 'Okay',
      separator: ' to ',
      firstDay: 1
    })
  ]
};
