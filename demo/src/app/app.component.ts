import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
