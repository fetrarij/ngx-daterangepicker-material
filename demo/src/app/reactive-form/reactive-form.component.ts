import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs/esm';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocaleConfig } from 'ngx-daterangepicker-material';

@Component({
  imports: [NgClass, ReactiveFormsModule, MatToolbarModule, NgxDaterangepickerMd],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'reactive-form',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './reactive-form.component.html'
})
export class ReactiveFormComponent {
  private fb = inject(FormBuilder);

  form: FormGroup;
  form2: FormGroup;
  locale: LocaleConfig = {
    format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    displayFormat: 'YYYY-MM-DD'
  };

  constructor() {
    this.form = this.fb.group({
      selected: [
        {
          startDate: dayjs('2015-11-24T00:00Z'),
          endDate: dayjs('2015-11-26T00:00Z')
        },
        Validators.required
      ]
    });

    this.form2 = this.fb.group({
      selected: [
        {
          startDate: '2019-12-11T18:30:00.000Z',
          endDate: '2019-12-12T18:29:59.000Z'
        },
        Validators.required
      ]
    });
  }

  submit(): void {
    // eslint-disable-next-line no-console
    console.log(this.form.value);
  }

  submit2(): void {
    // eslint-disable-next-line no-console
    console.log(this.form2.value);
  }

  toggleDisable(form: FormGroup): void {
    if (form.disabled) {
      form.enable();
    } else {
      form.disable();
    }
  }
}
