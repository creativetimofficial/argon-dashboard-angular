import { Order, OrderProduct } from 'src/app/models/order.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CartItem } from 'src/app/models/shoppingcart.model';
import { ColumnType, TableColumn } from 'src/app/models/util/table.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';
import { TableService } from 'src/app/services/util/table.service';
import { Transaction, TransactionDocument } from 'src/app/models/transaction.model';
import { PromptDialogComponent } from 'src/app/components/modal/prompt-dialog/prompt-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  checkOut: CartItem[] = []; 
  sortOrder: string[] = ["imgURL", "name", "size", "price", "quantity","totalPrice"]
  dataColumns: TableColumn[] = []
  orderPlaced: boolean = false;

  fieldConfig: Record<string, { type: ColumnType; hidden?: boolean; editable?: boolean; required?: boolean }> = {
    imgURL: { type: ColumnType.image, hidden: false, editable: false },
    name: { type: ColumnType.text, hidden: false, required: true, editable: false },
    size: { type: ColumnType.text, hidden: false, required: true, editable: false },
    price: { type: ColumnType.checkbox, hidden: true, editable: false },
    quantity: { type: ColumnType.number, hidden: false, required: true, editable: false },
    totalPrice: { type: ColumnType.number, hidden: false, required: true, editable: false }
  };

  htmlDescription: string = "";
  @ViewChild(PromptDialogComponent) promptDialog!: PromptDialogComponent;

constructor(
    private tableService: TableService,
    private firestoreService: FirestoreService, 
    private authService: AuthService,
    private shoppingcartService: ShoppingCartService,
    private router: Router) {

  firestoreService.collectionName = "Orders";

}

 ngOnInit(): void {
    // Retrieve selected items from session storage
    const selectedItems = sessionStorage.getItem('selectedItems');
    if (selectedItems) {
      this.checkOut = JSON.parse(selectedItems);
      console.log('Selected items for checkout:', this.checkOut);
    } else {
      console.error('No items were received for checkout');
    }
    this.dataColumns = this.sortOrder.map(fieldName => this.tableService.createTableColumn(fieldName, this.fieldConfig));
    this.htmlDescription = `<h3 class="mr-3">Total Items: <span class="text-info">${this.getTotalItems()}</span></h3>
                  <h3 class="mr-3">Price: <span class="text-info">&#8369; ${this.getTotalPrice()}</span></h3>`;
  }

  // Optionally, clear the session storage when done
  ngOnDestroy(): void {
    sessionStorage.removeItem('selectedItems');
  }

  getTotalItems(): number {
    return this.checkOut.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.checkOut.reduce((acc, item) => acc + item.totalPrice, 0);
  }

  onPlaceOrder(): void {
    const idNo = this.authService.getUserIdNo(); // Retrieve the user's ID
    const uniqueOrderNo = this.generateUniqueOrderNo(idNo);
    const dateTime = new Date().toISOString();
  
    const orderedProducts = this.mapOrderedProducts();  // Separate function for mapping products
    const newOrder = this.createOrderObject(idNo, dateTime, uniqueOrderNo, orderedProducts);  // Separate function for new order
    const transactionData = this.createTransactionObject(dateTime, uniqueOrderNo);  // Separate function for transaction data
  
    this.placeOrder(newOrder, transactionData);
  }
  
  // Generate a unique order number based on user ID and timestamp
  private generateUniqueOrderNo(idNo: string): string {
    const timestamp = Date.now().toString();
    return `${idNo}${timestamp}`;
  }
  
  // Separate function to map ordered products from cart
  private mapOrderedProducts(): OrderProduct[] {
    return this.checkOut.map(item => ({
      imgURL: item.imgURL,
      productCode: item.productCode,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      variantCode: item.variantCode,
      itemSubtotal: item.totalPrice,
      variantName: item.name,
      productName: item.productName
    }));
  }
  
  // Separate function to create the order object
  private createOrderObject(idNo: string, orderDate: string, orderNo: string, orderedProducts: OrderProduct[]): Order {
    return {
      idNo: idNo,
      orderDate: orderDate, // Save the order date as ISO string
      orderNo: orderNo,
      totalPrice: this.getTotalPrice(), // Function to calculate the total price
      products: orderedProducts // List of ordered products
    };
  }
  
  // Separate function to create the transaction data object
  private createTransactionObject(confirmedDate: string, orderNo: string): Transaction {
    return {
      confirmedDate: confirmedDate,
      orderNo: orderNo,
      status: "Pending Payment",
      type: "order"
    };
  }
  
  
  private placeOrder(newOrder: Order, transactionData: Transaction): void {
    this.firestoreService.addRecords([newOrder])
      .then(() => {
        this.openDialog();
        if (this.checkOut[0].cartID) {
          const removePromises = this.checkOut.map(item => this.shoppingcartService.removeFromCart(item.cartID));
          return Promise.all(removePromises);
        }
      })
      .then(() => {
        console.log('All items removed from the cart successfully.');
        
        this.firestoreService.collectionName = "Transactions";
        return this.firestoreService.addRecords([transactionData]);
      })
      .then(() => {
        console.log('Transaction added successfully.');

        this.firestoreService.collectionName = "Orders";
        this.orderPlaced = true;
      })
      .catch(error => {
        console.error('Error during placing order or removing items from cart:', error);
      });
  }

  openDialog() { 
    this.promptDialog.title = 'Success';
    this.promptDialog.message = "Order placed successfully! You can return to products page or view your order transaction.";
    this.promptDialog.confirmButtonLabel = "View Orders";
    this.promptDialog.cancelButtonLabel = "View Products";
    this.promptDialog.open();  
  }

  proceedToProductsPage(){
    this.router.navigate(['/student/products/']);
  }

  proceedToTransactionsPage(){
    this.router.navigate(['/student/transactions/']);
  }
  
}
