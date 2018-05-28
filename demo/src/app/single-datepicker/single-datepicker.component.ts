import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'single-datepicker',
  templateUrl: './single-datepicker.component.html',
  styleUrls: ['./single-datepicker.component.scss']
})
export class SingleDatepickerComponent implements OnInit {
  selected;
  constructor() { }

  ngOnInit() {
  }

}
