import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './daterangepicker.config';
import dayjs from "dayjs";

@Injectable()
export class LocaleService {
  constructor(@Inject(LOCALE_CONFIG) private _config: LocaleConfig) {}

  get config() {
    if (!this._config) {
      return DefaultLocaleConfig;
    }

    if(this._config.locale) {
      import(`dayjs/locale/${this._config.locale}`)
        .then(() => {
          dayjs.locale(this._config.locale);
        });
    }

    return {... DefaultLocaleConfig, ...this._config};
  }
}
