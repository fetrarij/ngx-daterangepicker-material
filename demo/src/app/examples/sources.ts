import { SourceFile } from '../shared/example-sources';
import * as basicRangeTs from './basic-range/basic-range.component' with { loader: 'text' };
import basicRangeHtml from './basic-range/basic-range.component.html' with { loader: 'text' };
import * as openFromButtonTs from './open-from-button/open-from-button.component' with { loader: 'text' };
import openFromButtonHtml from './open-from-button/open-from-button.component.html' with { loader: 'text' };
import * as dropdownsTs from './dropdowns/dropdowns.component' with { loader: 'text' };
import dropdownsHtml from './dropdowns/dropdowns.component.html' with { loader: 'text' };
import * as clearCancelTs from './clear-cancel/clear-cancel.component' with { loader: 'text' };
import clearCancelHtml from './clear-cancel/clear-cancel.component.html' with { loader: 'text' };
import * as frenchLocaleTs from './french-locale/french-locale.component' with { loader: 'text' };
import frenchLocaleHtml from './french-locale/french-locale.component.html' with { loader: 'text' };
import * as customFormatTs from './custom-format/custom-format.component' with { loader: 'text' };
import customFormatHtml from './custom-format/custom-format.component.html' with { loader: 'text' };
import * as singleDateTs from './single-date/single-date.component' with { loader: 'text' };
import singleDateHtml from './single-date/single-date.component.html' with { loader: 'text' };
import * as customDaysTs from './custom-days/custom-days.component' with { loader: 'text' };
import customDaysHtml from './custom-days/custom-days.component.html' with { loader: 'text' };
import * as dateTimeTs from './date-time/date-time.component' with { loader: 'text' };
import dateTimeHtml from './date-time/date-time.component.html' with { loader: 'text' };
import * as predefinedRangesTs from './predefined-ranges/predefined-ranges.component' with { loader: 'text' };
import predefinedRangesHtml from './predefined-ranges/predefined-ranges.component.html' with { loader: 'text' };
import * as tooltipDaysTs from './tooltip-days/tooltip-days.component' with { loader: 'text' };
import tooltipDaysHtml from './tooltip-days/tooltip-days.component.html' with { loader: 'text' };
import * as reactiveFormTs from './reactive-form/reactive-form.component' with { loader: 'text' };
import reactiveFormHtml from './reactive-form/reactive-form.component.html' with { loader: 'text' };
import * as singleDateFormTs from './single-date-form/single-date-form.component' with { loader: 'text' };
import singleDateFormHtml from './single-date-form/single-date-form.component.html' with { loader: 'text' };
import * as inlineCalendarTs from './inline-calendar/inline-calendar.component' with { loader: 'text' };
import inlineCalendarHtml from './inline-calendar/inline-calendar.component.html' with { loader: 'text' };
import * as inlineTimeTs from './inline-time/inline-time.component' with { loader: 'text' };
import inlineTimeHtml from './inline-time/inline-time.component.html' with { loader: 'text' };
import * as inlineNgmodelTs from './inline-ngmodel/inline-ngmodel.component' with { loader: 'text' };
import inlineNgmodelHtml from './inline-ngmodel/inline-ngmodel.component.html' with { loader: 'text' };
import * as dropsOpensTs from './drops-opens/drops-opens.component' with { loader: 'text' };
import dropsOpensHtml from './drops-opens/drops-opens.component.html' with { loader: 'text' };
import * as dropsAutoTs from './drops-auto/drops-auto.component' with { loader: 'text' };
import dropsAutoHtml from './drops-auto/drops-auto.component.html' with { loader: 'text' };
import * as appendToBodyTs from './append-to-body/append-to-body.component' with { loader: 'text' };
import appendToBodyHtml from './append-to-body/append-to-body.component.html' with { loader: 'text' };
import * as eventLogTs from './event-log/event-log.component' with { loader: 'text' };
import eventLogHtml from './event-log/event-log.component.html' with { loader: 'text' };
import * as openEndDateTs from './open-end-date/open-end-date.component' with { loader: 'text' };
import openEndDateHtml from './open-end-date/open-end-date.component.html' with { loader: 'text' };
import * as signalFormTs from './signal-form/signal-form.component' with { loader: 'text' };
import signalFormHtml from './signal-form/signal-form.component.html' with { loader: 'text' };
import * as globalConfigTs from './global-config/app.config' with { loader: 'text' };

// The text loader gives the file as the default export, but TypeScript still sees the .ts module.
const text = (module: unknown): string => (module as { default: string }).default;

const files = (name: string, html: string, ts: unknown): SourceFile[] => [
  { name: `${name}.component.html`, language: 'html', code: html },
  { name: `${name}.component.ts`, language: 'typescript', code: text(ts) }
];

export const exampleSources: Record<string, SourceFile[]> = {
  'basic-range': files('basic-range', basicRangeHtml, basicRangeTs),
  'open-from-button': files('open-from-button', openFromButtonHtml, openFromButtonTs),
  dropdowns: files('dropdowns', dropdownsHtml, dropdownsTs),
  'clear-cancel': files('clear-cancel', clearCancelHtml, clearCancelTs),
  'french-locale': files('french-locale', frenchLocaleHtml, frenchLocaleTs),
  'custom-format': files('custom-format', customFormatHtml, customFormatTs),
  'single-date': files('single-date', singleDateHtml, singleDateTs),
  'custom-days': files('custom-days', customDaysHtml, customDaysTs),
  'date-time': files('date-time', dateTimeHtml, dateTimeTs),
  'predefined-ranges': files('predefined-ranges', predefinedRangesHtml, predefinedRangesTs),
  'tooltip-days': files('tooltip-days', tooltipDaysHtml, tooltipDaysTs),
  'reactive-form': files('reactive-form', reactiveFormHtml, reactiveFormTs),
  'single-date-form': files('single-date-form', singleDateFormHtml, singleDateFormTs),
  'inline-calendar': files('inline-calendar', inlineCalendarHtml, inlineCalendarTs),
  'inline-time': files('inline-time', inlineTimeHtml, inlineTimeTs),
  'inline-ngmodel': files('inline-ngmodel', inlineNgmodelHtml, inlineNgmodelTs),
  'drops-opens': files('drops-opens', dropsOpensHtml, dropsOpensTs),
  'drops-auto': files('drops-auto', dropsAutoHtml, dropsAutoTs),
  'append-to-body': files('append-to-body', appendToBodyHtml, appendToBodyTs),
  'event-log': files('event-log', eventLogHtml, eventLogTs),
  'open-end-date': files('open-end-date', openEndDateHtml, openEndDateTs),
  'signal-form': files('signal-form', signalFormHtml, signalFormTs),
  'global-config': [{ name: 'app.config.ts', language: 'typescript', code: text(globalConfigTs) }]
};
