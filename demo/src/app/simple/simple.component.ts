import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {
  selected: {startdDate: moment.Moment, endDate: moment.Moment};
  constructor() { }

  ngOnInit() {
  }

}
