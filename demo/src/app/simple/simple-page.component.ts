import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../shared/demo-example/demo-example.component';
import { BasicRangeComponent } from '../examples/basic-range/basic-range.component';
import { OpenFromButtonComponent } from '../examples/open-from-button/open-from-button.component';

@Component({
  selector: 'demo-simple-page',
  imports: [DemoExampleComponent, BasicRangeComponent, OpenFromButtonComponent],
  templateUrl: './simple-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePageComponent {}
