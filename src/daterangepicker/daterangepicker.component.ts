import { 
    Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input, forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FormControl} from '@angular/forms';

import * as _moment from 'moment'; const moment = _moment;

export enum SideEnum {
    left = 'left',
    right = 'right'
}

@Component({
    selector: 'ngx-daterangepicker-material',
    styleUrls: ['./daterangepicker.component.scss'],
    templateUrl: './daterangepicker.component.html',
    host: {
    '(click)': 'handleInternalClick($event)',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DaterangepickerComponent),
        multi: true
    }]
})
export class DaterangepickerComponent implements OnInit {
    private _old: {start: any, end: any} = {start: null, end: null};
    chosenLabel: string;
    calendarVariables: {left: any, right: any} = {left: {}, right: {}};
    daterangepicker: {start: FormControl, end: FormControl} = {start: new FormControl(), end: new FormControl()};
    applyBtn: {disabled: boolean} = {disabled: false};
    startDate = moment().startOf('day');
    endDate = moment().endOf('day');
    dateLimit = null;
    
    @Input()
    minDate: _moment.Moment = null;
    @Input()
    maxDate: _moment.Moment = null;
    @Input()
    autoApply: Boolean = false;
    @Input()
    singleDatePicker: Boolean = false;
    @Input()
    showDropdowns: Boolean = false;
    @Input()
    showWeekNumbers: Boolean = false;
    @Input()
    showISOWeekNumbers : Boolean= false;
    @Input()
    linkedCalendars: Boolean = false;
    @Input()
    autoUpdateInput: Boolean = true;
    @Input()
    alwaysShowCalendars: Boolean = false;
    @Input()
    maxSpan: Boolean = false;
    @Input()
    timePicker: Boolean = false;
    @Input()
    showClearButton: Boolean = false;
    @Input()
    firstMonthDayClass: string = null;
    @Input()
    lastMonthDayClass: string = null;
    @Input()
    emptyWeekRowClass: string = null;
    @Input()
    firstDayOfNextMonthClass: string = null;
    @Input()
    lastDayOfPreviousMonthClass: string = null;
    @Input()
    locale: any = {
        direction: 'ltr',
        format: moment.localeData().longDateFormat('L'),
        separator: ' - ',
        weekLabel: 'W',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData().firstDayOfWeek()
    };
    // custom ranges
    @Input()
    ranges: any = {};
    @Input()
    showCustomRangeLabel: boolean;
    chosenRange: string;
    rangesArray: Array<any> = [];

    // some state information
    isShown: Boolean = false;
    inline: boolean = true;
    leftCalendar: any = {};
    rightCalendar: any = {};
    showCalInRanges: Boolean = false;

    options: any = {} ; // should get some opt from user
    @Output('choosedDate') choosedDate: EventEmitter<Object>;
    @Output('rangeClicked') rangeClicked: EventEmitter<Object>;
    @Output('datesUpdated') datesUpdated: EventEmitter<Object>;
    @ViewChild('pickerContainer') pickerContainer: ElementRef;

    constructor(
        private el: ElementRef,
    ) {
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.updateMonthsInView();
    }

    ngOnInit() {
        if (this.locale.firstDay != 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }
        if(this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    }
    renderRanges() {
        let start, end;
        if (typeof this.ranges === 'object') {
            for (const range in this.ranges) {
                if (typeof this.ranges[range][0] === 'string') {
                    start = moment(this.ranges[range][0], this.locale.format);
                } else {
                    start = moment(this.ranges[range][0]);
                }

                if (typeof this.ranges[range][1] === 'string') {
                    end = moment(this.ranges[range][1], this.locale.format);
                } else {
                    end = moment(this.ranges[range][1]);
                }

                // If the start or end date exceed those allowed by the minDate or maxSpan
                // options, shorten the range to the allowable period.
                if (this.minDate && start.isBefore(this.minDate)) {
                    start = this.minDate.clone();
                }

                var maxDate = this.maxDate;
                if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                    maxDate = start.clone().add(this.maxSpan);
                }
                if (maxDate && end.isAfter(maxDate)) {
                    end = maxDate.clone();
                }

                // If the end of the range is before the minimum or the start of the range is
                // after the maximum, don't display this range option at all.
                if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day'))
                || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                    continue;
                }

                //Support unicode chars in the range names.
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;

                this.ranges[rangeHtml] = [start, end];
            }
            for (const range in this.ranges) {
                this.rangesArray.push(range);
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
        }

    }
    renderCalendar(side: SideEnum) { // site enum
        let mainCalendar: any = ( side === SideEnum.left ) ? this.leftCalendar : this.rightCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay).subtract(1, 'month').month();
        const lastYear = moment(firstDay).subtract(1, 'month').year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        const dayOfWeek = firstDay.day();

