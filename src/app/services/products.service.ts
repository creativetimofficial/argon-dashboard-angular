import { Injectable, signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  constructor(private firestore: AngularFirestore) {}

  // Method to get all products
  getProducts(): Observable<Product[]> {
    // return this.firestore.collection<Product>('Products').valueChanges();
    return this.firestore
      .collection<Product>("Products")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Product;
            const id = a.payload.doc.id; // Get the document ID
            return { id, ...data }; // Return the complete object
          })
        )
      );
  }

  // Method to get a specific product by ID
  getProductById(productId: string): Observable<any> {
    return this.firestore.collection("Products").doc(productId).valueChanges();
  }

  getProductByCode(productCode: string): Observable<any> {
    return this.firestore
      .collection("Products", (ref) => ref.where("code", "==", productCode))
      .valueChanges()
      .pipe(map((products) => (products.length > 0 ? products[0] : null)));
  }

  getProductsByCode(productCode: string[]): Observable<any> {
    return this.firestore
      .collection("Products", (ref) => ref.where("code", "in", productCode))
      .valueChanges();
  }

  // Method to add multiple products
  addProducts(products: any[]): Promise<void> {
    const batch = this.firestore.firestore.batch();

    products.forEach((product) => {
      const id = this.firestore.createId();
      const docRef = this.firestore.collection("Products").doc(id).ref;
      batch.set(docRef, product);
    });

    return batch.commit(); // Save all in one go
  }

  // Method to update multiple products
  updateProducts(products: any[]): Promise<void> {
    const updates = products.map((product) => {
      // Logic to prepare your Firestore update operation
      const productRef = this.firestore.collection("products").doc(product.id); // Assuming product has an id
      return productRef.update(product); // Update the record
    });

    return Promise.all(updates).then(() => {});
  }

  // Method to delete a product
  deleteProduct(productId: string): Promise<void> {
    return this.firestore.collection("Products").doc(productId).delete();
  }
}
