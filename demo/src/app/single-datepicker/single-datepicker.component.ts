import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'single-datepicker',
  templateUrl: './single-datepicker.component.html',
  styleUrls: ['./single-datepicker.component.scss']
})
export class SingleDatepickerComponent implements OnInit {
  selected = moment();
  constructor() { }

  ngOnInit() {
  }

}
