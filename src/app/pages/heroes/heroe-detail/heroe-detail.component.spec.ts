import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog } from '@angular/cdk/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoadingService } from '../../../components/loading/services/loading.service';
import { EFormMode } from '../../../models/form';
import { HeroeService } from '../../../services/heroe.service';
import { HeroeDetailComponent } from './heroe-detail.component';

describe('HeroeDetailComponent', () => {
  let component: HeroeDetailComponent;
  let fixture: ComponentFixture<HeroeDetailComponent>;
  let router: Router;

  const heroeServiceSpy = jasmine.createSpyObj('HeroeService', ['getDetail', 'createHeroe', 'updateHeroe']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
    'show',
    'hide',
  ]);
  const dialogSpy = jasmine.createSpyObj('Dialog', ['open', 'closeAll']);

  const heroeMock = {
    id: 1,
    name: 'A-Bomb',
    slug: '1-a-bomb',
    powerstats: {
      intelligence: 38,
      strength: 100,
      speed: 17,
      durability: 80,
      power: 24,
      combat: 64,
    },
    appearance: {
      gender: 'MALE',
      race: 'HUMAN',
      height: 203,
      weight: 441,
      eyeColor: 'YELLOW',
      hairColor: 'NO_HAIR',
    },
    biography: {
      fullName: 'Richard Milhouse Jones',
      alterEgos: 'No alter egos found.',
      aliases: ['Rick Jones'],
      placeOfBirth: 'Scarsdale, Arizona',
      firstAppearance: 'Hulk Vol 2 #2 (April, 2008) (as A-Bomb)',
      publisher: 'Marvel Comics',
      alignment: 'good',
    },
    work: {
      occupation: 'Musician, adventurer, author; formerly talk show host',
      base: null,
    },
    connections: {
      groupAffiliation:
        'Hulk Family; Excelsior (sponsor), Avengers (honorary member); formerly partner of the Hulk, Captain America and Captain Marvel; Teen Brigade; ally of Rom',
      relatives:
        'Marlo Chandler-Jones (wife); Polly (aunt); Mrs. Chandler (mother-in-law); Keith Chandler, Ray Chandler, three unidentified others (brothers-in-law); unidentified father (deceased); Jackie Shorr (alleged mother; unconfirmed)',
    },
    images: {
      xs: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/xs/1-a-bomb.jpg',
      sm: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/1-a-bomb.jpg',
      md: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/1-a-bomb.jpg',
      lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/1-a-bomb.jpg',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HeroeDetailComponent,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: HeroeService, useValue: heroeServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: Dialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HeroeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should set create form mode and load form on init', () => {

    spyOnProperty(router, 'url', 'get').and.returnValue('/heroes/create');
    component.id = null;
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.CREATE);
    expect(component.form).not.toBeNull();
  });

  it('should set edit form mode, get heroe and update form', () => {
    const idMock = '1';
    spyOnProperty(router, 'url', 'get').and.returnValue(`/heroes/${idMock}/edit`);
    component.id = idMock;
    heroeServiceSpy.getDetail.and.returnValue(of(heroeMock));
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.EDIT);
    expect(heroeServiceSpy.getDetail).toHaveBeenCalled();
    expect(component.heroe).toEqual(heroeMock)

    const { id, name, powerstats, biography, appearance, work, images } = heroeMock;
    expect(component.form.getRawValue()).toEqual({
      id, name, powerstats, biography, appearance, work, images
    });
    expect(component.fileUpload()).toEqual(heroeMock.images.md);
  });

  it('should update file upload component when file is received', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/heroes/create');
    component.id = null;
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.CREATE);

    const fileMock = new File(['test'], 'file.png');
    component.onFileUploadChange(fileMock);

    expect(component.fileUpload()).toEqual(fileMock);
  });

  it('should update detect heroe changes when form values are changed',  ()=> {
    const idMock = '1';
    spyOnProperty(router, 'url', 'get').and.returnValue(`/heroes/${idMock}/edit`);
    component.id = idMock;
    heroeServiceSpy.getDetail.and.returnValue(of(heroeMock));
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.EDIT);
    expect(heroeServiceSpy.getDetail).toHaveBeenCalled();
    expect(component.heroe).toEqual(heroeMock);

    const fieldMock = 'name';
    const valueMock = 'Test 2'
    component.form.get(fieldMock).setValue(valueMock);
    fixture.detectChanges();

    expect(component.heroeChanges.length).toBeGreaterThan(0);
  });

  it('should show confirm cancel modal when there are changes and cancel button is clicked', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/heroes/create');
    const dialogRefSpy = dialogSpy.open.and.returnValue({
      componentInstance: {
        closeModal: of({})
      }
    });
    spyOn(router, 'navigate');

    component.id = null;
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.CREATE);

    const fieldMock = 'name';
    const valueMock = 'Test 2'
    component.form.get(fieldMock).setValue(valueMock);
    component.form.markAsDirty();

    component.onCancel();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy).toHaveBeenCalled();
    expect(component.form.pristine).toBeTruthy();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes/search']);
  });

  it('should navigate to heroe search page when cancel button is clicked and there are not changes in form', () => {
    component.id = null;
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.CREATE);

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/heroes/search']);
  });

  it('should create heroe when form is valid and save button is clicked', () => {
    const {name, powerstats, biography, appearance } = heroeMock;

    spyOnProperty(router, 'url', 'get').and.returnValue('/heroes/create');
    const dialogRefSpy = dialogSpy.open.and.returnValue({
      componentInstance: {
        closeModal: of({})
      }
    });
    spyOn(router, 'navigate');

    component.id = null;
    fixture.detectChanges();

    component.form.patchValue({name, powerstats, biography, appearance});
    fixture.detectChanges();

    component.onSaveChanges();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(heroeServiceSpy.createHeroe).toHaveBeenCalled();
    expect(component.form.pristine).toBeTruthy();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes/search']);
  });

  it('should update heroe when form is valid and save button is clicked', () => {
    const idMock = '1';
    const newNameMock = 'Test 2'
    const dialogRefSpy = dialogSpy.open.and.returnValue({
      componentInstance: {
        closeModal: of({})
      }
    });
    spyOn(router, 'navigate');
    spyOnProperty(router, 'url', 'get').and.returnValue(`/heroes/${idMock}/edit`);
    component.id = idMock;
    heroeServiceSpy.getDetail.and.returnValue(of(heroeMock));
    fixture.detectChanges();

    component.id = null;
    fixture.detectChanges();

    component.form.patchValue({name: newNameMock});
    fixture.detectChanges();

    expect(component.heroeChanges.length).toBeGreaterThan(0);

    component.onSaveChanges();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(heroeServiceSpy.updateHeroe).toHaveBeenCalled();
    expect(component.heroeChanges.length).toBe(0);
    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes/search']);
  });

  it('should show confirm cancel modal when there are changes and can deactive is invoked', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/heroes/create');
    const dialogRefSpy = dialogSpy.open.and.returnValue({
      componentInstance: {
        closeModal: of({})
      }
    });
    spyOn(router, 'navigate');

    component.id = null;
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.CREATE);

    const fieldMock = 'name';
    const valueMock = 'Test 2'
    component.form.get(fieldMock).setValue(valueMock);
    component.form.markAsDirty();

    component.onCancel();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy).toHaveBeenCalled();
    expect(component.form.pristine).toBeTruthy();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes/search']);
  });

  it('should navigate to heroe search page when can deactive is invoked', () => {
    component.id = null;
    fixture.detectChanges();

    expect(component.formMode()).toEqual(EFormMode.CREATE);

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/heroes/search']);
  });
});
