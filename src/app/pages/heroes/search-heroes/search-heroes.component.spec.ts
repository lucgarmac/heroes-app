import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from '../../../components/loading/services/loading.service';
import { HeroeService } from '../../../services/heroe.service';
import { SearchHeroesComponent } from './search-heroes.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import {Location} from '@angular/common';

@Component({
  template: '',
})
class DummyComponent {}


describe('SearchHeroesComponent', () => {
  let component: SearchHeroesComponent;
  let fixture: ComponentFixture<SearchHeroesComponent>;
  let location:Location;

  const heroeServiceSpy = jasmine.createSpyObj('HeroeService', [
    'findHeroes',
    'deleteHeroe',
  ]);
  const dialogSpy = jasmine.createSpyObj('Dialog', ['open', 'closeAll']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
    'show',
    'hide',
  ]);


  const heroesMock = [
    {
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
    },
    {
      id: 2,
      name: 'Abe Sapien',
      slug: '2-abe-sapien',
      powerstats: {
        intelligence: 88,
        strength: 28,
        speed: 35,
        durability: 65,
        power: 100,
        combat: 85,
      },
      appearance: {
        gender: 'MALE',
        race: 'ICTHYO_SAPIEN',
        height: 191,
        weight: 65,
        eyeColor: 'BLUE',
        hairColor: 'NO_HAIR',
      },
      biography: {
        fullName: 'Abraham Sapien',
        alterEgos: 'No alter egos found.',
        aliases: ['Langdon Everett Caul', 'Abraham Sapien', 'Langdon Caul'],
        placeOfBirth: null,
        firstAppearance: 'Hellboy: Seed of Destruction (1993)',
        publisher: 'Dark Horse Comics',
        alignment: 'good',
      },
      work: {
        occupation: 'Paranormal Investigator',
        base: null,
      },
      connections: {
        groupAffiliation: 'Bureau for Paranormal Research and Defense',
        relatives: 'Edith Howard (wife, deceased)',
      },
      images: {
        xs: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/xs/2-abe-sapien.jpg',
        sm: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/2-abe-sapien.jpg',
        md: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/2-abe-sapien.jpg',
        lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/2-abe-sapien.jpg',
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        BrowserAnimationsModule,
        SearchHeroesComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'heroes/1/edit', component: DummyComponent },
          { path: 'heroes/1', component: DummyComponent },
          { path: 'heroes/create', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: HeroeService, useValue: heroeServiceSpy },
        { provide: Dialog, useValue: dialogSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    }).compileComponents();

    heroeServiceSpy.findHeroes.and.returnValue(of(heroesMock));

    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(SearchHeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load config and table data on init', () => {
    spyOn(component['_nameSubject$'], 'subscribe')
    expect(component.displayedColumns.length).toBe(3);
    expect(component.pagination).toEqual(component['_defaultPagination']);
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(heroeServiceSpy.findHeroes).toHaveBeenCalled();
    expect(component.heroes.length).toBeGreaterThan(0);
    expect(component.heroes).toEqual(heroesMock);
  });

  it('should search heroes when set name', () => {
    spyOn(component['_nameSubject$'], 'subscribe')

    const nameFilterMock = 'Abe'
    component.onChangeName(nameFilterMock);

    expect(component.firstSearch).toBeTruthy();
    expect(component.name).toBe(nameFilterMock);
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(heroeServiceSpy.findHeroes).toHaveBeenCalled();
    expect(component.heroes.length).toBeGreaterThan(0);
    expect(component.heroes).toEqual(heroesMock);
  });

  it('should go to create heroe when new heroe button is clicked', () => {
    const createHeroeButton =  fixture.debugElement.nativeElement.querySelector('.create-heroe-button');
    createHeroeButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/heroes/create');
    });
  });

  it('should go to detail heroe when id link is clicked', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const detailLink =  fixture.debugElement.nativeElement.querySelector('.detail-link');
      detailLink.click();

      expect(location.path()).toBe('/heroes/1');
    });
  });

  it('should go to edit heroe when edit heroe button is clicked', () => {

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const editHeroeButton =  fixture.debugElement.nativeElement.querySelector('.edit-heroe-button');
      editHeroeButton.click();

      expect(location.path()).toBe('/heroes/1/edit');
    });

  });

  it('should open confirm delete heroe when delete button is clicked', () => {
    dialogSpy.open.and.returnValue({
      componentInstance: {
        closeModal: of({})
      }
    });
    component.onOpenDeleteHeroeModal(heroesMock[0]);

    expect(loadingServiceSpy.hide).toHaveBeenCalled();
    expect(heroeServiceSpy.deleteHeroe).toHaveBeenCalled();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(heroeServiceSpy.findHeroes).toHaveBeenCalled();

  });
});