        // initialize a 6 rows x 7 columns array for the calendar
        let calendar: any= [];
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

        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);

            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
            calendar[row][col].isBefore(this.minDate) && side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }

            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
            calendar[row][col].isAfter(this.maxDate) && side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
            if (!this.singleDatePicker && this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') && side === 'left') {
                // use previous calendars
                this.leftCalendar.month.subtract(1, 'month');
                this.rightCalendar.month.subtract(1, 'month');
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
        const minDate = side === 'left' ? this.minDate : this.startDate;
        let maxDate = this.maxDate;
        const selected = side === 'left' ? this.startDate : this.endDate;
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };

        if (this.showDropdowns) {
            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            const minYear = (minDate && minDate.year()) || (currentYear - 50);
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];
            for (var y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }

        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }

        for (let row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            const rowClasses = [];
            if(this.emptyWeekRowClass && !this.hasCurrentMonthDays(month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let col = 0; col < 7; col++) {
                const classes = [];

                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
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
                    if(this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) && calendar[row][col].date() === daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }

                    // mark the first day of the next month in this calendar
                    if(this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }

                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }

                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }

                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }

                // don't allow selection of dates after the maximum date
                if (maxDate && calendar[row][col].isAfter(maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }

                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled');
                }

                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }

                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }

                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }

                // apply custom classes for this date
                const isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    } else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                let cname = '', disabled = false;
                for (let i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
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
    setStartDate(startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }

        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }

        this.startDate = this.startDate.startOf('day');


        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
        }

        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
        }

        if (!this.isShown) {
            this.updateElement();
        }

        this.updateMonthsInView();
        this.datesUpdated.emit({startDate: this.startDate, endDate: this.endDate});

    }

    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }

        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }

        this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');


        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }

        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }

        if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit);
        }


        if (!this.isShown) {
            // this.updateElement();
        }
        this.updateMonthsInView();
        this.datesUpdated.emit({startDate: this.startDate, endDate: this.endDate});
    }

    isInvalidDate(date) {
        return false;
    }

    isCustomDate(date) {
        return false;
    }

    updateView() {
        this.updateMonthsInView();
        this.updateCalendars();
    }

    updateMonthsInView() {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))
                ) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                } else {
                        this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }

        } else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
            this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    }
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);

        if (this.endDate === null) { return; }
        this.calculateChosenLabel();
    }
    updateElement() {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                this.chosenLabel = this.startDate.format(this.locale.format) +
                    this.locale.separator + this.endDate.format(this.locale.format);            }
        } else if ( this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    }

    remove() {
        this.isShown = false;
    }
    /**
     * this should calculate the label
     */
    calculateChosenLabel () {
        let customRange = true;
        let i = 0;
        if (this.rangesArray.length > 0) {
            for (const range in this.ranges) {
                if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                    customRange = false;
                    this.chosenRange = this.rangesArray[i];
                    break;
                }
                i++;
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                } else {
                    this.chosenRange = null;
                }
                // if custom label: show calenar
                this.showCalInRanges = true; 
            }
        }

        this.updateElement();
    }

    clickApply(e?) {
        if (this.chosenLabel) {
            this.choosedDate.emit({chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate});
        }

        this.datesUpdated.emit({startDate: this.startDate, endDate: this.endDate});
        this.hide();
    }

    clickCancel(e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        this.datesUpdated.emit({startDate: this.startDate, endDate: this.endDate});
        if(this.inline) {
            this.updateView();
        }
        this.hide();
    }
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    monthChanged(monthEvent: any, side: SideEnum) {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    yearChanged(yearEvent: any, side: SideEnum) {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month: number, year: number, side: SideEnum) {
        const isLeft = side === SideEnum.left;

        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }

        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }

        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }

        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        } else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    }

    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side: SideEnum) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        } else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side: SideEnum) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        } else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e, side: SideEnum, row: number, col: number) {
        if (!e.target.classList.contains('available')) {
            return;
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }

        let date = side ===  SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

        if (this.endDate || date.isBefore(this.startDate, 'day')) { // picking start
            this.endDate = null;
            this.setStartDate(date.clone());
        } else if (!this.endDate && date.isBefore(this.startDate)) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        } else { // picking end
            this.setEndDate(date.clone());
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }

        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }

        this.updateView();

        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();

    }
    /**
     *  Click on the custom range
     * @param e: Event
     * @param label
     */
    clickRange(e, label) {
        this.chosenRange = label;
        if (label == this.locale.customRangeLabel) {
            this.isShown  = true; // show calendars
            this.showCalInRanges = true;
        } else {
            var dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            this.calculateChosenLabel();
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;

            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }

            if (!this.alwaysShowCalendars) {
                this.isShown  = false; // hide calendars
            }
            this.rangeClicked.emit({label: label, dates: dates});
            this.datesUpdated.emit({startDate: this.startDate, endDate: this.endDate});

            this.clickApply();
        }
    };



    show(e?) {
        if (this.isShown) { return; }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    }

    hide(e?) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }

        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
           // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }

        // if picker is attached to a text input, update it
        this.updateElement();
        setTimeout(() => {this.isShown = false}, 0)
    }

    /**
     * handle click on all element in the component, usefull for outside of click
     * @param e event
     */
    handleInternalClick(e) {
        e.stopPropagation()
    }
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale) {
        for (const key in locale) {
          if (this.locale.hasOwnProperty(key) && this.locale.hasOwnProperty(key)) {
            this.locale[key] = locale[key];
          }
        }
    }
    /**
     *  clear the daterange picker
     */
    clear() {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({chosenLabel: '', startDate: null, endDate: null});
        this.datesUpdated.emit({startDate: null, endDate: null});
        this.hide();
    }

    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(range) {
      if (range === this.locale.customRangeLabel) {
        return false;
      }
      const rangeMarkers = this.ranges[range];
      const areBothBefore = rangeMarkers.every( date => {
        return date.isBefore(this.minDate)
      });

      const areBothAfter = rangeMarkers.every( date => {
        return date.isAfter(this.maxDate)
      });

      return (areBothBefore || areBothAfter);
    }

    /**
     * Find out if the current calendar row has current month days 
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth, row) {
        for (let day = 0; day < 7; day++) {
            if(row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }
}
