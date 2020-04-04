import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DaterangepickerDirective } from '../../../../src/daterangepicker';

@Component({
    selector: 'example-full',
    template: `
        <mat-form-field>
            <input
                matInput
                ngxDaterangepickerMd
                name="daterange"
                placeholder="Choose date"
                applyLabel="Okay"
                startKey="start"
                endKey="end"
                firstMonthDayClass="first-day"
                lastMonthDayClass="last-day"
                emptyWeekRowClass="empty-week"
                lastDayOfPreviousMonthClass="last-previous-day"
                firstDayOfNextMonthClass="first-next-day"
                [autoApply]="options.autoApply"
                [linkedCalendars]="options.linkedCalendars"
                [singleDatePicker]="options.singleDatePicker"
                [locale]="locale"
                [showDropdowns]="true"
                [(ngModel)]="selected"
                [minDate]="minDate"
                [maxDate]="maxDate"
                [showWeekNumbers]="options.showWeekNumbers"
                [showCancel]="options.showCancel"
                [showClearButton]="options.showClearButton"
                [showISOWeekNumbers]="options.showISOWeekNumbers"
                [customRangeDirection]="options.customRangeDirection"
                [lockStartDate]="options.lockStartDate"
                [closeOnAutoApply]="options.closeOnAutoApply"
                [opens]="opens"
                [drops]="drops"
                [timePicker]="timePicker"
                [dateLimit]="dateLimit"
                (startDateChanged)="eventClicked($event)"
                (endDateChanged)="eventClicked($event)"
            />
        </mat-form-field>
        <div>Value: {{ selected | json }}</div>

        <div class="checkbox-wrapper">
            <mat-checkbox [(ngModel)]="timePicker">Enable Timepicker</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.autoApply">autoApply</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.closeOnAutoApply">closeOnAutoApply</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.showCancel">showCancel</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.showClearButton">showClearButton</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.linkedCalendars">linkedCalendars</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.singleDatePicker">singleDatePicker</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.showWeekNumbers">showWeekNumbers</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.showISOWeekNumbers">showISOWeekNumbers</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.customRangeDirection">customRangeDirection</mat-checkbox>
            <mat-checkbox [(ngModel)]="options.lockStartDate">lockStartDate</mat-checkbox>
            <div><strong>minDate:</strong> {{ minDate | date: 'dd/MM/yyyy' }}</div>
            <div><strong>maxDate:</strong> {{ maxDate | date: 'dd/MM/yyyy' }}</div>
        </div>
        <h2>Locale</h2>
        <div class="">
            <div class="row">
                <div class="col s12">
                    <mat-form-field>
                        <mat-select placeholder="Choose format" [(ngModel)]="locale.format">
                            <mat-option value="DD/MM/YYYY">DD/MM/YYYY</mat-option>
                            <mat-option value="MM-DD-YYYY">MM-DD-YYYY</mat-option>
                        </mat-select> </mat-form-field
                    ><br />
                    locale value:<br />
                    {{ locale | json }}
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <mat-form-field>
                        <mat-select [(ngModel)]="opens" placeholder="Position">
                            <mat-option value="left">Left</mat-option>
                            <mat-option value="center">Center</mat-option>
                            <mat-option value="right">Right</mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
                <div class="col s6">
                    <mat-form-field>
                        <mat-select [(ngModel)]="drops" placeholder="Drops">
                            <mat-option value="down">Down</mat-option>
                            <mat-option value="up">Up</mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
            </div>
            <div class="row">
                <div>
                    <button mat-raised-button color="warn" (click)="clear()">Clear</button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['full-example.component.scss'],
})
export class FullExampleComponent {
    @ViewChild(DaterangepickerDirective, { static: true })
    daterangepicker: DaterangepickerDirective;

    options: any = {
        autoApply: false,
        alwaysShowCalendars: false,
        showCancel: false,
        showClearButton: false,
        linkedCalendars: true,
        singleDatePicker: false,
        showWeekNumbers: false,
        showISOWeekNumbers: false,
        customRangeDirection: false,
        lockStartDate: false,
        closeOnAutoApply: true,
    };
    minDate: moment.Moment = moment().subtract(5, 'days');
    maxDate: moment.Moment = moment().add(2, 'month');
    locale: any = {
        format: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
        displayFormat: 'DD MMMM YYYY HH:mm',
        separator: ' To ',
        cancelLabel: 'Cancel',
        applyLabel: 'Okay',
    };
    timePicker = false;
    opens = 'right';
    drops = 'down';
    dateLimit = 30;
    selected = { startDate: moment().subtract(3, 'days'), endDate: moment().add(3, 'days') };

    clear(): void {
        this.daterangepicker.clear();
    }

    eventClicked(e): void {
        console.log(e);
    }
}
