import {
  Component,
  Input,
  OnInit,
  forwardRef
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ListItem } from '../../../../../models/list-item';
import { FormValidatorService } from '../../../../../services/form-validator.service';
import { IAppearanceForm } from '../../models/heroe-detail';
import { EFormMode } from '../../../../../models/form';

@Component({
  selector: 'app-heroe-appearance',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppearanceComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AppearanceComponent),
      multi: true,
    },
  ],
  templateUrl: './appearance.component.html',
  styleUrl: './appearance.component.scss',
})
export class AppearanceComponent
  implements ControlValueAccessor, Validator, OnInit
{
  constructor(
    private _builder: FormBuilder,
    private _formValidatorService: FormValidatorService,
    private _translateService: TranslateService
  ) {}

  private readonly _stopObservables$ = new Subject<void>();
  private readonly _defaultFormValues = {
    gender: '',
    race: '',
    height: null,
    weight: null,
    eyeColor: '',
    hairColor: '',
  };
  private readonly _baseKeysTranslate = [
    'GENERAL.EYES_COLORS',
    'GENERAL.GENDERS',
    'GENERAL.HAIR_COLORS',
    'GENERAL.RACES',
  ];

  @Input('mode') formMode: EFormMode;

  genders: ListItem[];
  races: ListItem[];
  eyesColors: ListItem[];
  hairColors: ListItem[];

  form!: FormGroup;

  onChange = (value: IAppearanceForm) => {};
  onTouched = () => {};

  private _loadLists() {
    this._translateService.get(this._baseKeysTranslate).pipe(
      takeUntil(this._stopObservables$)
    ).subscribe((response) => {
      this.eyesColors = this._fillList(this._baseKeysTranslate[0], response);
      this.genders = this._fillList(this._baseKeysTranslate[1], response);
      this.hairColors = this._fillList(this._baseKeysTranslate[2], response);
      this.races = this._fillList(this._baseKeysTranslate[3], response);
    });
  }

  private _changeLanguageEventListener() {
    this._translateService.onLangChange
      .pipe(
        takeUntil(this._stopObservables$),
        switchMap( () => this._translateService.get(this._baseKeysTranslate))
      )
      .subscribe((response) => {
        this.eyesColors = this._fillList(this._baseKeysTranslate[0], response);
        this.genders = this._fillList(this._baseKeysTranslate[1], response);
        this.hairColors = this._fillList(this._baseKeysTranslate[2], response);
        this.races = this._fillList(this._baseKeysTranslate[3], response);
      })
  }

  private _fillList(baseKey: string, translations: any): ListItem[] {
    if(!baseKey || !Object.keys(translations)?.length ) {
      return null;
    }

    const objectKeyTranslate = Object.keys(translations).find(item => item === baseKey);
    if(!objectKeyTranslate) {
      return [];
    }

    return Object.entries(translations[objectKeyTranslate])
      .map(item => <ListItem>({value: item[0], label: item[1]}));
  }

  private _initForm() {
    this.form = this._builder.group({
      gender: ['', this.formMode !== EFormMode.DETAIL && Validators.required],
      race: [''],
      height: [null, this.formMode !== EFormMode.DETAIL && Validators.required],
      weight: [null,this.formMode !== EFormMode.DETAIL &&  Validators.required],
      eyeColor: [''],
      hairColor: [''],
    });

    this.form.valueChanges
      .pipe(takeUntil(this._stopObservables$))
      .subscribe(value => this.onChange(value));
  }

  writeValue(obj: IAppearanceForm): void {
    if (!obj) {
      this.form.setValue(this._defaultFormValues);
      this.onChange(this.form.getRawValue());
      return;
    }

    this.form.patchValue({...obj});
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
    this._loadLists();
    this._initForm();
    this._changeLanguageEventListener();
  }
}
