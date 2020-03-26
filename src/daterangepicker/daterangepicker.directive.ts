import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, EventEmitter, forwardRef, Input, KeyValueDiffers, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';
const moment = _moment;

@Directive({
  selector: 'input[ngxDaterangepickerMd]',
  host: {
    '(keyup.esc)': 'hide()',
    '(blur)': 'onBlur()',
    '(click)': 'open()',
    '(keyup)': 'inputChanged($event)'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerDirective), multi: true
    }
]
})
export class DaterangepickerDirective implements OnInit, OnChanges, OnDestroy {
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _validatorChange = Function.prototype;
  private _value: any;
  private overlayRef: OverlayRef;
  private componentRef: ComponentRef<DaterangepickerComponent>;
  
  @Input()
  minDate: _moment.Moment
  @Input()
  maxDate: _moment.Moment
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
  isInvalidDate: Function;
  @Input()
  isCustomDate: Function;
  @Input()
  isTooltipDate: Function;
  @Input()
  showClearButton: boolean;
  @Input()
  customRangeDirection: boolean;
  @Input()
  ranges: any;
  @Input()
  opens = 'auto';
  @Input()
  drops = 'down';
  firstMonthDayClass: string;
  @Input()
  lastMonthDayClass: string;
  @Input()
  emptyWeekRowClass: string;
  @Input()
  firstDayOfNextMonthClass: string;
  @Input()
  lastDayOfPreviousMonthClass: string;
  @Input()
  keepCalendarOpeningWithRange: boolean;
  @Input()
  showRangeLabelOnInput: boolean;
  @Input()
  showCancel: boolean = false;
  @Input()
  lockStartDate: boolean = false;
  // timepicker variables
  @Input()
  timePicker: Boolean = false;
  @Input()
  timePicker24Hour: Boolean = false;
  @Input()
  timePickerIncrement: number = 1;
  @Input()
  timePickerSeconds: Boolean = false;
  @Input() closeOnAutoApply = true;
  _locale: LocaleConfig = {};
  @Input() set locale(value) {
    this._locale = {...this._localeService.config, ...value};
  }
  get locale(): any {
    return this._locale;
  }
  @Input()
  private _endKey: string = 'endDate';
  private _startKey: string = 'startDate';
  @Input() set startKey(value) {
    if (value !== null) {
      this._startKey = value;
    } else {
      this._startKey = 'startDate';
    }
  }
  @Input() set endKey(value) {
    if (value !== null) {
      this._endKey = value;
    } else {
      this._endKey = 'endDate';
    }
  }
  notForChangesProperty: Array<string> = [
    'locale',
    'endKey',
    'startKey'
  ];

  get value() {
    return this._value || null;
  }
  set value(val) {
    this._value = val;
    this._onChange(val);
    this._changeDetectorRef.markForCheck();
  }

  @Output('change') onChange: EventEmitter<Object> = new EventEmitter();
  @Output('rangeClicked') rangeClicked: EventEmitter<Object> = new EventEmitter();
  @Output('datesUpdated') datesUpdated: EventEmitter<Object> = new EventEmitter();
  @Output() startDateChanged: EventEmitter<Object> = new EventEmitter();
  @Output() endDateChanged: EventEmitter<Object> = new EventEmitter();

  destroy$ = new Subject();

