import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { EXAMPLE_SOURCES, SourceFile } from '../example-sources';
import { highlight } from '../highlight';

// One example: a short text, the live demo, then its real code with a copy button.
@Component({
  selector: 'demo-example',
  imports: [MatButtonModule, MatTabsModule],
  templateUrl: './demo-example.component.html',
  styleUrl: './demo-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoExampleComponent {
  readonly name = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');

  private readonly sources = inject(EXAMPLE_SOURCES, { optional: true });
  protected readonly files = computed(() =>
    (this.sources?.[this.name()] ?? []).map((file) => ({ ...file, html: highlight(file.code, file.language) }))
  );

  protected readonly copied = signal<string | null>(null);

  protected copy(file: SourceFile): void {
    navigator.clipboard.writeText(file.code).then(() => {
      this.copied.set(file.name);
      setTimeout(() => this.copied.set(null), 1500);
    });
  }
}
