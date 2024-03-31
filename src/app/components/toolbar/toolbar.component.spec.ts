import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { ToolbarService } from './services/toolbar.service';
import { ToolbarComponent } from './toolbar.component';


describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  const menuMock = [
    {
      "path": "/home",
      "label": "HOME.TITLE"
    }
  ];
  const languagesMock = [
    {
      "localeId": "es",
      "label": "COMPONENTS.TOOLBAR.LANGUAGE.ES"
    },
    {
      "localeId": "en",
      "label": "COMPONENTS.TOOLBAR.LANGUAGE.EN"
    }
  ];

  const toolbarServiceSpy = jasmine.createSpyObj('ToolbarService', ['getMenu', 'getLanguages'])
  const titleServiceSpy = jasmine.createSpyObj('TitleService', ['updateTitle']);

  beforeEach(async () => {

   await TestBed.configureTestingModule({
      imports: [
        ToolbarComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: ToolbarService, useValue: toolbarServiceSpy},
        {provide: TitleService, useValue: titleServiceSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load menu and languages on init', () => {
    toolbarServiceSpy.getMenu.and.returnValue(of(menuMock));
    toolbarServiceSpy.getLanguages.and.returnValue(of(languagesMock));

    fixture.detectChanges();

    expect(toolbarServiceSpy.getMenu).toHaveBeenCalled();
    expect(toolbarServiceSpy.getLanguages ).toHaveBeenCalled();
    expect(component.menuItems()).toEqual(menuMock);
    expect(component.languages()).toEqual(languagesMock);
  });

  it('should update language when language is received', () => {
    const translateSetDefaultLangSpy = spyOn(component['_translateService'],'setDefaultLang');
    const translateUseSpy = spyOn(component['_translateService'],'use');
    const language = 'es';

    component.onSelectLanguage(language);

    expect(translateSetDefaultLangSpy).toHaveBeenCalled();
    expect(translateUseSpy).toHaveBeenCalled();
    expect(titleServiceSpy.updateTitle).toHaveBeenCalled();
  });


});
