import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHeroesComponent } from './search-heroes.component';

describe('SearchHeroesComponent', () => {
  let component: SearchHeroesComponent;
  let fixture: ComponentFixture<SearchHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHeroesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchHeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
