import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
// import { User } from './user.model'; // Import the User interface
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private firestore: AngularFirestore) {}

  // Method to login the user
  login(idNo: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firestore.collection('Users', ref => ref.where('idNo', '==', idNo))
        .get()
        .subscribe({
          next: (snapshot) => {
            console.log("test");
            if (!snapshot.empty) {
              const user = snapshot.docs[0].data() as User;
              if (user.password === password) {
                this.userSubject.next(user);
                this.saveUserToLocalStorage(user);
                this.saveUserDocIdToLocalStorage(snapshot.docs[0].id);
                this.user$ = this.userSubject.asObservable();
                
                resolve(true); // Login successful
              } else {
                resolve(false); // Incorrect password
              }
            } else {
              resolve(false); // User not found
            }
          },
          error: (error) => {
            console.error("Error during login:", error);
            reject(false); // Login failed
          }
        });
    });
  }
  
  getUserRole(): string | null {
    const user = this.userSubject.value || this.getUserFromLocalStorage();
    return user ? user.role || null : null;
  }

  getUserIdNo(): string | null {
    const user = this.userSubject.value || this.getUserFromLocalStorage();
    return user ? user.idNo || null : null;
  }

  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  private saveUserToLocalStorage(user: User | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  private saveUserDocIdToLocalStorage(userDocId: string) {
    if(userDocId) {
      localStorage.setItem('userDocId', userDocId);
    } else {
      localStorage.removeItem('userDocId');
    }
  }

  getUserInitials() {
    const userData = this.getUserFromLocalStorage();
    
    if (userData) {
      const firstInitial = userData.firstName.charAt(0).toUpperCase(); // Get first letter of firstName
      const lastInitial = userData.lastName.charAt(0).toUpperCase(); // Get first letter of lastName
      return `${firstInitial}${lastInitial}`; // Return initials
    } else {
      console.log('No user data found in local storage.');
      return ''; // Return empty string if no user data
    }
  }

  getUserFullName() {
    const userData = this.getUserFromLocalStorage();
    
    if (userData) {
      const firstInitial = userData.firstName;
      const lastInitial = userData.lastName;
      return `${firstInitial} ${lastInitial}`; 
    } else {
      console.log('No user data found in local storage.');
      return ''; // Return empty string if no user data
    }
  }
  

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
  
  // Method to log out
  logout() {
    this.userSubject.next(null); // Clear user data
    this.saveUserToLocalStorage(null); // Remove user from localStorage
  }
}
