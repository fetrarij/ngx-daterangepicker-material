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
