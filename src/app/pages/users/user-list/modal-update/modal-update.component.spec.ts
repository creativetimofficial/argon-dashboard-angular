import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateComponent } from './modal-update.component';

describe('ModalUpdateComponent', () => {
  let component: ModalUpdateComponent;
  let fixture: ComponentFixture<ModalUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUpdateComponent]
    });
    fixture = TestBed.createComponent(ModalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
