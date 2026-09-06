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
