import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { DropsOpensComponent } from '../../examples/drops-opens/drops-opens.component';
import { DropsAutoComponent } from '../../examples/drops-auto/drops-auto.component';
import { AppendToBodyComponent } from '../../examples/append-to-body/append-to-body.component';

@Component({
  selector: 'demo-position-page',
  imports: [DemoExampleComponent, DropsOpensComponent, DropsAutoComponent, AppendToBodyComponent],
  templateUrl: './position-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionPageComponent {}
