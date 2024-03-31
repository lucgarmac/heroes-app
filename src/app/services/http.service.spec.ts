import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {
  let service: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return http params when request is received', () => {
    const requestMock = {
      name: 'test'
    };

    const result = service.parseToHttpParams(requestMock);

    expect(result).not.toBe(null);
    expect(result.keys()).toEqual(Object.keys(requestMock));
  });

  it('should return undefined when request is not received', () => {
    const requestMock = null;
    const result = service.parseToHttpParams(requestMock);
    expect(result).toBe(null);
  });
});
