import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  const dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmModalComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: DialogRef, useValue: dialogRefSpy},
        {provide: DIALOG_DATA, useValue:  {}},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get default values when data is not received', () => {
    fixture.detectChanges();
    expect(component.title()).toBe('');
    expect(component.message()).toBe('');
    expect(component.messageParams()).toEqual({});
    expect(component.cancelText()).toBe('GENERAL.CANCEL.TITLE');
    expect(component.confirmText()).toBe('GENERAL.CONFIRM');
  });

  it('should change values when data is received', () => {
    const dialogDataMock = {
      title: 'title test',
      message: 'message test',
      messageParams: {param: 'test'},
      cancelText: 'Cancel',
      confirmText: 'Confirm',
    };

    component.data = dialogDataMock;
    fixture.detectChanges();

    expect(component.title()).toBe(dialogDataMock.title);
    expect(component.message()).toBe(dialogDataMock.message);
    expect(component.messageParams()).toEqual(dialogDataMock.messageParams);
    expect(component.cancelText()).toBe(dialogDataMock.cancelText);
    expect(component.confirmText()).toBe(dialogDataMock.confirmText);
  });

  it('should close modal when cancel button is clicked', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.cancel-button');

    btn.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should emit close modal output when confirm button is clicked', () => {
    fixture.detectChanges();
    const closeModalSpy = spyOn(component.closeModal, 'emit');
    const btn = fixture.nativeElement.querySelector('.confirm-button');

    btn.click();

    expect(closeModalSpy).toHaveBeenCalled();
  });
});
