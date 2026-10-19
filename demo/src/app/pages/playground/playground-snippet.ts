import { SourceFile } from '../../shared/example-sources';
import { BooleanOption, PlaygroundOptions, defaultOptions, frenchLabels, fullFormat, isActive, rangePresets } from './playground-options';

// Boolean inputs written as [name]="true" when they differ from the default, in this order.
const booleanInputs: BooleanOption[] = [
  'singleDatePicker',
  'autoApply',
  'closeOnAutoApply',
  'linkedCalendars',
  'lockStartDate',
  'customRangeDirection',
  'allowEmptyEndDate',
  'showDropdowns',
  'showWeekNumbers',
  'showISOWeekNumbers',
  'showCancel',
  'showClearButton',
  'alwaysShowCalendars',
  'showCustomRangeLabel',
  'showRangeLabelOnInput',
  'timePicker',
  'timePicker24Hour',
  'timePickerSeconds'
];

// Single quotes, or double quotes for a text with an apostrophe, like Prettier writes them.
const quote = (text: string): string => (text.includes("'") ? `"${text}"` : `'${text}'`);

function changed<K extends keyof PlaygroundOptions>(options: PlaygroundOptions, key: K): boolean {
  return isActive(key, options) && options[key] !== defaultOptions[key];
}

function localeLines(options: PlaygroundOptions): string[] {
  const lines: string[] = [];
  if (options.language === 'fr') {
    lines.push('locale: fr');
    lines.push(...Object.entries(frenchLabels).map(([key, label]) => `${key}: ${quote(label)}`));
  }
  const format = fullFormat(options);
  if (format) {
    lines.push(`format: ${quote(format)}`);
  }
  if (options.separator !== defaultOptions.separator) {
    lines.push(`separator: ${quote(options.separator)}`);
  }
  if (options.firstDay !== null) {
    lines.push(`firstDay: ${options.firstDay}`);
  }
  return lines;
}

export function buildHtml(options: PlaygroundOptions): string {
  const attributes: string[] = [];
  for (const key of booleanInputs) {
    if (changed(options, key)) {
      attributes.push(`[${key}]="${options[key]}"`);
    }
  }
  if (changed(options, 'timePickerIncrement')) {
    attributes.push(`[timePickerIncrement]="${options.timePickerIncrement}"`);
  }
  if (options.ranges) {
    attributes.push('[ranges]="ranges"');
  }
  if (options.opens !== defaultOptions.opens) {
    attributes.push(`opens="${options.opens}"`);
  }
  if (options.drops !== defaultOptions.drops) {
    attributes.push(`drops="${options.drops}"`);
  }
  if (options.limits === 'future') {
    attributes.push('[minDate]="today"');
  }
  if (options.limits === 'past') {
    attributes.push('[maxDate]="today"');
  }
  if (changed(options, 'dateLimit')) {
    attributes.push(`[dateLimit]="${options.dateLimit}"`);
  }
  if (localeLines(options).length) {
    attributes.push('[locale]="locale"');
  }
  attributes.push('[(ngModel)]="selected"');

  if (attributes.length === 1) {
    return `<input type="text" ngxDaterangepickerMd ${attributes[0]} />\n`;
  }
  return ['<input', 'type="text"', 'ngxDaterangepickerMd', ...attributes].join('\n    ') + ' />\n';
}

export function buildTs(options: PlaygroundOptions): string {
  const locale = localeLines(options);
  const needsDayjs = options.ranges || options.limits !== 'none';
  const types = ['NgxDaterangepickerMd', 'TimePeriod'];
  const members = ['selected = signal<TimePeriod | null>(null);'];

  if (options.ranges) {
    types.push('DateRanges');
    const entries = rangePresets.map((preset) => `    ${quote(preset.label[options.language])}: ${preset.code}`);
    members.push(['ranges: DateRanges = {', entries.join(',\n'), '  };'].join('\n'));
  }
  if (options.limits !== 'none') {
    members.push('today = dayjs();');
  }
  if (locale.length) {
    types.push('LocaleConfig');
    members.push(['locale: LocaleConfig = {', locale.map((line) => `    ${line}`).join(',\n'), '  };'].join('\n'));
  }

  const imports = [
    "import { Component, signal } from '@angular/core';",
    "import { FormsModule } from '@angular/forms';",
    ...(needsDayjs ? ["import dayjs from 'dayjs/esm';"] : []),
    ...(options.language === 'fr' ? ["import fr from 'dayjs/esm/locale/fr';"] : []),
    `import { ${types.sort().join(', ')} } from 'ngx-daterangepicker-material';`
  ];

  return [
    imports.join('\n'),
    '',
    '@Component({',
    "  selector: 'app-date-range',",
    '  imports: [FormsModule, NgxDaterangepickerMd],',
    "  templateUrl: './date-range.component.html'",
    '})',
    'export class DateRangeComponent {',
    members.map((member) => `  ${member}`).join('\n'),
    '}',
    ''
  ].join('\n');
}

export function buildSnippet(options: PlaygroundOptions): SourceFile[] {
  return [
    { name: 'date-range.component.html', language: 'html', code: buildHtml(options) },
    { name: 'date-range.component.ts', language: 'typescript', code: buildTs(options) }
  ];
}
