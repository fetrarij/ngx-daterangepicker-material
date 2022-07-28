import {
  Directive,
  ViewContainerRef,
  ElementRef,
  HostListener,
  forwardRef,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  DoCheck,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
  EventEmitter,
  Renderer2,
  HostBinding
} from '@angular/core';
import { ChosenDate, DateRange, DaterangepickerComponent, DateRanges, EndDate, StartDate, TimePeriod } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs from 'dayjs';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[ngxDaterangepickerMd]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerDirective),
      multi: true
    }
  ]
})
// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
export class DaterangepickerDirective implements OnInit, OnChanges, DoCheck {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix,@angular-eslint/no-output-native,@angular-eslint/no-output-rename
  @Output('change') onChange: EventEmitter<TimePeriod | null> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('rangeClicked') rangeClicked: EventEmitter<DateRange> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('datesUpdated') datesUpdated: EventEmitter<TimePeriod> = new EventEmitter();
  @Output() startDateChanged: EventEmitter<StartDate> = new EventEmitter();
  @Output() endDateChanged: EventEmitter<EndDate> = new EventEmitter();
  @Output() clearClicked: EventEmitter<void> = new EventEmitter();

  @Input()
  minDate: dayjs.Dayjs;

  @Input()
  maxDate: dayjs.Dayjs;

  @Input()
  autoApply: boolean;

  @Input()
  alwaysShowCalendars: boolean;

  @Input()
  showCustomRangeLabel: boolean;

  @Input()
  linkedCalendars: boolean;

  @Input()
  dateLimit: number = null;

  @Input()
  singleDatePicker: boolean;

  @Input()
  showWeekNumbers: boolean;

  @Input()
  showISOWeekNumbers: boolean;

  @Input()
  showDropdowns: boolean;

  @Input()
  isInvalidDate: (Dayjs) => boolean;

  @Input()
  isCustomDate: (Dayjs) => string | boolean;

  @Input()
  isTooltipDate: (Dayjs) => string | boolean | null;

  @Input()
  showClearButton: boolean;

  @Input()
  customRangeDirection: boolean;

  @Input()
  ranges: DateRanges;

  @Input()
  opens: string;

  @Input()
  drops: string;

  @Input()
  firstMonthDayClass: string;

  @Input()
  lastMonthDayClass: string;

  @Input()
  emptyWeekRowClass: string;

  @Input()
  emptyWeekColumnClass: string;

  @Input()
  firstDayOfNextMonthClass: string;

  @Input()
  lastDayOfPreviousMonthClass: string;

  @Input()
  keepCalendarOpeningWithRange: boolean;

  @Input()
  showRangeLabelOnInput: boolean;

  @Input()
  showCancel = false;

  @Input()
  lockStartDate = false;

  // timepicker variables
  @Input()
  timePicker = false;

  @Input()
  timePicker24Hour = false;

  @Input()
  timePickerIncrement = 1;

  @Input()
  timePickerSeconds = false;

  @Input() closeOnAutoApply = true;
  @Input()
  private endKeyHolder: string;

  public picker: DaterangepickerComponent;
  private startKeyHolder: string;
  private notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey'];
  private onChangeFn = Function.prototype;
  private onTouched = Function.prototype;
  private validatorChange = Function.prototype;
  private disabledHolder: boolean;
  private valueHolder: TimePeriod | null;
  private localeDiffer: KeyValueDiffer<string, any>;
  private localeHolder: LocaleConfig = {};

  constructor(
    public viewContainerRef: ViewContainerRef,
    public ref: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private differs: KeyValueDiffers,
    private localeHolderService: LocaleService,
    private elementRef: ElementRef
  ) {
    this.endKey = 'endDate';
    this.startKey = 'startDate';
    this.drops = 'down';
    this.opens = 'auto';
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(DaterangepickerComponent);
    this.picker = componentRef.instance as DaterangepickerComponent;
    this.picker.inline = false; // set inline to false for all directive usage
  }

  @HostBinding('disabled') get disabled(): boolean {
    return this.disabledHolder;
  }

