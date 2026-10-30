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
  booleanAttribute,
  ComponentRef,
  Inject,
  NgZone,
  OnDestroy,
  effect,
  untracked
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ChosenDate, DateRange, DaterangepickerComponent, DateRanges, EndDate, StartDate, TimePeriod } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs/esm';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';
import { isPlainDate, parseDate, toExternalDate, toInternalDate } from './external-date';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[ngxDaterangepickerMd]',
  exportAs: 'ngxDaterangepickerMd',
  standalone: false,
  host: { '[disabled]': 'disabled' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerDirective),
      multi: true
    }
  ]
})
// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
export class DaterangepickerDirective implements OnInit, OnChanges, DoCheck, OnDestroy {
  /**
   * @deprecated Use `(dateChange)`. `(change)` also gets the native change event of the input (issue #344).
   * It will be removed in v23.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix,@angular-eslint/no-output-native,@angular-eslint/no-output-rename
  @Output('change') onChange: EventEmitter<TimePeriod | null> = new EventEmitter();
  @Output() dateChange: EventEmitter<TimePeriod> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('rangeClicked') rangeClicked: EventEmitter<DateRange> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('datesUpdated') datesUpdated: EventEmitter<TimePeriod> = new EventEmitter();
  @Output() startDateChanged: EventEmitter<StartDate> = new EventEmitter();
  @Output() endDateChanged: EventEmitter<EndDate> = new EventEmitter();
  @Output() clearClicked: EventEmitter<void> = new EventEmitter();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter();
  @Output() customRangeClicked: EventEmitter<void> = new EventEmitter();

  @Input()
  minDate: dayjs.Dayjs | Date | string;

  @Input()
  maxDate: dayjs.Dayjs | Date | string;

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
  isInvalidDate: (date: Dayjs) => boolean;

  @Input()
  isCustomDate: (date: Dayjs) => string | string[] | boolean;

  @Input()
  isTooltipDate: (date: Dayjs) => string | boolean | null;

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

  // Apply can keep the end date empty, for an open range like "from X" (issue #502).
  @Input()
  allowEmptyEndDate = false;

  // timepicker variables
  @Input()
  timePicker = false;

  @Input()
  timePicker24Hour = false;

  @Input()
  timePickerIncrement = 1;

  @Input()
  timePickerSeconds = false;

  @Input()
  initialDates: [string | dayjs.Dayjs, string | dayjs.Dayjs];

  @Input() closeOnAutoApply = true;
  // Moves the calendar to <body>, so a parent with overflow: hidden (like mat-form-field) cannot clip it (issue #565).
  @Input() appendToBody = false;
  @Input()
  private endKeyHolder: string;

  public picker: DaterangepickerComponent;
  private startKeyHolder: string;
  private notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey', 'initialDates', 'appendToBody', 'disabled'];
  private onChangeFn = Function.prototype;
  private onTouched = Function.prototype;
  private validatorChange = Function.prototype;
  private disabledHolder: boolean;
  private valueHolder: TimePeriod | null;
  private localeDiffer: KeyValueDiffer<string, any>;
  // The [locale] input as given; the global config is merged in when read, so it can change (issue #519).
  private localeInput: LocaleConfig = {};
  private componentRef: ComponentRef<DaterangepickerComponent>;
  private resizeObserver: ResizeObserver | null = null;
  private stopWindowListeners: (() => void) | null = null;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public ref: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private differs: KeyValueDiffers,
    private localeHolderService: LocaleService,
    private elementRef: ElementRef,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.endKey = 'endDate';
    this.startKey = 'startDate';
    this.drops = 'down';
    this.opens = 'auto';
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent(DaterangepickerComponent);
    this.picker = this.componentRef.instance as DaterangepickerComponent;
    this.picker.inline = false; // set inline to false for all directive usage
    let seenConfig = untracked(this.localeHolderService.configChanges);
    effect(() => {
      const config = this.localeHolderService.configChanges();
      if (config !== seenConfig && this.localeDiffer) {
        untracked(() => this.refreshLocale());
      }
      seenConfig = config;
    });
  }

  get disabled(): boolean {
    return this.disabledHolder;
  }

  // Without this input the host binding wins over [disabled] when there is no form (issue #428).
  @Input({ transform: booleanAttribute }) set disabled(value: boolean) {
    this.setDisabledState(value);
  }

  @Input() set startKey(value: string) {
    if (value !== null) {
      this.startKeyHolder = value;
    } else {
      this.startKeyHolder = 'startDate';
    }
  }

  get locale(): LocaleConfig {
    return { ...this.localeHolderService.config, ...this.localeInput };
  }

  @Input() set locale(value: LocaleConfig) {
    this.localeInput = value || {};
  }

  @Input() set endKey(value: string) {
    if (value !== null) {
      this.endKeyHolder = value;
    } else {
      this.endKeyHolder = 'endDate';
    }
  }

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

    // composedPath() sees inside shadow roots, where event.target is only the shadow host.
    const path = event.composedPath();

    // Also matches clicks on children of the action element, like an icon's svg.
    if (path.some((node) => node instanceof Element && node.classList.contains('ngx-daterangepicker-action'))) {
      return;
    }

    if (!path.includes(this.elementRef.nativeElement)) {
      this.hide();
    }
  }

  @HostListener('keyup.esc', ['$event'])
  hide(e?: Event): void {
    const wasShown = this.picker.isShown;
    this.picker.hide(e);
    if (wasShown) {
      this.writeAppliedValue();
    }
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  @HostListener('keyup', ['$event'])
  inputChanged(e: KeyboardEvent): void {
    // Enter applies a valid typed value; closing without it brings the applied value back (issue #172).
    if (this.readTypedValue(e) && e.key === 'Enter') {
      this.picker.clickApply();
      this.picker.hide();
    }
  }

  // Paste, autofill and scripts change the text without a key (issue #553). The value is still applied with Enter.
  @HostListener('input', ['$event'])
  inputEdited(e: Event): void {
    this.readTypedValue(e);
  }

  @HostListener('click', ['$event'])
  open(event?: Event): void {
    if (this.disabled) {
      return;
    }
    this.placePickerHost();
    this.picker.show(event);
    setTimeout(() => {
      this.setPosition();
      this.watchPosition();
    });
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnInit(): void {
    if (this.initialDates) {
      this.picker.initialDates = this.initialDates;
    }
    this.picker.startDateChanged.asObservable().subscribe((itemChanged: StartDate) => {
      this.startDateChanged.emit({ startDate: toExternalDate(itemChanged.startDate) });
    });
    this.picker.endDateChanged.asObservable().subscribe((itemChanged: EndDate) => {
      this.endDateChanged.emit({ endDate: toExternalDate(itemChanged.endDate) });
    });
    this.picker.rangeClicked.asObservable().subscribe((range: DateRange) => {
      this.rangeClicked.emit({
        label: range.label,
        dates: [toExternalDate(range.dates[0]), toExternalDate(range.dates[1])]
      });
    });
    this.picker.datesUpdated.asObservable().subscribe((range: TimePeriod) => {
      this.datesUpdated.emit({
        [this.startKeyHolder]: toExternalDate(range.startDate),
        [this.endKeyHolder]: toExternalDate(range.endDate)
      } as TimePeriod);
    });
    this.picker.cancelClicked.asObservable().subscribe(() => {
      this.writeAppliedValue();
      this.cancelClicked.emit();
    });
    this.picker.customRangeClicked.asObservable().subscribe(() => this.customRangeClicked.emit());
    this.picker.clearClicked.asObservable().subscribe(() => {
      this.clearClicked.emit();
    });
    this.picker.choosedDate.asObservable().subscribe((change: ChosenDate) => {
      if (change) {
        const value = {
          [this.startKeyHolder]: toExternalDate(change.startDate),
          [this.endKeyHolder]: toExternalDate(change.endDate)
        };
        this.value = value as TimePeriod;
        this.onChange.emit(value as TimePeriod);
        this.dateChange.emit(value as TimePeriod);
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
    this.localeDiffer = this.differs.find(this.localeInput).create();
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
    // The picker recomputes its label for new ranges; show it like a locale change does (issue #388).
    if (changes['ranges'] && !changes['ranges'].firstChange && this.hasDates(this.value) && this.picker.chosenLabel) {
      this.el.nativeElement.value = this.picker.chosenLabel;
    }
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngDoCheck(): void {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.localeInput);
      if (changes) {
        this.refreshLocale();
      }
    }
  }

  ngOnDestroy(): void {
    this.unwatchPosition();
    const host = this.componentRef.location.nativeElement;
    if (host.parentNode === this.document.body) {
      this.renderer.removeChild(this.document.body, host);
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
    if (state) {
      this.hide();
    }
  }

  // Gives the picker the new locale, then shows the text again in that locale.
  private refreshLocale(): void {
    this.picker.updateLocale(this.localeInput);
    if (this.hasDates(this.value)) {
      // [formField] writes the value before the first locale is set, so the label is rebuilt here.
      this.picker.calculateChosenLabel();
    }
    if (this.hasDates(this.value) && this.picker.chosenLabel) {
      this.el.nativeElement.value = this.picker.chosenLabel;
    }
  }

  /**
   * Set position of the calendar
   */
  setPosition(): void {
    const container: HTMLElement = this.picker.pickerContainer.nativeElement;
    const element: HTMLElement = this.el.nativeElement;
    // Set first: the width is measured in the final layout.
    this.renderer.setStyle(container, 'position', this.appendToBody ? 'fixed' : '');
    // The -10px margin from the styles assumes the in-flow position; with appendToBody, start right under the input.
    this.renderer.setStyle(container, 'margin-top', this.appendToBody ? '0' : '');
    // Viewport coordinates: they stay right when a parent is scrolled (issue #466).
    const input = element.getBoundingClientRect();
    const width = container.offsetWidth;
    // Align with the border box: clientWidth leaves out the input borders.
    let left: number;
    if (this.opens === 'left') {
      left = input.right - width;
    } else if (this.opens === 'center') {
      left = input.left + input.width / 2 - width / 2;
    } else if (this.opens === 'right') {
      left = input.left;
    } else {
      left = input.left + input.width / 2 - width / 2;
      if (left < 0) {
        left = input.left;
      }
    }
    // Keep the calendar inside the window (issue #542).
    const viewportWidth = this.document.documentElement.clientWidth;
    left = Math.max(0, Math.min(left, viewportWidth - width));

    const dropsUp = this.drops === 'up' || (this.drops === 'auto' && this.lacksRoomBelow(input, container));
    if (this.drops === 'auto') {
      // The template class says "auto": set the real direction for the opening animation.
      this.renderer[dropsUp ? 'addClass' : 'removeClass'](container, `drops-up-${this.opens}`);
      this.renderer[dropsUp ? 'removeClass' : 'addClass'](container, `drops-down-${this.opens}`);
    }

    let top: number | null = null;
    if (dropsUp) {
      top = input.top - container.offsetHeight;
    } else if (this.appendToBody) {
      top = input.bottom;
    }

    const origin = this.containerOrigin(container);
    this.renderer.setStyle(container, 'top', top === null ? 'auto' : top - origin.y + 'px');
    this.renderer.setStyle(container, 'left', left - origin.x + 'px');
    this.renderer.setStyle(container, 'right', 'auto');
  }

