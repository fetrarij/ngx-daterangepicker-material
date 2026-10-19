import { Component, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import dayjs from 'dayjs/esm';
import fr from 'dayjs/esm/locale/fr';
import es from 'dayjs/esm/locale/es';
import pt from 'dayjs/esm/locale/pt';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { TimePeriod } from './daterangepicker.component';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [(ngModel)]="selected"
    [timePicker]="true"
    [timePicker24Hour]="true"
    (datesUpdated)="onDatesUpdated($event)"
  />`
})
class TestHostComponent {
  selected: TimePeriod;
  lastDatesUpdated: TimePeriod;

  onDatesUpdated(range: TimePeriod): void {
    this.lastDatesUpdated = range;
  }
}

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [(ngModel)]="selected" style="display: block; width: 100%" />
    <ngx-daterangepicker-material></ngx-daterangepicker-material>`
})
class InlineAndPopupHostComponent {
  selected: TimePeriod;
}

describe('DaterangepickerDirective popup stacking with an inline calendar (issue #601)', () => {
  let fixture: ComponentFixture<InlineAndPopupHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InlineAndPopupHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.destroy());

  it('keeps the opened input popup above the inline calendar', async () => {
    fixture = TestBed.createComponent(InlineAndPopupHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('input') as HTMLInputElement).click();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();

    const popup = fixture.nativeElement.querySelector('.md-drppicker:not(.inline)') as HTMLElement;
    const inline = fixture.nativeElement.querySelector('.md-drppicker.inline') as HTMLElement;
    const inlineRect = inline.getBoundingClientRect();
    const popupCells = Array.from(popup.querySelectorAll<HTMLElement>('td.available:not(.off)'));
    const popupCell = popupCells.find((cell) => {
      const rect = cell.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      return x >= inlineRect.left && x < inlineRect.right && y >= inlineRect.top && y < inlineRect.bottom;
    });
    expect(popupCell).toBeDefined();
    const popupCellRect = popupCell.getBoundingClientRect();
    const x = Math.floor(popupCellRect.left + popupCellRect.width / 2);
    const y = Math.floor(popupCellRect.top + popupCellRect.height / 2);

    expect(popup.contains(document.elementFromPoint(x, y))).toBeTrue();
  });
});

describe('DaterangepickerDirective external date instants (issue #562)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: DaterangepickerDirective;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    directive = fixture.debugElement.query(By.directive(DaterangepickerDirective)).injector.get(DaterangepickerDirective);
    fixture.detectChanges();
  });

  it('does not shift the instant of a bound UTC date after apply', () => {
    const originalInstant = new Date('2025-05-17T05:00:00.000Z');
    directive.writeValue({
      startDate: dayjs(originalInstant),
      endDate: dayjs(originalInstant)
    });

    directive.picker.clickApply();
    fixture.detectChanges();

    expect(host.lastDatesUpdated.startDate.toISOString()).toBe(originalInstant.toISOString());
    expect(host.lastDatesUpdated.endDate.toISOString()).toBe(originalInstant.toISOString());
  });

  it('does not shift the instant emitted through ngModel after apply', () => {
    const originalInstant = new Date('2025-05-17T05:00:00.000Z');
    directive.writeValue({
      startDate: dayjs(originalInstant),
      endDate: dayjs(originalInstant)
    });

    directive.picker.clickApply();
    fixture.detectChanges();

    expect(host.selected.startDate.toISOString()).toBe(originalInstant.toISOString());
    expect(host.selected.endDate.toISOString()).toBe(originalInstant.toISOString());
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [singleDatePicker]="true"
    [autoApply]="true"
    [(ngModel)]="selected"
    (ngModelChange)="changes = changes + 1"
  />`
})
class SingleAutoApplyHostComponent {
  selected: TimePeriod;
  changes = 0;
}

describe('DaterangepickerDirective single autoApply (issue #526)', () => {
  let fixture: ComponentFixture<SingleAutoApplyHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingleAutoApplyHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  it('updates the model once per click and closes the picker', () => {
    fixture = TestBed.createComponent(SingleAutoApplyHostComponent);
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(DaterangepickerDirective)).injector.get(DaterangepickerDirective);
    directive.open();
    fixture.detectChanges();

    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('td.available:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === '10').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toBe(1);
    expect(directive.picker.isShown).toBeFalse();
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [singleDatePicker]="true"
    [autoApply]="autoApply"
    [ranges]="ranges"
    [showCustomRangeLabel]="true"
    [(ngModel)]="selected"
  />`
})
class SingleCustomRangeHostComponent {
  selected: TimePeriod;
  autoApply = false;
  ranges = { Today: [dayjs(), dayjs()] };
}

describe('DaterangepickerDirective single date with custom range (issue #555)', () => {
  let fixture: ComponentFixture<SingleCustomRangeHostComponent>;
  let directive: DaterangepickerDirective;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingleCustomRangeHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function openCustomRange(autoApply: boolean): void {
    fixture = TestBed.createComponent(SingleCustomRangeHostComponent);
    fixture.componentInstance.autoApply = autoApply;
    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(DaterangepickerDirective)).injector.get(DaterangepickerDirective);
    directive.open();
    fixture.detectChanges();
    findButton('.ranges button', 'Custom range').click();
    fixture.detectChanges();
  }

  function findButton(selector: string, label: string): HTMLButtonElement | undefined {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll(selector));
    return buttons.find((button) => button.textContent.trim() === label);
  }

  it('shows the Apply button and applies the clicked day', () => {
    openCustomRange(false);
    const apply = findButton('.buttons button', 'Apply');
    expect(apply).toBeTruthy();

    const cells: HTMLTableCellElement[] = Array.from(fixture.nativeElement.querySelectorAll('td.available:not(.off)'));
    cells.find((cell) => cell.textContent.trim() === '10').click();
    apply.click();
    fixture.detectChanges();

    const selected = fixture.componentInstance.selected;
    expect(selected.startDate.date()).toBe(10);
    expect(selected.endDate.date()).toBe(10);
  });

  it('has no Apply button with autoApply', () => {
    openCustomRange(true);

    expect(findButton('.buttons button', 'Apply')).toBeUndefined();
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [(ngModel)]="selected" />
    <button class="ngx-daterangepicker-action" type="button" (click)="open()">
      <svg width="20" height="20"><rect class="icon-part" width="20" height="20" /></svg>
    </button>`
})
class ActionIconHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  selected: TimePeriod;

  open(): void {
    this.picker.open();
  }
}

describe('DaterangepickerDirective open from an action element (issue #537)', () => {
  let fixture: ComponentFixture<ActionIconHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActionIconHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  it('stays open when the click lands on a child of the action element', () => {
    fixture = TestBed.createComponent(ActionIconHostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.icon-part').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.isShown).toBeTrue();
  });

  it('still closes on a click outside', () => {
    fixture = TestBed.createComponent(ActionIconHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.open();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.isShown).toBeFalse();
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [locale]="locale" [(ngModel)]="selected" />`
})
class LocaleSwitchHostComponent {
  locale: LocaleConfig = { format: 'D MMMM YYYY', separator: ' - ' };
  selected = { startDate: dayjs('2026-10-05'), endDate: dayjs('2026-10-20') };
}

