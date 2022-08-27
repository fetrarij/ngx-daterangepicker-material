import * as fr from 'dayjs/locale/fr'
import { Component, OnInit, ViewChild } from '@angular/core';
import dayjs from 'dayjs/esm';
dayjs.locale(fr);
import utc from 'dayjs/esm/plugin/utc';
dayjs.extend(utc);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'locale',
  templateUrl: './locale.component.html'
})
export class LocaleComponent implements OnInit {
  selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
  locale = fr;
  constructor() {}

  ngOnInit(): void {}
}
