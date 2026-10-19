import { InjectionToken } from '@angular/core';

export interface SourceFile {
  name: string;
  language: 'html' | 'typescript';
  code: string;
}

// The code of each example, by example name. Only the app provides it, so unit tests never load the text imports.
export const EXAMPLE_SOURCES = new InjectionToken<Record<string, SourceFile[]>>('EXAMPLE_SOURCES');
