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
import { NgxDaterangepickerMd } from './../../../src/daterangepicker';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { CustomRangesComponent } from './custom-ranges/custom-ranges.component';
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
        FullComponent,
        SingleDatepickerComponent,
        CustomRangesComponent,
        ReactiveFormComponent,
        TimepickerComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
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
            firstDay: 3
        }),
        RouterModule.forRoot(AppRoutes)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
