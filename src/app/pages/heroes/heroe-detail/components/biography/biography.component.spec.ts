import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiographyComponent } from './biography.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormValidatorService } from '../../../../../services/form-validator.service';

describe('BiographyComponent', () => {
  let component: BiographyComponent;
  let fixture: ComponentFixture<BiographyComponent>;

  const formValidatorServiceSpy = jasmine.createSpyObj('FormValidatorService', ['validate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BiographyComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: FormValidatorService, useValue: formValidatorServiceSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load form on init', () => {
    expect(component.form).not.toBeNull();
  });

  it('should set default values in form when not received values', ()=> {
    component.writeValue(null);
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(component['_defaultFormValues']);
  });

  it('should update form values with the received values', () => {
    const mockValues = {
      fullName: 'test',
      alterEgos: 'test',
      placeOfBirth: 'test',
      firstAppearance: 'test',
      publisher: 'test',
      alignment: 'test',
      aliases: ['test'],
    }
    component.writeValue(mockValues);
    fixture.detectChanges();
    const {aliases, ...values} = mockValues
    expect(component.form.getRawValue()).toEqual({
      ...values,
      aliases: aliases.map(alias => ({item: alias}))
    });
  });

  it('should register on change function', () => {
    const functionMock = () => {};
    component.registerOnChange(functionMock);
    expect(component.onChange).toEqual(functionMock);
  });

  it('should register on touched function', ()=> {
    const functionMock = () => {};
    component.registerOnTouched(functionMock);
    expect(component.onTouched).toEqual(functionMock);
  });

  it('should disable form when component has been disabled', () => {
    component.setDisabledState(true);
    expect(component.form.disabled).toBeTruthy();
  });

  it('should enable form when component has been enabled', () => {
    component.setDisabledState(false);
    expect(component.form.disabled).toBeFalsy();
  });

  it('should validate form when validate method is invoked', ()=> {
    component.validate(null);
    expect(formValidatorServiceSpy.validate).toHaveBeenCalledWith(component.form);
  });
});
