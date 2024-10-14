import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ToastComponent } from 'src/app/components/modal/toast/toast.component';
import { ToastService } from 'src/app/components/modal/toast/toast.service';
import { Order } from 'src/app/models/order.model';
import { Transaction, TransactionComment } from 'src/app/models/transaction.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-order-pickup',
  templateUrl: './order-pickup.component.html',
  styleUrl: './order-pickup.component.scss'
})
export class OrderPickupComponent {
  transactionId: string | null = null;
  orderedProducts: Order | null = null;
  transaction: Transaction | null = null;
  userName: string = '';
  newComment: string = '';
  userLoggedInName = '';
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    firestoreService.collectionName = "Transactions";
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.transactionId = params.get('transactionId');
      if (this.transactionId) {
        this.fetchTransactionDetails(this.transactionId);
      }
    });
    this.userLoggedInName = this.authService.getUserFullName();
  }

  ngAfterViewInit() {
    this.toastService.registerToast(this.toastComponent);
  }

  fetchTransactionDetails(transactionId: string): void {
    this.firestoreService.getRecordById(transactionId).pipe(
      switchMap(transactionData => {
        if (transactionData) {
          this.transaction = transactionData;
          const orderNo = transactionData.orderNo;
          this.firestoreService.collectionName = "Orders";
          if (orderNo) {
            return this.firestoreService.getRecordByorderNo(orderNo);
          }
        }
        return [];
      })
    ).subscribe(orderData => {
      if (orderData && orderData.length > 0) {
        this.orderedProducts = orderData[0];
        if (this.orderedProducts) {
          this.firestoreService.collectionName = "Users";
          this.getUserFullName(this.orderedProducts.idNo); 
        }
      }
    });
  }

  getUserFullName(idNo: string): void {
    if (idNo) {
      this.firestoreService.getRecordByidNo(idNo).subscribe(userData => {
        if (userData && userData.length > 0) {
          this.userName = `${userData[0].firstName} ${userData[0].lastName}`;
        }
      });
    }
  }


  addComment(form: NgForm) {
    // Check if the form is valid
    if (form.valid) {
      const comment: TransactionComment = {
        comment: this.newComment,
        commentDate: new Date().toISOString(),
        user: this.userLoggedInName
      };
  
      // Initialize comments array if not present
      if (!this.transaction.comments) {
        this.transaction.comments = [];
      }
  
      // Add the new comment to the transaction
      this.transaction.comments.push(comment);
  
      // Prepare the transaction update (using its ID)
      const updatedTransaction = {
        id: this.transactionId, // Make sure you have the ID of the transaction
        comments: this.transaction.comments // Only update the comments field
      };
      this.firestoreService.collectionName = "Transactions"
      // Call the updateRecords function to update Firestore
      this.firestoreService.updateRecords([updatedTransaction])
        .then(() => {
          console.log('Transaction updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating transaction:', error);
        });
  
      // Reset the textarea and the form
      this.newComment = '';
      form.resetForm(); // Reset the form
    } else {
      console.warn('Comment form is invalid or empty.');
    }
  }

  // Method for declining the transaction
  declinePayment(): void {
    if (this.transaction && this.transactionId) {
      // Update the transaction status
      const updatedTransaction = {
        id: this.transactionId,
        status: 'Invalid Payment',
      };
      
      // Create a new status update
      const statusUpdate = {
        status: 'Invalid Payment',
        dateUpdated: new Date().toISOString(),
        user: this.userLoggedInName,
      };
  
      // Check if the statusUpdates array exists, if not, initialize it
      if (!this.transaction.statusUpdates) {
        this.transaction.statusUpdates = [];
      }
  
      // Add the new status update
      this.transaction.statusUpdates.push(statusUpdate);
  
      // Set the updatedTransaction to include the status updates
      updatedTransaction['statusUpdates'] = this.transaction.statusUpdates;
  
      // Update the Firestore collection name
      this.firestoreService.collectionName = "Transactions";
  
      // Call the updateRecords method to update the transaction
      this.firestoreService.updateRecords([updatedTransaction])
        .then(() => {
          this.toastService.showToast("Payment has been marked as invalid. Please add a comment for clarification.", 'error');
          this.transaction.status = 'Invalid Payment';
        })
        .catch((error) => {
          console.error('Error updating transaction status:', error);
        });
    }
  }
  

// Method for confirming the transaction
confirmPickUp(): void {
  if (this.transaction && this.transactionId) {
    // Update the transaction status
    const updatedTransaction = {
      id: this.transactionId,
      status: 'Completed',
      dateCompleted: new Date().toISOString()
    };
    
    // Create a new status update
    const statusUpdate = {
      status: 'Completed',
      dateUpdated: new Date().toISOString(),
      user: this.userLoggedInName,
    };

    // Check if the statusUpdates array exists, if not, initialize it
    if (!this.transaction.statusUpdates) {
      this.transaction.statusUpdates = [];
    }

    // Add the new status update
    this.transaction.statusUpdates.push(statusUpdate);

    // Set the updatedTransaction to include the status updates
    updatedTransaction['statusUpdates'] = this.transaction.statusUpdates;

    // Update the Firestore collection name
    this.firestoreService.collectionName = "Transactions";

    // Call the updateRecords method to update the transaction
    this.firestoreService.updateRecords([updatedTransaction])
      .then(() => {
        
        this.toastService.showToast("Item picked up. Transaction is now complete.", 'success');
        this.transaction.status = 'Completed'; 
      })
      .catch((error) => {
        console.error('Error updating transaction status:', error);
      });
  }
}


}
