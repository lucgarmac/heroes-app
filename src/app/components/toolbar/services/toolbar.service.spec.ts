import { TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToolbarService } from './toolbar.service';

import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ToolbarService', () => {
  let service: ToolbarService;

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        ToolbarService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });

    service = TestBed.inject(ToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the menu when method is invoked', (done: DoneFn) => {
    const menuMock = [
      {
        path: '/',
        label: 'test',
      },
    ];

    httpClientSpy.get.and.returnValue(of(menuMock));

    service.getMenu().subscribe({
      next: (res) => {
        expect(res.length).toBe(menuMock.length);
        expect(res).toEqual(menuMock);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should return an empty array when the server is failed', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(throwError(() => 'error'));
    service.getMenu().subscribe({
      next: (response) => {
        expect(response.length).toBe(0);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should return the languages when method is invoked', (done: DoneFn) => {
    const languagesMock = [
      {
        localeId: 'es',
        label: 'Spain',
      },
      {
        localeId: 'en',
        label: 'English',
      },
    ];

    httpClientSpy.get.and.returnValue(of(languagesMock));

    service.getLanguages().subscribe({
      next: (res) => {
        expect(res.length).toBe(languagesMock.length);
        expect(res).toEqual(languagesMock);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should return an empty array when the server is failed', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(throwError(() => 'error'));
    service.getLanguages().subscribe({
      next: (response) => {
        expect(response.length).toBe(0);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get).toHaveBeenCalled();
  });
});
