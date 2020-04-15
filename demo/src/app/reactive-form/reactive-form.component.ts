import { Component } from '@angular/core';

const reactiveFormMultiSelectExample = require('!!raw-loader!../examples/reactive-form-multi-select-example.component.ts').default;
const reactiveFormSingleSelectExample = require('!!raw-loader!../examples/reactive-form-single-select-example.component.ts').default;

@Component({
    selector: 'reactive-form',
    templateUrl: './reactive-form.component.html',
    styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent {
    reactiveFormMultiSelectExample = reactiveFormMultiSelectExample;
    reactiveFormSingleSelectExample = reactiveFormSingleSelectExample;
}
