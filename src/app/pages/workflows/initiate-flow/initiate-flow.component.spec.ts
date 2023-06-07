import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateFlowComponent } from './initiate-flow.component';

describe('InitiateFlowComponent', () => {
  let component: InitiateFlowComponent;
  let fixture: ComponentFixture<InitiateFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitiateFlowComponent]
    });
    fixture = TestBed.createComponent(InitiateFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
