import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignerComponent } from './signer.component';

describe('SignerComponent', () => {
  let component: SignerComponent;
  let fixture: ComponentFixture<SignerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignerComponent]
    });
    fixture = TestBed.createComponent(SignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
