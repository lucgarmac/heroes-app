import { FormValidatorService } from './../../../../../services/form-validator.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceComponent } from './appearance.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppearanceComponent', () => {
  let component: AppearanceComponent;
  let fixture: ComponentFixture<AppearanceComponent>;

  const formValidatorServiceSpy = jasmine.createSpyObj('FormValidatorService', ['validate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        AppearanceComponent,
        TranslateModule.forRoot()],
      providers: [
        {provide: FormValidatorService, useValue: formValidatorServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load form and lists in correct language', () => {
    const getSpy = spyOn(component['_translateService'], 'get');
    const onLangChangeSpy = spyOn(component['_translateService'], 'onLangChange');

    expect(getSpy).toHaveBeenCalled();
    expect(onLangChangeSpy).toHaveBeenCalled();
    expect(component.eyesColors.length).toBeGreaterThan(0);
    expect(component.genders.length).toBeGreaterThan(0);
    expect(component.hairColors.length).toBeGreaterThan(0);
    expect(component.races.length).toBeGreaterThan(0);
    expect(component.form).not.toBeNull();
  });

  it('should set default values in form when not received values', ()=> {
    component.writeValue(null);
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(component['_defaultFormValues']);
  });

  it('should update form values with the received values', () => {
    const mockValues = {
      gender: 'gender test',
      race: 'race test',
      height: 1,
      weight: 1,
      eyeColor: 'eyeColor test',
      hairColor: 'hairColor test',
    }
    component.writeValue(mockValues);
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(mockValues);
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
