import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgDaterangepickerMd } from './../../../src/daterangepicker';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgDaterangepickerMd
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
