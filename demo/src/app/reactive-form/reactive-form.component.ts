import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocaleConfig } from '../../../../src/daterangepicker';

@Component({
    selector: 'reactive-form',
    templateUrl: './reactive-form.component.html',
    styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent {
    form: FormGroup;
    form2: FormGroup;
    locale: LocaleConfig = {
        format: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
        displayFormat: 'YYYY-MM-DD',
    };

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            selected: [
                {
                    startDate: dayjs('2015-11-24T00:00Z'),
                    endDate: dayjs('2015-11-26T00:00Z'),
                },
                Validators.required,
            ],
        });

        this.form2 = this.fb.group({
            selected: [
                {
                    startDate: dayjs('2022-04-22T15:48:00.000Z'),
                    endDate: dayjs('2022-04-22T15:48.000Z'),
                },
                Validators.required,
            ],
        });
    }

    submit() {
        console.log(this.form.value);
    }

    submit2() {
        console.log(this.form2.value);
    }
    toggleDisable(form: FormGroup) {
        if (form.disabled) {
            form.enable();
        } else {
            form.disable();
        }
    }
}
