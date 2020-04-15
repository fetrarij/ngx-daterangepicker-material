import { Component } from '@angular/core';

const simpleExample = require('!!raw-loader!../examples/simple-example.component.ts').default;
const simpleInlineExample = require('!!raw-loader!../examples/simple-inline-example.component.ts').default;
const simpleInlineTimepickerExample = require('!!raw-loader!../examples/simple-inline-timepicker-example.component.ts').default;

@Component({
    selector: 'simple',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent {
    simpleExample = simpleExample;
    simpleInlineExample = simpleInlineExample;
    simpleInlineTimepickerExample = simpleInlineTimepickerExample;
}
