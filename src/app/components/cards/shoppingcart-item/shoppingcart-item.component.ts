import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartItem } from 'src/app/models/shoppingcart.model';

@Component({
  selector: 'app-shoppingcart-item',
  templateUrl: './shoppingcart-item.component.html',
  styleUrl: './shoppingcart-item.component.scss'
})

export class ShoppingcartItemComponent implements OnInit {
  @Input() cartItem: CartItem;
  @Output() selectionChange = new EventEmitter<CartItem>();
  @Output() remove = new EventEmitter<CartItem>();

  ngOnInit(): void {
  }


  onCheckboxChange(): void {
    this.selectionChange.emit(this.cartItem); 
  }

  decreaseQuantity(): void {
    if (this.cartItem.quantity > 1) {
      this.cartItem.quantity--;
      this.updateTotalPrice();
    }
  }

  
  increaseQuantity(): void {
    if (this.cartItem.quantity < this.cartItem.maxQuantity) { 
      this.cartItem.quantity++;
      this.updateTotalPrice();
    }
  }

  updateTotalPrice(): void {
    this.cartItem.totalPrice = this.cartItem.quantity * this.cartItem.price;
  }

  removeItem(): void {
    this.remove.emit(this.cartItem); 
  }

  toggleCheckbox(event: MouseEvent): void {
    // Prevent toggling if clicking directly on the checkbox
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT') {
      this.cartItem.selected = !this.cartItem.selected;
    }
    this.selectionChange.emit(this.cartItem); 
  }

}
