import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPickupComponent } from './order-pickup.component';

describe('OrderPickupComponent', () => {
  let component: OrderPickupComponent;
  let fixture: ComponentFixture<OrderPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPickupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
