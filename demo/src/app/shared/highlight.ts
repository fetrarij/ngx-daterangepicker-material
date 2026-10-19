import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

// Only the two languages the examples use, to keep the bundle small.
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);

export function highlight(code: string, language: 'html' | 'typescript'): string {
  return hljs.highlight(code, { language }).value;
}
