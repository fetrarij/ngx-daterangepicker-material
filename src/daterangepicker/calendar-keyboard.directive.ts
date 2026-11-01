import { ChangeDetectorRef, Directive, HostListener, InjectionToken, Input, inject } from '@angular/core';
import { Dayjs } from 'dayjs/esm';
// Types only: a value import of the component would make an import cycle with its template.
import type { DaterangepickerComponent, SideEnum } from './daterangepicker.component';

// The calendar component, given to the keyboard directive of its template.
export const CALENDAR_PICKER = new InjectionToken<DaterangepickerComponent>('daterangepicker.calendar');

// The date the focus moves to for a key, or null when the key does not move it (issue #113).
export function nextFocusDate(date: Dayjs, e: { key: string; shiftKey?: boolean }, rtl = false, firstDay = 0): Dayjs | null {
  const daysFromWeekStart = (date.day() - firstDay + 7) % 7;
  switch (e.key) {
    case 'ArrowLeft':
      return date.add(rtl ? 1 : -1, 'day');
    case 'ArrowRight':
      return date.add(rtl ? -1 : 1, 'day');
    case 'ArrowUp':
      return date.subtract(1, 'week');
    case 'ArrowDown':
      return date.add(1, 'week');
    case 'Home':
      return date.subtract(daysFromWeekStart, 'day');
    case 'End':
      return date.add(6 - daysFromWeekStart, 'day');
    case 'PageUp':
      return date.subtract(1, e.shiftKey ? 'year' : 'month');
    case 'PageDown':
      return date.add(1, e.shiftKey ? 'year' : 'month');
    default:
      return null;
  }
}

// Keyboard navigation in one month grid of the calendar, with a single tab stop (WAI-ARIA date grid, issue #113).
@Directive({
  // Internal to the calendar template, not a public selector.
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[drpCalendarKeyboard]',
  exportAs: 'drpCalendarKeyboard',
  standalone: false
})
export class CalendarKeyboardDirective {
  @Input('drpCalendarKeyboard') side: SideEnum;

  private picker = inject(CALENDAR_PICKER);
  private ref = inject(ChangeDetectorRef);

  tabIndexFor(row: number, col: number): number {
    const date = this.cell(row, col);
    return date.month() === this.gridMonth() && date.isSame(this.focusTarget(), 'day') ? 0 : -1;
  }

  ariaLabelFor(row: number, col: number): string {
    const date = this.cell(row, col);
    const locale = this.picker.locale.locale;
    return (locale ? date.locale(locale) : date).format('LL');
  }

  isSelected(row: number, col: number): boolean {
    return /\b(start|end)-date\b/.test(this.classes(row, col));
  }

  isDisabled(row: number, col: number): boolean {
    return !this.isAvailable(row, col);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!(e.target as HTMLElement).closest('td')) {
      return;
    }
    const current = this.focusTarget();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.select(current);
      return;
    }
    let next = nextFocusDate(current, e, this.picker.locale.direction === 'rtl', this.picker.locale.firstDay ?? 0);
    if (!next) {
      return;
    }
    e.preventDefault();
    const { minDate, maxDate } = this.picker;
    if (minDate && next.isBefore(minDate, 'day')) {
      next = minDate.clone();
    }
    if (maxDate && next.isAfter(maxDate, 'day')) {
      next = maxDate.clone();
    }
    this.moveFocus(next);
  }

  private moveFocus(date: Dayjs): void {
    this.picker.focusedDate = date;
    if (!this.picker.isMonthShown(date)) {
      this.picker.showMonthOf(date);
    }
    // Like the mouse: while picking the end date, show the range up to the focused date.
    if (this.picker.pickingDate) {
      this.picker.nowHoveredDate = date;
      this.picker.renderCalendar('left' as SideEnum);
      this.picker.renderCalendar('right' as SideEnum);
    }
    this.ref.detectChanges();
    this.picker.focusCalendar();
  }

  private select(date: Dayjs): void {
    const calendar = this.picker.calendarVariables[this.side].calendar;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (calendar[row][col].month() === this.gridMonth() && calendar[row][col].isSame(date, 'day')) {
          if (this.isAvailable(row, col)) {
            this.picker.selectDate(this.side, row, col);
            if (this.picker.isShown || this.picker.inline) {
              this.ref.detectChanges();
              this.picker.focusCalendar();
            }
          }
          return;
        }
      }
    }
  }

  // The date with the tab stop: the focused date, else the start date, today or the first day shown.
  private focusTarget(): Dayjs {
    const { focusedDate, startDate } = this.picker;
    if (focusedDate && this.picker.isMonthShown(focusedDate)) {
      return focusedDate;
    }
    if (startDate && this.picker.isMonthShown(startDate)) {
      return startDate;
    }
    const today = this.picker.today();
    if (this.picker.isMonthShown(today)) {
      return today;
    }
    return this.picker.calendarVariables.left.calendar[1][1].startOf('month');
  }

  private cell(row: number, col: number): Dayjs {
    return this.picker.calendarVariables[this.side].calendar[row][col];
  }

  private classes(row: number, col: number): string {
    return this.picker.calendarVariables[this.side].classes[row][col] as string;
  }

  private isAvailable(row: number, col: number): boolean {
    return /\bavailable\b/.test(this.classes(row, col));
  }

  private gridMonth(): number {
    return this.picker.calendarVariables[this.side].calendar[1][1].month();
  }
}
