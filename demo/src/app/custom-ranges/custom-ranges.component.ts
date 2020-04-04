import { Component } from '@angular/core';

const customRangesExample = require('!!raw-loader!../examples/custom-ranges-example.component.ts').default;
const customRangesInlineExample = require('!!raw-loader!../examples/custom-ranges-inline-example.component.ts').default;

@Component({
    selector: 'custom-ranges',
    templateUrl: './custom-ranges.component.html',
    styleUrls: ['./custom-ranges.component.scss'],
})
export class CustomRangesComponent {
    customRangesExample = customRangesExample;
    customRangesInlineExample = customRangesInlineExample;
}
