import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { TitleBarService } from './components/title-bar/services/title-bar.service';

let fixture: ComponentFixture<AppComponent>;
let app: AppComponent;

const titleBarServiceSpy = jasmine.createSpyObj('TitleBarService', ['isValidUrl$']);

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: TitleBarService, useValue: titleBarServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(app).toBeTruthy();
    expect(app.isNotFoundPage()).toBeFalsy();
  });

  it('should set true not found page when received a true flag', () => {
    titleBarServiceSpy.isValidUrl$.and.returnValue(of(true));
    fixture.detectChanges();

    expect(app.isNotFoundPage()).toBeTruthy();
  });

});
