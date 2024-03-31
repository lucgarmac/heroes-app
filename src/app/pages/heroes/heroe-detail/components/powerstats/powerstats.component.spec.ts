import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerstatsComponent } from './powerstats.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { FormValidatorService } from '../../../../../services/form-validator.service';

describe('PowerstatsComponent', () => {
  let component: PowerstatsComponent;
  let fixture: ComponentFixture<PowerstatsComponent>;

  const formValidatorServiceSpy = jasmine.createSpyObj('FormValidatorService', [
    'validate',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        PowerstatsComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: FormValidatorService, useValue: formValidatorServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PowerstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load form on init', () => {
    expect(component.form).not.toBeNull();
  });

  it('should set default values in form when not received values', () => {
    component.writeValue(null);
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(
      component['_defaultFormValues']
    );
  });

  it('should update form values with the received values', () => {
    const mockValues = {
      intelligence: 1,
      strength: 1,
      speed: 1,
      durability: 1,
      power: 1,
      combat: 1,
    };
    component.writeValue(mockValues);
    fixture.detectChanges();
    expect(component.form.getRawValue()).toEqual(mockValues);
  });

  it('should register on change function', () => {
    const functionMock = () => {};
    component.registerOnChange(functionMock);
    expect(component.onChange).toEqual(functionMock);
  });

  it('should register on touched function', () => {
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

  it('should validate form when validate method is invoked', () => {
    component.validate(null);
    expect(formValidatorServiceSpy.validate).toHaveBeenCalledWith(
      component.form
    );
  });
});
