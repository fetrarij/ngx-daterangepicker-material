import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';
import { DemoExampleComponent } from '../../shared/demo-example/demo-example.component';
import {
  BooleanOption,
  PlaygroundOptions,
  defaultOptions,
  isActive,
  liveLocale,
  liveMaxDate,
  liveMinDate,
  liveRanges
} from './playground-options';
import { buildSnippet } from './playground-snippet';

interface ToggleGroup {
  label: string;
  toggles: BooleanOption[];
}

@Component({
  selector: 'demo-playground-page',
  imports: [
    DemoExampleComponent,
    FormsModule,
    JsonPipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    NgxDaterangepickerMd
  ],
  templateUrl: './playground-page.component.html',
  styleUrl: './playground-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundPageComponent {
  readonly options = signal<PlaygroundOptions>(defaultOptions);
  readonly selected = signal<TimePeriod | null>(null);
  // Goes up on each change: the template tracks the input by it, so a new input is built and every option applies from the start.
  private readonly revision = signal(0);

  protected readonly live = computed(() => {
    const options = this.options();
    return {
      ...options,
      id: this.revision(),
      ranges: liveRanges(options),
      locale: liveLocale(options),
      minDate: liveMinDate(options),
      maxDate: liveMaxDate(options),
      dateLimit: isActive('dateLimit', options) ? options.dateLimit : null
    };
  });

  protected readonly snippet = computed(() => buildSnippet(this.options()));

  protected readonly toggleGroups: ToggleGroup[] = [
    {
      label: 'Behavior',
      toggles: [
        'singleDatePicker',
        'autoApply',
        'closeOnAutoApply',
        'linkedCalendars',
        'lockStartDate',
        'customRangeDirection',
        'allowEmptyEndDate'
      ]
    },
    { label: 'Display', toggles: ['showDropdowns', 'showWeekNumbers', 'showISOWeekNumbers', 'showCancel', 'showClearButton'] },
    { label: 'Ranges', toggles: ['ranges', 'alwaysShowCalendars', 'showCustomRangeLabel', 'showRangeLabelOnInput'] },
    { label: 'Time', toggles: ['timePicker', 'timePicker24Hour', 'timePickerSeconds'] }
  ];

  protected readonly increments = [1, 5, 15, 30];
  protected readonly dateLimits = [null, 7, 30];
  protected readonly formats = ['', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMM YYYY'];
  protected readonly separators = [' - ', ' to ', ' → '];

  protected isActive(key: keyof PlaygroundOptions): boolean {
    return isActive(key, this.options());
  }

  protected set<K extends keyof PlaygroundOptions>(key: K, value: PlaygroundOptions[K]): void {
    this.options.update((options) => ({ ...options, [key]: value }));
    this.revision.update((revision) => revision + 1);
  }

  protected reset(): void {
    this.options.set(defaultOptions);
    this.revision.update((revision) => revision + 1);
    this.selected.set(null);
  }
}
