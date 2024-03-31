import { TestBed } from '@angular/core/testing';

import { TitleBarService } from './title-bar.service';
import { ActivatedRoute } from '@angular/router';

describe('TitleBarService', () => {
  let service: TitleBarService;

  const activatedRouteMock = {
    snapshot: {
      params: {}
    },
    firstChild: {
      snapshot: {
        params: {id: '1'}
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    });
    service = TestBed.inject(TitleBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when url received has not been found', () => {
    const mockUrl = '/test/1';
    const result = service.getRouteCurrentUrl(mockUrl,mockUrl);
    expect(result).toBe(null);
  });

  it('should return a title bar url object when url received has not been found', () => {
    const mockUrl = '/heroes/1';
    const result = service.getRouteCurrentUrl(mockUrl,mockUrl);

    const expectedResult = {
      id: 'heroes-detail',
      path: '/heroes/1',
      translateKey: 'HEROES.DETAIL.TITLE',
      params: ['id']
    };
    expect(result).toEqual(expectedResult);
  });

  it('should invoke to subject when received params', () => {
    const paramsMock = {id: '1'};
    const paramsSubjectSpy = spyOn(service['_paramsTitleSubject$'], 'next')

    service.setParamsTitle(paramsMock);

    expect(paramsSubjectSpy).toHaveBeenCalledWith(paramsMock);
  });

  it('should return true when url received is a route with return', () => {
    const mockUrl = '/heroes/1';
    const result = service.isUrlWithReturn(mockUrl,mockUrl);

    expect(result).toBeTruthy();
  });

  it('should return false when url received is not a route with return', () => {
    const mockUrl = '/about';
    const result = service.isUrlWithReturn(mockUrl,mockUrl);

    expect(result).toBeFalsy();
  });

  it('should get a title route  when url received is valid', () => {
    const mockUrl = '/heroes/1';
    const result = service.getTitleKey(mockUrl,mockUrl);

    expect(result).toBe('HEROES.DETAIL.TITLE');
  });

  it('should get a empty string when url received is invalid', () => {
    const mockUrl = '/invalid-route';
    const result = service.getTitleKey(mockUrl,mockUrl);

    expect(result).toBe('');
  });

  it('should get route to navigate when url received is valid', () => {
    const mockUrl = '/heroes/1';
    const result = service.getRouteNavigate(mockUrl,mockUrl);

    expect(result).toBe('/heroes/search');
  });

  it('should get a empty string when url received is invalid', () => {
    const mockUrl = '/invalid-route';
    const result = service.getRouteNavigate(mockUrl,mockUrl);

    expect(result).toBe('');
  });
});
