import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'example-simple-inline-timepicker',
    template: `
        <ngx-daterangepicker-material
            name="inline-daterangepicker-auto"
            [autoApply]="true"
            [timePicker24Hour]="true"
            [linkedCalendars]="true"
            [startDate]="selected?.startDate"
            [endDate]="selected?.endDate"
            [timePicker]="true"
            [locale]="{ applyLabel: 'Done', firstDay: 1 }"
            (chosenDate)="chosenDateTime($event)"
        >
        </ngx-daterangepicker-material>
        <div>Chosen date (after changes): {{ inlineDateTime | json }}</div>
    `,
})
export class SimpleInlineTimepickerExampleComponent {
    inlineDateTime: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment };

    selected = {
        startDate: moment('2015-11-18T00:00Z'),
        endDate: moment('2015-11-26T00:00Z'),
    };

    chosenDateTime(chosenDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment }): void {
        this.inlineDateTime = chosenDate;
    }
}
