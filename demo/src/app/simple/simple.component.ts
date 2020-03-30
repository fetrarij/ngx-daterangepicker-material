import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DaterangepickerDirective } from '../../../../src/daterangepicker';

declare var PR;

@Component({
    selector: 'simple',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent implements AfterViewInit {
    selected: { startDate: moment.Moment; endDate: moment.Moment };
    @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
    inlineDate: any;
    inlineDateTime: any;

    constructor() {
        this.selected = {
            startDate: moment('2015-11-18T00:00Z'),
            endDate: moment('2015-11-26T00:00Z'),
        };
    }

    ngModelChange(e): void {
        console.log(e);
    }

    ngAfterViewInit(): void {
        PR.prettyPrint();
    }

    change(e): void {
        console.log(e);
    }

    chosenDate(e): void {
        this.inlineDate = e;
    }

    chosenDateTime(e): void {
        this.inlineDateTime = e;
    }

    open(): void {
        this.pickerDirective.open();
    }

    clear(e): void {
        this.selected = null;
    }
}
