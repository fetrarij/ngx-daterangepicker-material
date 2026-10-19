import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { ReactiveFormComponent } from '../../examples/reactive-form/reactive-form.component';
import { SingleDateFormComponent } from '../../examples/single-date-form/single-date-form.component';

@Component({
  selector: 'demo-forms-page',
  imports: [DemoExampleComponent, ReactiveFormComponent, SingleDateFormComponent],
  templateUrl: './forms-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsPageComponent {}