  constructor(
    public viewContainerRef: ViewContainerRef,
    public _changeDetectorRef: ChangeDetectorRef,
    private _el: ElementRef,
    private differs: KeyValueDiffers,
    private _localeService: LocaleService,
    private elementRef: ElementRef,
    private overlay: Overlay
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void  {
    for (const change in changes) {
      if (changes.hasOwnProperty(change)) {
        if (this.componentRef && this.notForChangesProperty.indexOf(change) === -1) {
          this.componentRef[change] = changes[change].currentValue;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onBlur(): void {
    this._onTouched();
  }

  open(): void {
    if(this.overlayRef) {
      this.hide();
    }

    // TO-DO: implement this.drops and this.opens!
    this.overlayRef = this.overlay.create({
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.overlay.position().connectedTo(this.elementRef.nativeElement, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
    });
    const dateRangePickerPortal = new ComponentPortal(DaterangepickerComponent);
    this.componentRef = this.overlayRef.attach(dateRangePickerPortal);

    // Assign all inputs
    this.componentRef.instance.showCancel = this.showCancel;
    this.componentRef.instance.showClearButton = this.showClearButton;
    this.componentRef.instance.showDropdowns = this.showDropdowns;
    this.componentRef.instance.lockStartDate = this.lockStartDate;
    this.componentRef.instance.customRangeDirection = this.customRangeDirection;
    this.componentRef.instance.firstMonthDayClass = this.firstMonthDayClass;
    this.componentRef.instance.lastMonthDayClass = this.lastMonthDayClass;
    this.componentRef.instance.emptyWeekRowClass = this.emptyWeekRowClass;
    this.componentRef.instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
    this.componentRef.instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
    this.componentRef.instance.drops = this.drops;
    this.componentRef.instance.opens = this.opens;
    this.componentRef.instance.closeOnAutoApply = this.closeOnAutoApply;

    this.componentRef.instance.timePicker = this.timePicker;
    this.componentRef.instance.timePicker24Hour = this.timePicker24Hour;
    this.componentRef.instance.timePickerIncrement = this.timePickerIncrement;
    this.componentRef.instance.timePickerSeconds = this.timePickerSeconds
    this.componentRef.instance.closeOnAutoApply = this.closeOnAutoApply;
    
    const localeDiffer = this.differs.find(this.locale).create();
    if (localeDiffer) {
      const changes = localeDiffer.diff(this.locale);
      if (changes) {
        this.componentRef.instance.updateLocale(this.locale);
      }
    }

    // Subscribe to all outputs
    this.componentRef.instance.startDateChanged.asObservable().pipe(takeUntil(this.destroy$)).subscribe((itemChanged: { startDate: _moment.Moment }) => {
      this.startDateChanged.emit(itemChanged);
    });

    this.componentRef.instance.endDateChanged.asObservable().pipe(takeUntil(this.destroy$)).subscribe((itemChanged: any) => {
      this.endDateChanged.emit(itemChanged);
    });

    this.componentRef.instance.rangeClicked.asObservable().pipe(takeUntil(this.destroy$)).subscribe((range: any) => {
      this.rangeClicked.emit(range);
    });

    this.componentRef.instance.datesUpdated.asObservable().pipe(takeUntil(this.destroy$)).subscribe((range: any) => {
      this.datesUpdated.emit(range);
    });

    this.componentRef.instance.chosenDate.asObservable().pipe(takeUntil(this.destroy$)).subscribe((change: any) => {
      if (change) {
        const value = {};
        value[this._startKey] = change.startDate;
        value[this._endKey] = change.endDate;
        this.value = value;
        this.onChange.emit(value);
        if (typeof change.chosenLabel === 'string') {
          this._el.nativeElement.value = change.chosenLabel;
        }

        this.hide();
      }
    });
    
    // Close the DateRangePicker when the backdrop is clicked
    this.overlayRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.hide();
    });
  }

  hide(): void {
    if(this.overlayRef) {
      this.overlayRef.dispose();
      this.destroy$.next();
      this.overlayRef = null;
      this.componentRef = null;
    }
  }

  toggle(): void {
    if (this.overlayRef) {
      this.hide();
    } else {
      this.open();
    }
  }

  clear(): void {
    if(this.componentRef) {
      this.componentRef.instance.clear();
    }
  }

  writeValue(value): void {
    this.setValue(value);
  }

  registerOnChange(fn): void {
    this._onChange = fn;
  }

  registerOnTouched(fn): void {
    this._onTouched = fn;
  }

  private setValue(val: any): void {
    if(this.componentRef) {
      if (val) {
        this.value = val;
        if (val[this._startKey]) {
          this.componentRef.instance.setStartDate(val[this._startKey]);
        }
        if (val[this._endKey]) {
          this.componentRef.instance.setEndDate(val[this._endKey]);
        }
        this.componentRef.instance.calculateChosenLabel();
        if (this.componentRef.instance.chosenLabel) {
          this._el.nativeElement.value = this.componentRef.instance.chosenLabel;
        }
      } else {
        this.componentRef.instance.clear();
      }
    }
  }
  
  inputChanged(e): void {
    if (e.target.tagName.toLowerCase() !== 'input') {
      return;
    }
    
    if (!e.target.value.length) {
      return;
    }

    if(this.componentRef) {
      const dateString = e.target.value.split(this.componentRef.instance.locale.separator);
      let start = null, end = null;
      if (dateString.length === 2) {
        start = moment(dateString[0], this.componentRef.instance.locale.format);
        end = moment(dateString[1], this.componentRef.instance.locale.format);
      }
      if (this.singleDatePicker || start === null || end === null) {
        start = moment(e.target.value, this.componentRef.instance.locale.format);
        end = start;
      }
      if (!start.isValid() || !end.isValid()) {
        return;
      }
      this.componentRef.instance.setStartDate(start);
      this.componentRef.instance.setEndDate(end);
      this.componentRef.instance.updateView();
    }

  }
}
