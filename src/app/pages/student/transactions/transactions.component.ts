import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastComponent } from "src/app/components/modal/toast/toast.component";
import { ToastService } from "src/app/components/modal/toast/toast.service";
import { Order } from "src/app/models/order.model";
import { Transaction } from "src/app/models/transaction.model";
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from "src/app/services/firestore.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrl: "./transactions.component.scss",
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  orderArr: Order[] = [];
  transactionArr: Transaction[] = [];
  currentTransaction: Transaction;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;
  constructor(
    private firestoreService: FirestoreService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.spinner.show();
    this.loadInitialData();
  }
  ngAfterViewInit() {
    this.toastService.registerToast(this.toastComponent);
  }

  private loadInitialData(): void {
    this.firestoreService.collectionName = "Transactions";
    // this.firestoreService.getRecords().subscribe((data) => {
    //   this.transactionArr = data;
    //   this.firestoreService.collectionName = "Orders";
    //   this.firestoreService.getRecordsSortedByOrderDate().subscribe((data) => {
    //     this.orderArr = data;
    //     this.spinner.hide();
    //   });
    // });
    this.firestoreService.getRecords().subscribe({
      next: (data) => {
        this.transactionArr = data;
        this.firestoreService.collectionName = "Orders";
        this.firestoreService.getRecordsSortedByOrderDate().subscribe({
          next: (data) => {
            this.orderArr = data;
            this.spinner.hide();
          },
          error: (error) => {
            this.toastService.showToast("An error occured", "error");
            this.spinner.hide();
          },
        });
      },
      error: (error) => {
        this.toastService.showToast("An error occured", "error");
        this.spinner.hide();
      },
    });
  }
  isOrderHasTransaction(orderNo: string): boolean {
    this.getTransactionByOrderNo(orderNo);
    return this.currentTransaction !== undefined ? true : false;
  }

  private getTransactionByOrderNo(orderNo: string): void {
    this.currentTransaction = this.transactionArr.find(
      (transaction) => transaction.orderNo == orderNo
    );
  }

  getTransactionStatusByOrderNo(): string {
    return this.currentTransaction.status;
  }

  getTransactionIdByOrderNo(): string {
    if(this.authService.getUserRole()==='accountant'){
      return `${this.currentTransaction.id}/order-confirmation`
    }else if(this.authService.getUserRole() ==='custodian'){
      return `${this.currentTransaction.id}/order-pickup`;
    }
      
    return `${this.currentTransaction.id}/order-details`;
    }
  setState() {
    return { student: this.currentTransaction };
  }
}
