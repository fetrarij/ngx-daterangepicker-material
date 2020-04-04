import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocaleConfig } from '../../../../src/daterangepicker';

@Component({
    selector: 'example-reactive-form-multi-select',
    template: `
        <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field>
                <input
                    matInput
                    ngxDaterangepickerMd
                    placeholder="Choose date"
                    formControlName="selected"
                    [showDropdowns]="true"
                    [showCancel]="true"
                />
            </mat-form-field>
            <div>
                <button mat-raised-button color="primary" type="submit">Submit</button>
            </div>
        </form>
    `,
})
export class ReactiveFormMultiSelectExample {
    form = this.fb.group({
        selected: [
            {
                startDate: moment('2015-11-24T00:00Z'),
                endDate: moment('2015-11-26T00:00Z'),
            },
            Validators.required,
        ],
    });
    locale: LocaleConfig = {
        format: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
        displayFormat: 'YYYY-MM-DD',
    };

    constructor(private fb: FormBuilder) {}

    submit(): void {
        console.log(this.form.value);
    }
}
