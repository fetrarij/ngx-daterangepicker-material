import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocaleConfig } from '../../../../src/daterangepicker';

@Component({
  selector: 'reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent {
  form: FormGroup;
  form2: FormGroup;
  locale: LocaleConfig = {
    format: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
    displayFormat: 'YYYY-MM-DD',
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selected: [{
        startDate: moment('2015-11-24T00:00Z'),
        endDate: moment('2015-11-26T00:00Z')
      }, Validators.required],
    });

    this.form2 = this.fb.group({
      selected: [{
        startDate: '2019-12-11T18:30:00.000Z',
        endDate: '2019-12-12T18:29:59.000Z',
      }, Validators.required],
    });
   }

  submit() {
    console.log(this.form.value);
  }

  submit2() {
    console.log(this.form2.value);
  }
  toggleDisable(form: FormGroup) {
    if (form.disabled) {
      form.enable();
    } else {
      form.disable();
    }
  }
}
