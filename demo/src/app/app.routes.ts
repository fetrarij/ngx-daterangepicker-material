import { Routes } from '@angular/router';
import { SimplePageComponent } from './simple/simple-page.component';
import { LocaleComponent } from './locale/locale.component';
import { SingleDatepickerComponent } from './single-datepicker/single-datepicker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { FullComponent } from './full/full.component';
import { CustomRangesComponent } from './custom-ranges/custom-ranges.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';

export interface DemoLink {
  path: string;
  label: string;
}

// The menu shows the pages in this order.
export const demoLinks: DemoLink[] = [
  { path: 'simple', label: 'Simple' },
  { path: 'locale', label: 'Locale' },
  { path: 'single-datepicker', label: 'Single date' },
  { path: 'with-timepicker', label: 'Time picker' },
  { path: 'custom-ranges', label: 'Ranges' },
  { path: 'reactive-forms', label: 'Reactive forms' },
  { path: 'full', label: 'All options' }
];

export const routes: Routes = [
  { path: '', redirectTo: 'simple', pathMatch: 'full' },
  { path: 'simple', component: SimplePageComponent, title: 'Simple' },
  { path: 'locale', component: LocaleComponent, title: 'Locale' },
  { path: 'single-datepicker', component: SingleDatepickerComponent, title: 'Single date' },
  { path: 'with-timepicker', component: TimepickerComponent, title: 'Time picker' },
  { path: 'custom-ranges', component: CustomRangesComponent, title: 'Ranges' },
  { path: 'reactive-forms', component: ReactiveFormComponent, title: 'Reactive forms' },
  { path: 'full', component: FullComponent, title: 'All options' },
  { path: '**', redirectTo: 'simple' }
];
