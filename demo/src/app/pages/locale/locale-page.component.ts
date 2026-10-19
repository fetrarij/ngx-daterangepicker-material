import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import { FrenchLocaleComponent } from '../../examples/french-locale/french-locale.component';
import { CustomFormatComponent } from '../../examples/custom-format/custom-format.component';

@Component({
  selector: 'demo-locale-page',
  imports: [DemoExampleComponent, FrenchLocaleComponent, CustomFormatComponent],
  templateUrl: './locale-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalePageComponent {}
