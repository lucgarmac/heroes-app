import { TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToolbarService } from './toolbar.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('ToolbarService', () => {
  let toolbarService: ToolbarService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule ,
        TranslateModule.forRoot(),
      ],
      providers: [
        ToolbarService,
        TranslateService
      ]
    });

    toolbarService = new ToolbarService(httpClientSpy);

  });

  it('should be created', () => {
    expect(toolbarService).toBeTruthy();
  });

  it('should return the menu when method is invoked', (done: DoneFn) => {
    const dataMock = [
      {
        "path": "/",
        "label": "test"
      },
    ];

    httpClientSpy.get.and.returnValue(of(dataMock));
    toolbarService.getMenu().subscribe({
      next: (response) => {
        expect(response).toEqual(dataMock);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should return an empty array when the server is failed', (done: DoneFn) => {

    httpClientSpy.get.and.returnValue(throwError(() => 'error'));
    toolbarService.getMenu().subscribe({
      next: (response) => {
        expect(response).toEqual([]);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('should return the languages when method is invoked', (done: DoneFn) => {

    const dataMock = [
      {
        "localeId": "es",
        "label": "Spain"
      },
      {
        "localeId": "en",
        "label": "English"
      }
    ];


    httpClientSpy.get.and.returnValue(of(dataMock));
    toolbarService.getLanguages().subscribe({
      next: (response) => {
        expect(response).toEqual(dataMock);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('should return an empty array when the server is failed', (done: DoneFn) => {

    httpClientSpy.get.and.returnValue(throwError(() => 'error'));
    toolbarService.getLanguages().subscribe({
      next: (response) => {
        expect(response).toEqual([]);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });


});


