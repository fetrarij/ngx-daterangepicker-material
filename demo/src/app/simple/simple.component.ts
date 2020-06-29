import { Component, ViewChild } from '@angular/core';
import { SimpleExampleComponent } from '../examples/simple-example.component';
import { SimpleInlineExampleComponent } from '../examples/simple-inline-example.component';
import { SimpleInlineTimepickerExampleComponent } from '../examples/simple-inline-timepicker-example.component';

const simpleExample = require('!!raw-loader!../examples/simple-example.component.ts').default;
const simpleInlineExample = require('!!raw-loader!../examples/simple-inline-example.component.ts').default;
const simpleInlineTimepickerExample = require('!!raw-loader!../examples/simple-inline-timepicker-example.component.ts').default;

@Component({
    selector: 'simple',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent {
    @ViewChild(SimpleExampleComponent) simpleExempleComponent: SimpleExampleComponent;
    @ViewChild(SimpleInlineExampleComponent) simpleInlineExempleComponent: SimpleInlineExampleComponent;
    @ViewChild(SimpleInlineTimepickerExampleComponent) simpleInlineTimepickerExampleComponent: SimpleInlineTimepickerExampleComponent;
    
    simpleExample = simpleExample;
    simpleInlineExample = simpleInlineExample;
    simpleInlineTimepickerExample = simpleInlineTimepickerExample;
}
