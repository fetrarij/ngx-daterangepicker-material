import { Component } from '@angular/core';
import * as moment from 'moment';
import * as localization from 'moment/locale/fr';
moment.locale('fr', localization);

const singleDatepickerExample = require('!!raw-loader!../examples/single-datepicker-example.component.ts').default;

@Component({
    selector: 'single-datepicker',
    templateUrl: './single-datepicker.component.html',
    styleUrls: ['./single-datepicker.component.scss'],
})
export class SingleDatepickerComponent {
    singleDatepickerExample = singleDatepickerExample;
}
