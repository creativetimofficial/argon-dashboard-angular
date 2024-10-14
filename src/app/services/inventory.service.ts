import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private firestore: AngularFirestore) { }

  // Function to get a single inventory item by product code
  getInventoryByProductCode(productCode: string): Observable<Inventory | undefined> {
    return this.firestore.collection('Inventory', ref => ref.where('productCode', '==', productCode)).valueChanges().pipe(
      map(inventories => {
        if (inventories.length > 0) {
          const inventory = inventories[0] as Inventory;
          // Handle Timestamp conversion
          return {
            ...inventory
          };
        } else {
          return undefined; // No such document
        }
      }),
      catchError(err => {
        console.error('Error fetching inventory:', err);
        return of(undefined); // Handle errors
      })
    );
  }
}