describe('DaterangepickerDirective locale change at runtime (issue #462)', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LocaleSwitchHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  it('re-formats the input text in the new language', async () => {
    const fixture = TestBed.createComponent(LocaleSwitchHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('5 October 2026 - 20 October 2026');

    fixture.componentInstance.locale = { locale: fr, format: 'D MMMM YYYY', separator: ' - ' };
    fixture.detectChanges();

    expect(input.value).toBe('5 octobre 2026 - 20 octobre 2026');
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [timePicker]="timePicker()" [(ngModel)]="selected" />`
})
class TimePickerToggleHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  // A signal, because the host is OnPush by default and a plain field change would not refresh it.
  timePicker = signal(false);
  selected: TimePeriod;
}

describe('DaterangepickerDirective time picker enabled after init (issue #518)', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimePickerToggleHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  it('renders the time picker when timePicker becomes true, then false, then true again', () => {
    const fixture = TestBed.createComponent(TimePickerToggleHostComponent);
    fixture.detectChanges();

    for (const value of [true, false, true]) {
      fixture.componentInstance.timePicker.set(value);
      fixture.detectChanges();
      fixture.componentInstance.picker.open();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('select.hourselect').length).toBe(value ? 2 : 0);
    }
    expect(fixture.componentInstance.picker.picker.timepickerVariables.left.selectedHour).toBeDefined();
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [ranges]="ranges" [(ngModel)]="selected" />`
})
class FocusHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  ranges = { Today: [dayjs().startOf('day'), dayjs().endOf('day')] };
  selected: TimePeriod;
}

describe('DaterangepickerDirective keyboard focus when closed (issue #540)', () => {
  let fixture: ComponentFixture<FocusHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FocusHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => fixture.nativeElement.remove());

  function rangeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.ranges button');
  }

  it('keeps the buttons of the closed picker out of the tab order', () => {
    const picker: HTMLElement = fixture.nativeElement.querySelector('.md-drppicker');

    rangeButton().focus();

    expect(getComputedStyle(picker).visibility).toBe('hidden');
    expect(document.activeElement).not.toBe(rangeButton());
  });

  it('lets the buttons take the focus once the picker is open', () => {
    fixture.nativeElement.querySelector('input').click();
    fixture.detectChanges();

    rangeButton().focus();

    expect(getComputedStyle(fixture.nativeElement.querySelector('.md-drppicker')).visibility).toBe('visible');
    expect(document.activeElement).toBe(rangeButton());
  });
});

@Component({
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `<input ngxDaterangepickerMd [(ngModel)]="selected" />
    <button type="button" class="ngx-daterangepicker-action" (click)="open()"><svg class="icon-part"></svg></button>`
})
class ShadowDomHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  selected: TimePeriod;

  open(): void {
    this.picker.open();
  }
}

describe('DaterangepickerDirective inside a shadow root (issue #372)', () => {
  let fixture: ComponentFixture<ShadowDomHostComponent>;
  let shadowRoot: ShadowRoot;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShadowDomHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowDomHostComponent);
    fixture.detectChanges();
    shadowRoot = fixture.nativeElement.shadowRoot;
  });

  it('opens when the input is clicked', () => {
    // click() is composed, like a real click, so document listeners see it.
    shadowRoot.querySelector('input').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.isShown).toBeTrue();
  });

  it('stays open when the click lands on a child of an action element', () => {
    shadowRoot.querySelector('.icon-part').dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.isShown).toBeTrue();
  });

  it('closes on a click outside the shadow host', () => {
    shadowRoot.querySelector('input').click();
    fixture.detectChanges();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.isShown).toBeFalse();
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [ranges]="ranges()"
    [showRangeLabelOnInput]="showLabel"
    [locale]="{ format: 'YYYY-MM-DD', separator: ' - ' }"
    [(ngModel)]="selected"
  />`
})
class RangesSwitchHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  ranges = signal<Record<string, [dayjs.Dayjs, dayjs.Dayjs]>>({
    'First week': [dayjs('2026-10-05'), dayjs('2026-10-11')],
    'Second week': [dayjs('2026-10-12'), dayjs('2026-10-18')]
  });

  showLabel = true;
  selected: TimePeriod;
}

describe('DaterangepickerDirective ranges change at runtime (issue #388)', () => {
  let fixture: ComponentFixture<RangesSwitchHostComponent>;
  let input: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RangesSwitchHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  function chooseFirstWeek(showLabel: boolean): void {
    fixture = TestBed.createComponent(RangesSwitchHostComponent);
    fixture.componentInstance.showLabel = showLabel;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
    input.click();
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = Array.from(document.querySelectorAll('.ranges button'));
    buttons.find((button) => button.textContent.trim() === 'First week').click();
    fixture.detectChanges();
  }

  it('shows the new name of the chosen range', () => {
    chooseFirstWeek(true);
    expect(input.value).toBe('First week');

    fixture.componentInstance.ranges.set({
      'Première semaine': [dayjs('2026-10-05'), dayjs('2026-10-11')],
      'Deuxième semaine': [dayjs('2026-10-12'), dayjs('2026-10-18')]
    });
    fixture.detectChanges();

    expect(input.value).toBe('Première semaine');
  });

  it('shows the dates when the chosen range is gone', () => {
    chooseFirstWeek(true);

    fixture.componentInstance.ranges.set({ 'Second week': [dayjs('2026-10-12'), dayjs('2026-10-18')] });
    fixture.detectChanges();

    expect(input.value).toBe('2026-10-05 - 2026-10-11');
  });

  it('keeps the dates without showRangeLabelOnInput', () => {
    chooseFirstWeek(false);
    expect(input.value).toBe('2026-10-05 - 2026-10-11');

    fixture.componentInstance.ranges.set({ 'Première semaine': [dayjs('2026-10-05'), dayjs('2026-10-11')] });
    fixture.detectChanges();

    expect(input.value).toBe('2026-10-05 - 2026-10-11');
  });
});

@Component({
  standalone: false,
  template: `<input id="model" ngxDaterangepickerMd [locale]="locale" [(ngModel)]="selected" />
    <input id="control" ngxDaterangepickerMd [locale]="locale" [formControl]="control" />`
})
class EmptyObjectHostComponent {
  locale: LocaleConfig = { format: 'YYYY-MM-DD', separator: ' - ' };
  selected = { startDate: null, endDate: null };
  control = new FormControl<TimePeriod>(null);
}

describe('DaterangepickerDirective value without dates (issue #311)', () => {
  let fixture: ComponentFixture<EmptyObjectHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyObjectHostComponent],
      imports: [FormsModule, ReactiveFormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(EmptyObjectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('leaves the input empty for an ngModel with null dates', () => {
    expect(fixture.nativeElement.querySelector('#model').value).toBe('');
  });

  it('empties the input when a form control gets null dates', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#control');
    fixture.componentInstance.control.setValue({ startDate: dayjs('2026-10-05'), endDate: dayjs('2026-10-20') });
    expect(input.value).toBe('2026-10-05 - 2026-10-20');

    fixture.componentInstance.control.setValue({ startDate: null, endDate: null });

    expect(input.value).toBe('');
  });
});

@Component({
  standalone: false,
  template: `<input id="first" ngxDaterangepickerMd [(ngModel)]="selected" (ngModelChange)="changes = changes + 1" />
    <input id="second" ngxDaterangepickerMd [(ngModel)]="selected" />`
})
class SharedModelHostComponent {
  selected: TimePeriod = null;
  changes = 0;
}

describe('DaterangepickerDirective two inputs on one empty model (issue #311)', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SharedModelHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  it('settles instead of passing a new empty value back and forth', async () => {
    const fixture = TestBed.createComponent(SharedModelHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const changesAfterInit = fixture.componentInstance.changes;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.changes).toBe(changesAfterInit);
    expect(fixture.nativeElement.querySelector('#first').value).toBe('');
    expect(fixture.nativeElement.querySelector('#second').value).toBe('');
  });
});

describe('DaterangepickerDirective label after an empty value (issue #311)', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyObjectHostComponent],
      imports: [FormsModule, ReactiveFormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  it('keeps the input empty when the locale changes after null dates', async () => {
    const fixture = TestBed.createComponent(EmptyObjectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#control');
    fixture.componentInstance.control.setValue({ startDate: dayjs('2026-10-05'), endDate: dayjs('2026-10-20') });
    fixture.componentInstance.control.setValue({ startDate: null, endDate: null });

    fixture.componentInstance.locale = { format: 'DD/MM/YYYY', separator: ' - ' };
    fixture.detectChanges();

    expect(input.value).toBe('');
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [singleDatePicker]="true" [timePicker]="timePicker" [(ngModel)]="selected" />`
})
class SingleStartOnlyHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  timePicker = false;
  selected: TimePeriod;
}

