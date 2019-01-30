import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from './daterangepicker.config';

@Injectable()
export class LocaleService {
  constructor(@Inject(LOCALE_CONFIG) private _config) {}

  get config() {
    if (!this._config) {
      return DefaultLocaleConfig;
    }

    return {... DefaultLocaleConfig, ...this._config}
  }
}