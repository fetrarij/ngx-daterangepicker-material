import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import dayjs from 'dayjs/esm';
import fr from 'dayjs/esm/locale/fr';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { TimePeriod } from './daterangepicker.component';
import { LocaleConfig } from './daterangepicker.config';

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
