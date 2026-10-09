import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerComponent, TimePeriod } from './daterangepicker.component';

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

describe('DaterangepickerComponent inline Cancel (issue #554)', () => {
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
    component.inline = true;
    component.showCancel = true;
    component.showClearButton = true;
    fixture.detectChanges();
  });

  function clickDay(day: number): void {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar td.available:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === String(day)).click();
    fixture.detectChanges();
  }

  function clickButton(label: string): void {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.buttons button'));
    buttons.find((button) => button.textContent.trim().startsWith(label)).click();
    fixture.detectChanges();
  }

  function selectedDays(): number[] {
    return [component.startDate.date(), component.endDate.date()];
  }

  it('restores the last applied range', () => {
    clickDay(3);
    clickDay(6);
    clickButton('Apply');

    clickDay(10);
    clickDay(12);
    clickButton('Cancel');

    expect(selectedDays()).toEqual([3, 6]);
  });

  it('does not bring back a range applied before Clear', () => {
    clickDay(3);
    clickDay(6);
    clickButton('Apply');
    clickButton('Clear');
    const afterClear = selectedDays();

    clickDay(10);
    clickDay(12);
    clickButton('Cancel');

    expect(selectedDays()).toEqual(afterClear);
  });
});

describe('DaterangepickerComponent Apply with only a start date (issue #549)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;
  let component: DaterangepickerComponent;
  let lastUpdate: TimePeriod;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function create(timePicker: boolean): void {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    component = fixture.componentInstance;
    component.inline = true;
    component.timePicker = timePicker;
    fixture.detectChanges();
    component.datesUpdated.subscribe((range: TimePeriod) => (lastUpdate = range));
  }

  function clickDay(day: number): void {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar td.available:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === String(day)).click();
    fixture.detectChanges();
  }

  function apply(): void {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.buttons button'));
    buttons.find((button) => button.textContent.trim() === 'Apply').click();
    fixture.detectChanges();
  }

  it('ends at the end of the day without timePicker, like clicking the day twice', () => {
    create(false);
    clickDay(4);
    clickDay(4);
    apply();
    const twoClicks = lastUpdate.endDate.format();

    clickDay(4);
    apply();

    expect(lastUpdate.endDate.format()).toBe(twoClicks);
    expect(lastUpdate.endDate.format('HH:mm:ss')).toBe('23:59:59');
    expect(lastUpdate.startDate.format('YYYY-MM-DD HH:mm')).toBe(lastUpdate.endDate.format('YYYY-MM-DD') + ' 00:00');
  });

  it('keeps the right time picker value with timePicker', () => {
    create(true);
    clickDay(4);
    apply();

    expect(lastUpdate.endDate.format('HH:mm')).toBe('23:59');
    expect(lastUpdate.endDate.date()).toBe(4);
  });
});

describe('DaterangepickerComponent hour labels (issue #539)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function hourOptions(timePicker24Hour: boolean): { text: string; value: string }[] {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    fixture.componentInstance.inline = true;
    fixture.componentInstance.timePicker = true;
    fixture.componentInstance.timePicker24Hour = timePicker24Hour;
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('.hourselect');
    return Array.from(select.options).map((option) => ({ text: option.textContent.trim(), value: option.value }));
  }

  it('pads hours with a zero in 24-hour mode', () => {
    const options = hourOptions(true);

    expect(options.slice(0, 11).map((option) => option.text)).toEqual(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    expect(options[23].text).toBe('23');
    expect(options[5].value).toBe('5');
  });

  it('keeps unpadded hours in 12-hour mode', () => {
    const options = hourOptions(false);

    expect(options.map((option) => option.text)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  });
});
