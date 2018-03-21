import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgDaterangepickerMd } from './../../../src/daterangepicker';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgDaterangepickerMd
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
