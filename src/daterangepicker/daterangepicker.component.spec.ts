import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerComponent } from './daterangepicker.component';

describe('DaterangepickerComponent minDate/maxDate native Date support (issue #561)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;
  let component: DaterangepickerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('accepts a native Date for minDate instead of silently discarding it', () => {
    component.minDate = new Date('2025-04-30T00:00:00.000Z');

    expect(component.minDate).toBeTruthy();
    expect(component.minDate.format('YYYY-MM-DD')).toBe('2025-04-30');
  });

  it('accepts a native Date for maxDate instead of silently discarding it', () => {
    component.maxDate = new Date('2025-04-30T12:00:00.000Z');

    expect(component.maxDate).toBeTruthy();
    expect(component.maxDate.format('YYYY-MM-DD')).toBe('2025-04-30');
  });

  it('converts a native Date for minDate the same way as an equivalent ISO string', () => {
    const instant = '2025-04-30T00:00:00.000Z';
    component.minDate = new Date(instant);
    const fromDate = component.minDate.format();

    component.minDate = instant;
    const fromString = component.minDate.format();

    expect(fromDate).toBe(fromString);
  });
});

describe('DaterangepickerComponent year dropdown bounds (issue #525)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;
  let component: DaterangepickerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function create(singleDatePicker: boolean, maxDate?: string): void {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    component = fixture.componentInstance;
    component.showDropdowns = true;
    component.singleDatePicker = singleDatePicker;
    if (maxDate) {
      component.maxDate = maxDate;
    }
    fixture.detectChanges();
  }

  function selectYear(year: number): void {
    // The first year select is always the left calendar's, even in single mode where it has the "right" class.
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('.yearselect');
    select.value = String(year);
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  for (const singleDatePicker of [true, false]) {
    const mode = singleDatePicker ? 'single' : 'range';

    it(`renders the first and last default years without minDate/maxDate (${mode})`, () => {
      create(singleDatePicker);
      const { minYear, maxYear } = component.calendarVariables.left.dropdowns;

      expect(() => selectYear(maxYear)).not.toThrow();
      expect(() => selectYear(minYear)).not.toThrow();
    });
  }

  it('still disables the months after maxDate in the last year', () => {
    create(true, '2030-06-15');
    selectYear(2030);

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('.monthselect');
    const disabled = Array.from(select.options).map((option) => option.disabled);

    expect(disabled.slice(0, 6).every((value) => !value)).toBeTrue();
    expect(disabled.slice(6).every((value) => value)).toBeTrue();
  });
});

describe('DaterangepickerComponent autoApply emits once (issue #526)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;
  let component: DaterangepickerComponent;
  let emitted: { choosedDate: number; datesUpdated: number };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function create(singleDatePicker: boolean, autoApply: boolean): void {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    component = fixture.componentInstance;
    component.singleDatePicker = singleDatePicker;
    component.autoApply = autoApply;
    fixture.detectChanges();
    emitted = { choosedDate: 0, datesUpdated: 0 };
    component.choosedDate.subscribe(() => emitted.choosedDate++);
    component.datesUpdated.subscribe(() => emitted.datesUpdated++);
  }

  function clickDay(day: number): void {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('td.available:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === String(day)).click();
    fixture.detectChanges();
  }

  it('emits once per click in single mode with autoApply', () => {
    create(true, true);
    clickDay(10);

    expect(emitted).toEqual({ choosedDate: 1, datesUpdated: 1 });
  });

  it('does not emit on click in single mode without autoApply', () => {
    create(true, false);
    clickDay(10);

    expect(emitted).toEqual({ choosedDate: 0, datesUpdated: 0 });
  });

  it('emits once after the end date in range mode with autoApply', () => {
    create(false, true);
    clickDay(10);
    expect(emitted).toEqual({ choosedDate: 0, datesUpdated: 0 });

    clickDay(12);
    expect(emitted).toEqual({ choosedDate: 1, datesUpdated: 1 });
  });
});
