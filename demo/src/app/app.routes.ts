import { Routes } from '@angular/router';
import { SimplePageComponent } from './pages/simple/simple-page.component';
import { LocalePageComponent } from './pages/locale/locale-page.component';
import { SingleDatePageComponent } from './pages/single-date/single-date-page.component';
import { TimePickerPageComponent } from './pages/time-picker/time-picker-page.component';
import { RangesPageComponent } from './pages/ranges/ranges-page.component';
import { FormsPageComponent } from './pages/forms/forms-page.component';
import { InlinePageComponent } from './pages/inline/inline-page.component';
import { FullComponent } from './full/full.component';

export interface DemoLink {
  path: string;
  label: string;
}

// The menu shows the pages in this order. The paths stay the same as in the old demo, so old links still work.
export const demoLinks: DemoLink[] = [
  { path: 'simple', label: 'Simple' },
  { path: 'locale', label: 'Locale' },
  { path: 'single-datepicker', label: 'Single date' },
  { path: 'with-timepicker', label: 'Time picker' },
  { path: 'custom-ranges', label: 'Ranges' },
  { path: 'reactive-forms', label: 'Forms' },
  { path: 'inline', label: 'Inline' },
  { path: 'full', label: 'All options' }
];

export const routes: Routes = [
  { path: '', redirectTo: 'simple', pathMatch: 'full' },
  { path: 'simple', component: SimplePageComponent, title: 'Simple' },
  { path: 'locale', component: LocalePageComponent, title: 'Locale' },
  { path: 'single-datepicker', component: SingleDatePageComponent, title: 'Single date' },
  { path: 'with-timepicker', component: TimePickerPageComponent, title: 'Time picker' },
  { path: 'custom-ranges', component: RangesPageComponent, title: 'Ranges' },
  { path: 'reactive-forms', component: FormsPageComponent, title: 'Forms' },
  { path: 'inline', component: InlinePageComponent, title: 'Inline' },
  { path: 'full', component: FullComponent, title: 'All options' },
  { path: '**', redirectTo: 'simple' }
];
