import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, WritableSignal, forwardRef, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { EFormMode } from '../../../../../models/form';
import { FormValidatorService } from '../../../../../services/form-validator.service';
import { IPowerstatsForm } from '../../models/heroe-detail';

@Component({
  selector: 'app-heroe-powerstats',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSliderModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PowerstatsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PowerstatsComponent),
      multi: true
    }
  ],
  templateUrl: './powerstats.component.html',
  styleUrl: './powerstats.component.scss'
})
export class PowerstatsComponent implements ControlValueAccessor,Validator,OnInit{

  constructor(
    private _builder: FormBuilder,
    private _formValidatorService: FormValidatorService) {}

  private readonly _stopObservables$ = new Subject<void>();
  private readonly _defaultFormValues = {
    intelligence: 0,
    strength: 0,
    speed: 0,
    durability: 0,
    power: 0,
    combat: 0,
  };

  @Input('mode') formMode: EFormMode;

  form!: UntypedFormGroup;
  formModeEnum = EFormMode;
  powerstatNames: string[] = [
    'intelligence',
    'strength',
    'speed',
    'durability',
    'power',
    'combat',
  ];

  onChange = (value:IPowerstatsForm) =>{};
  onTouched = () =>{};

  private _initForm() {
    this.form = this._builder.group({
      intelligence: [0, Validators.required],
      strength: [0, Validators.required],
      speed: [0, Validators.required],
      durability: [0, Validators.required],
      power: [0, Validators.required],
      combat: [0, Validators.required],
    });

    this.form.valueChanges
      .pipe(takeUntil(this._stopObservables$))
      .subscribe(value => this.onChange(value));
  }

  writeValue(obj: IPowerstatsForm): void {
    if(!obj) {
      this.form.setValue(this._defaultFormValues);
      this.onChange(this.form.getRawValue());
      return;
    }

    this.form.patchValue({...obj})
    this.onChange(this.form.getRawValue());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
   return this._formValidatorService.validate(this.form);
  }


  ngOnInit(): void {
    this._initForm();
  }


}
