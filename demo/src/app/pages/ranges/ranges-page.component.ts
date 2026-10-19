import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { PredefinedRangesComponent } from '../../examples/predefined-ranges/predefined-ranges.component';
import { OpenEndDateComponent } from '../../examples/open-end-date/open-end-date.component';
import { TooltipDaysComponent } from '../../examples/tooltip-days/tooltip-days.component';

@Component({
  selector: 'demo-ranges-page',
  imports: [DemoExampleComponent, PredefinedRangesComponent, TooltipDaysComponent, OpenEndDateComponent],
  templateUrl: './ranges-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangesPageComponent {}
