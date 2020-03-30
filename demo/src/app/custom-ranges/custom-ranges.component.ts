import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

declare var PR;

@Component({
    selector: 'custom-ranges',
    templateUrl: './custom-ranges.component.html',
    styleUrls: ['./custom-ranges.component.scss'],
})
export class CustomRangesComponent implements AfterViewInit {
    selected: any;
    alwaysShowCalendars: boolean;
    showRangeLabelOnInput: boolean;
    keepCalendarOpeningWithRange: boolean;
    maxDate: moment.Moment;
    minDate: moment.Moment;
    invalidDates: moment.Moment[] = [];
    tooltips = [
        { date: moment(), text: 'Today is just unselectable' },
        { date: moment().add(2, 'days'), text: 'Yeeeees!!!' },
    ];
    inlineDateTime;
    ranges = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 3 Month': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    };
    form = this.formBuilder.group({
        selected: {
            startDate: moment().subtract(1, 'days').set({ hours: 0, minutes: 0 }),
            endDate: moment().subtract(1, 'days').set({ hours: 23, minutes: 59 }),
        },
        alwaysShowCalendars: true,
        keepCalendarOpeningWithRange: true,
        showRangeLabelOnInput: true,
    });

    constructor(private formBuilder: FormBuilder) {
        this.maxDate = moment().add(2, 'weeks');
        this.minDate = moment().subtract(3, 'days');
    }

    ngAfterViewInit(): void {
        PR.prettyPrint();
    }

    isInvalidDate = (m: moment.Moment) => {
        return this.invalidDates.some((d) => d.isSame(m, 'day'));
    };

    isTooltipDate = (m: moment.Moment) => {
        const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, 'day'));
        if (tooltip) {
            return tooltip.text;
        } else {
            return false;
        }
    };

    rangeClicked(range): void {
        console.log('[rangeClicked] range is : ', range);
    }

    datesUpdated(range): void {
        console.log('[datesUpdated] range is : ', range);
    }

    chosenDateTime(e): void {
        this.inlineDateTime = e;
    }
}
