import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import dayjs from 'dayjs/esm';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BasicRangeComponent } from './basic-range/basic-range.component';
import { ClearCancelComponent } from './clear-cancel/clear-cancel.component';
import { CustomDaysComponent } from './custom-days/custom-days.component';
import { CustomFormatComponent } from './custom-format/custom-format.component';
import { DateTimeComponent } from './date-time/date-time.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { FrenchLocaleComponent } from './french-locale/french-locale.component';
import { InlineCalendarComponent } from './inline-calendar/inline-calendar.component';
import { InlineNgmodelComponent } from './inline-ngmodel/inline-ngmodel.component';
import { InlineTimeComponent } from './inline-time/inline-time.component';
import { OpenFromButtonComponent } from './open-from-button/open-from-button.component';
import { PredefinedRangesComponent } from './predefined-ranges/predefined-ranges.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { SingleDateComponent } from './single-date/single-date.component';
import { SingleDateFormComponent } from './single-date-form/single-date-form.component';
import { TooltipDaysComponent } from './tooltip-days/tooltip-days.component';
import { appConfig } from './global-config/app.config';

const inputExamples: Type<unknown>[] = [
  BasicRangeComponent,
  ClearCancelComponent,
  CustomDaysComponent,
  CustomFormatComponent,
  DateTimeComponent,
  DropdownsComponent,
  FrenchLocaleComponent,
  OpenFromButtonComponent,
  PredefinedRangesComponent,
  ReactiveFormComponent,
  SingleDateComponent,
  SingleDateFormComponent,
  TooltipDaysComponent
];
const inlineExamples: Type<unknown>[] = [InlineCalendarComponent, InlineNgmodelComponent, InlineTimeComponent];

// Waits for the calendar to open and for the forms to settle.
const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 50));

describe('Demo examples', () => {
  let fixture: ComponentFixture<unknown>;

  // Waits for ngModel, which writes its first value later and would close a calendar opened before.
  async function create<T>(component: Type<T>, providers = NgxDaterangepickerMd.forRoot().providers): Promise<ComponentFixture<T>> {
    TestBed.configureTestingModule({ imports: [component], providers });
    const created = TestBed.createComponent(component);
    fixture = created;
    document.body.appendChild(created.nativeElement);
    created.detectChanges();
    await created.whenStable();
    created.detectChanges();
    return created;
  }

  const root = (): HTMLElement => fixture.nativeElement as HTMLElement;

  async function open(): Promise<void> {
    root().querySelector('input').click();
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
  }

  function clickDay(day: number): void {
    const cell = Array.from(root().querySelectorAll<HTMLElement>('.calendar.left td.available:not(.off)')).find(
      (td) => td.textContent.trim() === String(day)
    );
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
  }

  function clickButton(label: string): void {
    Array.from(root().querySelectorAll<HTMLButtonElement>('.md-drppicker button'))
      .find((button) => button.textContent.trim() === label)
      .click();
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
  });

  for (const component of inputExamples) {
    it(`${component.name} opens the calendar from its input`, async () => {
      await create(component);
      await open();

      expect(root().querySelector('.md-drppicker.shown')).not.toBeNull();
    });
  }

  for (const component of inlineExamples) {
    it(`${component.name} shows an inline calendar`, async () => {
      await create(component);

      expect(root().querySelector('.md-drppicker.inline')).not.toBeNull();
    });
  }

  it('reactive form: required until a range is applied, again after Clear', async () => {
    const form = (await create(ReactiveFormComponent)).componentInstance;

    expect(form.dates.status).toBe('INVALID');

    await open();
    clickDay(10);
    clickDay(12);
    clickButton('Apply');
    await settle();

    expect(form.dates.status).toBe('VALID');

    await open();
    clickButton('Clear');
    await settle();

    expect(form.dates.status).toBe('INVALID');
  });

  it('custom days: Sundays are blocked and Saturdays get the custom class', async () => {
    await create(CustomDaysComponent);
    await open();
    // Single mode shows one calendar, which starts at the current month, inside minDate and maxDate.
    const days = Array.from(root().querySelectorAll<HTMLElement>('.calendar td'));
    const sunday = days.find((td) => td.classList.contains('invalid'));
    const saturday = days.find((td) => td.classList.contains('weekend-day'));

    expect(sunday).toBeDefined();
    expect(saturday).toBeDefined();
    expect(saturday.classList.contains('invalid')).toBeFalse();
  });

  it('single date form: shows the plain starting date', async () => {
    await create(SingleDateFormComponent);

    expect(root().querySelector('input').value).toBe(dayjs('2026-03-15').format('MM/DD/YYYY'));
  });

  it('global config: forRoot() settings reach every picker', async () => {
    await create(BasicRangeComponent, appConfig.providers);
    await open();
    const labels = Array.from(root().querySelectorAll('.md-drppicker button')).map((button) => button.textContent.trim());

    expect(labels).toContain('Okay');
  });
});
