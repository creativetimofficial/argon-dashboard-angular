import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsComponent } from './transactions.component';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
