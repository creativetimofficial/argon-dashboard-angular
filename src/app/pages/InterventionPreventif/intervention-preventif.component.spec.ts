import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionPreventifComponent } from './intervention-preventif.component';

describe('InterventionPreventifComponent', () => {
  let component: InterventionPreventifComponent;
  let fixture: ComponentFixture<InterventionPreventifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionPreventifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionPreventifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
