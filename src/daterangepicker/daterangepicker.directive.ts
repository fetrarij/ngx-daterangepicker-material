import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    KeyValueDiffers,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';

@Directive({
    selector: 'input[ngxDaterangepickerMd]',
    host: {
        '(keyup.esc)': 'hide()',
        '(blur)': 'onBlur()',
        '(click)': 'open()',
        '(keyup)': 'inputChanged($event)',
        autocomplete: 'off',
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DaterangepickerDirective),
            multi: true,
        },
    ],
})
export class DaterangepickerDirective implements OnInit, OnChanges, OnDestroy {
    private _onChange = Function.prototype;
    private _onTouched = Function.prototype;
    private _validatorChange = Function.prototype;
    private _value: any;
    private overlayRef: OverlayRef;
    private componentRef: ComponentRef<DaterangepickerComponent>;

    @Input()
    minDate: moment.Moment;
    @Input()
    maxDate: moment.Moment;
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
    isInvalidDate = (date: moment.Moment) => false;
    @Input()
    isCustomDate = (date: moment.Moment) => false;
    @Input()
    isTooltipDate = (date: moment.Moment) => null;
    @Input()
    showClearButton: boolean;
    @Input()
    customRangeDirection: boolean;
    @Input()
    ranges = {};
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
    _locale: LocaleConfig = {};
    @Input() set locale(value) {
        this._locale = { ...this._localeService.config, ...value };
    }
    get locale(): any {
        return this._locale;
    }
    @Input()
    private _endKey = 'endDate';
    private _startKey = 'startDate';
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
    notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey'];

