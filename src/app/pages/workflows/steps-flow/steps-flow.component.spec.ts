import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsFlowComponent } from './steps-flow.component';

describe('StepsFlowComponent', () => {
  let component: StepsFlowComponent;
  let fixture: ComponentFixture<StepsFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepsFlowComponent]
    });
    fixture = TestBed.createComponent(StepsFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
