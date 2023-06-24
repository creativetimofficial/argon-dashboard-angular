import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureListComponent } from './signature-list.component';

describe('SignatureListComponent', () => {
  let component: SignatureListComponent;
  let fixture: ComponentFixture<SignatureListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignatureListComponent]
    });
    fixture = TestBed.createComponent(SignatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