    get value() {
        return this._value || null;
    }
    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }

    @Output('change') onChange: EventEmitter<{ startDate: moment.Moment; endDate: moment.Moment }> = new EventEmitter();
    @Output('rangeClicked') rangeClicked: EventEmitter<{ label: string; dates: [moment.Moment, moment.Moment] }> = new EventEmitter();
    @Output('datesUpdated') datesUpdated: EventEmitter<{ startDate: moment.Moment; endDate: moment.Moment }> = new EventEmitter();
    @Output() startDateChanged: EventEmitter<{ startDate: moment.Moment }> = new EventEmitter();
    @Output() endDateChanged: EventEmitter<{ endDate: moment.Moment }> = new EventEmitter();

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

    ngOnInit(): void {
        this._buildLocale();
    }

    ngOnChanges(changes: SimpleChanges): void {
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
        if (this.overlayRef) {
            this.hide();
        }

        // TO-DO: implement this.drops and this.opens!
        this.overlayRef = this.overlay.create({
            backdropClass: 'cdk-overlay-transparent-backdrop',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .connectedTo(
                    this.elementRef.nativeElement,
                    { originX: 'start', originY: 'bottom' },
                    { overlayX: 'start', overlayY: 'top' }
                ),
        });
        const dateRangePickerPortal = new ComponentPortal(DaterangepickerComponent);
        this.componentRef = this.overlayRef.attach(dateRangePickerPortal);

        // Assign all inputs
        this.componentRef.instance.minDate = this.minDate;
        this.componentRef.instance.maxDate = this.maxDate;
        this.componentRef.instance.autoApply = this.autoApply;
        this.componentRef.instance.alwaysShowCalendars = this.alwaysShowCalendars;
        this.componentRef.instance.showCustomRangeLabel = this.showCustomRangeLabel;
        this.componentRef.instance.linkedCalendars = this.linkedCalendars;
        this.componentRef.instance.dateLimit = this.dateLimit;
        this.componentRef.instance.singleDatePicker = this.singleDatePicker;
        this.componentRef.instance.showWeekNumbers = this.showWeekNumbers;
        this.componentRef.instance.showISOWeekNumbers = this.showISOWeekNumbers;
        this.componentRef.instance.showDropdowns = this.showDropdowns;
        this.componentRef.instance.showClearButton = this.showClearButton;
        this.componentRef.instance.customRangeDirection = this.customRangeDirection;
        this.componentRef.instance.ranges = this.ranges;
        this.componentRef.instance.opens = this.opens;
        this.componentRef.instance.drops = this.drops;
        this.componentRef.instance.firstMonthDayClass = this.firstMonthDayClass;
        this.componentRef.instance.lastMonthDayClass = this.lastMonthDayClass;
        this.componentRef.instance.emptyWeekRowClass = this.emptyWeekRowClass;
        this.componentRef.instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.componentRef.instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.componentRef.instance.keepCalendarOpeningWithRange = this.keepCalendarOpeningWithRange;
        this.componentRef.instance.showRangeLabelOnInput = this.showRangeLabelOnInput;
        this.componentRef.instance.showCancel = this.showCancel;
        this.componentRef.instance.lockStartDate = this.lockStartDate;
        this.componentRef.instance.timePicker = this.timePicker;
        this.componentRef.instance.timePicker24Hour = this.timePicker24Hour;
        this.componentRef.instance.timePickerIncrement = this.timePickerIncrement;
        this.componentRef.instance.timePickerSeconds = this.timePickerSeconds;
        this.componentRef.instance.closeOnAutoApply = this.closeOnAutoApply;
        this.componentRef.instance.locale = this.locale;

        this.componentRef.instance.isInvalidDate = this.isInvalidDate;
        this.componentRef.instance.isCustomDate = this.isCustomDate;
        this.componentRef.instance.isTooltipDate = this.isTooltipDate;

        // Set the value
        this.setValue(this.value);

        const localeDiffer = this.differs.find(this.locale).create();
        if (localeDiffer) {
            const changes = localeDiffer.diff(this.locale);
            if (changes) {
                this.componentRef.instance.updateLocale(this.locale);
            }
        }

        // Subscribe to all outputs
        this.componentRef.instance.startDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemChanged: { startDate: moment.Moment }) => {
                this.startDateChanged.emit(itemChanged);
            });

        this.componentRef.instance.endDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemChanged) => {
                this.endDateChanged.emit(itemChanged);
            });

        this.componentRef.instance.rangeClicked
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((range) => {
                this.rangeClicked.emit(range);
            });

        this.componentRef.instance.datesUpdated
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((range) => {
                this.datesUpdated.emit(range);
            });

        this.componentRef.instance.chosenDate
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((chosenDate) => {
                if (chosenDate) {
                    const { endDate, startDate } = chosenDate;
                    this.value = { endDate, startDate };
                    this.onChange.emit(this.value);
                    if (typeof chosenDate.chosenLabel === 'string') {
                        this._el.nativeElement.value = chosenDate.chosenLabel;
                    }

                    this.hide();
                }
            });

        this.componentRef.instance.closeDateRangePicker
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.hide();
            });

        // Close the DateRangePicker when the backdrop is clicked
        this.overlayRef
            .backdropClick()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.hide();
            });
    }

    hide(): void {
        if (this.overlayRef) {
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
        if (this.componentRef) {
            this.componentRef.instance.clear();
        }
    }

    writeValue(value: { startDate: moment.Moment | string; endDate: moment.Moment | string } | moment.Moment): void {
        if (moment.isMoment(value)) {
            this.value = { startDate: value };
        } else if (value) {
            this.value = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
        } else {
            this.value = null;
        }
        this.setValue(this.value);
    }

    registerOnChange(fn): void {
        this._onChange = fn;
    }

    registerOnTouched(fn): void {
        this._onTouched = fn;
    }

    private setValue(value: { startDate: moment.Moment; endDate: moment.Moment }): void {
        if (this.componentRef) {
            if (value) {
                if (value[this._startKey]) {
                    this.componentRef.instance.setStartDate(value[this._startKey]);
                }
                if (value[this._endKey]) {
                    this.componentRef.instance.setEndDate(value[this._endKey]);
                }
                this.componentRef.instance.calculateChosenLabel();
                if (this.componentRef.instance.chosenLabel) {
                    this._el.nativeElement.value = this.componentRef.instance.chosenLabel;
                }
            } else {
                this.componentRef.instance.clear();
            }
        }

        this._el.nativeElement.value = value ? this.calculateChosenLabel(value.startDate, value.endDate) : null;
    }

    inputChanged(e): void {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }

        if (!e.target.value.length) {
            return;
        }

        if (this.componentRef) {
            const dateString = e.target.value.split(this.componentRef.instance.locale.separator);
            let start = null,
                end = null;
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

    calculateChosenLabel(startDate: moment.Moment, endDate: moment.Moment): string {
        const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;

        if (this.singleDatePicker) {
            return startDate.format(format);
        }

        if (startDate && endDate) {
            return startDate.format(format) + this.locale.separator + endDate.format(format);
        }

        return null;
    }

    /**
     *  build the locale config
     */
    private _buildLocale() {
        this.locale = { ...this._localeService.config, ...this.locale };
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            } else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    }
}
