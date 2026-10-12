import { Injectable, Inject, Optional, Signal, WritableSignal, linkedSignal, signal } from '@angular/core';
import { LOCALE_CONFIG, LOCALE_CONFIG_SIGNAL, DefaultLocaleConfig, LocaleConfig } from './daterangepicker.config';

@Injectable()
export class LocaleService {
  /** The global config; pickers on the page redraw when it changes (issue #519). */
  readonly configChanges: Signal<LocaleConfig>;
  private holder: WritableSignal<LocaleConfig>;

  constructor(@Inject(LOCALE_CONFIG) config: LocaleConfig, @Optional() @Inject(LOCALE_CONFIG_SIGNAL) source?: Signal<LocaleConfig>) {
    // With a signal from forRoot(), its new values replace what setConfig() gave, and the other way round.
    this.holder = source ? linkedSignal(() => source()) : signal(config);
    this.configChanges = this.holder.asReadonly();
  }

  private get configHolder(): LocaleConfig {
    return this.holder();
  }

  get config() {
    if (!this.configHolder) {
      return DefaultLocaleConfig;
    }
    return { ...DefaultLocaleConfig, ...this.configHolder };
  }

  /** Replaces the global config, like a new forRoot(config), and updates the pickers already shown. */
  setConfig(config: LocaleConfig): void {
    this.holder.set(config);
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
