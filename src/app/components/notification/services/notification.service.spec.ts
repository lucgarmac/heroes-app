import { NotificationComponent } from './../notification.component';
import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENotificationType } from '../models/notification';

describe('NotificationService', () => {
  let service: NotificationService;

  const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: MatSnackBar, useValue: snackBarSpy}
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open snackbar when show method is invoked', () => {
    const configMock = {
      messageKey: 'Test',
      type: ENotificationType.SUCCESS,
      closeInMillis: 500
    };
    service.show(configMock);

    const expectedConfig = {
      duration: configMock.closeInMillis,
      data: {
        message: configMock.messageKey,
        type:configMock.type
      }
    };
    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, expectedConfig)
  });
});
