import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Pure angular daterangepicker';
  options: any = {
    autoApply: false,
    showInputs: false,
    alwaysShowCalendars: false,
    linkedCalendars: true,
    singleDatePicker: false,
    showWeekNumbers: false,
    showISOWeekNumbers: false
  };
  minDate: moment.Moment = moment().subtract(5, 'days');
  maxDate: moment.Moment = moment().add(2, 'month');
  locale: any = {
    format: 'DD MMMM YYYY',
    separator: ' To ',
    cancelLabel: 'Cancel',
    applyLabel: 'Okay'
  }
  selected = {start: moment().subtract(3, 'days'), end: moment().add(3, 'days') };
}
