import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProductComponent } from './display-product.component';

describe('DisplayProductComponent', () => {
  let component: DisplayProductComponent;
  let fixture: ComponentFixture<DisplayProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
