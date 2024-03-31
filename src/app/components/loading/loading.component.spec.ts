import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoadingComponent,
        TranslateModule.forRoot()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('show title message when received input message', () => {
    const messageMock = 'Test';
    component.messageKey = messageMock;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.loading_message').textContent
    ).toBe(messageMock);
  });
});