  @Input() set startKey(value: string) {
    if (value !== null) {
      this.startKeyHolder = value;
    } else {
      this.startKeyHolder = 'startDate';
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get locale(): LocaleConfig {
    return this.localeHolder;
  }

  @Input() set locale(value: LocaleConfig) {
    this.localeHolder = { ...this.localeHolderService.config, ...value };
  }

  @Input() set endKey(value: string) {
    if (value !== null) {
      this.endKeyHolder = value;
    } else {
      this.endKeyHolder = 'endDate';
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get value(): TimePeriod | null {
    return this.valueHolder || null;
  }

  set value(val: TimePeriod | null) {
    this.valueHolder = val;
    this.onChangeFn(val);
    this.ref.markForCheck();
  }

  /**
   * For click outside the calendar's container
   *
   * @param event event object
   */
  @HostListener('document:click', ['$event'])
  outsideClick(event: Event): void {
    if (!event.target) {
      return;
    }

    if ((event.target as HTMLElement).classList.contains('ngx-daterangepicker-action')) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  @HostListener('keyup.esc', ['$event'])
  hide(e?: Event): void {
    this.picker.hide(e);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  @HostListener('keyup', ['$event'])
  inputChanged(e: KeyboardEvent): void {
    if ((e.target as HTMLElement).tagName.toLowerCase() !== 'input') {
      return;
    }
    if (!(e.target as HTMLInputElement).value.length) {
      return;
    }
    const dateString = (e.target as HTMLInputElement).value.split(this.picker.locale.separator);
    let start = null;
    let end = null;
    if (dateString.length === 2) {
      start = dayjs(dateString[0], this.picker.locale.format);
      end = dayjs(dateString[1], this.picker.locale.format);
    }
    if (this.singleDatePicker || start === null || end === null) {
      start = dayjs((e.target as HTMLInputElement).value, this.picker.locale.format);
      end = start;
    }
    if (!start.isValid() || !end.isValid()) {
      return;
    }
    this.picker.setStartDate(start);
    this.picker.setEndDate(end);
    this.picker.updateView();
  }

  @HostListener('click', ['$event'])
  open(event?: Event): void {
    if (this.disabled) {
      return;
    }
    this.picker.show(event);
    setTimeout(() => {
      this.setPosition();
    });
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnInit(): void {
    this.picker.startDateChanged.asObservable().subscribe((itemChanged: StartDate) => {
      this.startDateChanged.emit(itemChanged);
    });
    this.picker.endDateChanged.asObservable().subscribe((itemChanged: EndDate) => {
      this.endDateChanged.emit(itemChanged);
    });
    this.picker.rangeClicked.asObservable().subscribe((range: DateRange) => {
      this.rangeClicked.emit(range);
    });
    this.picker.datesUpdated.asObservable().subscribe((range: TimePeriod) => {
      this.datesUpdated.emit(range);
    });
    this.picker.clearClicked.asObservable().subscribe(() => {
      this.clearClicked.emit();
    });
    this.picker.choosedDate.asObservable().subscribe((change: ChosenDate) => {
      if (change) {
        const value = {
          [this.startKeyHolder]: change.startDate,
          [this.endKeyHolder]: change.endDate
        };
        this.value = value as TimePeriod;
        this.onChange.emit(value as TimePeriod);
        if (typeof change.chosenLabel === 'string') {
          this.el.nativeElement.value = change.chosenLabel;
        }
      }
    });
    this.picker.firstMonthDayClass = this.firstMonthDayClass;
    this.picker.lastMonthDayClass = this.lastMonthDayClass;
    this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
    this.picker.emptyWeekColumnClass = this.emptyWeekColumnClass;
    this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
    this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
    this.picker.drops = this.drops;
    this.picker.opens = this.opens;
    this.localeDiffer = this.differs.find(this.locale).create();
    this.picker.closeOnAutoApply = this.closeOnAutoApply;
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, change)) {
        if (this.notForChangesProperty.indexOf(change) === -1) {
          this.picker[change] = changes[change].currentValue;
        }
      }
    }
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngDoCheck(): void {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.locale);
      if (changes) {
        this.picker.updateLocale(this.locale);
      }
    }
  }

  toggle(e?: Event): void {
    if (this.picker.isShown) {
      this.hide(e);
    } else {
      this.open(e);
    }
  }

  clear(): void {
    this.picker.clear();
  }

  writeValue(value: TimePeriod): void {
    this.setValue(value);
  }

  registerOnChange(fn: () => TimePeriod | null): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    this.disabledHolder = state;
  }

  /**
   * Set position of the calendar
   */
  setPosition(): void {
    let style;
    let containerTop;
    const container = this.picker.pickerContainer.nativeElement;
    const element = this.el.nativeElement;
    if (this.drops && this.drops === 'up') {
      containerTop = element.offsetTop - container.clientHeight + 'px';
    } else {
      containerTop = 'auto';
    }
    if (this.opens === 'left') {
      style = {
        top: containerTop,
        left: element.offsetLeft - container.clientWidth + element.clientWidth + 'px',
        right: 'auto'
      };
    } else if (this.opens === 'center') {
      style = {
        top: containerTop,
        left: element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2 + 'px',
        right: 'auto'
      };
    } else if (this.opens === 'right') {
      style = {
        top: containerTop,
        left: element.offsetLeft + 'px',
        right: 'auto'
      };
    } else {
      const position = element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2;
      if (position < 0) {
        style = {
          top: containerTop,
          left: element.offsetLeft + 'px',
          right: 'auto'
        };
      } else {
        style = {
          top: containerTop,
          left: position + 'px',
          right: 'auto'
        };
      }
    }
    if (style) {
      this.renderer.setStyle(container, 'top', style.top);
      this.renderer.setStyle(container, 'left', style.left);
      this.renderer.setStyle(container, 'right', style.right);
    }
  }

  private setValue(val: TimePeriod) {
    if (val) {
      this.value = val;
      if (val[this.startKeyHolder]) {
        this.picker.setStartDate(val[this.startKeyHolder]);
      }
      if (val[this.endKeyHolder]) {
        this.picker.setEndDate(val[this.endKeyHolder]);
      }
      this.picker.calculateChosenLabel();
      if (this.picker.chosenLabel) {
        this.el.nativeElement.value = this.picker.chosenLabel;
      }
    } else {
      this.picker.clear();
    }
  }
}
