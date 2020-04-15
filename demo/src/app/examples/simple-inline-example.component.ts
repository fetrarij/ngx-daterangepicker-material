import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'example-simple-inline',
    template: `
        <ngx-daterangepicker-material
            [locale]="{ applyLabel: 'Done', firstDay: 1 }"
            name="inline-daterangepicker"
            (chosenDate)="chosenDate($event)"
        >
        </ngx-daterangepicker-material>
        <div>Chosen date: {{ inlineDate | json }}</div>
    `,
})
export class SimpleInlineExampleComponent {
    inlineDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment };

    selected = {
        startDate: moment('2015-11-18T00:00Z'),
        endDate: moment('2015-11-26T00:00Z'),
    };

    chosenDate(chosenDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment }): void {
        console.log(chosenDate);
        this.inlineDate = chosenDate;
    }
}
