import { PlaygroundOptions, defaultOptions } from './playground-options';
import { buildHtml, buildTs } from './playground-snippet';

const withOptions = (changes: Partial<PlaygroundOptions>): PlaygroundOptions => ({ ...defaultOptions, ...changes });

describe('Playground snippet', () => {
  it('gives the shortest input for the defaults', () => {
    expect(buildHtml(defaultOptions)).toBe('<input type="text" ngxDaterangepickerMd [(ngModel)]="selected" />\n');
    expect(buildTs(defaultOptions)).not.toContain('dayjs');
    expect(buildTs(defaultOptions)).toContain("import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';");
  });

  it('writes booleans, numbers and texts in their own way', () => {
    const html = buildHtml(
      withOptions({ autoApply: true, closeOnAutoApply: false, timePicker: true, timePickerIncrement: 15, opens: 'left', drops: 'up' })
    );

    expect(html).toContain('[autoApply]="true"');
    expect(html).toContain('[closeOnAutoApply]="false"');
    expect(html).toContain('[timePickerIncrement]="15"');
    expect(html).toContain('opens="left"');
    expect(html).toContain('drops="up"');
    expect(html.trim().endsWith('[(ngModel)]="selected" />')).toBeTrue();
  });

  it('leaves out options that do nothing without another one', () => {
    const html = buildHtml(withOptions({ closeOnAutoApply: false, timePickerSeconds: true, alwaysShowCalendars: true }));

    expect(html).toBe('<input type="text" ngxDaterangepickerMd [(ngModel)]="selected" />\n');
  });

  it('adds the ranges and dayjs to the TS only with ranges', () => {
    const options = withOptions({ ranges: true, showCustomRangeLabel: true });
    const ts = buildTs(options);

    expect(buildHtml(options)).toContain('[ranges]="ranges"');
    expect(buildHtml(options)).toContain('[showCustomRangeLabel]="true"');
    expect(ts).toContain("import dayjs from 'dayjs/esm';");
    expect(ts).toContain("'Last 7 days': [dayjs().subtract(6, 'day'), dayjs()]");
    expect(ts).toContain('DateRanges');
  });

  it('builds the locale from the language, the format and the first day', () => {
    const options = withOptions({ language: 'fr', format: 'DD/MM/YYYY', timePicker: true, timePicker24Hour: true, firstDay: 1 });
    const ts = buildTs(options);

    expect(buildHtml(options)).toContain('[locale]="locale"');
    expect(ts).toContain("import fr from 'dayjs/esm/locale/fr';");
    expect(ts).toContain('locale: fr,');
    expect(ts).toContain("format: 'DD/MM/YYYY HH:mm'");
    expect(ts).toContain('firstDay: 1');
    expect(ts).toContain("applyLabel: 'Appliquer'");
  });

  it('quotes a French range name with an apostrophe', () => {
    expect(buildTs(withOptions({ ranges: true, language: 'fr' }))).toContain(`"Aujourd'hui": [dayjs(), dayjs()]`);
  });

  it('gives minDate or maxDate from today', () => {
    expect(buildHtml(withOptions({ limits: 'future' }))).toContain('[minDate]="today"');
    expect(buildHtml(withOptions({ limits: 'past' }))).toContain('[maxDate]="today"');
    expect(buildTs(withOptions({ limits: 'past' }))).toContain('today = dayjs();');
  });
});