  // With drops="auto", open up when the calendar does not fit below the input and there is more room above (issue #136).
  private lacksRoomBelow(input: DOMRect, container: HTMLElement): boolean {
    const below = this.document.documentElement.clientHeight - input.bottom;
    return container.offsetHeight > below && input.top > below;
  }

  // Where the calendar's containing block starts, in viewport coordinates, so top and left can be converted to it.
  private containerOrigin(container: HTMLElement): { x: number; y: number } {
    if (this.appendToBody) {
      return { x: 0, y: 0 };
    }
    const view = this.document.defaultView;
    for (let parent = container.parentElement; parent; parent = parent.parentElement) {
      const style = view.getComputedStyle(parent);
      if (style.position !== 'static' || style.transform !== 'none') {
        if (parent === this.document.body || parent === this.document.documentElement) {
          break;
        }
        const rect = parent.getBoundingClientRect();
        return {
          x: rect.left + parent.clientLeft - parent.scrollLeft,
          y: rect.top + parent.clientTop - parent.scrollTop
        };
      }
    }
    // No positioned parent: the calendar is placed relative to the page.
    return { x: -view.scrollX, y: -view.scrollY };
  }

  // Puts the calendar under <body> with appendToBody, or back next to the input without it.
  private placePickerHost(): void {
    const host = this.componentRef.location.nativeElement;
    const element = this.el.nativeElement;
    if (this.appendToBody && host.parentNode !== this.document.body) {
      this.renderer.appendChild(this.document.body, host);
    } else if (!this.appendToBody && host.parentNode === this.document.body && element.parentNode) {
      this.renderer.insertBefore(element.parentNode, host, element.nextSibling);
    }
  }

