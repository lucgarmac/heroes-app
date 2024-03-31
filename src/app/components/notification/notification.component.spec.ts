import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { ENotificationType } from './models/notification';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  let matSnackbarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismissWithAction']);

  const matSnackbarDataMock = {
    message: 'Test',
    type: ENotificationType.SUCCESS
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [
        {provide:MAT_SNACK_BAR_DATA, useValue: matSnackbarDataMock},
        {provide: MatSnackBarRef, useValue: matSnackbarRefSpy},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show message and set class notification type when data is received', () => {
    fixture.detectChanges();

    expect(component.message()).toBe(matSnackbarDataMock.message);
    expect(component.classNotification()).toContain(matSnackbarDataMock.type);
  });

  it('should close notification when dismiss button is clicked', () => {
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    expect(matSnackbarRefSpy.dismissWithAction).toHaveBeenCalled();
  });
});
