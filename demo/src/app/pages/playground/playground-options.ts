import dayjs from 'dayjs/esm';
import fr from 'dayjs/esm/locale/fr';
import { DateRanges, LocaleConfig } from 'ngx-daterangepicker-material';

export type Opens = 'auto' | 'left' | 'center' | 'right';
export type Drops = 'down' | 'up' | 'auto';
export type Limits = 'none' | 'future' | 'past';
export type Language = 'en' | 'fr';

export interface PlaygroundOptions {
  autoApply: boolean;
  closeOnAutoApply: boolean;
  singleDatePicker: boolean;
  linkedCalendars: boolean;
  lockStartDate: boolean;
  customRangeDirection: boolean;
  allowEmptyEndDate: boolean;
  showDropdowns: boolean;
  showWeekNumbers: boolean;
  showISOWeekNumbers: boolean;
  showCancel: boolean;
  showClearButton: boolean;
  ranges: boolean;
  alwaysShowCalendars: boolean;
  showCustomRangeLabel: boolean;
  showRangeLabelOnInput: boolean;
  timePicker: boolean;
  timePicker24Hour: boolean;
  timePickerSeconds: boolean;
  timePickerIncrement: number;
  opens: Opens;
  drops: Drops;
  limits: Limits;
  dateLimit: number | null;
  language: Language;
  // An empty format lets the picker choose: the short date, or the date and time with the time picker.
  format: string;
  separator: string;
  firstDay: number | null;
}

export type BooleanOption = { [K in keyof PlaygroundOptions]: PlaygroundOptions[K] extends boolean ? K : never }[keyof PlaygroundOptions];

// The same values as the picker's own defaults, so the generated code only lists what was changed.
export const defaultOptions: PlaygroundOptions = {
  autoApply: false,
  closeOnAutoApply: true,
  singleDatePicker: false,
  linkedCalendars: false,
  lockStartDate: false,
  customRangeDirection: false,
  allowEmptyEndDate: false,
  showDropdowns: false,
  showWeekNumbers: false,
  showISOWeekNumbers: false,
  showCancel: false,
  showClearButton: false,
  ranges: false,
  alwaysShowCalendars: false,
  showCustomRangeLabel: false,
  showRangeLabelOnInput: false,
  timePicker: false,
  timePicker24Hour: false,
  timePickerSeconds: false,
  timePickerIncrement: 1,
  opens: 'auto',
  drops: 'down',
  limits: 'none',
  dateLimit: null,
  language: 'en',
  format: '',
  separator: ' - ',
  firstDay: null
};

// Options that only mean something when another one is on.
export function isActive(key: keyof PlaygroundOptions, options: PlaygroundOptions): boolean {
  switch (key) {
    case 'closeOnAutoApply':
      return options.autoApply;
    case 'linkedCalendars':
    case 'allowEmptyEndDate':
      return !options.singleDatePicker;
    case 'alwaysShowCalendars':
    case 'showCustomRangeLabel':
    case 'showRangeLabelOnInput':
      return options.ranges;
    case 'timePicker24Hour':
    case 'timePickerSeconds':
    case 'timePickerIncrement':
      return options.timePicker;
    case 'dateLimit':
      return !options.singleDatePicker;
    default:
      return true;
  }
}

// The format with the time added when the time picker is on.
export function fullFormat(options: PlaygroundOptions): string {
  if (!options.format || !options.timePicker) {
    return options.format;
  }
  const time = options.timePicker24Hour ? 'HH:mm' : 'hh:mm';
  return `${options.format} ${time}${options.timePickerSeconds ? ':ss' : ''}${options.timePicker24Hour ? '' : ' A'}`;
}

export const frenchLabels = {
  applyLabel: 'Appliquer',
  cancelLabel: 'Annuler',
  clearLabel: 'Effacer',
  customRangeLabel: 'Personnalisé'
};

export interface RangePreset {
  label: Record<Language, string>;
  code: string;
  dates: () => [dayjs.Dayjs, dayjs.Dayjs];
}

export const rangePresets: RangePreset[] = [
  { label: { en: 'Today', fr: "Aujourd'hui" }, code: '[dayjs(), dayjs()]', dates: () => [dayjs(), dayjs()] },
  {
    label: { en: 'Last 7 days', fr: '7 derniers jours' },
    code: "[dayjs().subtract(6, 'day'), dayjs()]",
    dates: () => [dayjs().subtract(6, 'day'), dayjs()]
  },
  {
    label: { en: 'This month', fr: 'Ce mois-ci' },
    code: "[dayjs().startOf('month'), dayjs().endOf('month')]",
    dates: () => [dayjs().startOf('month'), dayjs().endOf('month')]
  }
];

// No ranges is an empty object, the picker default: undefined hides the calendars.
export function liveRanges(options: PlaygroundOptions): DateRanges {
  if (!options.ranges) {
    return {};
  }
  return Object.fromEntries(rangePresets.map((preset) => [preset.label[options.language], preset.dates()]));
}

export function liveLocale(options: PlaygroundOptions): LocaleConfig {
  const format = fullFormat(options);
  return {
    ...(options.language === 'fr' ? { locale: fr, ...frenchLabels } : {}),
    ...(format ? { format } : {}),
    ...(options.separator !== defaultOptions.separator ? { separator: options.separator } : {}),
    ...(options.firstDay !== null ? { firstDay: options.firstDay } : {})
  };
}

export function liveMinDate(options: PlaygroundOptions): dayjs.Dayjs | null {
  return options.limits === 'future' ? dayjs() : null;
}

export function liveMaxDate(options: PlaygroundOptions): dayjs.Dayjs | null {
  return options.limits === 'past' ? dayjs() : null;
}
