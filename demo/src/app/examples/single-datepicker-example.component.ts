import { Component } from '@angular/core';
import * as moment from 'moment';
import * as localization from 'moment/locale/fr';
import { LocaleConfig } from '../../../../src/daterangepicker';
moment.locale('fr', localization);

@Component({
    selector: 'example-single-datepicker',
    template: `
        <mat-form-field>
            <input
                matInput
                ngxDaterangepickerMd
                placeholder="Choose date"
                [isInvalidDate]="isInvalidDate"
                [isCustomDate]="isCustomDate"
                [locale]="locale"
                [(ngModel)]="selected"
                [singleDatePicker]="true"
                [autoApply]="true"
            />
        </mat-form-field>
    `,
})
export class SingleDatepickerExampleComponent {
    selected = moment();
    locale: LocaleConfig = {
        applyLabel: 'Appliquer',
        customRangeLabel: ' - ',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData().firstDayOfWeek(),
    };

    isInvalidDate(date) {
        return date.weekday() === 0;
    }

    isCustomDate(date) {
        return date.weekday() === 0 || date.weekday() === 6 ? 'mycustomdate' : false;
    }
}
