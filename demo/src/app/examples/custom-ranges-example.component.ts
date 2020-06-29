import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'example-custom-ranges',
    template: `
        <form [formGroup]="form">
            <mat-form-field>
                <input
                    matInput
                    ngxDaterangepickerMd
                    placeholder="Choose date"
                    formControlName="selected"
                    [showCustomRangeLabel]="true"
                    [alwaysShowCalendars]="form.get('alwaysShowCalendars').value"
                    [ranges]="ranges"
                    [showClearButton]="true"
                    [showCancel]="true"
                    [linkedCalendars]="false"
                    [isTooltipDate]="isTooltipDate"
                    [isInvalidDate]="isInvalidDate"
                    [locale]="{ applyLabel: 'Done' }"
                    [keepCalendarOpeningWithRange]="form.get('keepCalendarOpeningWithRange').value"
                    [showRangeLabelOnInput]="form.get('showRangeLabelOnInput').value"
                    (rangeClicked)="rangeClicked($event)"
                    (datesUpdated)="datesUpdated($event)"
                    startKey="customStart"
                    endKey="customEnd"
                />
            </mat-form-field>
            {{ selected | json }}
            <div>
                <mat-checkbox formControlName="alwaysShowCalendars">
                    alwaysShowCalendars
                </mat-checkbox>
            </div>
            <div>
                <mat-checkbox formControlName="keepCalendarOpeningWithRange">
                    keepCalendarOpeningWithRange
                </mat-checkbox>
            </div>
            <div>
                <mat-checkbox formControlName="showRangeLabelOnInput">
                    showRangeLabelOnInput
                </mat-checkbox>
            </div>
        </form>
    `,
})
export class CustomRangesExampleComponent {
    selected: any;
    invalidDates: moment.Moment[] = [];
    tooltips = [
        { date: moment(), text: 'Today is just unselectable' },
        { date: moment().add(2, 'days'), text: 'Yeeeees!!!' },
    ];
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
            customStart: moment().startOf('month'),
            customEnd: moment().endOf('month'),
        },
        alwaysShowCalendars: true,
        keepCalendarOpeningWithRange: true,
        showRangeLabelOnInput: true,
    });

    constructor(private formBuilder: FormBuilder) {}

    isInvalidDate = (m: moment.Moment) => {
        return this.invalidDates.some((d) => d.isSame(m, 'day'));
    }

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
}
