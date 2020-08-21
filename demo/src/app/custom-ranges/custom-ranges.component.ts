import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'custom-ranges',
  templateUrl: './custom-ranges.component.html',
  styleUrls: ['./custom-ranges.component.scss']
})
export class CustomRangesComponent implements OnInit {
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  maxDate: moment.Moment;
  minDate: moment.Moment;
  invalidDates: moment.Moment[] = [];
  tooltips = [
    {date: moment(), text: 'Today is just unselectable'},
    {date:  moment().add(2, 'days'), text: 'Yeeeees!!!'}
  ];
  inlineDateTime;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment()
        .subtract(1, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ],
    'Last 3 Month': [
      moment()
        .subtract(3, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ]
  };

  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') );
  }
  isTooltipDate = (m: moment.Moment) =>  {
    const tooltip = this.tooltips.find(tt => tt.date.isSame(m, 'day'));
    if (tooltip) {
      return tooltip.text;
    } else {
      return false;
    }
  }

  constructor() {
    this.maxDate = moment().add(2,  'weeks');
    this.minDate = moment().subtract(3, 'days');

    this.alwaysShowCalendars = true;
    this.keepCalendarOpeningWithRange = true;
    this.showRangeLabelOnInput = true;
    this.selected = {
      startDate: moment().subtract(1, 'days').set({hours: 0, minutes: 0}),
      endDate: moment().subtract(1, 'days').set({hours: 23, minutes: 59})
    };
  }
  rangeClicked(range) {
    console.log('[rangeClicked] range is : ', range);
  }
  datesUpdated(range) {
    console.log('[datesUpdated] range is : ', range);
  }

  ngOnInit() {}
  choosedDateTime(e) {
    this.inlineDateTime = e;
  }
}
