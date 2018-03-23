import { Component, OnInit, ElementRef, HostListener, EventEmitter, Output} from '@angular/core';
import { FormControl} from '@angular/forms';

import * as _moment from 'moment'; const moment = _moment;

interface Hour {
    hour: string;
    minute: string;
    second: string;
    ampm: string;
}
export enum SideEnum {
    left = 'left',
    right = 'right'
} 

@Component({
 selector: 'ngx-daterangepicker-md',
 styleUrls: ['./daterangepicker.component.scss'],
 templateUrl: './daterangepicker.component.html',
})
export class DaterangepickerComponent implements OnInit {
    chosenLabel;
    oldStartDate;
    oldEndDate;
    calendarVariables: {left: any, right: any} = {left: {}, right: {}};
    daterangepicker: {start: FormControl, end: FormControl} = {start: new FormControl(), end: new FormControl()};
    disabled: {} = {};
    daterangepickerEnd: {active?: boolean, model?: any, control: FormControl, focus?: boolean} =
        {active: false, model: undefined, control: new FormControl(), focus: false};
    daterangepickerStart: {active?: boolean, model?: any, control: FormControl, focus?: boolean} =
        {active: false, model: undefined, control: new FormControl(), focus: false};
    applyBtn: {disabled: boolean} = {disabled: false};

    startDate = moment().startOf('day');
    endDate = moment().endOf('day');
    minDate: _moment.Moment = null;
    maxDate: _moment.Moment = null;
    dateLimit = null;
    autoApply: Boolean = false;
    singleDatePicker: Boolean = false;
    showDropdowns: Boolean = false;
    showWeekNumbers: Boolean = false;
    showISOWeekNumbers : Boolean= false;
    linkedCalendars: Boolean = true;
    autoUpdateInput: Boolean = true;
    alwaysShowCalendars: Boolean = false;
    locale: any = {
        direction: 'ltr',
        format: moment.localeData().longDateFormat('L'),
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData().firstDayOfWeek()
    };

    // some state information
    isShown: Boolean = false;
    leftCalendar: any = {};
    rightCalendar: any = {};

    options: any = {} ; // should get some opt from user
    @Output('choosedDate') choosedDate:EventEmitter<Object>; 

    constructor(
        private el: ElementRef
    ) {
        this.choosedDate = new EventEmitter();
        this.updateMonthsInView();
    }


    ngOnInit() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
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
    }

    isInvalidDate(date) {
        return false;
    }

    isCustomDate(date) {
        return false;
    }

    updateView() {
        if (this.endDate) {
            this.daterangepickerStart.active = true;
            this.daterangepickerEnd.active = false;
        } else {
            this.daterangepickerStart.active = false;
            this.daterangepickerEnd.active = true;
        }
        this.updateMonthsInView();
        this.updateCalendars();
        this.updateFormInputs();
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
        if (this.chosenLabel) {
            this.choosedDate.emit({chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate});
        }
    }

    remove() {
        this.isShown = false;
    }
    calculateChosenLabel () {
        if (this.chosenLabel) {
            this.choosedDate.emit({chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate});
        }
    }

    clickApply(e?) {
        this.hide();
    }

    clickCancel(e) {
        this.startDate = this.oldStartDate;
        this.endDate = this.oldEndDate;
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

        let date = side ===  SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

        //
        // this function needs to do a few things:
        // * alternate between selecting a start and end date for the range,
        // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
        // * if autoapply is enabled, and an end date was chosen, apply the selection
        // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
        // * if one of the inputs above the calendars was focused, cancel that manual input
        //

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
        }

        this.updateView();

        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();

    }
    /**
     *  Update the input after applying 
     */
    updateFormInputs() {
        // ignore mouse movements while an above-calendar text input has focus
        if (this.daterangepickerEnd.focus || this.daterangepickerStart.focus) {
            return;
        }

        this.daterangepickerStart.model = this.startDate.format(this.locale.format);
        if (this.endDate) {
            this.daterangepickerEnd.model = this.endDate.format(this.locale.format);
        }

        if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
            this.applyBtn.disabled = false;
        } else {
            this.applyBtn.disabled = true;
        }

    }


    show(e?) {
        if (this.isShown) { return; }
        this.oldStartDate = this.startDate.clone();
        this.oldEndDate = this.endDate.clone();
        this.updateView();
        setTimeout( () => this.isShown = true , 0);
    }

    hide(e?) {
        if (!this.isShown) { 
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this.oldStartDate) {
                this.startDate = this.oldStartDate.clone();
            }
            if (this.oldEndDate) {
                this.endDate = this.oldEndDate.clone();
            }
        }

        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)) {
           // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }

        // if picker is attached to a text input, update it
        this.updateElement();
        setTimeout(() => {this.isShown = false}, 0)
    }

    showCalendars() {
        this.isShown  = true;
    }

    hideCalendars() {
        this.isShown  = false;
    }
}
