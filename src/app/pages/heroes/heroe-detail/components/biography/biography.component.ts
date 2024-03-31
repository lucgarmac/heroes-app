import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FormValidatorService } from '../../../../../services/form-validator.service';
import { IBioForm } from '../../models/heroe-detail';
import { EFormMode } from '../../../../../models/form';

@Component({
  selector: 'app-heroe-biography',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BiographyComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BiographyComponent),
      multi: true
    }
  ],
  templateUrl: './biography.component.html',
  styleUrl: './biography.component.scss',
})
export class BiographyComponent
  implements ControlValueAccessor, Validator, OnInit
{
  constructor(
    private _builder: FormBuilder,
    private _formValidatorService: FormValidatorService
  ) {}

  private _stopObservables$ = new Subject<void>();
  private _defaultFormValues = {
    fullName: '',
    alterEgos: '',
    placeOfBirth: '',
    firstAppearance: '',
    publisher: '',
    alignment: '',
    aliases: [],
  };

  @Input('mode') formMode: EFormMode;

  form!: FormGroup;
  aliasInput!: string;
  formModeEnum = EFormMode;

  onChange = (value: IBioForm) => {};
  onTouched = () => {};

  private _initForm() {
    this.form = this._builder.group({
      fullName: ['', this.formMode !== EFormMode.DETAIL && Validators.required],
      alterEgos: ['', this.formMode !== EFormMode.DETAIL && Validators.required],
      placeOfBirth: [''],
      firstAppearance: [''],
      publisher: ['', this.formMode !== EFormMode.DETAIL && Validators.required],
      alignment: ['', this.formMode !== EFormMode.DETAIL && Validators.required],
      aliases: this._builder.array([]),
    });

    this.form.valueChanges
      .pipe(takeUntil(this._stopObservables$))
      .subscribe(value => {this.onChange({
        ...value,
        aliases: value?.aliases?.map(alias => alias.item)
      })});
  }

  private _fillAliases(aliases: string[]) {
    if(!aliases?.length) {
      return;
    }

    aliases.forEach(alias => this.aliasItems.push(
      this._builder.group({
        item: [alias],
      })
    ))
  }

  get aliasItems() {
    return <FormArray>this.form.get('aliases');
  }

  onAddAlias() {
    this.aliasItems.push(
      this._builder.group({
        item: [this.aliasInput],
      })
    );
    this.aliasInput = '';
  }

  onRemoveAlias(index: number) {
    this.aliasItems.removeAt(index);
  }

  writeValue(obj: IBioForm): void {
    if (!obj) {
      this.form.setValue(this._defaultFormValues);
      this.onChange(this.form.getRawValue());
      return;
    }

    const {aliases, ...values} = obj;
    this.form.patchValue({ ...values });
    this._fillAliases(aliases);
    const formValues = this.form.getRawValue();
    this.onChange({
      ...formValues,
      aliases: formValues?.aliases?.map(alias => alias.item)
    });
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