describe('DaterangepickerDirective single date with only a start date (issue #537)', () => {
  let fixture: ComponentFixture<SingleStartOnlyHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingleStartOnlyHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  async function create(timePicker: boolean, value: Partial<TimePeriod>): Promise<void> {
    fixture = TestBed.createComponent(SingleStartOnlyHostComponent);
    fixture.componentInstance.timePicker = timePicker;
    fixture.componentInstance.selected = value as TimePeriod;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('ends on the start day instead of today, so no range is drawn', async () => {
    await create(false, { startDate: dayjs('2026-03-10') });
    const directive = fixture.componentInstance.picker;
    directive.open();
    fixture.detectChanges();

    expect(directive.picker.endDate.format('YYYY-MM-DD HH:mm:ss')).toBe('2026-03-10 23:59:59');
    // The selected cell itself can carry in-range, depending on the time of day; no other cell may.
    expect(document.querySelectorAll('.md-drppicker.shown td.in-range:not(.active)').length).toBe(0);
    directive.hide();
  });

  it('ignores a different end date', async () => {
    await create(false, { startDate: dayjs('2026-03-10'), endDate: dayjs('2026-03-20') });

    expect(fixture.componentInstance.picker.picker.endDate.format('YYYY-MM-DD')).toBe('2026-03-10');
  });

  it('keeps the start time with the time picker', async () => {
    await create(true, { startDate: dayjs('2026-03-10T14:30:00') });

    expect(fixture.componentInstance.picker.picker.endDate.format('YYYY-MM-DD HH:mm')).toBe('2026-03-10 14:30');
  });
});

interface MonthsOptions {
  singleDatePicker: boolean;
  linkedCalendars: boolean;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  initialDates: [dayjs.Dayjs, dayjs.Dayjs];
  ranges: Record<string, [dayjs.Dayjs, dayjs.Dayjs]>;
  autoApply: boolean;
  closeOnAutoApply: boolean;
  alwaysShowCalendars: boolean;
  keepCalendarOpeningWithRange: boolean;
  timePicker: boolean;
}

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [singleDatePicker]="o.singleDatePicker"
    [linkedCalendars]="o.linkedCalendars"
    [minDate]="o.minDate"
    [maxDate]="o.maxDate"
    [initialDates]="o.initialDates"
    [ranges]="o.ranges"
    [autoApply]="o.autoApply"
    [closeOnAutoApply]="o.closeOnAutoApply"
    [alwaysShowCalendars]="o.alwaysShowCalendars"
    [keepCalendarOpeningWithRange]="o.keepCalendarOpeningWithRange"
    [timePicker]="o.timePicker"
    [(ngModel)]="selected"
  />`
})
class MonthsHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  o: MonthsOptions;
  selected: TimePeriod = null;
}

describe('DaterangepickerDirective months in view (issues #400, #398, #450, #416, #277, #111, #142)', () => {
  let fixture: ComponentFixture<MonthsHostComponent>;
  const today = dayjs();
  const month = (offset: number): string => today.add(offset, 'month').format('YYYY-MM');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MonthsHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.componentInstance.picker.hide());

  async function open(options: Partial<MonthsOptions> = {}, value: Partial<TimePeriod> = null): Promise<void> {
    fixture = TestBed.createComponent(MonthsHostComponent);
    fixture.componentInstance.o = {
      singleDatePicker: false,
      linkedCalendars: false,
      minDate: null,
      maxDate: null,
      initialDates: null,
      ranges: {},
      autoApply: false,
      closeOnAutoApply: true,
      alwaysShowCalendars: false,
      keepCalendarOpeningWithRange: false,
      timePicker: false,
      ...options
    };
    fixture.componentInstance.selected = value as TimePeriod;
    fixture.detectChanges();
    await fixture.whenStable();
    // A real click: the host is OnPush (Angular 22 default), and the click marks it for check.
    fixture.nativeElement.querySelector('input').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function view(): string[] {
    const picker = fixture.componentInstance.picker.picker;
    return [picker.leftCalendar.month.format('YYYY-MM'), picker.rightCalendar.month.format('YYYY-MM')];
  }

  function cells(side: 'left' | 'right', selector: string): string[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(`.md-drppicker.shown .calendar.${side} td${selector}:not(.off)`)
    ).map((cell) => cell.textContent.trim());
  }

  function clickCell(side: 'left' | 'right', day: number): void {
    const cell = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(`.md-drppicker.shown .calendar.${side} td.available:not(.off)`)
    ).find((td) => td.textContent.trim() === String(day));
    cell.click();
    fixture.detectChanges();
  }

  function clickRange(label: string): void {
    const button = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.md-drppicker.shown .ranges button')
    ).find((b) => b.textContent.trim() === label);
    button.click();
    fixture.detectChanges();
  }

  it('opens on the month of a single date from the model (#400)', async () => {
    await open(
      { singleDatePicker: true },
      { startDate: today.subtract(2, 'month').date(14), endDate: today.subtract(2, 'month').date(14) }
    );

    expect(view()[0]).toBe(month(-2));
    // In single mode the only calendar has the "right" class.
    expect(cells('right', '.active')).toEqual(['14']);
  });

  it('opens on the start month of a range from the model', async () => {
    await open({}, { startDate: today.add(3, 'month').date(10), endDate: today.add(3, 'month').date(12) });

    expect(view()[0]).toBe(month(3));
  });

  it('moves to the month of a typed range (#450)', async () => {
    await open();
    const directive = fixture.componentInstance.picker;
    const format = directive.picker.locale.format;
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = `${today.add(5, 'month').date(3).format(format)} - ${today.add(5, 'month').date(8).format(format)}`;
    input.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(view()[0]).toBe(month(5));
  });

  it('shows the maxDate month on the right with linked calendars (#398)', async () => {
    await open({ linkedCalendars: true, maxDate: today.endOf('month') });

    expect(view()).toEqual([month(-1), month(0)]);
  });

  it('shows the maxDate month on the right with unlinked calendars (#111)', async () => {
    await open({ maxDate: today.endOf('month') });

    expect(view()).toEqual([month(-1), month(0)]);
  });

  it('opens on the minDate month when minDate is in a later month (#277)', async () => {
    await open({ minDate: today.add(3, 'month').startOf('month') });

    expect(view()[0]).toBe(month(3));
  });

  it('starts the time picker at minDate when no date is chosen (#142)', async () => {
    await open({ singleDatePicker: true, timePicker: true, minDate: today.hour(22).minute(12) });

    const hour: HTMLSelectElement = (fixture.nativeElement as HTMLElement).querySelector('.md-drppicker.shown .calendar.right .hourselect');
    const minute: HTMLSelectElement = (fixture.nativeElement as HTMLElement).querySelector(
      '.md-drppicker.shown .calendar.right .minuteselect'
    );
    const ampm: HTMLSelectElement = (fixture.nativeElement as HTMLElement).querySelector('.md-drppicker.shown .calendar.right .ampmselect');
    expect(hour.selectedOptions[0]?.textContent.trim()).toBe('10');
    expect(minute.selectedOptions[0]?.textContent.trim()).toBe('12');
    expect(ampm.value).toBe('PM');
  });

  it('opens on initialDates when no date is chosen', async () => {
    await open({ initialDates: [today.subtract(4, 'month'), today.subtract(3, 'month')] });

    expect(view()).toEqual([month(-4), month(-3)]);
  });

  it('keeps the months in view when the end date is clicked after moving away', async () => {
    await open();
    clickCell('left', 10);
    const component = fixture.componentInstance.picker.picker;
    component.clickNext(component.sideEnum.left);
    component.clickNext(component.sideEnum.left);
    component.clickNext(component.sideEnum.left);
    fixture.detectChanges();
    clickCell('left', 12);

    expect(view()[0]).toBe(month(3));
  });

  it('shows the clicked range when autoApply keeps the picker open (#416)', async () => {
    const start = today.add(2, 'month').date(5);
    await open({
      ranges: { Later: [start, start.date(9)] },
      autoApply: true,
      closeOnAutoApply: false,
      alwaysShowCalendars: true
    });
    clickRange('Later');

    expect(view()[0]).toBe(month(2));
    expect(cells('left', '.start-date')).toEqual(['5']);
    expect(cells('left', '.end-date')).toEqual(['9']);
  });

  it('shows two different months after a range inside one month (#416)', async () => {
    const start = today.add(2, 'month').date(5);
    await open({
      ranges: { Later: [start, start.date(9)] },
      alwaysShowCalendars: true,
      keepCalendarOpeningWithRange: true
    });
    clickRange('Later');

    expect(view()).toEqual([month(2), month(3)]);
  });

  it('keeps the maxDate month on the right after a range click (#411)', async () => {
    await open({
      ranges: { 'This Month': [today.startOf('month'), today] },
      maxDate: today,
      alwaysShowCalendars: true,
      keepCalendarOpeningWithRange: true
    });
    clickRange('This Month');

    expect(view()).toEqual([month(-1), month(0)]);
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [singleDatePicker]="single"
    [locale]="locale"
    [(ngModel)]="selected"
    (datesUpdated)="updates.push($event)"
  />`
})
class KeyboardHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  single = false;
  locale: LocaleConfig = {};
  // A plain date is allowed in single mode (issue #141).
  selected: unknown = null;
  updates: TimePeriod[] = [];
}

