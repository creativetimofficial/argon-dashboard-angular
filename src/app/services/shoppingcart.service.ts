import { Injectable, ViewChild } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { CartItem } from '../models/shoppingcart.model'; 
import { catchError, map, Observable, of } from 'rxjs';
import { Inventory } from '../models/inventory.model';
import { PromptDialogComponent } from '../components/modal/prompt-dialog/prompt-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private selectedItems: CartItem[] = []; 

  constructor(private firestore: AngularFirestore) { }

  // Method to add a product to the shopping cart
  addToCart(cartItem: CartItem): Promise<DocumentReference> {
    return this.firestore.collection('ShoppingCart').add(cartItem)
      .then((docRef: DocumentReference) => {
        console.log('Product added to cart successfully with ID:', docRef.id);
        return docRef;
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
        throw error;
      });
  }

  // Method to retrieve the cart items
  getCartItems(idNo: string): Observable<CartItem[]> {
    return this.firestore.collection<CartItem>('ShoppingCart', ref => ref.where('idNo', '==', idNo)).valueChanges();
  }

  // Method to remove an item from the cart by its document ID
  removeFromCart(cartID: number): Promise<void> {
    // Step 1: Fetch the document reference based on the cartID
    return this.firestore.collection('ShoppingCart', ref => 
        ref.where('cartID', '==', cartID).limit(1) // Assuming cartID is unique
    ).get().toPromise()
    .then(snapshot => {
        if (!snapshot.empty) {
            const doc = snapshot.docs[0]; // Get the first document
            return this.firestore.collection('ShoppingCart').doc(doc.id).delete(); // Delete the document
        } else {
            console.error('No cart item found with the given cartID.');
            return Promise.reject('No cart item found');
        }
    })
    .then(() => {
        console.log('Item removed from cart');
        // Optionally update the shopping cart in Firestore
        // return this.updateCartInFirebase();
    })
    .catch(error => {
        console.error('Error removing item from cart:', error);
        throw error; // Rethrow the error if needed
    });
    
}



  // Method to update quantity or other fields of an item in the cart
  updateCartItem(cartItemId: string, updatedFields: Partial<CartItem>): Promise<void> {
    return this.firestore.collection('ShoppingCart').doc(cartItemId).update(updatedFields)
      .then(() => console.log('Cart item updated'))
      .catch((error) => console.error('Error updating cart item:', error));
  }

  getInventoryQuantityByProductCodeAndVariantCode(productCode: string, variantCode: string): Observable<number | null> {
    return this.firestore
      .collection('Inventory', ref => ref.where('productCode', '==', productCode))
      .valueChanges()
      .pipe(
        map((products: any[]) => {
          if (products.length > 0) {
            const product = products[0] as Inventory; 
            const variant = product.variants.find(v => v.code === variantCode);
            return variant ? variant.quantity : null; 
          }
          return null; 
        })
      );
  }

  getInventoryQuantityByProductCodeAndVariantCodeAndSize(productCode: string, variantCode: string, size: string): Observable<number | null> {
    return this.firestore
      .collection('Inventory', ref => ref.where('productCode', '==', productCode))
      .valueChanges()
      .pipe(
        map((products: any[]) => {
          if (products.length > 0) {
            const product = products[0] as Inventory;
            const variant = product.variants.find(v => v.code === variantCode);
            if (variant && variant.sizes) {
              const sizeObj = variant.sizes.find(s => s.size === size);
              return sizeObj ? sizeObj.quantity : null;
            }
            return variant ? variant.quantity : null; // Fallback to variant quantity if sizes are not present
          }
          return null;
        })
      );
  }

  getLowestQuantityForSet(productCode: string, selectedSize: string = ''): Observable<number | null> {
    return this.firestore.collection<Inventory>('Inventory', ref => ref.where('productCode', '==', productCode))
      .valueChanges()
      .pipe(
        map(inventories => {
            console.log('Fetched inventories for product code:', productCode, inventories);
            if (!inventories || inventories.length === 0) {
                console.log('No inventories found for product code:', productCode);
                return null;
            }

            let lowestQuantity: number | null = null;

            inventories.forEach(inventory => {
                console.log('Processing inventory:', inventory);
                inventory.variants.forEach(variant => {
                    if (variant.sizes && variant.sizes.length > 0) {
                        if (selectedSize) {
                            const sizeInfo = variant.sizes.find(size => size.size === selectedSize);
                            
                            if (sizeInfo && sizeInfo.quantity !== undefined) {
                                lowestQuantity = (lowestQuantity === null) ? sizeInfo.quantity : Math.min(lowestQuantity, sizeInfo.quantity);
                            }
                        } else {
                            variant.sizes.forEach(size => {
                                if (size.quantity !== undefined) {
                                    lowestQuantity = (lowestQuantity === null) ? size.quantity : Math.min(lowestQuantity, size.quantity);
                                }
                            });
                        }
                    } else {
                        if (variant.quantity !== undefined) {
                            lowestQuantity = (lowestQuantity === null) ? variant.quantity : Math.min(lowestQuantity, variant.quantity);
                        }
                    }
                });
            });

            console.log('Final lowest quantity for product code', productCode, ':', lowestQuantity);
            return lowestQuantity; // Return the lowest quantity found
        }),
        catchError(error => {
            console.error('Error fetching lowest quantity:', error);
            return of(null); // Return null on error
        })
    );
}

  // Setter to store the selected items
  setSelectedItems(items: CartItem[]): void {
    this.selectedItems = items;
  }

  getSelectedItems(): CartItem[] {
    return this.selectedItems;
  }

  // Optionally, you can clear the selected items after checkout
  clearSelectedItems(): void {
    this.selectedItems = [];
  }

}
