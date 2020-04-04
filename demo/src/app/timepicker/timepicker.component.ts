import { Component } from '@angular/core';

const timepickerExample = require('!!raw-loader!../examples/timepicker-example.component.ts').default;

@Component({
    selector: 'timepicker',
    templateUrl: './timepicker.component.html',
})
export class TimepickerComponent {
    timepickerExample = timepickerExample;
}
