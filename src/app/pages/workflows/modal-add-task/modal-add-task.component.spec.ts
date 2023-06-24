import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddTaskComponent } from './modal-add-task.component';

describe('ModalAddTaskComponent', () => {
  let component: ModalAddTaskComponent;
  let fixture: ComponentFixture<ModalAddTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddTaskComponent]
    });
    fixture = TestBed.createComponent(ModalAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
