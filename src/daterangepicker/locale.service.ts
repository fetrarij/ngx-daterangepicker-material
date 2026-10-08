import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './daterangepicker.config';

@Injectable()
export class LocaleService {
  constructor(@Inject(LOCALE_CONFIG) private configHolder: LocaleConfig) {}

  get config() {
    if (!this.configHolder) {
      return DefaultLocaleConfig;
    }
    return { ...DefaultLocaleConfig, ...this.configHolder };
  }

  configWithLocale(locale) {
    if (!this.configHolder && !locale) {
      return DefaultLocaleConfig;
    }
    const fromLocale = {
      daysOfWeek: toList(locale.weekdaysMin) ?? toList(locale.weekdays)?.map((day) => day.slice(0, 2)),
      monthNames: toList(locale.monthsShort) ?? toList(locale.months)?.map((month) => month.slice(0, 3)),
      firstDay: locale.weekStart
    };
    // Keep the defaults for anything the dayjs locale does not define (e.g. 'en' has no monthsShort).
    const defined = Object.fromEntries(Object.entries(fromLocale).filter(([, value]) => value !== undefined));
    return {
      ...DefaultLocaleConfig,
      ...defined,
      ...this.configHolder
    };
  }
}

// Some dayjs locales (ru, be) give a function with the standalone names in `.s` instead of an array.
function toList(value): string[] | undefined {
  return Array.isArray(value) ? value : value?.s;
}
