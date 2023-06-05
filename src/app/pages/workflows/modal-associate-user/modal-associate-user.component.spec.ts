import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAssociateUserComponent } from './modal-associate-user.component';

describe('ModalAssociateUserComponent', () => {
  let component: ModalAssociateUserComponent;
  let fixture: ComponentFixture<ModalAssociateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAssociateUserComponent]
    });
    fixture = TestBed.createComponent(ModalAssociateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
