import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map } from 'rxjs/operators';
import { version } from '../../../package.json';
import { demoLinks } from './app.routes';

@Component({
  selector: 'demo-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatListModule, MatSidenavModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  protected readonly version = version;
  protected readonly links = demoLinks;
  // Below this width the menu becomes a drawer opened from the top bar.
  protected readonly isSmall = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 899px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false }
  );
}
