import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserFormComponent } from './add-user-form.component';

describe('AddUserFormComponent', () => {
  let component: AddUserFormComponent;
  let fixture: ComponentFixture<AddUserFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserFormComponent]
    });
    fixture = TestBed.createComponent(AddUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
