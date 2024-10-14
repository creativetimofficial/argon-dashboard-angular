// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private firestore: AngularFirestore) { }

  // Method to add user to Firestore
  addUser(user: any): Promise<void> {
    const userId = this.firestore.createId(); // Generate unique ID
    return this.firestore.collection('users').doc(userId).set(user);
  }

  // Method to get a user by idNo
  getUserByIdNo(idNo: string): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('idNo', '==', idNo)).valueChanges();
  }
}
