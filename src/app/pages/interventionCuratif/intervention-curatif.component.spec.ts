import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionCuratifComponent } from './intervention-curatif.component';

describe('InterventionCuratifComponent', () => {
  let component: InterventionCuratifComponent;
  let fixture: ComponentFixture<InterventionCuratifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionCuratifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionCuratifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
