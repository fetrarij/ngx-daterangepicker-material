import { Routes } from '@angular/router';
import { SimpleComponent } from './simple/simple.component';
import { FullComponent } from './full/full.component';
import { CustomRangesComponent } from './custom-ranges/custom-ranges.component';
import { SingleDatepickerComponent } from './single-datepicker/single-datepicker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';

export const AppRoutes: Routes = [
    {
         path: '',
         redirectTo: 'simple',
         pathMatch: 'full'
    },
    {
        path: 'simple',
        component: SimpleComponent,
    },
    {
        path: 'single-datepicker',
        component: SingleDatepickerComponent,
    },
    {
        path: 'with-timepicker',
        component: TimepickerComponent,
    },
    {
        path: 'full',
        component: FullComponent,
    },
    {
        path: 'custom-ranges',
        component: CustomRangesComponent,
    },
    {
        path: 'reactive-forms',
        component: ReactiveFormComponent,
    }
];