  // While open, follow size changes (Custom range, issue #385) and, with appendToBody, scrolling.
  private watchPosition(): void {
    this.unwatchPosition();
    const view = this.document.defaultView;
    if (!this.picker.isShown || !view) {
      return;
    }
    // Outside Angular: moving the calendar needs no change detection.
    this.zone.runOutsideAngular(() => {
      const update = (): void => (this.picker.isShown ? this.setPosition() : this.unwatchPosition());
      if (typeof view.ResizeObserver !== 'undefined') {
        this.resizeObserver = new view.ResizeObserver(update);
        this.resizeObserver.observe(this.picker.pickerContainer.nativeElement);
      }
      if (this.appendToBody) {
        // Capture also catches the scroll of any parent, not only of the page.
        view.addEventListener('scroll', update, true);
        view.addEventListener('resize', update);
        this.stopWindowListeners = () => {
          view.removeEventListener('scroll', update, true);
          view.removeEventListener('resize', update);
        };
      }
    });
  }

  private unwatchPosition(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.stopWindowListeners?.();
    this.stopWindowListeners = null;
  }

  // Shows a valid typed date range in the calendar. Returns false when the text is not a valid date.
  private readTypedValue(e: Event): boolean {
    const target = e.target as HTMLInputElement;
    if (target.tagName.toLowerCase() !== 'input' || !target.value.length) {
      return false;
    }
    const { format, separator, locale } = this.picker.locale;
    const dateString = target.value.split(separator);
    let start = null;
    let end = null;
    if (dateString.length === 2) {
      start = parseDate(dateString[0], format, locale);
      end = parseDate(dateString[1], format, locale);
    }
    if (this.singleDatePicker || start === null || end === null) {
      start = parseDate(target.value, format, locale);
      end = start;
    }
    if (!start.isValid() || !end.isValid()) {
      return false;
    }
    this.picker.setStartDate(start);
    this.picker.setEndDate(end);
    this.picker.updateView();
    return true;
  }

