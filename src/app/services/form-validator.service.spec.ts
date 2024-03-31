import { TestBed } from '@angular/core/testing';

import { FormValidatorService } from './form-validator.service';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

describe('FormValidatorService', () => {
  let service: FormValidatorService;

  let  form = new FormGroup({
    name: new FormControl('', Validators.required)
  })
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule]
    });
    service = TestBed.inject(FormValidatorService);
  });

  afterEach(() => {
    form = new FormGroup({
      name: new FormControl('', Validators.required)
    })
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should null when form received is valid', () => {
    form.get('name').setValue('Test');
    form.markAsDirty();
    const result = service.validate(form);
    expect(result).toBe(null);
  });

  it('should null when form received not load controls', () => {
    const wrongForm = new FormGroup({});
    const result = service.validate(wrongForm);
    expect(result).toBe(null);
  });

  it('should errors when form received is invalid', () => {
    form.get('name').setValue(null);
    form.markAsDirty();

    const result = service.validate(form);
    expect(result).not.toBe(null);
    expect(result.length).toBeGreaterThan(0);
  });
});
