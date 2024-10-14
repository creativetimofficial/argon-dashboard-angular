import { Component, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PromptDialogComponent } from 'src/app/components/modal/prompt-dialog/prompt-dialog.component';
import { CartItem } from 'src/app/models/shoppingcart.model';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrl: './shoppingcart.component.scss'
})
export class ShoppingcartComponent implements OnInit {

  shoppingCartItems:CartItem[] = []
  selectedItems: CartItem[] = [];
  itemToRemove: CartItem; 
  @Output() checkout = new EventEmitter<CartItem[]>()
  
  @ViewChild(PromptDialogComponent) promptDialog!: PromptDialogComponent;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private authservice: AuthService
  ){

  }
  ngOnInit(): void {
    this.getShoppingCartItems()
    console.log(this.shoppingCartItems.length)
  }

  getShoppingCartItems(): void{
    this.shoppingCartService.getCartItems(this.authservice.getUserIdNo()).subscribe((items: CartItem[]) => {
    this.shoppingCartItems = items;
    this.getQuantitiesForCartItems();
    });
  }

  onItemSelectionChange(item: CartItem): void {
    if (item.selected) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(i => i.cartID !== item.cartID);
    }
  }

  removeCartItem(item: CartItem): void {
    this.shoppingCartItems = this.shoppingCartItems.filter(i => i.cartID !== item.cartID);
    this.shoppingCartService.removeFromCart(item.cartID);
  }

  getTotal(): number {
    return this.selectedItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  getQuantitiesForCartItems(): void {
    this.shoppingCartItems.forEach(item => {
      if (item.variantCode === "SET") {
        this.shoppingCartService.getLowestQuantityForSet(item.productCode, item.size)
          .subscribe(quantity => {
            item.maxQuantity = quantity;
            
          });
      } else if (item.size) {
        this.shoppingCartService.getInventoryQuantityByProductCodeAndVariantCodeAndSize(item.productCode, item.variantCode, item.size)
          .subscribe(quantity => {
            item.maxQuantity = quantity;
           
          });
      } else {
        this.shoppingCartService.getInventoryQuantityByProductCodeAndVariantCode(item.productCode, item.variantCode)
          .subscribe(quantity => {
            item.maxQuantity = quantity;
          });
      }
    });
  }

  proceedToCheckout(): void {
    if (this.selectedItems.length > 0) {
      sessionStorage.setItem('selectedItems', JSON.stringify(this.selectedItems));
    
     this.router.navigate(['/student/checkout']);
    } else {
      console.log('No items selected for checkout');
    }
  }

  openDialog(item: CartItem) {
    this.itemToRemove = item;  
    this.promptDialog.title = 'Remove Item from Shopping Cart';
    this.promptDialog.message = `Are you sure you want to remove <span class="text-danger"> ${item.name}</span> from shopping cart?`;
    this.promptDialog.cancelButtonLabel = "Cancel";
    this.promptDialog.confirmButtonLabel = "Remove";
    this.promptDialog.open();  
  }

  onConfirmRemove(): void {
    if (this.itemToRemove) {
      this.removeCartItem(this.itemToRemove);  // Remove the stored item
    }
  }

}