describe('DaterangepickerDirective keyboard and closing (issues #399, #172, #450, #141)', () => {
  let fixture: ComponentFixture<KeyboardHostComponent>;
  let input: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KeyboardHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.componentInstance.picker.hide());

  async function create(setup: (host: KeyboardHostComponent) => void = () => undefined): Promise<void> {
    fixture = TestBed.createComponent(KeyboardHostComponent);
    setup(fixture.componentInstance);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  }

  // A real click: the host is OnPush (Angular 22 default), and the click marks it for check.
  async function open(): Promise<void> {
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function type(text: string, key = 'a'): void {
    input.value = text;
    input.dispatchEvent(new KeyboardEvent('keyup', { key }));
    fixture.detectChanges();
  }

  function clickDay(day: number): void {
    const cell = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.md-drppicker.shown .calendar.left td.available:not(.off)')
    ).find((td) => td.textContent.trim() === String(day));
    cell.click();
    fixture.detectChanges();
  }

  function clickOutside(): void {
    document.body.click();
    fixture.detectChanges();
  }

  function pickerDates(): string {
    const picker = fixture.componentInstance.picker.picker;
    return `${picker.startDate.format('YYYY-MM-DD')} ${picker.endDate.format('YYYY-MM-DD')}`;
  }

  const applied = { startDate: dayjs('2026-03-02'), endDate: dayjs('2026-03-04') };

  it('drops a selection that was not applied when clicking outside (#399)', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(20);
    clickDay(23);
    clickOutside();
    await open();

    expect(pickerDates()).toBe('2026-03-02 2026-03-04');
    expect(
      Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.md-drppicker.shown .calendar.left td.active:not(.off)')).map(
        (td) => td.textContent.trim()
      )
    ).toEqual(['2', '4']);
  });

  it('drops a selection that was not applied when pressing Escape (#399)', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(20);
    clickDay(23);
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    fixture.detectChanges();
    await open();

    expect(pickerDates()).toBe('2026-03-02 2026-03-04');
  });

  it('keeps an applied selection when opening again', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(20);
    clickDay(23);
    fixture.componentInstance.picker.picker.clickApply(new MouseEvent('click'));
    fixture.detectChanges();
    await open();

    expect(pickerDates()).toBe('2026-03-20 2026-03-23');
  });

  it('applies a typed range with Enter (#172)', async () => {
    await create();
    await open();
    type('03/05/2026 - 03/08/2026');
    type('03/05/2026 - 03/08/2026', 'Enter');
    await fixture.whenStable();

    const selected = fixture.componentInstance.selected as TimePeriod;
    expect(selected.startDate.format('YYYY-MM-DD')).toBe('2026-03-05');
    expect(selected.endDate.format('YYYY-MM-DD')).toBe('2026-03-08');
    expect(fixture.componentInstance.updates.length).toBeGreaterThan(0);
  });

  it('emits nothing for an invalid text with Enter (#172)', async () => {
    await create();
    await open();
    const updates = fixture.componentInstance.updates.length;
    type('not a date', 'Enter');

    expect(fixture.componentInstance.updates.length).toBe(updates);
    expect((fixture.componentInstance.selected as TimePeriod)?.startDate ?? null).toBeNull();
  });

  it('writes the applied value back when closing after typing (#172)', async () => {
    await create((host) => (host.selected = applied));
    const text = input.value;
    await open();
    type('03/05/2026 - 03/08/2026');
    clickOutside();

    expect(input.value).toBe(text);
    expect((fixture.componentInstance.selected as TimePeriod).startDate.format('YYYY-MM-DD')).toBe('2026-03-02');
  });

  it('empties the input when closing after typing with an empty model (#172)', async () => {
    await create();
    await open();
    type('03/05/2026 - 03/08/2026');
    clickOutside();

    expect(input.value).toBe('');
    expect((fixture.componentInstance.selected as TimePeriod)?.startDate ?? null).toBeNull();
  });

  it('writes the applied value back on Cancel after typing (#172)', async () => {
    await create((host) => (host.selected = applied));
    const text = input.value;
    await open();
    type('03/05/2026 - 03/08/2026');
    fixture.componentInstance.picker.picker.clickCancel(new MouseEvent('click'));
    fixture.detectChanges();

    expect(input.value).toBe(text);
  });

  it('reads month names in the instance locale (#450)', async () => {
    await create((host) => (host.locale = { locale: es, format: 'D MMMM YYYY' }));
    await open();
    type('5 enero 2026 - 10 enero 2026');

    expect(pickerDates()).toBe('2026-01-05 2026-01-10');
  });

  it('reads short month names in the instance locale (#450)', async () => {
    await create((host) => (host.locale = { locale: pt, format: 'DD MMM YYYY' }));
    await open();
    type('05 jan 2026 - 10 fev 2026');

    expect(pickerDates()).toBe('2026-01-05 2026-02-10');
  });

  it('still reads numeric dates (#450)', async () => {
    await create((host) => (host.locale = { locale: es, format: 'DD/MM/YYYY' }));
    await open();
    type('05/01/2026 - 10/01/2026');

    expect(pickerDates()).toBe('2026-01-05 2026-01-10');
  });

  for (const [name, value] of [
    ['a dayjs date', dayjs('2026-03-10')],
    ['a native Date', new Date(2026, 2, 10)],
    ['an ISO string', '2026-03-10']
  ] as [string, unknown][]) {
    it(`shows ${name} given as the value in single mode (#141)`, async () => {
      await create((host) => {
        host.single = true;
        host.selected = value;
      });

      expect(input.value).toBe('03/10/2026');
      expect(pickerDates()).toBe('2026-03-10 2026-03-10');
    });
  }

  it('still reads { startDate, endDate } in single mode (#141)', async () => {
    await create((host) => {
      host.single = true;
      host.selected = { startDate: dayjs('2026-03-10'), endDate: dayjs('2026-03-10') };
    });

    expect(input.value).toBe('03/10/2026');
  });

  it('ignores a plain date in range mode, as before (#141)', async () => {
    await create((host) => (host.selected = dayjs('2026-03-10')));

    expect(input.value).toBe('');
  });
});

