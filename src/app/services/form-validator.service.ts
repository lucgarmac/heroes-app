import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  constructor() {}

  private _getFormErrors(form: FormGroup) {
    const formControlNames = Object.keys(form.controls);
    if (!formControlNames?.length) {
      return null;
    }

    return formControlNames.map((controlName) => ({
      [controlName]: form.get(controlName)?.errors,
    }));
  }

  validate(form: FormGroup): ValidationErrors | null {
    return form?.pristine || (form?.dirty && form.valid)
      ? null
      : this._getFormErrors(form);
  }
}
