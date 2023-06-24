import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailComponent } from './modal-detail.component';

describe('ModalDetailComponent', () => {
  let component: ModalDetailComponent;
  let fixture: ComponentFixture<ModalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetailComponent]
    });
    fixture = TestBed.createComponent(ModalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
