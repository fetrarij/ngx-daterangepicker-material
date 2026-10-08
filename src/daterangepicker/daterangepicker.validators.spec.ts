import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import dayjs from 'dayjs/esm';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { dateRangeRequired } from './daterangepicker.validators';

describe('dateRangeRequired (issue #496)', () => {
  it('is invalid for an empty value', () => {
    expect(new FormControl(null, dateRangeRequired()).valid).toBeFalse();
    expect(new FormControl('', dateRangeRequired()).valid).toBeFalse();
  });

  it('is invalid for a cleared value', () => {
    const control = new FormControl({ startDate: null, endDate: null }, dateRangeRequired());

    expect(control.errors).toEqual({ required: true });
  });

  it('is valid once a date is selected', () => {
    const control = new FormControl({ startDate: dayjs(), endDate: dayjs() }, dateRangeRequired());

    expect(control.valid).toBeTrue();
  });

  it('reads custom startKey and endKey', () => {
    expect(new FormControl({ start: dayjs(), end: dayjs() }, dateRangeRequired('start', 'end')).valid).toBeTrue();
    expect(new FormControl({ start: null, end: null }, dateRangeRequired('start', 'end')).valid).toBeFalse();
  });
});

@Component({
  standalone: false,
  template: `<input ngxDaterangepickerMd [showClearButton]="true" [formControl]="control" />`
})
class TestHostComponent {
  control = new FormControl(null, dateRangeRequired());
}

describe('dateRangeRequired with the directive (issue #496)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: DaterangepickerDirective;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [ReactiveFormsModule, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    directive = fixture.debugElement.query(By.directive(DaterangepickerDirective)).injector.get(DaterangepickerDirective);
    fixture.detectChanges();
  });

  it('becomes invalid again after Clear', () => {
    directive.picker.setStartDate(dayjs('2026-10-01'));
    directive.picker.setEndDate(dayjs('2026-10-05'));
    directive.picker.clickApply();
    fixture.detectChanges();
    expect(host.control.valid).toBeTrue();

    directive.picker.clear();
    fixture.detectChanges();

    expect(host.control.value).toEqual({ startDate: null, endDate: null });
    expect(host.control.valid).toBeFalse();
  });
});
