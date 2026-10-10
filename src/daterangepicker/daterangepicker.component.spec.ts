import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import dayjs, { Dayjs } from 'dayjs/esm';
import fr from 'dayjs/esm/locale/fr';
import dayjsCjs from 'dayjs';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerComponent, TimePeriod } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';

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

describe('DaterangepickerComponent isCustomDate (issue #534)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function classesOfDay10(isCustomDate: (date: Dayjs) => string | string[] | boolean): string[] {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    fixture.componentInstance.inline = true;
    fixture.componentInstance.isCustomDate = (date: Dayjs) => (date.date() === 10 ? isCustomDate(date) : false);
    fixture.detectChanges();
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar td.available:not(.off)'));
    return Array.from(cells.find((cell) => cell.textContent.trim() === '10').classList);
  }

  it('adds a class name', () => {
    expect(classesOfDay10(() => 'holiday')).toContain('holiday');
  });

  it('adds a list of class names', () => {
    const classes = classesOfDay10(() => ['holiday', 'busy']);

    expect(classes).toContain('holiday');
    expect(classes).toContain('busy');
  });

  it('ignores false and true without breaking the rendering', () => {
    expect(classesOfDay10(() => false)).toContain('available');
    expect(classesOfDay10(() => true)).toContain('available');
  });
});

describe('DaterangepickerDirective callback typings (issue #534)', () => {
  it('accepts a list of classes from isCustomDate', () => {
    const directive = {} as DaterangepickerDirective;
    directive.isCustomDate = (date: Dayjs) => (date.day() === 0 ? ['weekend', 'sunday'] : false);
    directive.isInvalidDate = (date: Dayjs) => date.day() === 6;

    expect(directive.isCustomDate(dayjs('2026-10-11'))).toEqual(['weekend', 'sunday']);
  });
});

describe('DaterangepickerComponent locale change at runtime (issues #519, #462)', () => {
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
    fixture.detectChanges();
  });

  function headers(): string[] {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar thead tr:last-child th'));
    return cells.map((cell) => cell.textContent.trim()).slice(-7);
  }

  function firstGridDay(): number {
    return component.calendarVariables.left.calendar[0][0].day();
  }

  it('re-orders the weekday headers and the grid together', () => {
    fixture.componentRef.setInput('locale', { locale: fr });
    fixture.detectChanges();

    expect(headers()).toEqual(['lu', 'ma', 'me', 'je', 've', 'sa', 'di']);
    expect(firstGridDay()).toBe(1);
    expect(fixture.nativeElement.querySelector('.month').textContent).toContain(fr.monthsShort[component.leftCalendar.month.month()]);

    fixture.componentRef.setInput('locale', { format: 'MM/DD/YYYY' });
    fixture.detectChanges();

    expect(headers()).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    expect(firstGridDay()).toBe(0);
  });
});

