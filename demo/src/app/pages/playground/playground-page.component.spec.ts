import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PlaygroundPageComponent } from './playground-page.component';

// Waits for the calendar to open and for ngModel to write its value.
const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 50));

describe('PlaygroundPageComponent', () => {
  let fixture: ComponentFixture<PlaygroundPageComponent>;
  let root: HTMLElement;

  const input = (): HTMLInputElement => root.querySelector('.preview input');
  const code = (): string => root.querySelector('pre code').textContent;

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await settle();
    fixture.detectChanges();
  }

  async function toggle(name: string): Promise<void> {
    Array.from(root.querySelectorAll('mat-slide-toggle'))
      .find((element) => element.textContent.trim() === name)
      .querySelector('button')
      .click();
    await render();
  }

  async function open(): Promise<void> {
    input().click();
    await render();
  }

  // Calendars hidden by single mode stay in the page, so only the drawn ones count.
  const shownCalendars = (): number =>
    Array.from(root.querySelectorAll<HTMLElement>('.md-drppicker.shown .calendar')).filter((calendar) => calendar.offsetParent !== null)
      .length;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [PlaygroundPageComponent], providers: NgxDaterangepickerMd.forRoot().providers });
    fixture = TestBed.createComponent(PlaygroundPageComponent);
    root = fixture.nativeElement;
    document.body.appendChild(root);
    await render();
  });

  afterEach(() => {
    fixture.destroy();
    root.remove();
  });

  it('starts with two calendars and the shortest code', async () => {
    await open();

    expect(shownCalendars()).toBe(2);
    expect(code().trim()).toBe('<input type="text" ngxDaterangepickerMd [(ngModel)]="selected" />');
  });

  it('builds the picker again with the new option', async () => {
    await toggle('singleDatePicker');
    await open();

    expect(shownCalendars()).toBe(1);
    expect(code()).toContain('[singleDatePicker]="true"');
  });

  it('shows the time with timePicker', async () => {
    await toggle('timePicker');
    await open();

    expect(root.querySelector('.md-drppicker.shown .calendar-time')).not.toBeNull();
  });

  it('keeps the value when an option changes, and Reset clears it', async () => {
    const page = fixture.componentInstance;
    await open();
    const days = Array.from(root.querySelectorAll<HTMLElement>('.calendar.left td.available:not(.off)'));
    days[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    days[4].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    root.querySelector<HTMLButtonElement>('.md-drppicker.shown .buttons button:last-child').click();
    await render();
    const text = input().value;

    expect(page.selected().startDate).not.toBeNull();

    await toggle('showWeekNumbers');

    expect(input().value).toBe(text);

    Array.from(root.querySelectorAll<HTMLButtonElement>('.panel-head button'))[0].click();
    await render();

    expect(page.selected()).toBeNull();
    expect(input().value).toBe('');
    expect(code()).not.toContain('showWeekNumbers');
  });

  it('turns off the options that need another one', async () => {
    const closeOnAutoApply = (): HTMLButtonElement =>
      Array.from(root.querySelectorAll('mat-slide-toggle'))
        .find((element) => element.textContent.trim() === 'closeOnAutoApply')
        .querySelector('button');

    expect(closeOnAutoApply().disabled).toBeTrue();

    await toggle('autoApply');

    expect(closeOnAutoApply().disabled).toBeFalse();
  });
});
