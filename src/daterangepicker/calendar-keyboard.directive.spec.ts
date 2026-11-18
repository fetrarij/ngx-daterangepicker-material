import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs/esm';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleConfig } from './daterangepicker.config';
import { nextFocusDate } from './calendar-keyboard.directive';

describe('nextFocusDate (issue #113)', () => {
  const day = dayjs('2026-11-11'); // a Wednesday
  const next = (key: string, shiftKey = false, rtl = false, firstDay = 0): string =>
    nextFocusDate(day, { key, shiftKey }, rtl, firstDay)?.format('YYYY-MM-DD') ?? null;

  it('moves by day and by week with the arrows', () => {
    expect(next('ArrowLeft')).toBe('2026-11-10');
    expect(next('ArrowRight')).toBe('2026-11-12');
    expect(next('ArrowUp')).toBe('2026-11-04');
    expect(next('ArrowDown')).toBe('2026-11-18');
  });

  it('swaps left and right in RTL', () => {
    expect(next('ArrowLeft', false, true)).toBe('2026-11-12');
    expect(next('ArrowRight', false, true)).toBe('2026-11-10');
  });

  it('goes to the start and end of the week, from the first day of the locale', () => {
    expect(next('Home')).toBe('2026-11-08');
    expect(next('End')).toBe('2026-11-14');
    expect(next('Home', false, false, 1)).toBe('2026-11-09');
    expect(next('End', false, false, 1)).toBe('2026-11-15');
  });

  it('moves by month, and by year with Shift', () => {
    expect(next('PageUp')).toBe('2026-10-11');
    expect(next('PageDown')).toBe('2026-12-11');
    expect(next('PageUp', true)).toBe('2025-11-11');
    expect(next('PageDown', true)).toBe('2027-11-11');
    expect(nextFocusDate(dayjs('2026-03-31'), { key: 'PageUp' }).format('YYYY-MM-DD')).toBe('2026-02-28');
  });

  it('ignores other keys', () => {
    expect(next('a')).toBeNull();
    expect(next('Tab')).toBeNull();
  });
});

@Component({
  template: `<ngx-daterangepicker-material
    [formControl]="control"
    [minDate]="minDate"
    [locale]="locale"
    [isInvalidDate]="isInvalidDate"
  ></ngx-daterangepicker-material>`,
  imports: [NgxDaterangepickerMd, ReactiveFormsModule]
})
class KeyboardHostComponent {
  @ViewChild(DaterangepickerComponent, { static: true }) picker: DaterangepickerComponent;
  control = new FormControl<unknown>({ startDate: dayjs('2026-11-10'), endDate: dayjs('2026-11-12') });
  minDate: Dayjs | null = null;
  locale: LocaleConfig = {};
  isInvalidDate = (date: Dayjs): boolean => date.date() === 20;
}

