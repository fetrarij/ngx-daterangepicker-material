import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { routes } from './app.routes';
import { EXAMPLE_SOURCES } from './shared/example-sources';
import { exampleSources } from './examples/sources';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    importProvidersFrom(NgxDaterangepickerMd.forRoot()),
    { provide: EXAMPLE_SOURCES, useValue: exampleSources }
  ]
};
