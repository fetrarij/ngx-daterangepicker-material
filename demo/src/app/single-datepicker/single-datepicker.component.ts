import { AfterViewInit, Component } from '@angular/core';
import * as moment from 'moment';
import * as localization from 'moment/locale/fr';
import { LocaleConfig } from '../../../../src/daterangepicker';
moment.locale('fr', localization);

declare var PR;

@Component({
    selector: 'single-datepicker',
    templateUrl: './single-datepicker.component.html',
    styleUrls: ['./single-datepicker.component.scss']
})
export class SingleDatepickerComponent implements AfterViewInit {
    selected = moment();
    locale: LocaleConfig = {
        applyLabel: 'Appliquer',
        customRangeLabel: ' - ',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: moment.localeData().firstDayOfWeek()
    };

    ngAfterViewInit(): void {
        PR.prettyPrint();
    }

    isInvalidDate(date) {
        return date.weekday() === 0;
    }

    isCustomDate(date) {
        return date.weekday() === 0 || date.weekday() === 6 ? 'mycustomdate' : false;
    }
}
