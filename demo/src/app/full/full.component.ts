import { Component } from '@angular/core';

const fullExample = require('!!raw-loader!../examples/full-example.component.ts').default;

@Component({
    selector: 'full',
    templateUrl: './full.component.html',
})
export class FullComponent {
    fullExample = fullExample;
}
