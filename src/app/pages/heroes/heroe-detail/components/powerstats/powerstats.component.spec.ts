import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerstatsComponent } from './powerstats.component';

describe('PowerstatsComponent', () => {
  let component: PowerstatsComponent;
  let fixture: ComponentFixture<PowerstatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerstatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PowerstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
