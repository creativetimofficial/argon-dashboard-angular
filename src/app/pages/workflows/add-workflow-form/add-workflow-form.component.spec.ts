import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowFormComponent } from './add-workflow-form.component';

describe('AddWorkflowFormComponent', () => {
  let component: AddWorkflowFormComponent;
  let fixture: ComponentFixture<AddWorkflowFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkflowFormComponent]
    });
    fixture = TestBed.createComponent(AddWorkflowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