describe('Calendar keyboard navigation (issue #113)', () => {
  let fixture: ComponentFixture<KeyboardHostComponent>;
  let root: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  async function create(setup: (host: KeyboardHostComponent) => void = () => undefined): Promise<void> {
    fixture = TestBed.createComponent(KeyboardHostComponent);
    setup(fixture.componentInstance);
    root = fixture.nativeElement;
    // Attached to the page, so the cells can take the focus.
    document.body.appendChild(root);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture.destroy();
    root.remove();
  });

  const tabStops = (): HTMLElement[] => Array.from(root.querySelectorAll<HTMLElement>('td[tabindex="0"]'));
  const focused = (): string => (document.activeElement as HTMLElement).getAttribute('aria-label');
  const press = (key: string, shiftKey = false): void => {
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };
  const focusGrid = (): void => {
    tabStops()[0].focus();
  };
  const picker = (): DaterangepickerComponent => fixture.componentInstance.picker;

  it('has a single tab stop, on the start date', async () => {
    await create();

    expect(tabStops().length).toBe(1);
    expect(tabStops()[0].getAttribute('aria-label')).toBe('November 10, 2026');
  });

  it('moves the focus with the arrows, Home and End', async () => {
    await create();
    focusGrid();

    press('ArrowRight');
    expect(focused()).toBe('November 11, 2026');
    press('ArrowDown');
    expect(focused()).toBe('November 18, 2026');
    press('Home');
    expect(focused()).toBe('November 15, 2026');
    press('End');
    expect(focused()).toBe('November 21, 2026');
    expect(tabStops().length).toBe(1);
  });

  it('shows the next months when the focus leaves them', async () => {
    await create();
    focusGrid();

    press('PageDown');
    press('PageDown');

    expect(focused()).toBe('January 10, 2027');
    expect(picker().isMonthShown(dayjs('2027-01-10'))).toBeTrue();
    expect(tabStops().length).toBe(1);

    press('PageUp', true);
    expect(focused()).toBe('January 10, 2026');
  });

  it('keeps the two unlinked months one month apart when the focus leaves them', async () => {
    await create();
    focusGrid();

    const months = (): string => `${picker().leftCalendar.month.format('YYYY-MM')}..${picker().rightCalendar.month.format('YYYY-MM')}`;
    // The default configuration: the two calendars are not linked.
    expect(months()).toBe('2026-11..2026-12');

    press('PageDown'); // December is already shown, in the right calendar.
    press('PageDown'); // January 2027 is not shown: both months move.
    expect(focused()).toBe('January 10, 2027');
    expect(months()).toBe('2026-12..2027-01');

    press('PageDown');
    expect(months()).toBe('2027-01..2027-02');

    // Going back drags the right calendar along the same way.
    press('PageUp');
    press('PageUp');
    expect(focused()).toBe('December 10, 2026');
    expect(months()).toBe('2026-12..2027-01');

    for (let i = 0; i < 3; i++) {
      press('PageUp');
      expect(picker().rightCalendar.month.diff(picker().leftCalendar.month, 'month')).toBe(1);
      expect(tabStops().length).toBe(1);
    }
    expect(focused()).toBe('September 10, 2026');
  });

  it('chooses the start and the end date with Enter and Space', async () => {
    await create();
    focusGrid();

    press('ArrowRight');
    press('Enter');
    expect(picker().startDate.format('YYYY-MM-DD')).toBe('2026-11-11');
    expect(picker().endDate).toBeNull();

    press('ArrowRight');
    press('ArrowRight');
    // The start date cell has the in-range class too.
    expect(root.querySelectorAll('td.in-range:not(.start-date)').length).toBe(1);
    press(' ');

    expect(picker().endDate.format('YYYY-MM-DD')).toBe('2026-11-13');
    expect(focused()).toBe('November 13, 2026');
  });

  it('does not choose a disabled date and does not go before minDate', async () => {
    await create((host) => (host.minDate = dayjs('2026-11-09')));
    focusGrid();

    press('ArrowLeft');
    press('ArrowLeft');
    expect(focused()).toBe('November 9, 2026');

    // The 20th is disabled by isInvalidDate.
    press('ArrowDown');
    press('ArrowDown');
    press('ArrowRight');
    expect(focused()).toBe('November 24, 2026');
    press('ArrowLeft');
    press('ArrowLeft');
    press('ArrowLeft');
    press('ArrowLeft');
    expect(focused()).toBe('November 20, 2026');
    expect(document.activeElement.getAttribute('aria-disabled')).toBe('true');
    press('Enter');

    expect(picker().startDate.format('YYYY-MM-DD')).toBe('2026-11-10');
  });

  it('swaps left and right in an RTL calendar', async () => {
    await create((host) => (host.locale = { direction: 'rtl' }));
    focusGrid();

    press('ArrowLeft');

    expect(focused()).toBe('November 11, 2026');
  });

  it('labels the grid for screen readers', async () => {
    await create();
    const start = root.querySelector('td.start-date');

    expect(root.querySelector('table').getAttribute('role')).toBe('grid');
    expect(start.getAttribute('role')).toBe('gridcell');
    expect(start.getAttribute('aria-selected')).toBe('true');
    expect(root.querySelector('td.in-range:not(.start-date):not(.end-date)').getAttribute('aria-selected')).toBe('false');
  });

  it('opens the next month from the keyboard with a labeled button', async () => {
    await create();
    // Unlinked adjacent months hide the left next control (#635), so the labeled
    // next button on the page is the right calendar's.
    const next = root.querySelector<HTMLElement>('.calendar.right th.next');
    expect(next.getAttribute('role')).toBe('button');
    expect(next.getAttribute('tabindex')).toBe('0');
    expect(next.getAttribute('aria-label')).toBe('Next month');

    next.focus();
    press('Enter');

    expect(picker().rightCalendar.month.format('YYYY-MM')).toBe('2027-01');
  });
});
