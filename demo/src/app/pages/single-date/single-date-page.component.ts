import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { SingleDateComponent } from '../../examples/single-date/single-date.component';
import { CustomDaysComponent } from '../../examples/custom-days/custom-days.component';

@Component({
  selector: 'demo-single-date-page',
  imports: [DemoExampleComponent, SingleDateComponent, CustomDaysComponent],
  templateUrl: './single-date-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleDatePageComponent {}
