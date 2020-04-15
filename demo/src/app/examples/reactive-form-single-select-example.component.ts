import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocaleConfig } from '../../../../src/daterangepicker';

@Component({
    selector: 'example-reactive-form-single-select',
    template: `
        <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field>
                <input
                    matInput
                    ngxDaterangepickerMd
                    formControlName="selected"
                    placeholder="Choose date"
                    [showDropdowns]="true"
                    [singleDatePicker]="true"
                    [showCancel]="true"
                    [locale]="locale"
                />
            </mat-form-field>
            <div>
                <button mat-raised-button color="primary" type="submit">Submit</button>
            </div>
        </form>
    `,
})
export class ReactiveFormSingleSelectExample {
    form = this.fb.group({
        selected: [
            {
                startDate: '2019-12-11T18:30:00.000Z',
                endDate: '2019-12-12T18:29:59.000Z',
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
