import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  effect,
  untracked
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs, { type Dayjs } from 'dayjs/esm';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';
import { isPlainDate, toExternalDate, toInternalDate } from './external-date';

import localeData from 'dayjs/esm/plugin/localeData';
import LocalizedFormat from 'dayjs/esm/plugin/localizedFormat';
import isoWeek from 'dayjs/esm/plugin/isoWeek';
import week from 'dayjs/esm/plugin/weekOfYear';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import utc from 'dayjs/esm/plugin/utc';

dayjs.extend(localeData);
dayjs.extend(LocalizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(week);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export enum SideEnum {
  left = 'left',
  right = 'right'
}

export interface DateRanges {
  [index: string]: [Dayjs, Dayjs];
}

export interface DateRange {
  label: string;
  dates: [Dayjs, Dayjs];
}

export interface ChosenDate {
  chosenLabel: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

export interface TimePeriod {
  [index: string]: Dayjs;

  startDate: Dayjs;
  endDate: Dayjs;
}

export interface StartDate {
  startDate: Dayjs;
}

export interface EndDate {
  endDate: Dayjs;
}

interface TimePickerVariables {
  secondsLabel: string[];
  selectedMinute: number;
  selectedSecond: number;
  hours: number[];
  hoursLabel: string[];
  seconds: number[];
  disabledHours: number[];
  disabledMinutes: number[];
  minutes: number[];
  minutesLabel: string[];
  selectedHour: number;
  disabledSeconds: number[];
  amDisabled?: boolean;
  pmDisabled?: boolean;
  ampmModel?: string;
  selected: Dayjs;
}

interface TimePickerVariablesHolder {
  [index: string]: TimePickerVariables;
}

interface CalendarRowClasses {
  [index: number]: string;

  classList: string;
}

interface CalendarClasses {
  [index: number]: CalendarRowClasses;
}

interface Dropdowns {
  inMaxYear: boolean;
  yearArrays: number[];
  maxYear: number;
  minYear: number;
  currentMonth: number;
  inMinYear: boolean;
  monthArrays: number[];
  currentYear: number;
}

type CalendarArrayWithProps<T> = T[] & { firstDay?: Dayjs; lastDay?: Dayjs };

interface CalendarVariables {
  calRows: number[];
  calCols: number[];
  calendar: CalendarArrayWithProps<Dayjs[]>;
  minDate: dayjs.Dayjs;
  year: number;
  classes: CalendarClasses;
  lastMonth: number;
  minute: number;
  second: number;
  daysInMonth: number;
  dayOfWeek: number;
  month: number;
  hour: number;
  firstDay: dayjs.Dayjs;
  lastYear: number;
  lastDay: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  daysInLastMonth: number;
  dropdowns?: Dropdowns;
}

interface CalendarVariableHolder {
  [index: string]: CalendarVariables;
}

interface VisibleCalendar {
  month: Dayjs;
  calendar: CalendarArrayWithProps<Dayjs[]>;
}

@Component({
  selector: 'ngx-daterangepicker-material',
  standalone: false,
  styleUrls: ['./daterangepicker.component.scss'],
  templateUrl: './daterangepicker.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerComponent),
      multi: true
    }
  ]
})
export class DaterangepickerComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input()
  initialDates: [string | Dayjs, string | Dayjs] = null;

  @Input()
  startDate = dayjs().utc(true).startOf('day');

  @Input()
  endDate = dayjs().utc(true).endOf('day');

  @Input()
  dateLimit: number = null;

  // general
  @Input()
  autoApply = false;

  @Input()
  singleDatePicker = false;

  @Input()
  showDropdowns = false;

  @Input()
  showWeekNumbers = false;

  @Input()
  showISOWeekNumbers = false;

  @Input()
  linkedCalendars = false;

  @Input()
  autoUpdateInput = true;

  @Input()
  alwaysShowCalendars = false;

  @Input()
  maxSpan = false;

  @Input()
  lockStartDate = false;

  // Apply can keep the end date empty, for an open range like "from X" (issue #502).
  @Input()
  allowEmptyEndDate = false;

  // timepicker variables
  @Input()
  get timePicker(): boolean {
    return this.timePickerHolder;
  }

  set timePicker(value: boolean) {
    this.timePickerHolder = value;
    // The time picker data is computed at init, so compute it when the time picker is turned on later (issue #518).
    if (value && this.initialized && this.startDate) {
      this.updateView();
    }
  }

  @Input()
  timePicker24Hour = false;

  @Input()
  timePickerIncrement = 1;

  @Input()
  timePickerSeconds = false;

  // end of timepicker variables
  @Input()
  showClearButton = false;

  @Input()
  firstMonthDayClass: string = null;

  @Input()
  lastMonthDayClass: string = null;

  @Input()
  emptyWeekRowClass: string = null;

  @Input()
  emptyWeekColumnClass: string = null;

  @Input()
  firstDayOfNextMonthClass: string = null;

  @Input()
  lastDayOfPreviousMonthClass: string = null;

  @Input()
  showCustomRangeLabel: boolean;

  @Input()
  showCancel = false;

  @Input()
  keepCalendarOpeningWithRange = false;

  @Input()
  showRangeLabelOnInput = false;

  @Input()
  customRangeDirection = false;

  @Input() drops: string;
  @Input() opens: string;
  @Input() closeOnAutoApply = true;
  @Output() choosedDate: EventEmitter<ChosenDate>;
  @Output() rangeClicked: EventEmitter<DateRange>;
  @Output() datesUpdated: EventEmitter<TimePeriod>;
  @Output() startDateChanged: EventEmitter<StartDate>;
  @Output() endDateChanged: EventEmitter<EndDate>;
  @Output() cancelClicked: EventEmitter<void>;
  @Output() clearClicked: EventEmitter<void>;
  // "Custom range" has no dates yet, so it does not go through rangeClicked (issue #522).
  @Output() customRangeClicked: EventEmitter<void>;
  @ViewChild('pickerContainer', { static: true }) pickerContainer: ElementRef;

  public chosenLabel: string;

  public calendarVariables: CalendarVariableHolder = {};
  // tooltiptext = []; // for storing tooltiptext
  public timepickerVariables: TimePickerVariablesHolder = {};
  daterangepicker: { start: FormControl; end: FormControl } = { start: new FormControl(), end: new FormControl() };

  public applyBtn: { disabled: boolean } = { disabled: false };

  // used in template for compile time support of enum values.
  public sideEnum = SideEnum;
  public chosenRange: string;

  public rangesArray: Array<string> = [];
  // some state information

  public isShown = false;
  public inline = true;
  leftCalendar: VisibleCalendar = { month: null, calendar: [] };
  rightCalendar: VisibleCalendar = { month: null, calendar: [] };
  public showCalInRanges = false;
  nowHoveredDate = null;
  pickingDate = false;
  // options: any = {}; // should get some opt from user
  // protected

  protected minDateHolder: dayjs.Dayjs;
  protected maxDateHolder: dayjs.Dayjs;
  protected timePickerHolder = false;
  protected localeHolder: LocaleConfig = {};
  // The [locale] input as given, so a new global config can be merged with it again.
  private localeInput: LocaleConfig = {};
  weekDays: string[] = [];
  private initialized = false;
  protected rangesHolder: DateRanges = {};
  // False while the dates are only today's placeholder, so the view can follow initialDates and the bounds.
  private hasSelection = false;
  // Set during a day click, so picking the end date does not move the months in view.
  private keepMonthsInView = false;
  private cachedVersion: { start: Dayjs; end: Dayjs } = { start: null, end: null };
  // An applied empty end date, not one still being picked: the next day click starts a new selection.
  private emptyEndApplied = false;
  // Set by ngModel or formControl on the inline component (issue #527).
  public isDisabled = false;
  private onChangeFn: (value: TimePeriod) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;
  // formControl can write a value before ngOnInit; it is applied once the calendar is ready.
  private pendingValue: { value: TimePeriod | Dayjs | Date | string | null } = null;

  constructor(
    private el: ElementRef,
    private ref: ChangeDetectorRef,
    private localeHolderService: LocaleService
  ) {
    this.choosedDate = new EventEmitter();
    this.rangeClicked = new EventEmitter();
    this.datesUpdated = new EventEmitter();
    this.startDateChanged = new EventEmitter();
    this.endDateChanged = new EventEmitter();
    this.cancelClicked = new EventEmitter();
    this.clearClicked = new EventEmitter();
    this.customRangeClicked = new EventEmitter();
    let seenConfig = untracked(this.localeHolderService.configChanges);
    effect(() => {
      const config = this.localeHolderService.configChanges();
      // The directive redraws its own picker, then updates the input text.
      if (config !== seenConfig && this.inline && this.initialized) {
        untracked(() => this.refreshLocale());
      }
      seenConfig = config;
    });
  }

  // accessors
  get minDate(): dayjs.Dayjs {
    return this.minDateHolder;
  }

  @Input()
  set minDate(value: dayjs.Dayjs | Date | string) {
    this.minDateHolder = toInternalDate(value);
  }

  get locale(): LocaleConfig {
    return this.localeHolder;
  }

  @Input() set locale(value: LocaleConfig) {
    this.localeInput = value || {};
    this.localeHolder = this.resolveLocale(this.localeInput);
    if (this.initialized) {
      this.refreshLocale();
    }
  }

  // custom ranges

  get ranges(): DateRanges {
    return this.rangesHolder;
  }

  @Input() set ranges(value: DateRanges) {
    // No ranges, like [ranges]="undefined", must still show the calendars.
    this.rangesHolder = value || {};
    this.renderRanges();
    // New range names must reach the label of the chosen range too (issue #388).
    if (this.initialized && this.startDate && this.endDate) {
      this.calculateChosenLabel();
    }
  }

  get maxDate(): dayjs.Dayjs {
    return this.maxDateHolder;
  }

  @Input()
  set maxDate(value: dayjs.Dayjs | Date | string) {
    this.maxDateHolder = toInternalDate(value);
  }

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInvalidDate(date: Dayjs): boolean {
    return false;
  }

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isCustomDate(date: Dayjs): string | string[] | boolean {
    return false;
  }

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isTooltipDate(date: Dayjs): string | boolean | null {
    return null;
  }

  /**
   * handle click on all element in the component, useful for outside of click
   *
   * @param e event
   */
  @HostListener('click', ['$event'])
  handleInternalClick(e: MouseEvent): void {
    return e.stopPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.startDate || changes.endDate) {
      this.hasSelection = true;
    }
    if (changes.startDate || changes.singleDatePicker) {
      this.alignSingleEndDate();
    }
    if ((changes.startDate || changes.endDate) && this.inline) {
      this.updateView();
    }
  }

  ngOnInit(): void {
    this.buildLocale();
    this.updateWeekDays();

    // Initialize with initialDates if provided
    let leftMonth: Dayjs;
    let rightMonth: Dayjs;

    if (this.initialDates && this.initialDates.length === 2) {
      leftMonth = toInternalDate(this.initialDates[0]);
      rightMonth = toInternalDate(this.initialDates[1]);
    } else {
      leftMonth = dayjs().utc(true);
      rightMonth = leftMonth.clone().add(1, 'month');
    }

    // Set calendar view without selecting dates
    if (!this.startDate || this.startDate.isSame(dayjs().utc(true).startOf('day'))) {
      this.leftCalendar.month = leftMonth.clone();
      this.rightCalendar.month = rightMonth.clone();
    }

    if (this.inline) {
      this.cachedVersion.start = this.startDate?.clone();
      this.cachedVersion.end = this.endDate?.clone();
    }

    if (!this.hasSelection) {
      this.fitDefaultDatesInBounds();
    }
    this.alignSingleEndDate();

    const hasSelection = this.hasSelection;
    if (this.startDate && this.timePicker) {
      this.setStartDate(this.startDate);
      this.renderTimePicker(SideEnum.left);
    }

    if (this.endDate && this.timePicker) {
      this.setEndDate(this.endDate);
      this.renderTimePicker(SideEnum.right);
    }
    this.hasSelection = hasSelection;

    this.updateMonthsInView();
    this.renderCalendar(SideEnum.left);
    this.renderCalendar(SideEnum.right);
    this.renderRanges();
    this.initialized = true;
    if (this.pendingValue) {
      this.applyValue(this.pendingValue.value);
      this.pendingValue = null;
    }
  }

  writeValue(value: TimePeriod | Dayjs | Date | string | null): void {
    if (this.initialized) {
      this.applyValue(value);
    } else {
      this.pendingValue = { value };
    }
  }

  registerOnChange(fn: (value: TimePeriod) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(state: boolean): void {
    this.isDisabled = state;
    this.ref.markForCheck();
  }

  renderRanges(): void {
    this.rangesArray = [];
    let start;
    let end;
    if (typeof this.ranges === 'object') {
      for (const range in this.ranges) {
        if (this.ranges[range]) {
          start = toInternalDate(this.ranges[range][0], this.locale.format, this.locale.locale);
          end = toInternalDate(this.ranges[range][1], this.locale.format, this.locale.locale);
          // If the start or end date exceed those allowed by the minDate or maxSpan
          // options, shorten the range to the allowable period.
          if (this.minDate && start.isBefore(this.minDate)) {
            start = this.minDate.clone();
          }
          let maxDate = this.maxDate;
          if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
            maxDate = start.clone().add(this.maxSpan);
          }
          if (maxDate && end.isAfter(maxDate)) {
            end = maxDate.clone();
          }
          // If the end of the range is before the minimum or the start of the range is
          // after the maximum, don't display this range option at all.
          if (
            (this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day')) ||
            (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))
          ) {
            continue;
          }
          // Keep the name as is: Angular interpolation already shows unicode, and no DOM access keeps SSR working.
          this.ranges[range] = [start, end];
        }
      }
      for (const range in this.ranges) {
        if (this.ranges[range]) {
          this.rangesArray.push(range);
        }
      }
      if (this.showCustomRangeLabel) {
        this.rangesArray.push(this.locale.customRangeLabel);
      }
      this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;
      // endDate is null between the two clicks of a selection (issue #349).
      if (!this.timePicker) {
        this.startDate = this.startDate?.startOf('day') ?? null;
        this.endDate = this.endDate?.endOf('day') ?? null;
      }
    }
  }

  renderTimePicker(side: SideEnum): void {
    let selected: Dayjs;
    let minDate: Dayjs;
    const maxDate = this.maxDate;
    if (side === SideEnum.left) {
      selected = this.startDate.clone();
      minDate = this.minDate;
    } else if (side === SideEnum.right && this.endDate) {
      selected = this.endDate.clone();
      minDate = this.startDate;
    } else if (side === SideEnum.right && !this.endDate) {
      // don't have an end date, use the start date then put the selected time for the right side as the time
      selected = this.getDateWithTime(this.startDate, SideEnum.right);
      if (selected.isBefore(this.startDate)) {
        selected = this.startDate.clone(); // set it back to the start date the time was backwards
      }
      minDate = this.startDate;
    }
    const start = this.timePicker24Hour ? 0 : 1;
    const end = this.timePicker24Hour ? 23 : 12;
    this.timepickerVariables[side] = {
      hours: [],
      hoursLabel: [],
      minutes: [],
      minutesLabel: [],
      seconds: [],
      secondsLabel: [],
      disabledHours: [],
      disabledMinutes: [],
      disabledSeconds: [],
      selectedHour: 0,
      selectedMinute: 0,
      selectedSecond: 0,
      selected
    };
    // generate hours
    for (let i = start; i <= end; i++) {
      let iIn24 = i;
      if (!this.timePicker24Hour) {
        iIn24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : i === 12 ? 0 : i;
      }

      const time = selected.clone().hour(iIn24);
      let disabled = false;
      if (minDate && time.minute(59).isBefore(minDate)) {
        disabled = true;
      }
      if (maxDate && time.minute(0).isAfter(maxDate)) {
        disabled = true;
      }

      this.timepickerVariables[side].hours.push(i);
      this.timepickerVariables[side].hoursLabel.push(this.timePicker24Hour && i < 10 ? `0${i}` : `${i}`);
      if (iIn24 === selected.hour() && !disabled) {
        this.timepickerVariables[side].selectedHour = i;
      } else if (disabled) {
        this.timepickerVariables[side].disabledHours.push(i);
      }
    }

    // generate minutes
    // A minute between two steps, like 59 at the end of the day, selects the step before it.
    const selectedStep = Math.floor(selected.minute() / this.timePickerIncrement) * this.timePickerIncrement;
    for (let i = 0; i < 60; i += this.timePickerIncrement) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const time = selected.clone().minute(i);

      let disabled = false;
      if (minDate && time.second(59).isBefore(minDate)) {
        disabled = true;
      }
      if (maxDate && time.second(0).isAfter(maxDate)) {
        disabled = true;
      }
      this.timepickerVariables[side].minutes.push(i);
      this.timepickerVariables[side].minutesLabel.push(padded);
      if (selectedStep === i && !disabled) {
        this.timepickerVariables[side].selectedMinute = i;
      } else if (disabled) {
        this.timepickerVariables[side].disabledMinutes.push(i);
      }
    }
    // generate seconds
    if (this.timePickerSeconds) {
      for (let i = 0; i < 60; i++) {
        const padded = i < 10 ? `0${i}` : `${i}`;
        const time = selected.clone().second(i);

        let disabled = false;
        if (minDate && time.isBefore(minDate)) {
          disabled = true;
        }
        if (maxDate && time.isAfter(maxDate)) {
          disabled = true;
        }

        this.timepickerVariables[side].seconds.push(i);
        this.timepickerVariables[side].secondsLabel.push(padded);
        if (selected.second() === i && !disabled) {
          this.timepickerVariables[side].selectedSecond = i;
        } else if (disabled) {
          this.timepickerVariables[side].disabledSeconds.push(i);
        }
      }
    }
    // generate AM/PM
    if (!this.timePicker24Hour) {
      if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
        this.timepickerVariables[side].amDisabled = true;
      }

      if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
        this.timepickerVariables[side].pmDisabled = true;
      }
      if (selected.hour() >= 12) {
        this.timepickerVariables[side].ampmModel = 'PM';
      } else {
        this.timepickerVariables[side].ampmModel = 'AM';
      }
    }
    this.timepickerVariables[side].selected = selected;
  }

  renderCalendar(side: SideEnum): void {
    // side enum
    const mainCalendar: VisibleCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
    const month: number = mainCalendar.month.month();
    const year: number = mainCalendar.month.year();
    const hour: number = mainCalendar.month.hour();
    const minute: number = mainCalendar.month.minute();
    const second: number = mainCalendar.month.second();
    const daysInMonth: number = dayjs(new Date(year, month)).utc(true).daysInMonth();
    const firstDay: Dayjs = dayjs(new Date(year, month, 1)).utc(true);
    const lastDay: Dayjs = dayjs(new Date(year, month, daysInMonth)).utc(true);
    const lastMonth: number = dayjs(firstDay).utc(true).subtract(1, 'month').month();
    const lastYear: number = dayjs(firstDay).utc(true).subtract(1, 'month').year();
    const daysInLastMonth: number = dayjs(new Date(lastYear, lastMonth)).utc(true).daysInMonth();
    const dayOfWeek: number = firstDay.day();
    // initialize 6 rows x 7 columns array for the calendar
    const calendar: CalendarArrayWithProps<Dayjs[]> = [];
    calendar.firstDay = firstDay;
    calendar.lastDay = lastDay;

    for (let i = 0; i < 6; i++) {
      calendar[i] = [];
    }

    // populate the calendar with date objects
    let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
    if (startDay > daysInLastMonth) {
      startDay -= 7;
    }

    if (dayOfWeek === this.locale.firstDay) {
      startDay = daysInLastMonth - 6;
    }

    let curDate = dayjs(new Date(lastYear, lastMonth, startDay, 12, minute, second)).utc(true);

    for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = dayjs(curDate).utc(true).add(24, 'hours')) {
      if (i > 0 && col % 7 === 0) {
        col = 0;
        row++;
      }
      calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
      curDate = curDate.hour(12);

      if (
        this.minDate &&
        calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
        calendar[row][col].isBefore(this.minDate) &&
        side === 'left'
      ) {
        calendar[row][col] = this.minDate.clone();
      }

      if (
        this.maxDate &&
        calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
        calendar[row][col].isAfter(this.maxDate) &&
        side === 'right'
      ) {
        calendar[row][col] = this.maxDate.clone();
      }
    }

    // make the calendar object available to hoverDate/clickDate
    if (side === SideEnum.left) {
      this.leftCalendar.calendar = calendar;
    } else {
      this.rightCalendar.calendar = calendar;
    }
    //
    // Display the calendar
    //
    let minDate = side === 'left' ? this.minDate : this.startDate;
    let maxDate = this.maxDate;
    // adjust maxDate to reflect the dateLimit setting in order to
    // grey out end dates beyond the dateLimit
    if (this.endDate === null && this.dateLimit) {
      const maxLimit = this.startDate.clone().add(this.dateLimit, 'day').endOf('day');
      if (!maxDate || maxLimit.isBefore(maxDate)) {
        maxDate = maxLimit;
      }

      if (this.customRangeDirection) {
        minDate = this.minDate;
        const minLimit = this.startDate.clone().subtract(this.dateLimit, 'day').endOf('day');
        if (!minDate || minLimit.isAfter(minDate)) {
          minDate = minLimit;
        }
      }
    }

    this.calendarVariables[side] = {
      month,
      year,
      hour,
      minute,
      second,
      daysInMonth,
      firstDay,
      lastDay,
      lastMonth,
      lastYear,
      daysInLastMonth,
      dayOfWeek,
      // other vars
      calRows: Array.from(Array(6).keys()),
      calCols: Array.from(Array(7).keys()),
      classes: {},
      minDate,
      maxDate,
      calendar
    };
    if (this.showDropdowns) {
      const currentMonth: number = calendar[1][1].month();
      const currentYear: number = calendar[1][1].year();
      const realCurrentYear: number = dayjs().utc(true).year();
      const maxYear: number = (maxDate && maxDate.year()) || realCurrentYear + 5;
      const minYear: number = (minDate && minDate.year()) || realCurrentYear - 50;
      const inMinYear: boolean = currentYear === minYear;
      const inMaxYear: boolean = currentYear === maxYear;
      const years: number[] = [];
      for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
      }
      this.calendarVariables[side].dropdowns = {
        currentMonth,
        currentYear,
        maxYear,
        minYear,
        inMinYear,
        inMaxYear,
        monthArrays: Array.from(Array(12).keys()),
        yearArrays: years
      };
    }

    this.buildCells(calendar, side);
  }

  setStartDate(startDate: string | Dayjs): void {
    this.hasSelection = true;
    if (typeof startDate === 'string') {
      this.startDate = toInternalDate(startDate, this.locale.format, this.locale.locale);
    }

    if (typeof startDate === 'object') {
      this.pickingDate = true;
      this.startDate = toInternalDate(startDate);
    }
    if (!this.timePicker) {
      this.pickingDate = true;
      this.startDate = this.startDate.startOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.startDate = this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
    }

    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      this.startDate = this.minDate.clone();
      // Without time picker, a date range covers whole days.
      if (!this.timePicker) {
        this.startDate = this.startDate.startOf('day');
      }
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate = this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }
    }

    if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
      this.startDate = this.maxDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate = this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }
    }

    if (!this.isShown) {
      this.updateElement();
    }
    this.startDateChanged.emit({ startDate: this.toOutput(this.startDate) });
    this.updateMonthsInView();
  }

  setEndDate(endDate: string | Dayjs): void {
    this.emptyEndApplied = false;
    this.hasSelection = true;
    if (typeof endDate === 'string') {
      this.endDate = toInternalDate(endDate, this.locale.format, this.locale.locale);
    }

    if (typeof endDate === 'object') {
      this.pickingDate = false;
      this.endDate = toInternalDate(endDate);
    }
    if (!this.timePicker) {
      this.pickingDate = false;
      // Same end as the ranges and the default value: 23:59:59.999.
      this.endDate = this.endDate.endOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      // Round down: rounding 59 up gives 60, which moves the end to the next hour or day.
      this.endDate = this.endDate.minute(Math.floor(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
    }

    if (this.endDate.isBefore(this.startDate)) {
      this.endDate = this.startDate.clone();
    }

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
      // Without time picker, the end is the end of the maxDate day, like any other end date (issue #486).
      if (!this.timePicker) {
        this.endDate = this.endDate.endOf('day');
      }
    }

    if (this.dateLimit && this.startDate.clone().add(this.dateLimit, 'day').isBefore(this.endDate)) {
      this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
    }

    if (!this.isShown) {
      // this.updateElement();
    }
    this.endDateChanged.emit({ endDate: this.toOutput(this.endDate) });
    this.updateMonthsInView();
  }

  updateView(): void {
    if (this.timePicker) {
      this.renderTimePicker(SideEnum.left);
      this.renderTimePicker(SideEnum.right);
    }
    this.updateMonthsInView();
    this.updateCalendars();
  }

  updateMonthsInView(): void {
    // Nothing chosen yet: keep the months asked by initialDates.
    if (!this.hasSelection && this.initialDates && this.leftCalendar.month && this.rightCalendar.month) {
      return;
    }
    // A day click keeps the months the user moved to (picking the end date after browsing).
    if (this.keepMonthsInView && this.leftCalendar.month && this.rightCalendar.month) {
      return;
    }
    if (this.endDate) {
      // if both dates are visible already, do not move the months
      const bothVisible =
        !this.singleDatePicker &&
        this.leftCalendar.month &&
        this.rightCalendar.month &&
        ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
          (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) &&
        (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
          this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'));
      if (!bothVisible && this.startDate) {
        this.leftCalendar.month = this.startDate.clone().date(2);
        if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() || this.endDate.year() !== this.startDate.year())) {
          this.rightCalendar.month = this.endDate.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      }
    } else {
      if (
        this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
        this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')
      ) {
        this.leftCalendar.month = this.startDate.clone().date(2);
        this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
      }
    }
    // Linked or not, the right calendar must not be a month after maxDate (issues #398, #111), unless it hides the start date.
    if (this.maxDate && !this.singleDatePicker && this.rightCalendar.month.isAfter(this.maxDate, 'month')) {
      const left = this.maxDate.clone().date(2).subtract(1, 'month');
      if (!this.startDate || !this.startDate.isBefore(left, 'month')) {
        this.rightCalendar.month = this.maxDate.clone().date(2);
        this.leftCalendar.month = left;
      }
    }
  }

  /**
   *  This is responsible for updating the calendars
   */
  updateCalendars(): void {
    this.renderCalendar(SideEnum.left);
    this.renderCalendar(SideEnum.right);

    if (this.endDate === null) {
      return;
    }
    this.calculateChosenLabel();
  }

  updateElement(): void {
    const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
    if (!this.singleDatePicker && this.autoUpdateInput) {
      if (this.startDate && !this.endDate && this.allowEmptyEndDate) {
        this.chosenLabel = this.emptyEndDateLabel(format);
      } else if (this.startDate && this.endDate) {
        // if we use ranges and should show range label on input
        if (
          this.rangesArray.length &&
          this.showRangeLabelOnInput === true &&
          this.chosenRange &&
          this.locale.customRangeLabel !== this.chosenRange
        ) {
          this.chosenLabel = this.chosenRange;
        } else {
          const formattedStartDate = this.localeHolder.locale
            ? this.startDate.locale(this.localeHolder.locale).format(format)
            : this.startDate.format(format);
          const formattedEndDate = this.localeHolder.locale
            ? this.endDate.locale(this.localeHolder.locale).format(format)
            : this.endDate.format(format);

          this.chosenLabel = formattedStartDate + this.locale.separator + formattedEndDate;
        }
      }
    } else if (this.autoUpdateInput) {
      this.chosenLabel = this.localeHolder.locale
        ? this.startDate.locale(this.localeHolder.locale).format(format)
        : this.startDate.format(format);
    }
  }

  // Without a template, the separator stays so the text still reads as a range.
  private emptyEndDateLabel(format: string): string {
    const start = this.localeHolder.locale ? this.startDate.locale(this.localeHolder.locale).format(format) : this.startDate.format(format);
    const template = this.locale.emptyEndDateLabel;
    return template ? template.replace('{start}', start) : start + this.locale.separator;
  }

  // Week numbers follow the instance locale, not the global dayjs locale (issue #378).
  weekOfRow(side: SideEnum, row: number): number {
    const day = this.calendarVariables[side].calendar[row][0];
    return (this.localeHolder.locale ? day.locale(this.localeHolder.locale) : day).week();
  }

  // An ISO week is the week of its Thursday; the first cell can be a Sunday from the week before (issue #378).
  isoWeekOfRow(side: SideEnum, row: number): number {
    const days: Dayjs[] = this.calendarVariables[side].calendar[row];
    return days.find((day) => day.day() === 4).isoWeek();
  }

  remove(): void {
    this.isShown = false;
  }

  /**
   * this should calculate the label
   */
  calculateChosenLabel(): void {
    if (!this.locale || !this.locale.separator) {
      this.buildLocale();
    }
    let customRange = true;
    let i = 0;
    // An empty end date matches no predefined range.
    if (this.rangesArray.length > 0 && this.endDate) {
      for (const range in this.ranges) {
        if (this.ranges[range]) {
          if (this.timePicker) {
            const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
            // ignore times when comparing dates if time picker seconds is not enabled
            if (
              this.startDate.format(format) === this.ranges[range][0].format(format) &&
              this.endDate.format(format) === this.ranges[range][1].format(format)
            ) {
              customRange = false;
              this.chosenRange = this.rangesArray[i];
              break;
            }
          } else {
            // ignore times when comparing dates if time picker is not enabled
            if (
              this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD') &&
              this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')
            ) {
              customRange = false;
              this.chosenRange = this.rangesArray[i];
              break;
            }
          }
          i++;
        }
      }
      if (customRange) {
        if (this.showCustomRangeLabel) {
          this.chosenRange = this.locale.customRangeLabel;
        } else {
          this.chosenRange = null;
        }
        // if custom label: show calendar
        this.showCalInRanges = true;
      }
    }

    this.updateElement();
  }

  clickApply(e?: MouseEvent): void {
    if (!this.singleDatePicker && this.startDate && !this.endDate) {
      // With allowEmptyEndDate the start date is applied alone (issue #502).
      if (this.allowEmptyEndDate) {
        this.emptyEndApplied = true;
      } else {
        if (this.timePicker) {
          this.endDate = this.getDateWithTime(this.startDate, SideEnum.right);
        } else {
          // setEndDate() moves the end to the end of the day, like a second click on the same day.
          this.setEndDate(this.startDate.clone());
        }
      }
      this.calculateChosenLabel();
    }
    if (this.isInvalidDate && this.startDate && this.endDate) {
      // get if there are invalid date between range

      let d = this.startDate.clone();
      while (d.isBefore(this.endDate)) {
        // Consumer callbacks get real local dates, like the outputs (issue #455).
        if (this.isInvalidDate(toExternalDate(d))) {
          this.endDate = d.subtract(1, 'days');
          this.calculateChosenLabel();
          break;
        }
        d = d.add(1, 'days');
      }
    }
    if (this.chosenLabel) {
      this.choosedDate.emit({
        chosenLabel: this.chosenLabel,
        startDate: this.toOutput(this.startDate),
        endDate: this.toOutput(this.endDate)
      });
    }

    this.datesUpdated.emit({ startDate: this.toOutput(this.startDate), endDate: this.toOutput(this.endDate) });
    this.onChangeFn({ startDate: this.toOutput(this.startDate), endDate: this.toOutput(this.endDate) });
    this.onTouchedFn();
    // Inline pickers never call show(), so Cancel needs the cache refreshed here.
    this.cachedVersion.start = this.startDate?.clone();
    this.cachedVersion.end = this.endDate?.clone();
    if (e || (this.closeOnAutoApply && !e)) {
      this.hide();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickCancel(e: MouseEvent): void {
    this.startDate = this.cachedVersion.start;
    this.endDate = this.cachedVersion.end;
    this.emptyEndApplied = this.allowEmptyEndDate && !!this.startDate && !this.endDate;
    if (this.inline) {
      this.updateView();
    }
    this.cancelClicked.emit();
    this.hide();
  }

  /**
   * called when month is changed
   *
   * @param monthEvent get value in event.target.value
   * @param side left or right
   */
  monthChanged(monthEvent: Event, side: SideEnum): void {
    const year = this.calendarVariables[side].dropdowns.currentYear;
    const month = parseInt((monthEvent.target as HTMLSelectElement).value, 10);
    this.monthOrYearChanged(month, year, side);
  }

  /**
   * called when year is changed
   *
   * @param yearEvent get value in event.target.value
   * @param side left or right
   */
  yearChanged(yearEvent: Event, side: SideEnum): void {
    const month = this.calendarVariables[side].dropdowns.currentMonth;
    const year = parseInt((yearEvent.target as HTMLSelectElement).value, 10);
    this.monthOrYearChanged(month, year, side);
  }

  /**
   * called when time is changed
   *
   * @param timeEvent  an event
   * @param side left or right
   */
  timeChanged(timeEvent: Event, side: SideEnum): void {
    let hour = parseInt(String(this.timepickerVariables[side].selectedHour), 10);
    const minute = parseInt(String(this.timepickerVariables[side].selectedMinute), 10);
    const second = this.timePickerSeconds ? parseInt(String(this.timepickerVariables[side].selectedSecond), 10) : 0;

    if (!this.timePicker24Hour) {
      const ampm = this.timepickerVariables[side].ampmModel;
      if (ampm === 'PM' && hour < 12) {
        hour += 12;
      }
      if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }
    }

    if (side === SideEnum.left) {
      let start = this.startDate.clone();
      start = start.hour(hour);
      start = start.minute(minute);
      start = start.second(second);
      this.setStartDate(start);
      if (this.singleDatePicker) {
        this.endDate = this.startDate.clone();
      } else if (this.endDate && this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
        this.setEndDate(start.clone());
      } else if (!this.endDate && this.timePicker) {
        const startClone = this.getDateWithTime(start, SideEnum.right);

        if (startClone.isBefore(start)) {
          this.timepickerVariables[SideEnum.right].selectedHour = hour;
          this.timepickerVariables[SideEnum.right].selectedMinute = minute;
          this.timepickerVariables[SideEnum.right].selectedSecond = second;
        }
      }
    } else if (this.endDate) {
      let end = this.endDate.clone();
      end = end.hour(hour);
      end = end.minute(minute);
      end = end.second(second);
      this.setEndDate(end);
    }

    // update the calendars so all clickable dates reflect the new time component
    this.updateCalendars();

    // re-render the time pickers because changing one selection can affect what's enabled in another
    this.renderTimePicker(SideEnum.left);
    this.renderTimePicker(SideEnum.right);

    if (this.autoApply) {
      this.clickApply();
    }
  }

  /**
   *  call when month or year changed
   *
   * @param month month number 0 -11
   * @param year year eg: 1995
   * @param side left or right
   */
  monthOrYearChanged(month: number, year: number, side: SideEnum): void {
    const isLeft = side === SideEnum.left;
    let newMonth = month;
    let newYear = year;

    if (!isLeft) {
      if (newYear < this.startDate.year() || (newYear === this.startDate.year() && newMonth < this.startDate.month())) {
        newMonth = this.startDate.month();
        newYear = this.startDate.year();
      }
    }

    if (this.minDate) {
      if (newYear < this.minDate.year() || (newYear === this.minDate.year() && newMonth < this.minDate.month())) {
        newMonth = this.minDate.month();
        newYear = this.minDate.year();
      }
    }

    if (this.maxDate) {
      if (newYear > this.maxDate.year() || (newYear === this.maxDate.year() && newMonth > this.maxDate.month())) {
        newMonth = this.maxDate.month();
        newYear = this.maxDate.year();
      }
    }
    this.calendarVariables[side].dropdowns.currentYear = newYear;
    this.calendarVariables[side].dropdowns.currentMonth = newMonth;
    if (isLeft) {
      this.leftCalendar.month = this.leftCalendar.month.month(newMonth).year(newYear);
      if (this.linkedCalendars) {
        this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
      }
    } else {
      this.rightCalendar.month = this.rightCalendar.month.month(newMonth).year(newYear);
      if (this.linkedCalendars) {
        this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
      }
    }
    this.updateCalendars();
  }

  /**
   * Click on previous month
   *
   * @param side left or right calendar
   */
  clickPrev(side: SideEnum): void {
    if (side === SideEnum.left) {
      this.leftCalendar.month = this.leftCalendar.month.subtract(1, 'month');
      if (this.linkedCalendars) {
        this.rightCalendar.month = this.rightCalendar.month.subtract(1, 'month');
      }
    } else {
      this.rightCalendar.month = this.rightCalendar.month.subtract(1, 'month');
    }
    this.updateCalendars();
  }

  /**
   * Click on next month
   *
   * @param side left or right calendar
   */
  clickNext = (side: SideEnum) => {
    if (side === SideEnum.left) {
      this.leftCalendar.month = this.leftCalendar.month.add(1, 'month');
    } else {
      this.rightCalendar.month = this.rightCalendar.month.add(1, 'month');
      if (this.linkedCalendars) {
        this.leftCalendar.month = this.leftCalendar.month.add(1, 'month');
      }
    }
    this.updateCalendars();
  };

  /**
   * When hovering a date
   *
   * @param e event: get value by e.target.value
   * @param side left or right
   * @param row row position of the current date clicked
   * @param col col position of the current date clicked
   */
  hoverDate(e: Event, side: SideEnum, row: number, col: number): void {
    const leftCalDate = this.calendarVariables.left.calendar[row][col];
    const rightCalDate = this.calendarVariables.right.calendar[row][col];
    if (this.pickingDate) {
      this.nowHoveredDate = side === SideEnum.left ? leftCalDate : rightCalDate;
      this.renderCalendar(SideEnum.left);
      this.renderCalendar(SideEnum.right);
    }
    // const tooltip = side === SideEnum.left ? this.tooltiptext[leftCalDate] : this.tooltiptext[rightCalDate];
    // if (tooltip.length > 0) {
    //   (e.target as HTMLTableCellElement).setAttribute('title', tooltip);
    // }
  }

  /**
   * When selecting a date
   *
   * @param e event: get value by e.target.value
   * @param side left or right
   * @param row row position of the current date clicked
   * @param col col position of the current date clicked
   */
  clickDate(e: Event, side: SideEnum, row: number, col: number): void {
    if ((e.target as HTMLTableCellElement).tagName === 'TD') {
      if (!(e.target as HTMLTableCellElement).classList.contains('available')) {
        return;
      }
    } else if ((e.target as HTMLSpanElement).tagName === 'SPAN') {
      if (!(e.target as HTMLSpanElement).parentElement.classList.contains('available')) {
        return;
      }
    }
    if (this.rangesArray.length) {
      this.chosenRange = this.locale.customRangeLabel;
    }

    let date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
    this.keepMonthsInView = true;

    if (
      (this.endDate || this.emptyEndApplied || (date.isBefore(this.startDate, 'day') && this.customRangeDirection === false)) &&
      this.lockStartDate === false
    ) {
      // picking start
      this.emptyEndApplied = false;
      if (this.timePicker) {
        date = this.getDateWithTime(date, SideEnum.left);
      }
      this.endDate = null;
      this.setStartDate(date.clone());
    } else if (!this.endDate && date.isBefore(this.startDate) && this.customRangeDirection === false) {
      // special case: clicking the same date for start/end,
      // but the time of the end date is before the start date
      this.setEndDate(this.startDate.clone());
    } else {
      // picking end
      if (this.timePicker) {
        date = this.getDateWithTime(date, SideEnum.right);
      }
      if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
        this.setEndDate(this.startDate);
        this.setStartDate(date.clone());
        this.pickingDate = false;
      } else {
        this.setEndDate(date.clone());
      }

      if (this.autoApply) {
        this.calculateChosenLabel();
      }
    }

    if (this.singleDatePicker) {
      this.setEndDate(this.startDate);
      this.updateElement();
    }

    this.updateView();

    if (this.autoApply && this.startDate && this.endDate) {
      this.clickApply();
    }
    this.keepMonthsInView = false;

    // This is to cancel the blur event handler if the mouse was in one of the inputs
    e.stopPropagation();
  }

  /**
   *  Click on the custom range
   *
   * @param e: Event
   * @param label
   */
  clickRange(e: MouseEvent, label: string): void {
    this.chosenRange = label;
    if (label === this.locale.customRangeLabel) {
      this.isShown = true; // show calendars
      this.showCalInRanges = true;
      this.customRangeClicked.emit();
    } else {
      this.hasSelection = true;
      const dates = this.ranges[label];
      if (this.minDate && dates[0].isBefore(this.minDate)) {
        this.startDate = this.minDate;
      } else {
        this.startDate = dates[0].clone();
      }
      if (this.maxDate && dates[1].isAfter(this.maxDate)) {
        this.endDate = this.maxDate;
      } else {
        this.endDate = dates[1].clone();
      }
      if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
        this.chosenLabel = label;
      } else {
        this.calculateChosenLabel();
      }
      this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;

      if (!this.timePicker) {
        this.startDate = this.startDate.startOf('day');
        this.endDate = this.endDate.endOf('day');
      }

      if (!this.alwaysShowCalendars) {
        this.isShown = false; // hide calendars
      }
      this.rangeClicked.emit({ label, dates: [this.toOutput(dates[0]), this.toOutput(dates[1])] });
      if (!this.keepCalendarOpeningWithRange || this.autoApply) {
        this.clickApply();
        // The picker can stay open (closeOnAutoApply false): show the new range, not the old one (issue #416).
        this.updateView();
      } else {
        if (!this.alwaysShowCalendars) {
          return this.clickApply();
        }
        // Same month rules as any other selection, so a range in one month is not shown twice (issue #416).
        this.updateView();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show(e?: Event): void {
    if (this.isShown) {
      return;
    }
    // minDate or maxDate may have changed since the placeholder dates were set.
    if (!this.hasSelection) {
      this.resetDates();
    }
    this.cachedVersion.start = this.startDate.clone();
    this.cachedVersion.end = this.endDate?.clone() ?? null;
    this.isShown = true;
    this.updateView();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hide(e?: Event): void {
    if (!this.isShown) {
      return;
    }
    // Closing without Apply drops the selection: the last applied dates come back (issue #399).
    const { start, end } = this.cachedVersion;
    // The applied value may have an empty end date (allowEmptyEndDate).
    const emptyEnd = this.allowEmptyEndDate && start && !end;
    if ((start && !this.startDate?.isSame(start)) || (end && !this.endDate?.isSame(end)) || (emptyEnd && this.endDate)) {
      this.startDate = start ? start.clone() : this.startDate;
      this.endDate = end ? end.clone() : emptyEnd ? null : this.endDate;
      this.calculateChosenLabel();
    }
    if (emptyEnd) {
      this.emptyEndApplied = true;
    }

    // if picker is attached to a text input, update it
    this.updateElement();
    this.isShown = false;
    this.ref.detectChanges();
  }

  /**
   * update the locale options
   *
   * @param locale
   */
  updateLocale(locale: LocaleConfig): void {
    this.locale = locale;
  }

  /**
   *  clear the daterange picker
   */
  clear(): void {
    this.resetDates();
    this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null });
    this.datesUpdated.emit({ startDate: null, endDate: null });
    this.onChangeFn({ startDate: null, endDate: null });
    this.onTouchedFn();
    this.clearClicked.emit();
    this.hide();
  }

  // Today may be outside minDate/maxDate: start on the nearest day the user can pick (issues #277, #142).
  private fitDefaultDatesInBounds(): void {
    const increment = this.timePicker && this.timePickerIncrement ? this.timePickerIncrement : 1;
    let start: Dayjs;
    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      start = this.minDate.clone();
      // Round up, so the time stays after minDate.
      start = start.minute(Math.ceil(start.minute() / increment) * increment);
    } else if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
      start = this.maxDate.clone();
      start = start.minute(Math.floor(start.minute() / increment) * increment);
    } else {
      return;
    }
    this.startDate = this.timePicker ? start : start.startOf('day');
    this.endDate = this.startDate.endOf('day');
    if (this.timePicker && this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
    }
  }

  // One date: the end is the start, else it stays on today and the calendar draws a range (issue #537).
  private alignSingleEndDate(): void {
    if (this.singleDatePicker && this.startDate) {
      // Same end of day as setEndDate() without time picker.
      this.endDate = this.timePicker ? this.startDate.clone() : this.startDate.clone().endOf('day');
    }
  }

  // A value from ngModel or formControl; like the input, a plain date is read as one day in single mode.
  private applyValue(value: TimePeriod | Dayjs | Date | string | null): void {
    const period = value as TimePeriod;
    let start = period?.startDate || null;
    let end = period?.endDate || null;
    if (this.singleDatePicker && isPlainDate(value)) {
      const date = toInternalDate(value as Dayjs | Date | string);
      start = end = date?.isValid() ? toExternalDate(date) : null;
    }
    if (!start && !end) {
      this.resetDates();
      this.updateView();
      return;
    }
    if (this.singleDatePicker) {
      this.setStartDate(start || end);
      this.setEndDate(start || end);
    } else {
      if (start) {
        this.setStartDate(start);
      }
      if (end) {
        this.setEndDate(end);
      } else if (this.allowEmptyEndDate) {
        this.clearEndDate();
      }
    }
    this.hasSelection = true;
    this.cachedVersion.start = this.startDate.clone();
    this.cachedVersion.end = this.endDate?.clone() ?? null;
    this.calculateChosenLabel();
    this.updateView();
  }

  /** Sets an applied empty end date (allowEmptyEndDate), like a value "from X". */
  clearEndDate(): void {
    this.endDate = null;
    this.emptyEndApplied = true;
  }

  /** Puts the picker back on today without emitting anything, for an empty value given by the app. */
  resetDates(): void {
    this.emptyEndApplied = false;
    this.startDate = dayjs().utc(true).startOf('day');
    this.endDate = dayjs().utc(true).endOf('day');
    this.hasSelection = false;
    this.fitDefaultDatesInBounds();
    this.alignSingleEndDate();
    this.cachedVersion.start = this.startDate.clone();
    this.cachedVersion.end = this.endDate.clone();
    // Otherwise a later locale or ranges change would show the old label again.
    this.chosenLabel = null;
  }

  /**
   * Find out if the selected range should be disabled if it doesn't
   * fit into minDate and maxDate limitations.
   */
  disableRange(range: string): boolean {
    if (range === this.locale.customRangeLabel) {
      return false;
    }
    const rangeMarkers = this.ranges[range];
    const areBothBefore = rangeMarkers.every((date) => {
      if (!this.minDate) {
        return false;
      }
      return date.isBefore(this.minDate);
    });

    const areBothAfter = rangeMarkers.every((date) => {
      if (!this.maxDate) {
        return false;
      }
      return date.isAfter(this.maxDate);
    });
    return areBothBefore || areBothAfter;
  }

  /**
   *
   * @param date the date to add time
   * @param side left or right
   */
  private getDateWithTime(date, side: SideEnum): dayjs.Dayjs {
    if (this.timepickerVariables[side]) {
      let hour = parseInt(String(this.timepickerVariables[side].selectedHour), 10);
      if (!this.timePicker24Hour) {
        const ampm = this.timepickerVariables[side].ampmModel;
        if (ampm === 'PM' && hour < 12) {
          hour += 12;
        }
        if (ampm === 'AM' && hour === 12) {
          hour = 0;
        }
      }
      const minute = parseInt(String(this.timepickerVariables[side].selectedMinute), 10);
      const second = this.timePickerSeconds ? parseInt(String(this.timepickerVariables[side].selectedSecond), 10) : 0;
      return date.clone().hour(hour).minute(minute).second(second);
    } else {
      return;
    }
  }

  /**
   *  build the locale config
   */
  /**
   * Dates leaving the inline component. The directive converts them itself, so it gets the internal dates.
   */
  private toOutput(date: Dayjs | null): Dayjs | null {
    return this.inline ? toExternalDate(date) : date;
  }

  /**
   * Merge a locale input with the global config. A dayjs `locale` provides the day and month names and the first day.
   */
  private resolveLocale(value: LocaleConfig): LocaleConfig {
    // Without a dayjs locale on the instance, the one from the global config gives the names (issue #519).
    const dayjsLocale = value.locale || this.localeHolderService.config.locale;
    if (!dayjsLocale) {
      return { ...this.localeHolderService.config, ...value };
    }
    const custom = { ...value };
    delete custom.daysOfWeek;
    delete custom.monthNames;
    delete custom.firstDay;
    return { ...this.localeHolderService.configWithLocale(dayjsLocale), ...custom };
  }

  /**
   * Weekday headers starting on `locale.firstDay`. `locale.daysOfWeek` itself always starts on Sunday.
   */
  private updateWeekDays(): void {
    this.locale.firstDay = this.locale.firstDay % 7;
    const days = [...this.locale.daysOfWeek];
    for (let i = 0; i < this.locale.firstDay; i++) {
      days.push(days.shift());
    }
    this.weekDays = days;
  }

  /**
   * Redraw everything that depends on the locale after it changed at runtime.
   */
  private refreshLocale(): void {
    this.buildLocale();
    this.updateWeekDays();
    this.renderRanges();
    this.updateView();
    this.updateElement();
    // A global config change comes from outside change detection; an OnPush parent would skip the redraw.
    this.ref.markForCheck();
  }

  private buildLocale() {
    this.localeHolder = this.resolveLocale(this.localeInput);
    if (!this.locale.format) {
      if (this.timePicker) {
        this.locale.format = dayjs.localeData().longDateFormat('lll');
      } else {
        this.locale.format = dayjs.localeData().longDateFormat('L');
      }
    }
  }

  private buildCells(calendar, side: SideEnum) {
    for (let row = 0; row < 6; row++) {
      this.calendarVariables[side].classes[row] = { classList: '' };
      const rowClasses = [];
      if (
        this.emptyWeekRowClass &&
        Array.from(Array(7).keys()).some((i) => calendar[row][i].month() !== this.calendarVariables[side].month)
      ) {
        rowClasses.push(this.emptyWeekRowClass);
      }
      for (let col = 0; col < 7; col++) {
        const classes = [];
        // empty week row class
        if (this.emptyWeekColumnClass) {
          if (calendar[row][col].month() !== this.calendarVariables[side].month) {
            classes.push(this.emptyWeekColumnClass);
          }
        }
        // highlight today's date
        if (calendar[row][col].isSame(dayjs().utc(true), 'day')) {
          classes.push('today');
        }
        // highlight weekends
        if (calendar[row][col].isoWeekday() > 5) {
          classes.push('weekend');
        }
        // grey out the dates in other months displayed at beginning and end of this calendar
        if (calendar[row][col].month() !== calendar[1][1].month()) {
          classes.push('off');

          // mark the last day of the previous month in this calendar
          if (
            this.lastDayOfPreviousMonthClass &&
            (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) &&
            calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth
          ) {
            classes.push(this.lastDayOfPreviousMonthClass);
          }

          // mark the first day of the next month in this calendar
          if (
            this.firstDayOfNextMonthClass &&
            (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) &&
            calendar[row][col].date() === 1
          ) {
            classes.push(this.firstDayOfNextMonthClass);
          }
        }
        // mark the first day of the current month with a custom class
        if (
          this.firstMonthDayClass &&
          calendar[row][col].month() === calendar[1][1].month() &&
          calendar[row][col].date() === calendar.firstDay.date()
        ) {
          classes.push(this.firstMonthDayClass);
        }
        // mark the last day of the current month with a custom class
        if (
          this.lastMonthDayClass &&
          calendar[row][col].month() === calendar[1][1].month() &&
          calendar[row][col].date() === calendar.lastDay.date()
        ) {
          classes.push(this.lastMonthDayClass);
        }
        // don't allow selection of dates before the minimum date
        if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
          classes.push('off', 'disabled');
        }
        // don't allow selection of dates after the maximum date
        if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
          classes.push('off', 'disabled');
        }
        // Consumer callbacks get real local dates, like the outputs (issue #455).
        const externalDate = toExternalDate(calendar[row][col]);
        // don't allow selection of date if a custom function decides it's invalid
        if (this.isInvalidDate(externalDate)) {
          classes.push('off', 'disabled', 'invalid');
        }
        // highlight the currently selected start date
        if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
          classes.push('active', 'start-date');
        }
        // highlight the currently selected end date
        // for singleDatePicker, don't add end-date class if it's the same as start date
        if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
          if (!this.singleDatePicker || this.endDate.format('YYYY-MM-DD') !== this.startDate.format('YYYY-MM-DD')) {
            classes.push('active', 'end-date');
          }
        }
        // highlight dates in-between the selected dates
        if (
          ((this.nowHoveredDate != null && this.pickingDate) || this.endDate != null) &&
          calendar[row][col] > this.startDate &&
          (calendar[row][col] < this.endDate || (calendar[row][col] < this.nowHoveredDate && this.pickingDate)) &&
          !classes.find((el) => el === 'off')
        ) {
          classes.push('in-range');
        }
        // apply custom classes for this date
        const isCustom = this.isCustomDate(externalDate);
        // Only strings and arrays are class names, booleans are ignored.
        if (typeof isCustom === 'string') {
          classes.push(isCustom);
        } else if (Array.isArray(isCustom)) {
          classes.push(...isCustom);
        }
        // apply custom tooltip for this date
        // const isTooltip = this.isTooltipDate(calendar[row][col]);
        // if (isTooltip) {
        //   if (typeof isTooltip === 'string') {
        //     this.tooltiptext[calendar[row][col]] = isTooltip; // setting tooltiptext for custom date
        //   } else {
        //     this.tooltiptext[calendar[row][col]] = 'Put the tooltip as the returned value of isTooltipDate';
        //   }
        // } else {
        //   this.tooltiptext[calendar[row][col]] = '';
        // }
        // store classes var
        let cname = '';
        let disabled = false;
        for (const className of classes) {
          cname += className + ' ';
          if (className === 'disabled') {
            disabled = true;
          }
        }
        if (!disabled) {
          cname += 'available';
        }
        this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
      }
      this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
    }
  }
}