  private setValue(value: TimePeriod) {
    let val = value;
    // In single mode a plain date (dayjs, Date or ISO string) is read as the start and the end (issue #141).
    if (this.picker.singleDatePicker && isPlainDate(value)) {
      const date = toInternalDate(value);
      if (date?.isValid()) {
        val = { [this.startKeyHolder]: toExternalDate(date), [this.endKeyHolder]: toExternalDate(date) } as TimePeriod;
      }
    }
    if (this.hasDates(val)) {
      this.value = val;
      if (this.picker.singleDatePicker) {
        // One date: the end is the start, else it stays on today and the calendar draws a range (issue #537).
        const date = val[this.startKeyHolder] || val[this.endKeyHolder];
        this.picker.setStartDate(date);
        this.picker.setEndDate(date);
      } else {
        if (val[this.startKeyHolder]) {
          this.picker.setStartDate(val[this.startKeyHolder]);
        }
        if (val[this.endKeyHolder]) {
          this.picker.setEndDate(val[this.endKeyHolder]);
        } else if (this.allowEmptyEndDate) {
          this.picker.clearEndDate();
        }
      }
      this.picker.calculateChosenLabel();
      if (this.picker.chosenLabel) {
        this.el.nativeElement.value = this.picker.chosenLabel;
      }
    } else {
      // null or a value without dates, like { startDate: null, endDate: null }, shows nothing (issue #311).
      // No emit here: a written value must not come back as a change, and two inputs on one model would loop.
      this.valueHolder = val || null;
      this.picker.resetDates();
      this.el.nativeElement.value = '';
    }
  }

  // After closing without Apply, the input shows the applied value again instead of the typed text (issue #172).
  private writeAppliedValue(): void {
    if (!this.picker.autoUpdateInput) {
      return;
    }
    if (this.hasDates(this.value)) {
      this.picker.calculateChosenLabel();
      this.el.nativeElement.value = this.picker.chosenLabel ?? '';
    } else {
      this.el.nativeElement.value = '';
    }
  }

  // False for null and for a value without dates, like the one emitted by Clear.
  private hasDates(val: TimePeriod | null): boolean {
    return !!val && !!(val[this.startKeyHolder] || val[this.endKeyHolder]);
  }
}