describe('DaterangepickerComponent inline emitted instants (issue #547)', () => {
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
    component.alwaysShowCalendars = true;
    component.ranges = { Week: [dayjs('2026-10-05T00:00:00'), dayjs('2026-10-11T23:59:59')] };
    fixture.detectChanges();
  });

  // The local instant of a wall-clock time in the browser's timezone.
  function local(wallClock: string): string {
    return dayjs(wallClock).toISOString();
  }

  function clickDay(day: number): void {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar td.available:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === String(day)).click();
    fixture.detectChanges();
  }

  it('emits local instants from datesUpdated, choosedDate, startDateChanged and endDateChanged', () => {
    const month = component.leftCalendar.month.format('YYYY-MM');
    const emitted: Record<string, string> = {};
    component.datesUpdated.subscribe((range: TimePeriod) => (emitted.updatedStart = range.startDate.toISOString()));
    component.choosedDate.subscribe((range) => (emitted.chosenEnd = range.endDate.toISOString()));
    component.startDateChanged.subscribe((value) => (emitted.start = value.startDate.toISOString()));
    component.endDateChanged.subscribe((value) => (emitted.end = value.endDate.toISOString()));

    clickDay(4);
    clickDay(6);
    component.clickApply();

    expect(emitted.start).toBe(local(`${month}-04T00:00:00`));
    expect(emitted.updatedStart).toBe(local(`${month}-04T00:00:00`));
    expect(emitted.end).toBe(local(`${month}-06T23:59:59`));
    expect(emitted.chosenEnd).toBe(local(`${month}-06T23:59:59`));
  });

  it('emits local instants from rangeClicked', () => {
    let start: string;
    component.rangeClicked.subscribe((range) => (start = range.dates[0].toISOString()));

    component.clickRange(new MouseEvent('click'), 'Week');

    expect(start).toBe(local('2026-10-05T00:00:00'));
  });

  it('still emits null dates on Clear', () => {
    let cleared: TimePeriod;
    component.datesUpdated.subscribe((range: TimePeriod) => (cleared = range));

    component.clear();

    expect(cleared).toEqual({ startDate: null, endDate: null });
  });
});

