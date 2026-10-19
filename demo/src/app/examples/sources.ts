import { SourceFile } from '../shared/example-sources';
import * as basicRangeTs from './basic-range/basic-range.component' with { loader: 'text' };
import basicRangeHtml from './basic-range/basic-range.component.html' with { loader: 'text' };
import * as openFromButtonTs from './open-from-button/open-from-button.component' with { loader: 'text' };
import openFromButtonHtml from './open-from-button/open-from-button.component.html' with { loader: 'text' };

// The text loader gives the file as the default export, but TypeScript still sees the .ts module.
const text = (module: unknown): string => (module as { default: string }).default;

const files = (name: string, html: string, ts: unknown): SourceFile[] => [
  { name: `${name}.component.html`, language: 'html', code: html },
  { name: `${name}.component.ts`, language: 'typescript', code: text(ts) }
];

export const exampleSources: Record<string, SourceFile[]> = {
  'basic-range': files('basic-range', basicRangeHtml, basicRangeTs),
  'open-from-button': files('open-from-button', openFromButtonHtml, openFromButtonTs)
};
