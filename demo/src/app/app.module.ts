import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { NgxDaterangepickerMd } from './../../../src/daterangepicker';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routing';
import { CustomRangesComponent } from './custom-ranges/custom-ranges.component';
import { ExampleComponent } from './example/example.component';
import { CustomRangesExampleComponent } from './examples/custom-ranges-example.component';
import { CustomRangesInlineExampleComponent } from './examples/custom-ranges-inline-example.component';
import { FullExampleComponent } from './examples/full-example.component';
import { ReactiveFormMultiSelectExample } from './examples/reactive-form-multi-select-example.component';
import { ReactiveFormSingleSelectExample } from './examples/reactive-form-single-select-example.component';
import { SimpleExampleComponent } from './examples/simple-example.component';
import { SimpleInlineExampleComponent } from './examples/simple-inline-example.component';
import { SimpleInlineTimepickerExampleComponent } from './examples/simple-inline-timepicker-example.component';
import { SingleDatepickerExampleComponent } from './examples/single-datepicker-example.component';
import { TimepickerExampleComponent } from './examples/timepicker-example.component';
import { FooterModule } from './footer/footer';
import { FullComponent } from './full/full.component';
import { NavBarModule } from './navbar/navbar';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { SimpleComponent } from './simple/simple.component';
import { SingleDatepickerComponent } from './single-datepicker/single-datepicker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';

@NgModule({
    declarations: [
        AppComponent,
        SimpleComponent,
        ExampleComponent,
        FullComponent,
        CustomRangesExampleComponent,
        CustomRangesInlineExampleComponent,
        FullExampleComponent,
        SingleDatepickerComponent,
        SingleDatepickerExampleComponent,
        SimpleExampleComponent,
        SimpleInlineExampleComponent,
        SimpleInlineTimepickerExampleComponent,
        ReactiveFormMultiSelectExample,
        ReactiveFormSingleSelectExample,
        TimepickerExampleComponent,
        CustomRangesComponent,
        ReactiveFormComponent,
        TimepickerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FooterModule,
        FormsModule,
        HighlightModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatCardModule,
        MatGridListModule,
        MatInputModule,
        MatSelectModule,
        NavBarModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'Okay',
            firstDay: 3,
        }),
        RouterModule.forRoot(appRoutes),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