describe('DaterangepickerComponent dates from another copy of dayjs (issues #521, #486)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;
  let component: DaterangepickerComponent;
  let month: string;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    component = fixture.componentInstance;
    month = dayjs().format('YYYY-MM');
  });

  function enabledDays(): number[] {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar.left tbody td:not(.off)'));
    return cells.filter((cell) => !cell.classList.contains('disabled')).map((cell) => Number(cell.textContent.trim()));
  }

  // The CommonJS copy is left without the utc plugin, like in a consumer app.
  it('uses the CommonJS build for "dayjs" in this test, so the copies really differ', () => {
    expect(dayjsCjs() instanceof dayjs().constructor).toBeFalse();
  });

  it('applies minDate/maxDate created with the CommonJS dayjs', () => {
    component.minDate = dayjsCjs(`${month}-10`) as unknown as Dayjs;
    component.maxDate = dayjsCjs(`${month}-20T15:30:00`) as unknown as Dayjs;
    fixture.detectChanges();

    expect(component.minDate.format('YYYY-MM-DD HH:mm')).toBe(`${month}-10 00:00`);
    expect(component.maxDate.format('YYYY-MM-DD HH:mm')).toBe(`${month}-20 15:30`);
    expect(component.maxDate.isUTC()).toBeTrue();
    expect(enabledDays()).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('accepts a dayjs-like object that isDayjs() does not recognize (dayjs < 1.11.10)', () => {
    const foreign = { format: () => `${month}-12T00:00:00.000`, isValid: () => true };

    component.minDate = foreign as unknown as Dayjs;

    expect(component.minDate.format('YYYY-MM-DD')).toBe(`${month}-12`);
  });

  it('drops an unknown value with a warning instead of failing silently', () => {
    spyOn(console, 'warn');

    component.maxDate = {} as unknown as Dayjs;

    expect(component.maxDate).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it('renders ranges made of CommonJS dayjs objects and emits them on click', () => {
    component.inline = true;
    component.alwaysShowCalendars = true;
    component.ranges = { Week: [dayjsCjs('2026-10-05T00:00:00'), dayjsCjs('2026-10-11T23:59:59')] as unknown as [Dayjs, Dayjs] };
    fixture.detectChanges();
    let dates: Dayjs[];
    component.rangeClicked.subscribe((range) => (dates = range.dates));

    component.clickRange(new MouseEvent('click'), 'Week');

    expect(component.rangesArray).toContain('Week');
    expect(dates[0].toISOString()).toBe(dayjs('2026-10-05T00:00:00').toISOString());
    expect(dates[1].toISOString()).toBe(dayjs('2026-10-11T23:59:59').toISOString());
  });

  it('accepts CommonJS dayjs objects in setStartDate/setEndDate', () => {
    fixture.detectChanges();

    component.setStartDate(dayjsCjs(`${month}-03`) as unknown as Dayjs);
    component.setEndDate(dayjsCjs(`${month}-05`) as unknown as Dayjs);

    expect(component.startDate.format('YYYY-MM-DD HH:mm:ss')).toBe(`${month}-03 00:00:00`);
    expect(component.endDate.format('YYYY-MM-DD HH:mm:ss')).toBe(`${month}-05 23:59:59`);
  });
});

describe('DaterangepickerComponent dates clamped to minDate/maxDate (issue #486)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;
  let component: DaterangepickerComponent;
  let month: string;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function create(timePicker: boolean, minDate: string | Dayjs, maxDate: string | Dayjs): void {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    component = fixture.componentInstance;
    component.timePicker = timePicker;
    component.minDate = minDate;
    component.maxDate = maxDate;
    fixture.detectChanges();
  }

  function clickDay(day: number): void {
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar.left tbody td:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === String(day)).click();
    fixture.detectChanges();
  }

  beforeEach(() => (month = dayjs().format('YYYY-MM')));

  it('ends at the end of the maxDate day when the end is clamped (dayjs maxDate with a time)', () => {
    create(false, null, dayjs(`${month}-20T15:30:00`));
    let end: string;
    component.endDateChanged.subscribe((value) => (end = value.endDate.format('YYYY-MM-DD HH:mm:ss')));

    clickDay(18);
    clickDay(20);

    expect(component.endDate.format('YYYY-MM-DD HH:mm:ss')).toBe(`${month}-20 23:59:59`);
    expect(end).toBe(`${month}-20 23:59:59`);
  });

  it('ends at the end of the maxDate day when maxDate is a date string', () => {
    create(false, null, `${month}-20`);

    clickDay(18);
    clickDay(20);

    expect(component.endDate.format('YYYY-MM-DD HH:mm:ss')).toBe(`${month}-20 23:59:59`);
  });

  it('keeps maxDate exactly with the time picker', () => {
    create(true, null, dayjs(`${month}-20T15:30:00`));

    component.setStartDate(dayjs(`${month}-18T10:00:00`));
    component.setEndDate(dayjs(`${month}-20T18:00:00`));

    expect(component.endDate.format('YYYY-MM-DD HH:mm')).toBe(`${month}-20 15:30`);
  });

  it('starts at the beginning of the minDate day when the start is clamped', () => {
    create(false, dayjs(`${month}-10T09:00:00`), null);

    component.setStartDate(dayjs(`${month}-05`));

    expect(component.startDate.format('YYYY-MM-DD HH:mm:ss')).toBe(`${month}-10 00:00:00`);
  });

  it('keeps minDate exactly with the time picker', () => {
    create(true, dayjs(`${month}-10T09:00:00`), null);

    component.setStartDate(dayjs(`${month}-05T08:00:00`));

    expect(component.startDate.format('YYYY-MM-DD HH:mm')).toBe(`${month}-10 09:00`);
  });
});

describe('DaterangepickerComponent time picker enabled after init (issue #518)', () => {
  let fixture: ComponentFixture<DaterangepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaterangepickerComponent);
    fixture.componentRef.setInput('autoApply', true);
    fixture.detectChanges();
  });

  it('renders the time picker when timePicker becomes true, then false, then true again', () => {
    for (const value of [true, false, true]) {
      fixture.componentRef.setInput('timePicker', value);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('select.hourselect').length).toBe(value ? 2 : 0);
    }
  });

  it('lets the user pick a range after the time picker was enabled', () => {
    fixture.componentRef.setInput('timePicker', true);
    fixture.detectChanges();
    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('.calendar.left tbody td.available:not(.off)'));

    cells[0].click();
    fixture.detectChanges();
    cells[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.endDate.isAfter(fixture.componentInstance.startDate)).toBeTrue();
  });
});
