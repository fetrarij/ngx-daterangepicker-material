import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DaterangepickerDirective } from '../../../../src/daterangepicker';

@Component({
    selector: 'example-simple',
    template: `
        <mat-form-field>
            <input
                matInput
                ngxDaterangepickerMd
                showCancel="true"
                placeholder="Choose date"
                [(ngModel)]="selected"
                [showDropdowns]="true"
                [minDate]="minDate"
                [linkedCalendars]="false"
                [lockStartDate]="false"
                [customRangeDirection]="false"
                (ngModelChange)="ngModelChange($event)"
                (change)="change($event)"
            />
        </mat-form-field>
        <div>
            <button mat-raised-button color="primary" (click)="open()">Open from a button</button>
            <button *ngIf="selected && selected.startDate" mat-raised-button (click)="clear($event)">
                Clear
            </button>
        </div>
    `,
})
export class SimpleExampleComponent {
    @ViewChild(DaterangepickerDirective, { static: true })
    pickerDirective: DaterangepickerDirective;

    selected = {
        startDate: moment('2015-11-18T00:00Z'),
        endDate: moment('2015-11-26T00:00Z'),
    };
    minDate = moment('2020-10-10', 'YYYY-MM-DD');

    ngModelChange(e): void {
        console.log(e);
    }

    change(e): void {
        console.log(e);
    }

    open(): void {
        console.log('open')
        this.pickerDirective.open();
    }

    clear(e): void {
        this.selected = null;
    }
}
