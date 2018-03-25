import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ngx-daterangepicker-material';
  options: any = {
    autoApply: false,
    showInputs: false,
    alwaysShowCalendars: false
  };
  locale: any = {
    format: 'DD/MM-YYYY'
  }
  selected = {start: moment("2018-03-15T21:00:00.000Z"), end: moment("2018-04-23T20:59:59.000Z") };
}
