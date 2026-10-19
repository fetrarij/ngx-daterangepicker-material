import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { EventLogComponent } from '../../examples/event-log/event-log.component';
import { OpenFromButtonComponent } from '../../examples/open-from-button/open-from-button.component';

@Component({
  selector: 'demo-events-page',
  imports: [DemoExampleComponent, EventLogComponent, OpenFromButtonComponent],
  templateUrl: './events-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsPageComponent {}
