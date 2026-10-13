import { Component, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormField, disabled, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import dayjs from 'dayjs/esm';

import { NgxDaterangepickerMd } from './daterangepicker.module';
import { DaterangepickerComponent, TimePeriod } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';

interface Booking {
  dates: TimePeriod;
}

@Component({
  template: `<input ngxDaterangepickerMd [locale]="{ format: 'YYYY-MM-DD', separator: ' - ' }" [formField]="bookingForm.dates" />
    <ngx-daterangepicker-material [formField]="bookingForm.dates"></ngx-daterangepicker-material>`,
  imports: [NgxDaterangepickerMd, FormField]
})
class SignalFormHostComponent {
  @ViewChild(DaterangepickerDirective, { static: true }) directive: DaterangepickerDirective;
  off = signal(false);
  booking = signal<Booking>({ dates: { startDate: dayjs('2026-03-03'), endDate: dayjs('2026-03-06') } });
  bookingForm = form(this.booking, (path) => disabled(path.dates, () => this.off()));
}

// Signal Forms bind to the picker through its ControlValueAccessor.
describe('Daterangepicker with Signal Forms [formField]', () => {
  let fixture: ComponentFixture<SignalFormHostComponent>;
  let host: SignalFormHostComponent;
  let input: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(SignalFormHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  afterEach(() => host.directive.hide());

  function inline(): DaterangepickerComponent {
    return fixture.debugElement.query(By.css('ngx-daterangepicker-material')).componentInstance;
  }

  function popup(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector('.md-drppicker.shown');
  }

  function click(root: HTMLElement, selector: string, text: string): void {
    const target = Array.from(root.querySelectorAll<HTMLElement>(selector)).find((el) => el.textContent.trim() === text);
    target.click();
    fixture.detectChanges();
  }

  it('shows the form value in the input and the inline calendar', () => {
    expect(input.value).toBe('2026-03-03 - 2026-03-06');
    expect(inline().startDate.format('YYYY-MM-DD')).toBe('2026-03-03');
    expect(inline().endDate.format('YYYY-MM-DD')).toBe('2026-03-06');
  });

  it('follows a new value set on the form', async () => {
    host.booking.set({ dates: { startDate: dayjs('2026-05-11'), endDate: dayjs('2026-05-14') } });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(input.value).toBe('2026-05-11 - 2026-05-14');
    expect(inline().endDate.format('YYYY-MM-DD')).toBe('2026-05-14');
  });

  it('writes the dates chosen in the input picker to the form', async () => {
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    click(popup(), '.calendar.left td.available:not(.off)', '10');
    click(popup(), '.calendar.left td.available:not(.off)', '12');
    click(popup(), '.buttons button', 'Apply');

    const dates = host.bookingForm.dates().value();
    expect(dates.startDate.format('YYYY-MM-DD')).toBe('2026-03-10');
    expect(dates.endDate.format('YYYY-MM-DD')).toBe('2026-03-12');
  });

  it('writes the dates chosen in the inline calendar to the form', () => {
    const root = fixture.debugElement.query(By.css('ngx-daterangepicker-material')).nativeElement as HTMLElement;

    click(root, '.calendar.left td.available:not(.off)', '20');
    click(root, '.calendar.left td.available:not(.off)', '25');
    click(root, '.buttons button', 'Apply');

    const dates = host.booking().dates;
    expect(dates.startDate.format('YYYY-MM-DD')).toBe('2026-03-20');
    expect(dates.endDate.format('YYYY-MM-DD')).toBe('2026-03-25');
  });

  it('disables both pickers with the disabled() rule', async () => {
    host.off.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(input.disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('.md-drppicker.inline').classList).toContain('disabled');
  });
});
