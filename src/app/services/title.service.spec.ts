import { TestBed } from '@angular/core/testing';

import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TitleService } from './title.service';

describe('TitleService', () => {
  let service: TitleService;

  const titleServiceSpy = jasmine.createSpyObj('TitleService',['setTitle']);
  const translateServiceSpy = jasmine.createSpyObj('TranslateService',['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        {
          provide: Title,
          useValue: titleServiceSpy
        },
        {
          provide: TranslateService,
          useValue: translateServiceSpy
        }
      ]
    });
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the title', () => {
    const mockSnapshot = {} as any;
    const appTitleMock = 'GENERAL.APP';
    const titleTranslateMock = 'Heroes app';

    translateServiceSpy.get
      .and.returnValue(of(appTitleMock))
      .and.returnValue(of(titleTranslateMock));

    service.updateTitle(mockSnapshot);

    expect(translateServiceSpy.get).toHaveBeenCalledTimes(2);
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith(`${appTitleMock} - ${titleTranslateMock}`);
  });
});
