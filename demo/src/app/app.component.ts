import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { version } from '../../../package.json';
import { demoLinkGroups } from './app.routes';

// The page scrolls as a whole, without a scrolling container: a calendar wider than its example is not clipped.
@Component({
  selector: 'demo-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' }
})
export class AppComponent {
  protected readonly version = version;
  protected readonly groups = demoLinkGroups;
  // Only used on small screens, where the menu is a drawer.
  protected readonly menuOpen = signal(false);
}
