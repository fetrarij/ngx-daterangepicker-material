import { Component, ViewChild } from '@angular/core';
import { CustomRangesExampleComponent } from '../examples/custom-ranges-example.component';
import { CustomRangesInlineExampleComponent } from '../examples/custom-ranges-inline-example.component';

const customRangesExample = require('!!raw-loader!../examples/custom-ranges-example.component.ts').default;
const customRangesInlineExample = require('!!raw-loader!../examples/custom-ranges-inline-example.component.ts').default;

@Component({
    selector: 'custom-ranges',
    templateUrl: './custom-ranges.component.html',
    styleUrls: ['./custom-ranges.component.scss'],
})
export class CustomRangesComponent {
    @ViewChild(CustomRangesExampleComponent) customRangesExampleComponent: CustomRangesExampleComponent;
    @ViewChild(CustomRangesInlineExampleComponent) customRangesInlineExampleComponent: CustomRangesInlineExampleComponent;
    customRangesExample = customRangesExample;
    customRangesInlineExample = customRangesInlineExample;
}
