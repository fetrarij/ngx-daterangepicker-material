import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { InlineCalendarComponent } from '../../examples/inline-calendar/inline-calendar.component';
import { InlineTimeComponent } from '../../examples/inline-time/inline-time.component';
import { InlineNgmodelComponent } from '../../examples/inline-ngmodel/inline-ngmodel.component';

@Component({
  selector: 'demo-inline-page',
  imports: [DemoExampleComponent, InlineCalendarComponent, InlineTimeComponent, InlineNgmodelComponent],
  templateUrl: './inline-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlinePageComponent {}
