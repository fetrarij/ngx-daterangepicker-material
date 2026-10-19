import { Routes } from '@angular/router';
import { SimplePageComponent } from './pages/simple/simple-page.component';
import { LocalePageComponent } from './pages/locale/locale-page.component';
import { SingleDatePageComponent } from './pages/single-date/single-date-page.component';
import { TimePickerPageComponent } from './pages/time-picker/time-picker-page.component';
import { RangesPageComponent } from './pages/ranges/ranges-page.component';
import { FormsPageComponent } from './pages/forms/forms-page.component';
import { InlinePageComponent } from './pages/inline/inline-page.component';
import { PositionPageComponent } from './pages/position/position-page.component';
import { EventsPageComponent } from './pages/events/events-page.component';
import { PlaygroundPageComponent } from './pages/playground/playground-page.component';

export interface DemoLink {
  path: string;
  label: string;
}

export interface DemoLinkGroup {
  label: string;
  links: DemoLink[];
}

// The menu shows the pages in this order. The old paths stay the same, so old links still work.
export const demoLinkGroups: DemoLinkGroup[] = [
  { label: 'Getting started', links: [{ path: 'simple', label: 'Simple' }] },
  {
    label: 'Features',
    links: [
      { path: 'single-datepicker', label: 'Single date' },
      { path: 'with-timepicker', label: 'Time picker' },
      { path: 'custom-ranges', label: 'Ranges' },
      { path: 'locale', label: 'Locale' },
      { path: 'position', label: 'Position' },
      { path: 'inline', label: 'Inline' }
    ]
  },
  {
    label: 'Integration',
    links: [
      { path: 'reactive-forms', label: 'Forms' },
      { path: 'events', label: 'Events and API' }
    ]
  },
  { label: 'Try it', links: [{ path: 'full', label: 'Playground' }] }
];

export const routes: Routes = [
  { path: '', redirectTo: 'simple', pathMatch: 'full' },
  { path: 'simple', component: SimplePageComponent, title: 'Simple' },
  { path: 'locale', component: LocalePageComponent, title: 'Locale' },
  { path: 'single-datepicker', component: SingleDatePageComponent, title: 'Single date' },
  { path: 'with-timepicker', component: TimePickerPageComponent, title: 'Time picker' },
  { path: 'custom-ranges', component: RangesPageComponent, title: 'Ranges' },
  { path: 'position', component: PositionPageComponent, title: 'Position' },
  { path: 'reactive-forms', component: FormsPageComponent, title: 'Forms' },
  { path: 'events', component: EventsPageComponent, title: 'Events and API' },
  { path: 'inline', component: InlinePageComponent, title: 'Inline' },
  { path: 'full', component: PlaygroundPageComponent, title: 'Playground' },
  { path: '**', redirectTo: 'simple' }
];
