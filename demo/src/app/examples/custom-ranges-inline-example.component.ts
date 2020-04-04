import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'example-custom-ranges-inline',
    template: `
        <form [formGroup]="form">
            <ngx-daterangepicker-material
                [autoApply]="true"
                [showCustomRangeLabel]="true"
                [alwaysShowCalendars]="form.get('alwaysShowCalendars').value"
                [ranges]="ranges"
                [showClearButton]="true"
                [showCancel]="true"
                [linkedCalendars]="true"
                [isTooltipDate]="isTooltipDate"
                [isInvalidDate]="isInvalidDate"
                [locale]="{ applyLabel: 'Done' }"
                [keepCalendarOpeningWithRange]="form.get('keepCalendarOpeningWithRange').value"
                [showRangeLabelOnInput]="form.get('showRangeLabelOnInput').value"
                [locale]="{ applyLabel: 'Done', firstDay: 1 }"
                (datesUpdated)="chosenDateTime($event)"
            ></ngx-daterangepicker-material>
            <div>Chosen date (after changes): {{ inlineDateTime | json }}</div>
        </form>
    `,
})
export class CustomRangesInlineExampleComponent {
    showRangeLabelOnInput: boolean;
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

    constructor(private formBuilder: FormBuilder) {}

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

    datesUpdated(range): void {
        console.log('[datesUpdated] range is : ', range);
    }

    chosenDateTime(e): void {
        this.inlineDateTime = e;
    }
}
