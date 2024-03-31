import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { TitleBarService } from './services/title-bar.service';
import { TitleBarComponent } from './title-bar.component';

describe('TitleBarComponent', () => {
  let component: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;

  const titleBarServiceSpy = jasmine.createSpyObj('TitleBarService', [
    'isUrlWithReturn',
    'getTitleKey',
    'getRouteNavigate',
    'paramsTitle$',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'events']);
  const eventSubject = new Subject<RouterEvent>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleBarComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TitleBarService, useValue: titleBarServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    routerSpy.events = eventSubject.asObservable();
    titleBarServiceSpy.paramsTitle$ = of({ id: '1' });

    fixture = TestBed.createComponent(TitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set props title bar when route is received', () => {
    const routerMock = '/heroes/search';

    titleBarServiceSpy.getTitleKey.and.returnValue(routerMock);
    titleBarServiceSpy.getRouteNavigate.and.returnValue('');

    eventSubject.next(new NavigationEnd(1, routerMock, routerMock));

    expect(titleBarServiceSpy.isUrlWithReturn).toHaveBeenCalled();
    expect(titleBarServiceSpy.getTitleKey).toHaveBeenCalled();
    expect(titleBarServiceSpy.getRouteNavigate).toHaveBeenCalled();
    expect(component.isVisibleReturn()).toBeFalsy();
    expect(component.title()).toBe(routerMock);
    expect(component.routeNavigate()).toBe('');
  });

  it('should set params title when params url is received', () => {
    expect(component.paramsTitle()).toEqual({ id: '1' });
  });
});