@Component({
  standalone: false,
  template: `<div class="frame" [style.overflow-x]="scroll ? 'auto' : 'visible'" style="width: 300px">
    <div [style.width.px]="scroll ? 2000 : null" [style.padding-left.px]="inputLeft" [style.padding-top.px]="inputTop">
      <input
        ngxDaterangepickerMd
        [(ngModel)]="selected"
        [opens]="opens"
        [drops]="drops"
        [ranges]="ranges"
        [appendToBody]="appendToBody"
        [showCustomRangeLabel]="true"
        style="width: 200px"
      />
    </div>
  </div>`
})
class PositionHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  selected: TimePeriod;
  opens = 'right';
  drops = 'down';
  ranges = {};
  appendToBody = false;
  scroll = false;
  inputLeft = 0;
  inputTop = 0;
}

describe('DaterangepickerDirective position (issues #466, #385, #542, #565)', () => {
  let fixture: ComponentFixture<PositionHostComponent>;
  let input: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PositionHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  // These tests measure the final position. The opening animation would make them depend on the browser
  // drawing frames, which a CI browser may not do for content out of view.
  let noAnimation: HTMLStyleElement;

  beforeAll(() => {
    noAnimation = document.createElement('style');
    noAnimation.textContent = '.md-drppicker { transition: none !important; }';
    document.head.appendChild(noAnimation);
  });

  afterAll(() => noAnimation.remove());

  afterEach(() => fixture.destroy());

  // Waits for the position set after opening and for the ResizeObserver.
  const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 250));

  async function open(setup: (host: PositionHostComponent) => void = () => undefined): Promise<void> {
    fixture = TestBed.createComponent(PositionHostComponent);
    setup(fixture.componentInstance);
    // Attached to the page, so the measures are real.
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input');
    const frame: HTMLElement = fixture.nativeElement.querySelector('.frame');
    frame.scrollLeft = 500;
    input.click();
    fixture.detectChanges();
    await settle();
  }

  const pickerBox = (): DOMRect => fixture.componentInstance.picker.picker.pickerContainer.nativeElement.getBoundingClientRect();

  it('opens under the input inside a scrolled parent (#466)', async () => {
    await open((host) => {
      host.scroll = true;
      host.inputLeft = 600;
    });

    expect(Math.abs(pickerBox().left - input.getBoundingClientRect().left)).toBeLessThan(2);
  });

  it('stays aligned with opens="left" after Custom range makes it wider (#385)', async () => {
    await open((host) => {
      host.opens = 'left';
      host.inputLeft = 500;
      host.ranges = { Today: [dayjs(), dayjs()] };
    });
    const custom = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.ranges button')).find(
      (b) => b.textContent.trim() === 'Custom range'
    );
    custom.click();
    fixture.detectChanges();
    await settle();

    expect(pickerBox().width).toBeGreaterThan(400);
    expect(Math.abs(pickerBox().right - input.getBoundingClientRect().right)).toBeLessThan(2);
  });

  it('stays inside the window near the right edge (#542)', async () => {
    await open((host) => (host.inputLeft = document.documentElement.clientWidth - 100));

    expect(pickerBox().right).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
    expect(pickerBox().left).toBeGreaterThanOrEqual(0);
  });

  it('keeps the same double width wherever it opens (#542)', async () => {
    // No ranges: the two months are shown at once.
    await open();
    const width = pickerBox().width;
    fixture.destroy();

    await open((host) => (host.inputLeft = document.documentElement.clientWidth - 250));

    expect(pickerBox().width).toBe(width);
  });

  it('moves the calendar to <body> and under the input with appendToBody (#565)', async () => {
    await open((host) => (host.appendToBody = true));
    const host = fixture.componentInstance.picker.picker.pickerContainer.nativeElement.parentElement;

    expect(host.parentElement).toBe(document.body);
    expect(Math.abs(pickerBox().left - input.getBoundingClientRect().left)).toBeLessThan(2);
    expect(Math.abs(pickerBox().top - input.getBoundingClientRect().bottom)).toBeLessThan(2);

    fixture.destroy();

    expect(document.body.contains(host)).toBeFalse();
  });

  for (const appendToBody of [false, true]) {
    it(`opens above the input with drops="up" (appendToBody ${appendToBody})`, async () => {
      await open((host) => {
        host.drops = 'up';
        host.appendToBody = appendToBody;
      });
      const gap = input.getBoundingClientRect().top - pickerBox().bottom;

      // Without appendToBody the -10px margin from the styles leaves a small gap, as before.
      expect(gap).toBeGreaterThanOrEqual(-1);
      expect(gap).toBeLessThan(12);
    });
  }

  for (const appendToBody of [false, true]) {
    it(`opens above the input with drops="auto" near the bottom of the window (#136, appendToBody ${appendToBody})`, async () => {
      await open((host) => {
        host.drops = 'auto';
        host.appendToBody = appendToBody;
        host.inputTop = document.documentElement.clientHeight - 60;
      });
      const gap = input.getBoundingClientRect().top - pickerBox().bottom;
      const classes = fixture.componentInstance.picker.picker.pickerContainer.nativeElement.classList;

      expect(gap).toBeGreaterThanOrEqual(-1);
      expect(gap).toBeLessThan(12);
      expect(classes.contains('drops-up-right')).toBeTrue();
      expect(classes.contains('drops-down-right')).toBeFalse();
    });

    it(`opens under the input with drops="auto" when there is room below (#136, appendToBody ${appendToBody})`, async () => {
      await open((host) => {
        host.drops = 'auto';
        host.appendToBody = appendToBody;
      });
      const gap = pickerBox().top - input.getBoundingClientRect().bottom;
      const classes = fixture.componentInstance.picker.picker.pickerContainer.nativeElement.classList;

      // Without appendToBody the -10px margin from the styles makes it overlap a little, as with drops="down".
      expect(gap).toBeGreaterThanOrEqual(-11);
      expect(gap).toBeLessThan(2);
      expect(classes.contains('drops-down-right')).toBeTrue();
    });
  }

  it('is not clipped by a parent with overflow hidden with appendToBody (#565)', async () => {
    await open((host) => (host.appendToBody = true));
    const frame: HTMLElement = fixture.nativeElement.querySelector('.frame');
    // Like the mat-form-field wrapper: positioned, overflow hidden.
    frame.style.position = 'relative';
    frame.style.overflow = 'hidden';
    frame.style.height = '40px';
    await settle();

    const box = pickerBox();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.bottom - 20);

    expect(fixture.componentInstance.picker.picker.pickerContainer.nativeElement.contains(hit)).toBeTrue();
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [ranges]="ranges"
    [showCancel]="true"
    [showCustomRangeLabel]="true"
    [disabled]="off()"
    (cancelClicked)="events.push('cancel')"
    (customRangeClicked)="events.push('custom')"
    (rangeClicked)="events.push('range')"
    (change)="events.push('change')"
  />`
})
class EventsHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  ranges = { Today: [dayjs(), dayjs()] };
  off = signal(false);
  events: string[] = [];
}

describe('DaterangepickerDirective outputs and disabled (issues #289, #522, #428, #553)', () => {
  let fixture: ComponentFixture<EventsHostComponent>;
  let input: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventsHostComponent],
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.componentInstance.picker.hide());

  async function create(setup: (host: EventsHostComponent) => void = () => undefined): Promise<void> {
    fixture = TestBed.createComponent(EventsHostComponent);
    setup(fixture.componentInstance);
    fixture.detectChanges();
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input');
  }

  async function open(): Promise<void> {
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function clickButton(selector: string, label: string): void {
    const button = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(selector)).find(
      (b) => b.textContent.trim() === label
    );
    button.click();
    fixture.detectChanges();
  }

  it('emits cancelClicked on the input (#289)', async () => {
    await create();
    await open();
    clickButton('.md-drppicker.shown .ranges button', 'Custom range');
    clickButton('.md-drppicker.shown .buttons button', 'Cancel');

    expect(fixture.componentInstance.events).toContain('cancel');
  });

  it('emits customRangeClicked only for "Custom range" (#522)', async () => {
    await create();
    await open();
    clickButton('.md-drppicker.shown .ranges button', 'Today');

    expect(fixture.componentInstance.events).not.toContain('custom');

    await open();
    clickButton('.md-drppicker.shown .ranges button', 'Custom range');

    expect(fixture.componentInstance.events).toContain('custom');
    expect(fixture.componentInstance.events.filter((e) => e === 'range').length).toBe(1);
  });

  it('honors [disabled] without a form (#428)', async () => {
    await create((host) => host.off.set(true));

    expect(input.disabled).toBeTrue();
    fixture.componentInstance.picker.open();
    expect(fixture.componentInstance.picker.picker.isShown).toBeFalse();

    fixture.componentInstance.off.set(false);
    fixture.detectChanges();

    expect(input.disabled).toBeFalse();
    await open();
    expect(fixture.componentInstance.picker.picker.isShown).toBeTrue();
  });

  it('closes the calendar when it gets disabled (#428)', async () => {
    await create();
    await open();
    fixture.componentInstance.off.set(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.isShown).toBeFalse();
  });

  it('reads text set without a key, but applies it only with Enter (#553)', async () => {
    await create();
    input.value = '03/10/2026 - 03/12/2026';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const picker = fixture.componentInstance.picker.picker;

    expect(`${picker.startDate.format('YYYY-MM-DD')} ${picker.endDate.format('YYYY-MM-DD')}`).toBe('2026-03-10 2026-03-12');
    expect(fixture.componentInstance.events).not.toContain('change');

    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.events).toContain('change');
  });
});

@Component({
  template: `<input
    ngxDaterangepickerMd
    [ranges]="ranges"
    startKey="from"
    endKey="to"
    (dateChange)="dateChanges.push($event)"
    (change)="changes.push($event)"
  />`,
  imports: [NgxDaterangepickerMd]
})
class DateChangeHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  ranges = { Today: [dayjs(), dayjs()] };
  dateChanges: unknown[] = [];
  changes: unknown[] = [];
}

describe('DaterangepickerDirective dateChange output (issue #344)', () => {
  let fixture: ComponentFixture<DateChangeHostComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [DateChangeHostComponent, NgxDaterangepickerMd.forRoot()] });
    fixture = TestBed.createComponent(DateChangeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input');
  });

  afterEach(() => fixture.componentInstance.picker.hide());

  it('gets only dates, never the native change event of the input', () => {
    input.value = '03/10/2026 - 03/12/2026';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // The deprecated (change) output is mixed with the DOM event, dateChange is not.
    expect(fixture.componentInstance.changes[0] instanceof Event).toBeTrue();
    expect(fixture.componentInstance.dateChanges).toEqual([]);

    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();

    const value = fixture.componentInstance.dateChanges[0] as Record<string, dayjs.Dayjs>;
    expect(fixture.componentInstance.dateChanges.length).toBe(1);
    expect(`${value.from.format('YYYY-MM-DD')} ${value.to.format('YYYY-MM-DD')}`).toBe('2026-03-10 2026-03-12');
  });

  it('emits the dates of a clicked range with startKey and endKey', async () => {
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const today = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.md-drppicker.shown .ranges button')
    ).find((b) => b.textContent.trim() === 'Today');
    today.click();
    fixture.detectChanges();

    const value = fixture.componentInstance.dateChanges[0] as Record<string, dayjs.Dayjs>;
    expect(fixture.componentInstance.dateChanges.length).toBe(1);
    expect(value.from.format('YYYY-MM-DD')).toBe(dayjs().format('YYYY-MM-DD'));
    expect(value.to.format('YYYY-MM-DD')).toBe(dayjs().format('YYYY-MM-DD'));
  });
});

@Component({
  template: `
    <input class="plain" ngxDaterangepickerMd [(ngModel)]="selected" />
    <input class="own" ngxDaterangepickerMd [locale]="{ applyLabel: 'Mine' }" [(ngModel)]="selected" />
    <ngx-daterangepicker-material></ngx-daterangepicker-material>
  `,
  imports: [NgxDaterangepickerMd, FormsModule]
})
class GlobalConfigHostComponent {
  selected = signal<unknown>({ startDate: dayjs('2026-10-05'), endDate: dayjs('2026-10-20') });
}

describe('DaterangepickerDirective global config change (issue #519)', () => {
  const source = signal<LocaleConfig>({ applyLabel: 'Go' });

  async function create(config: LocaleConfig | typeof source): Promise<ComponentFixture<GlobalConfigHostComponent>> {
    TestBed.configureTestingModule({ imports: [NgxDaterangepickerMd.forRoot(config)] });
    const fixture = TestBed.createComponent(GlobalConfigHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function containers(fixture: ComponentFixture<unknown>): HTMLElement[] {
    return fixture.debugElement.queryAll(By.css('.md-drppicker')).map((el) => el.nativeElement);
  }

  function applyText(container: HTMLElement): string {
    const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('.buttons button'));
    return buttons[buttons.length - 1].textContent.trim();
  }

  it('redraws labels, input text and keeps the instance locale after setConfig()', async () => {
    const fixture = await create({});
    const [plain, own, inline] = containers(fixture);
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input.plain');
    expect(applyText(plain)).toBe('Apply');

    TestBed.inject(LocaleService).setConfig({ applyLabel: 'OK', displayFormat: 'YYYY/MM/DD' });
    await settle(fixture);

    expect(applyText(plain)).toBe('OK');
    expect(applyText(inline)).toBe('OK');
    expect(applyText(own)).toBe('Mine');
    expect(input.value).toBe('2026/10/05 - 2026/10/20');
  });

  it('re-orders the weekday headers after setConfig() with firstDay', async () => {
    const fixture = await create({});
    const inline = containers(fixture)[2];
    const firstHeader = (): string => inline.querySelector('.calendar thead tr:last-child th').textContent.trim();
    expect(firstHeader()).toBe('Su');

    TestBed.inject(LocaleService).setConfig({ firstDay: 1 });
    await settle(fixture);

    expect(firstHeader()).toBe('Mo');
  });

  it('takes the day names from a dayjs locale in the global config', async () => {
    const fixture = await create({});
    const inline = containers(fixture)[2];

    TestBed.inject(LocaleService).setConfig({ locale: fr });
    await settle(fixture);

    const headers = Array.from(inline.querySelectorAll('.calendar thead tr:last-child th')).map((th) => th.textContent.trim());
    expect(headers.slice(0, 2)).toEqual(['lu', 'ma']);
  });

  it('follows a signal given to forRoot()', async () => {
    const fixture = await create(source);
    const inline = containers(fixture)[2];
    expect(applyText(inline)).toBe('Go');

    source.set({ applyLabel: 'Vas-y' });
    await settle(fixture);

    expect(applyText(inline)).toBe('Vas-y');
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [allowEmptyEndDate]="allow"
    [timePicker]="timePicker"
    [locale]="locale"
    [(ngModel)]="selected"
    (dateChange)="changes.push($event)"
    (datesUpdated)="updates.push($event)"
  />`
})
class EmptyEndDateHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  allow = true;
  timePicker = false;
  locale: LocaleConfig = { format: 'YYYY-MM-DD' };
  selected: TimePeriod = null;
  changes: TimePeriod[] = [];
  updates: TimePeriod[] = [];
}

