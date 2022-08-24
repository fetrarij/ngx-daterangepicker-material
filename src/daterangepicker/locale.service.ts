import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './daterangepicker.config';
import dayjs from "dayjs";

@Injectable()
export class LocaleService {
  constructor(@Inject(LOCALE_CONFIG) private configHolder: LocaleConfig) {}

  get config() {
    if (!this.configHolder) {
      return DefaultLocaleConfig;
    }

    if(this.config.locale) {
      import(`dayjs/locale/${this.config.locale}`)
        .then(() => {
          dayjs.locale(this.config.locale);
        });
    }

    return { ...DefaultLocaleConfig, ...this.configHolder };
  }
}
