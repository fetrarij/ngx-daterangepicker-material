import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import dayjs from 'dayjs/esm';
import { ChosenDate, DateRanges, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { highlight } from '../../shared/highlight';

interface Feature {
  title: string;
  text: string;
  path: string;
}

interface Step {
  title: string;
  file: string;
  language: 'html' | 'typescript';
  code: string;
}

const steps: Step[] = [
  {
    title: 'Register the providers once',
    file: 'app.config.ts',
    language: 'typescript',
    code: `import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(NgxDaterangepickerMd.forRoot())]
};`
  },
  {
    title: 'Import it in your component',
    file: 'date-range.component.ts',
    language: 'typescript',
    code: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-date-range',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './date-range.component.html'
})
export class DateRangeComponent {
  selected = signal<TimePeriod | null>(null);
}`
  },
  {
    title: 'Add it to an input',
    file: 'date-range.component.html',
    language: 'html',
    code: `<input type="text" ngxDaterangepickerMd [(ngModel)]="selected" />`
  }
];

@Component({
  selector: 'demo-home-page',
  imports: [RouterLink, MatButtonModule, NgxDaterangepickerMd],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  protected readonly installCommands = [
    { label: 'ng add', command: 'ng add ngx-daterangepicker-material' },
    { label: 'npm', command: 'npm install ngx-daterangepicker-material' }
  ];

  protected readonly selectedCommand = signal(0);
  protected readonly copied = signal(false);

  protected readonly ranges: DateRanges = {
    Today: [dayjs(), dayjs()],
    'Last 7 days': [dayjs().subtract(6, 'day'), dayjs()],
    'This month': [dayjs().startOf('month'), dayjs().endOf('month')]
  };

  protected readonly chosen = signal<ChosenDate | null>(null);

  protected readonly features: Feature[] = [
    { title: 'Predefined ranges', text: 'Today, Last 7 days, This month, or your own list next to the calendars.', path: '/custom-ranges' },
    { title: 'Time picker', text: 'Hours, minutes and seconds, in 12 or 24 hour format, with a step.', path: '/with-timepicker' },
    { title: 'Any language', text: 'Pass a dayjs locale for the day and month names and the first day of the week.', path: '/locale' },
    { title: 'Forms', text: 'ngModel, reactive forms and Signal Forms, with a required validator.', path: '/reactive-forms' },
    { title: 'Position', text: 'Open left, right, above or where there is room, even inside a parent that clips.', path: '/position' },
    { title: 'Events and API', text: 'Follow every step of a selection, and open or clear the picker from your code.', path: '/events' }
  ];

  protected readonly steps = steps.map((step) => ({ ...step, html: highlight(step.code, step.language) }));

  protected copyCommand(): void {
    navigator.clipboard.writeText(this.installCommands[this.selectedCommand()].command).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  protected selectCommand(index: number): void {
    this.selectedCommand.set(index);
    this.copied.set(false);
  }
}