describe('DaterangepickerDirective allowEmptyEndDate (issue #502)', () => {
  let fixture: ComponentFixture<EmptyEndDateHostComponent>;
  let input: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyEndDateHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.componentInstance.picker.hide());

  async function create(setup: (host: EmptyEndDateHostComponent) => void = () => undefined): Promise<void> {
    fixture = TestBed.createComponent(EmptyEndDateHostComponent);
    setup(fixture.componentInstance);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  }

  async function open(): Promise<void> {
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function clickDay(day: number): void {
    const cell = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.md-drppicker.shown .calendar.left td.available:not(.off)')
    ).find((td) => td.textContent.trim() === String(day));
    cell.click();
    fixture.detectChanges();
  }

  async function apply(): Promise<void> {
    fixture.componentInstance.picker.picker.clickApply(new MouseEvent('click'));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function activeDays(): string[] {
    const root = fixture.nativeElement as HTMLElement;
    return Array.from(root.querySelectorAll('.md-drppicker.shown .calendar.left td.active:not(.off)')).map((td) => td.textContent.trim());
  }

  const day = (d: number): string => dayjs().date(d).format('YYYY-MM-DD');
  const applied = { startDate: dayjs('2026-03-02'), endDate: null as dayjs.Dayjs };

  it('applies a start date alone and emits an empty end date', async () => {
    await create();
    await open();
    clickDay(20);
    await apply();

    const host = fixture.componentInstance;
    expect(host.selected.startDate.format('YYYY-MM-DD')).toBe(day(20));
    expect(host.selected.endDate).toBeNull();
    expect(host.changes.pop().endDate).toBeNull();
    expect(host.updates.pop().endDate).toBeNull();
    expect(input.value).toBe(`${day(20)} - `);
  });

  it('shows the emptyEndDateLabel template from the locale', async () => {
    await create((host) => (host.locale = { format: 'YYYY-MM-DD', emptyEndDateLabel: 'From {start}' }));
    await open();
    clickDay(20);
    await apply();

    expect(input.value).toBe(`From ${day(20)}`);
  });

  it('still applies a full range', async () => {
    await create();
    await open();
    clickDay(20);
    clickDay(23);
    await apply();

    expect(fixture.componentInstance.selected.endDate.format('YYYY-MM-DD')).toBe(day(23));
    expect(input.value).toBe(`${day(20)} - ${day(23)}`);
  });

  it('keeps the end date as the start date when the option is off', async () => {
    await create((host) => (host.allow = false));
    await open();
    clickDay(20);
    await apply();

    expect(fixture.componentInstance.selected.endDate.format('YYYY-MM-DD')).toBe(day(20));
  });

  it('keeps the end date empty with the time picker', async () => {
    await create((host) => (host.timePicker = true));
    await open();
    clickDay(20);
    await apply();

    expect(fixture.componentInstance.selected.endDate).toBeNull();
  });

  it('shows a model value without end date', async () => {
    await create((host) => (host.selected = applied));

    expect(input.value).toBe('2026-03-02 - ');
    expect(fixture.componentInstance.picker.picker.endDate).toBeNull();
  });

  it('opens again on the start date alone', async () => {
    await create((host) => (host.selected = applied));
    await open();

    expect(activeDays()).toEqual(['2']);
    expect(fixture.componentInstance.picker.picker.endDate).toBeNull();
  });

  it('starts a new selection on the first click after opening again', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(20);

    const picker = fixture.componentInstance.picker.picker;
    expect(picker.startDate.format('YYYY-MM-DD')).toBe('2026-03-20');
    expect(picker.endDate).toBeNull();

    clickDay(23);
    expect(picker.endDate.format('YYYY-MM-DD')).toBe('2026-03-23');
  });

  it('still starts a new selection after a click left without Apply', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(2);
    document.body.click();
    fixture.detectChanges();
    await open();
    clickDay(20);

    expect(fixture.componentInstance.picker.picker.startDate.format('YYYY-MM-DD')).toBe('2026-03-20');
    expect(fixture.componentInstance.picker.picker.endDate).toBeNull();
  });

  it('brings the empty end date back when closing without Apply', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(20);
    clickDay(23);
    document.body.click();
    fixture.detectChanges();

    const picker = fixture.componentInstance.picker.picker;
    expect(picker.startDate.format('YYYY-MM-DD')).toBe('2026-03-02');
    expect(picker.endDate).toBeNull();
    expect(input.value).toBe('2026-03-02 - ');
  });

  it('brings the empty end date back on Cancel', async () => {
    await create((host) => (host.selected = applied));
    await open();
    clickDay(20);
    clickDay(23);
    fixture.componentInstance.picker.picker.clickCancel(new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.picker.picker.endDate).toBeNull();
    expect(input.value).toBe('2026-03-02 - ');
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd #picker="ngxDaterangepickerMd" [(ngModel)]="selected" />
    <button class="ngx-daterangepicker-action open-button" type="button" (click)="picker.open()">Open</button>`
})
class ExportAsHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) directive: DaterangepickerDirective;
  selected: TimePeriod;
}

describe('DaterangepickerDirective exportAs (issue #607)', () => {
  let fixture: ComponentFixture<ExportAsHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExportAsHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.destroy());

  it('opens the calendar from a template reference', () => {
    fixture = TestBed.createComponent(ExportAsHostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.open-button').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.directive.picker.isShown).toBeTrue();
  });
});

@Component({
  standalone: false,
  template: `<input
    ngxDaterangepickerMd
    [(ngModel)]="selected"
    (ngModelChange)="events.push('ngModelChange')"
    (datesUpdated)="events.push('datesUpdated')"
    (dateChange)="events.push('dateChange')"
    (clearClicked)="events.push('clearClicked')"
  />`
})
class SilentWriteHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;
  selected: TimePeriod | null = null;
  events: string[] = [];
}

describe('DaterangepickerDirective writeValue', () => {
  let fixture: ComponentFixture<SilentWriteHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SilentWriteHostComponent],
      imports: [FormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  afterEach(() => fixture.destroy());

  async function create(): Promise<SilentWriteHostComponent> {
    fixture = TestBed.createComponent(SilentWriteHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('sends nothing back when the model starts empty', async () => {
    const host = await create();

    expect(host.events).toEqual([]);
    expect(host.selected).toBeNull();
  });

  it('sends nothing back and keeps the calendar open when the model is emptied', async () => {
    const host = await create();
    host.selected = { startDate: dayjs('2026-03-02'), endDate: dayjs('2026-03-05') };
    fixture.detectChanges();
    await fixture.whenStable();
    host.picker.open();
    fixture.detectChanges();

    host.selected = null;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.events).toEqual([]);
    expect(host.picker.picker.isShown).toBeTrue();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('');
    expect(host.picker.picker.startDate.isSame(dayjs(), 'day')).toBeTrue();
  });
});
