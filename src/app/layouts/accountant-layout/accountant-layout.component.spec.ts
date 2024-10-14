import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantLayoutComponent } from './accountant-layout.component';

describe('AccountantLayoutComponent', () => {
  let component: AccountantLayoutComponent;
  let fixture: ComponentFixture<AccountantLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountantLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountantLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
