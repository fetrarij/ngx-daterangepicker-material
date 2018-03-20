import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DaterangepickerModule } from '../../../src/daterangepicker/daterangepicker.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DaterangepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
