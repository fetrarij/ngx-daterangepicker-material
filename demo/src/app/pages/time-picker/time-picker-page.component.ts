import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { DateTimeComponent } from '../../examples/date-time/date-time.component';

@Component({
  selector: 'demo-time-picker-page',
  imports: [DemoExampleComponent, DateTimeComponent],
  templateUrl: './time-picker-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerPageComponent {}
