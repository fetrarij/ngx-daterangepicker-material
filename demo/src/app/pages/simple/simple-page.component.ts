import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { BasicRangeComponent } from '../../examples/basic-range/basic-range.component';
import { DropdownsComponent } from '../../examples/dropdowns/dropdowns.component';
import { ClearCancelComponent } from '../../examples/clear-cancel/clear-cancel.component';

@Component({
  selector: 'demo-simple-page',
  imports: [DemoExampleComponent, BasicRangeComponent, DropdownsComponent, ClearCancelComponent],
  templateUrl: './simple-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePageComponent {}
