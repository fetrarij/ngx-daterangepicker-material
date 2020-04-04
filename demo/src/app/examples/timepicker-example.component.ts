import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'example-timepicker',
    template: `
        <mat-form-field>
            <input
                matInput
                ngxDaterangepickerMd
                placeholder="Choose date"
                [timePicker]="true"
                [timePickerSeconds]="true"
                [timePickerIncrement]="15"
                [timePicker24Hour]="true"
                [(ngModel)]="selected"
            />
        </mat-form-field>
    `,
})
export class TimepickerExampleComponent {
    selected = {
        startDate: moment('2015-11-18T00:00Z'),
        endDate: moment('2015-11-26T00:00Z'),
    };
}
