import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodianLayoutComponent } from './custodian-layout.component';

describe('CustodianLayoutComponent', () => {
  let component: CustodianLayoutComponent;
  let fixture: ComponentFixture<CustodianLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustodianLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodianLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
