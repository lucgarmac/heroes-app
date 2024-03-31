import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../components/notification/services/notification.service';
import { EOperationPatch } from '../models/heroe';
import { HeroeService } from './heroe.service';

describe('HeroeService', () => {
  let service: HeroeService;
  let httpMock: HttpTestingController;

  const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);

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
      images: {
        xs: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/xs/1-a-bomb.jpg',
        sm: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/1-a-bomb.jpg',
        md: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/1-a-bomb.jpg',
        lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/1-a-bomb.jpg',
      },
    },
  ];

  const requestPostMock = {
    name: 'A-Bomb',
    image: new File(['text'], 'img.png'),
    intelligence: 38,
    strength: 100,
    speed: 17,
    durability: 80,
    power: 24,
    combat: 64,
    gender: 'MALE',
    race: 'HUMAN',
    height: 203,
    weight: 441,
    eyeColor: 'YELLOW',
    hairColor: 'NO_HAIR',
    fullName: 'Richard Milhouse Jones',
    alterEgos: 'No alter egos found.',
    aliases: ['Rick Jones'],
    placeOfBirth: 'Scarsdale, Arizona',
    firstAppearance: 'Hulk Vol 2 #2 (April, 2008) (as A-Bomb)',
    publisher: 'Marvel Comics',
    alignment: 'good',
    occupation: 'Musician, adventurer, author; formerly talk show host',
    base: null,
  };

  const requestPatchMock = [
    {operation: EOperationPatch.ADD, path: 'name', value: 'test'}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {provide: NotificationService, useValue: notificationServiceSpy}],
    });
    service = TestBed.inject(HeroeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find heroes by name', () => {
    const nameMock = heroesMock[0].name;
    service.findHeroes(nameMock).subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res).toEqual(heroesMock);
    });

    const request = httpMock.expectOne(`/assets/config/heroes.json`);
    expect(request.request.method).toBe('GET');
    request.flush(heroesMock);
  });

  it('should get a heroe detail', () => {
    const idMock = heroesMock[0].id;
    service.getDetail(idMock.toString()).subscribe((res) => {
      expect(res).toEqual(heroesMock[0]);
    });

    const request = httpMock.expectOne(`/assets/config/heroes.json`);
    expect(request.request.method).toBe('GET');
    request.flush(heroesMock);
  });

  it('should create a heroe', (done: DoneFn) => {
    service.createHeroe(requestPostMock).subscribe((res) => {
      expect(res).toEqual({ id: 9999 });
      expect(notificationServiceSpy.show).toHaveBeenCalled();
      done();
    });
  });

  it('should update a heroe', (done: DoneFn) => {
    service.updateHeroe(requestPatchMock).subscribe((res) => {
      expect(res).toEqual({ updated: true });
      expect(notificationServiceSpy.show).toHaveBeenCalled();
      done();
    });
  });

  it('should remove a heroe', (done: DoneFn) => {
    const idMock = 1;
    service.deleteHeroe(idMock.toString()).subscribe((res) => {
      expect(res).toEqual({ deleted: true });
      expect(notificationServiceSpy.show).toHaveBeenCalled();
      done();
    });
  });
});
