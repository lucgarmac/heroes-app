import { Dialog, DialogRef } from '@angular/cdk/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, map, of, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { FileUploaderModule } from '../../../components/file-uploader/file-uploader.module';
import { LoadingService } from '../../../components/loading/services/loading.service';
import { ITab } from '../../../models/components/tab';
import { EFormControlStatus, EFormMode } from '../../../models/form';
import {
  EHeroeProperty,
  EOperationPatch,
  IHeroeDetail,
  IHeroePostRequest,
  IPatchRequest,
} from '../../../models/heroe';
import { ObjectUrlPipe } from '../../../pipes/object-url.pipe';
import { SecureUrlPipe } from '../../../pipes/secure-url.pipe';
import { HeroeService } from '../../../services/heroe.service';
import { AppearanceComponent } from './components/appearance/appearance.component';
import { BiographyComponent } from './components/biography/biography.component';
import { PowerstatsComponent } from './components/powerstats/powerstats.component';
@Component({
  selector: 'app-heroe-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    FileUploaderModule,
    AppearanceComponent,
    BiographyComponent,
    PowerstatsComponent,
    SecureUrlPipe,
    ObjectUrlPipe,
  ],
  templateUrl: './heroe-detail.component.html',
  styleUrl: './heroe-detail.component.scss',
})
export class HeroeDetailComponent implements OnInit {
  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _dialog: Dialog,
    private _matDialog: MatDialog,
    private _heroeService: HeroeService,
    private _loadingService: LoadingService
  ) {}
  private readonly _stopObservables$ = new Subject<void>();
  private readonly _formControlNames = [
    'id',
    'name',
    'powerstats',
    'biography',
    'appearance',
    'occupation',
    'base',
  ];

  @Input() id: string;

  form!: FormGroup;
  tabs: ITab[] = [
    {
      id: EHeroeProperty.POWERSTATS,
      labelKey: 'HEROES.HEROE.POWERSTATS.TITLE',
    },
    {
      id: EHeroeProperty.BIO,
      labelKey: 'HEROES.HEROE.BIO.TITLE',
    },
    {
      id: EHeroeProperty.APPEARANCE,
      labelKey: 'HEROES.HEROE.APPEARANCE.TITLE',
    },
    {
      id: EHeroeProperty.WORK,
      labelKey: 'HEROES.HEROE.WORK.TITLE',
    },
  ];
  heroePropertyEnum = EHeroeProperty;
  heroe!: IHeroeDetail;
  formMode: WritableSignal<EFormMode> = signal(EFormMode.CREATE);
  formModeEnum = EFormMode;
  fileUpload: WritableSignal<File | string | null> = signal(null);
  heroeChanges: IPatchRequest[];

  private _initForm() {
    this.form = this._builder.group({
      id: [{ value: '', disabled: true }],
      name: ['', this.formMode() !== EFormMode.DETAIL && Validators.required],
      powerstats: [
        null,
        this.formMode() !== EFormMode.DETAIL && Validators.required,
      ],
      biography: [
        null,
        this.formMode() !== EFormMode.DETAIL && Validators.required,
      ],
      appearance: [
        null,
        this.formMode() !== EFormMode.DETAIL && Validators.required,
      ],
      occupation: [''],
      base: [''],
    });

    this.form.valueChanges.subscribe((val) => {
      // console.log(val);
      this._getHeroeChanges();
    });
  }

  private _confirmSaveChanges() {
    this._loadingService.show('HEROES.CREATE.LOADING');
    const request =
      this.formMode() === EFormMode.EDIT
        ? this.heroeChanges
        : this._getRequest();
    const observable =
      this.formMode() === EFormMode.EDIT
        ? this._heroeService.updateHeroe(<IPatchRequest[]>request)
        : this._heroeService.createHeroe(<IHeroePostRequest>request);

    observable.pipe(takeUntil(this._stopObservables$)).subscribe({
      next: () => {
        this._loadingService.hide();
        this._dialog.closeAll();
        this.formMode() === EFormMode.EDIT && (this.heroeChanges = []);
        this.formMode() === EFormMode.CREATE && this.form.markAsPristine();
        this._router.navigate(['/heroes/search']);
      },
      error: (_) => this._loadingService.hide(),
    });
  }

  private _getRequest(): IHeroePostRequest {
    const { name, powerstats, bio, appearance, occupation, base } =
      this.form.getRawValue();
    return {
      name,
      ...powerstats,
      ...bio,
      ...appearance,
      occupation,
      base,
      image: this.fileUpload(),
    };
  }

  private _updateForm() {
    const { id, name, powerstats, biography, appearance, work, images } =
      this.heroe;
    this.form.patchValue({
      id,
      name,
      powerstats,
      biography,
      appearance,
      occupation: work?.occupation ?? null,
      base: work?.base ?? null,
    });

    this.fileUpload.set(images?.md);
    this.formMode() === EFormMode.DETAIL &&
      this._changeStatusFormControls(
        this._formControlNames,
        EFormControlStatus.DISABLED
      );
  }

  private _changeStatusFormControls(
    controlNames: string[],
    status: EFormControlStatus
  ) {
    controlNames.forEach((controlName) =>
      status === EFormControlStatus.ENABLED
        ? this.form.get(controlName).enable()
        : this.form.get(controlName).disable()
    );
  }

  private _showConfirmCancelModal() {
    const dialogRef: DialogRef<any, any> = this._dialog.open<string>(
      ConfirmModalComponent,
      {
        disableClose: true,
        data: {
          title: 'GENERAL.CANCEL.MODAL.TITLE',
          message: 'GENERAL.CANCEL.MODAL.MESSAGE',
        },
      }
    );

    dialogRef.componentInstance.closeModal
      .pipe(takeUntil(this._stopObservables$))
      .subscribe((_: void) => {
        this.formMode() === EFormMode.EDIT && (this.heroeChanges = []);
        this.formMode() === EFormMode.CREATE && this.form.markAsPristine();
        this._dialog.closeAll();
        this._router.navigate(['/heroes/search']);
      });

    return false;
  }

  private _getHeroeChanges() {
    this.heroeChanges = [];
    if (this.formMode() === EFormMode.EDIT) {
      const { name, occupation, base } = this.form.getRawValue();
      const {
        name: originalName,
        images: { md: originalImage },
        work: { occupation: originalOccupation, base: originalBase },
      } = this.heroe;

      const changes = [
        { key: 'name', previousValue: originalName, currentValue: name },
        {
          key: 'image',
          previousValue: originalImage,
          currentValue: this.fileUpload(),
        },
        {
          key: 'occupation',
          previousValue: originalOccupation,
          currentValue: occupation,
        },
        { key: 'base', previousValue: originalBase, currentValue: base },
        ...this._getPowerstatsChanges(),
        ...this._getBiographyChanges(),
        ...this._getAppearanceChanges(),
      ];

      changes.forEach((change) => {
        const operation =
          (Array.isArray(change.previousValue) &&
            ((change.previousValue?.length === change.currentValue?.length &&
              !change.previousValue?.every((item) =>
                change.currentValue?.includes(item)
              )) ||
              change.previousValue?.length !== change.currentValue?.length)) ||
          (!Array.isArray(change.previousValue) &&
            change.previousValue !== change.currentValue)
            ? 'add'
            : 'remove';
        this._updateHeroeChanges(
          this._getPatchRequestField(
            change.key,
            change.previousValue,
            change.currentValue
          ),
          operation
        );
      });
    }
  }

  private _getPowerstatsChanges() {
    const formValues = this.form.getRawValue();
    if (!formValues.powerstats) {
      return [];
    }

    const {
      powerstats: { intelligence, strength, speed, durability, power, combat },
    } = formValues;

    const {
      powerstats: {
        intelligence: originalIntelligence,
        strength: originalStrength,
        speed: originalSpeed,
        durability: originalDurability,
        power: originalPower,
        combat: originalCombat,
      },
    } = this.heroe;

    return [
      {
        key: 'intelligence',
        previousValue: originalIntelligence,
        currentValue: intelligence,
      },
      {
        key: 'strength',
        previousValue: originalStrength,
        currentValue: strength,
      },
      { key: 'speed', previousValue: originalSpeed, currentValue: speed },
      {
        key: 'durability',
        previousValue: originalDurability,
        currentValue: durability,
      },
      { key: 'power', previousValue: originalPower, currentValue: power },
      { key: 'combat', previousValue: originalCombat, currentValue: combat },
    ];
  }

  private _getBiographyChanges() {
    const formValues = this.form.getRawValue();
    if (!formValues.biography) {
      return [];
    }

    const {
      biography: {
        fullName,
        alterEgos,
        aliases,
        placeOfBirth,
        firstAppearance,
        publisher,
        alignment,
      },
    } = formValues;

    const {
      biography: {
        fullName: originalFullName,
        alterEgos: originalAlterEgos,
        aliases: originalAliases,
        placeOfBirth: originalPlaceOfBirth,
        firstAppearance: originalFirstAppearance,
        publisher: originalPublisher,
        alignment: originalAlignment,
      },
    } = this.heroe;

    return [
      {
        key: 'fullName',
        previousValue: originalFullName,
        currentValue: fullName,
      },
      {
        key: 'alterEgos',
        previousValue: originalAlterEgos,
        currentValue: alterEgos,
      },
      { key: 'aliases', previousValue: originalAliases, currentValue: aliases },
      {
        key: 'placeOfBirth',
        previousValue: originalPlaceOfBirth,
        currentValue: placeOfBirth,
      },
      {
        key: 'firstAppearance',
        previousValue: originalFirstAppearance,
        currentValue: firstAppearance,
      },
      {
        key: 'publisher',
        previousValue: originalPublisher,
        currentValue: publisher,
      },
      {
        key: 'alignment',
        previousValue: originalAlignment,
        currentValue: alignment,
      },
    ];
  }

  private _getAppearanceChanges() {
    const formValues = this.form.getRawValue();
    if (!formValues.appearance) {
      return [];
    }

    const {
      appearance: { gender, race, height, weight, eyeColor, hairColor },
    } = this.form.getRawValue();

    const {
      appearance: {
        gender: originalGender,
        race: originalRace,
        height: originalHeight,
        weight: originalWeight,
        eyeColor: originalEyeColor,
        hairColor: originalHairColor,
      },
    } = this.heroe;

    return [
      { key: 'gender', previousValue: originalGender, currentValue: gender },
      { key: 'race', previousValue: originalRace, currentValue: race },
      { key: 'height', previousValue: originalHeight, currentValue: height },
      { key: 'weight', previousValue: originalWeight, currentValue: weight },
      {
        key: 'eyeColor',
        previousValue: originalEyeColor,
        currentValue: eyeColor,
      },
      {
        key: 'hairColor',
        previousValue: originalHairColor,
        currentValue: hairColor,
      },
    ];
  }

  private _updateHeroeChanges(
    patchRequestField: IPatchRequest,
    operation: 'add' | 'remove'
  ) {
    const patchFound = this.heroeChanges?.find(
      (item) => item?.path === patchRequestField?.path
    );
    if (patchFound) {
      this.heroeChanges = this.heroeChanges.filter(
        (item) => item.path !== patchFound.path
      );
    }

    operation === 'add' && this.heroeChanges.push(patchRequestField);
  }

  private _getPatchRequestField(
    fieldName: string,
    previousValue: any,
    newValue: any
  ) {
    let operation: EOperationPatch = EOperationPatch.REPLACE;

    this._isEmptyValue(previousValue) &&
      !this._isEmptyValue(newValue) &&
      (operation = EOperationPatch.ADD);
    !this._isEmptyValue(previousValue) &&
      !this._isEmptyValue(newValue) &&
      (operation = EOperationPatch.REPLACE);
    !this._isEmptyValue(previousValue) &&
      this._isEmptyValue(newValue) &&
      (operation = EOperationPatch.REMOVE);

    return {
      operation,
      path: fieldName,
      value: newValue,
    };
  }

  private _isEmptyValue(value: string | number | Array<any>) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && !value.trim().length) ||
      (Array.isArray(value) && !value?.length)
    );
  }

  onFileUploadChange(event: File) {
    this.fileUpload.set(event);
    this._getHeroeChanges();
  }

  onCancel() {
    if (
      (this.formMode() === EFormMode.CREATE && this.form.dirty) ||
      (this.formMode() === EFormMode.EDIT && this.heroeChanges?.length)
    ) {
      this._showConfirmCancelModal();
      return;
    }

    this._router.navigate(['/heroes/search']);
  }

  onSaveChanges() {
    if (this.form.valid) {
      if (this.formMode() === EFormMode.EDIT && !this.heroeChanges?.length) {
        return;
      }

      const dialogRef: DialogRef<any, any> = this._dialog.open<string>(
        ConfirmModalComponent,
        {
          disableClose: true,
          data: {
            title: 'GENERAL.SAVE.MODAL.TITLE',
            message: 'GENERAL.SAVE.MODAL.MESSAGE',
          },
        }
      );

      dialogRef.componentInstance.closeModal
        .pipe(takeUntil(this._stopObservables$))
        .subscribe((_: void) => {
          this._confirmSaveChanges();
        });
    }
  }

  canDeactivate() {
    return (this.formMode() === EFormMode.CREATE && this.form.dirty) ||
      (this.formMode() === EFormMode.EDIT && !!this.heroeChanges?.length)
      ? this._showConfirmCancelModal()
      : true;
  }

  ngOnInit(): void {
    const createCondition = !this.id ? EFormMode.CREATE : EFormMode.DETAIL;
    this.formMode.set(
      this.id && this._router.url.includes('edit')
        ? EFormMode.EDIT
        : createCondition
    );
    this._initForm();

    if (this.id) {
      this._heroeService
        .getDetail(this.id)
        .pipe(takeUntil(this._stopObservables$))
        .subscribe((response) => {
          this.heroe = response;
          this._updateForm();
          this._getHeroeChanges();
        });
    }
  }
}
