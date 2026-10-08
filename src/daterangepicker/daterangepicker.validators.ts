import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Required validator for the date range value.
 * Use it instead of `Validators.required`: after "Clear" the value is `{ startDate: null, endDate: null }`,
 * which `Validators.required` treats as filled.
 */
export function dateRangeRequired(startKey = 'startDate', endKey = 'endDate'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value?.[startKey] || value?.[endKey] ? null : { required: true };
  };
}
