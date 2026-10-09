import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import dayjs from 'dayjs/esm';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { TimePeriod } from './daterangepicker.component';

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
