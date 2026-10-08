import en from 'dayjs/esm/locale/en';
import fr from 'dayjs/esm/locale/fr';
import ru from 'dayjs/esm/locale/ru';

import { DefaultLocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';

describe('LocaleService.configWithLocale (issue #511)', () => {
  it('reads month names from locales that give them as a function (ru)', () => {
    const config = new LocaleService(null).configWithLocale(ru);

    expect(config.monthNames.length).toBe(12);
    expect(config.monthNames[0]).toBe('янв.');
    expect(config.daysOfWeek).toEqual(ru.weekdaysMin);
    expect(config.firstDay).toBe(1);
  });

  it('falls back to truncated names when the locale has no short names (en)', () => {
    const config = new LocaleService(null).configWithLocale(en);

    expect(config.monthNames[0]).toBe('Jan');
    expect(config.daysOfWeek[0]).toBe('Su');
    expect(config.firstDay).toBe(DefaultLocaleConfig.firstDay);
  });

  it('keeps using the arrays of regular locales (fr)', () => {
    const config = new LocaleService(null).configWithLocale(fr);

    expect(config.monthNames).toEqual(fr.monthsShort);
    expect(config.daysOfWeek).toEqual(fr.weekdaysMin);
    expect(config.firstDay).toBe(1);
  });

  it('gives priority to the global forRoot() config', () => {
    const config = new LocaleService({ monthNames: ['a', 'b'] }).configWithLocale(ru);

    expect(config.monthNames).toEqual(['a', 'b']);
  });
});
