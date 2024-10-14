import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "src/app/models/order.model";
import { Product } from "src/app/models/product.model";
import {
  Transaction,
  TransactionDocument,
} from "src/app/models/transaction.model";
import { OrderProgress } from "src/app/models/order-progress.model";
import { FileUploadService } from "src/app/services/file-upload.service";
import * as _ from "lodash";
import { FirestoreService } from "src/app/services/firestore.service";
import { ToastService } from "src/app/components/modal/toast/toast.service";
import { ToastComponent } from "src/app/components/modal/toast/toast.component";
import { finalize } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrl: "./order-details.component.scss",
})
export class OrderDetailsComponent implements OnInit {
  transactionId: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private fileUploadService: FileUploadService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {}
  order: Order;
  transaction: Transaction;
  productCodeArr: string[];
  productArr: Product[];
  orderProgress: OrderProgress[] = [];
  // image
  selectedFiles: File[] = [];
  isDragOver: boolean = false;
  uploadURLs: string[] = [];
  hasDocument: boolean = false;
  //selected index
  selectedIndex: number = null;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  ngOnInit(): void {
    this.spinner.show();
    // Retrieve the transaction ID from the route parameters
    this.route.paramMap.subscribe((params) => {
      this.transactionId = params.get("transactionId");
      console.log("Transaction ID:", this.transactionId);
    });
    this.loadTransaction();
  }
  ngAfterViewInit() {
    this.toastService.registerToast(this.toastComponent);
  }
  private loadTransaction(): void {
    this.firestoreService.collectionName = "Transactions";
    this.firestoreService
      .getRecordById(this.transactionId)
      .subscribe((result) => {
        this.transaction = result;
        if (!_.isEmpty(this.transaction.documents)) {
          this.hasDocument = true;
          this.uploadURLs = [];
          for (let fileUrl of this.transaction.documents) {
            this.uploadURLs.push(fileUrl.url);
          }
        }
        this.loadOrder();
      });
  }
  private loadOrder(): void {
    this.firestoreService.collectionName = "Orders";
    this.firestoreService
      .getRecordByOrderNo(this.transaction.orderNo)
      .subscribe((result) => {
        this.order = result;
        this.loadProduct();
      });
  }
  private loadProduct(): void {
    this.firestoreService.collectionName = "Products";
    this.productCodeArr = this.order.products.map((product) =>
      String(product.productCode)
    );
    this.firestoreService
      .getRecordByCodeArr(this.productCodeArr)
      .subscribe((result) => {
        this.productArr = result;
        this.setOrderProgress();
        this.spinner.hide();
      });
  }
  getProductDisplay(productCode: string): string {
    return this.productArr.filter((product) => product.code === productCode)[0]
      .name;
  }
  //#region Upload
  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
    }
  }
  // Handle drag-over event
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  // Handle drag-leave event
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  // Handle file drop event
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFiles(Array.from(event.dataTransfer.files)); // Process the dropped file
    }
  }
  handleFiles(files: File[]): void {
    this.spinner.show();
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    this.uploadURLs = [];
    let isAllFilesImage: boolean = true;
    for (let file of files) {
      if (validImageTypes.includes(file.type) == false) {
        isAllFilesImage = false;
        break;
      }
    }
    if (isAllFilesImage) {
      this.onDeleteImages();
      this.fileUploadService.uploadFiles(files).subscribe({
        next: (urls: any[]) => {
          const transactionDocumentArr: TransactionDocument[] = [];
          for (let url of urls) {
            // Save the file metadata to Firestore
            const metadata: TransactionDocument = {
              uploadDate: new Date(Date.now()).toISOString(),
              url: url,
            };
            transactionDocumentArr.push(metadata);
          }
          // Update the transaction document
          this.transaction.documents = transactionDocumentArr;
          this.transaction.status = "Awaiting Confirmation";
          this.firestoreService.collectionName = "Transactions";
          this.firestoreService
            .updateRecords([this.transaction])
            .then(() => {
              console.log("File metadata saved successfully");
              this.hasDocument = true;
              this.toastService.showToast(
                "Files successfully uploaded",
                "success"
              );
              this.spinner.hide();
            })
            .catch((err) => {
              console.log("Error saving metadata:", err);
              this.toastService.showToast(
                "There was an error upon saving your files",
                "error"
              );
              this.spinner.hide();
            });
        },
        error: (err) => {
          this.toastService.showToast("Error saving files", "error");
          this.spinner.hide();
        },
      });
    } else {
      this.selectedFiles = null;
      this.toastService.showToast("Only image files are allowed!", "error");
      this.spinner.hide();
    }
  }

  onDeleteImages() {
    debugger;
    if (this.transaction.documents) {
      const deleteFiles = this.transaction.documents;
      const deleteFileUrls: string[] = [];
      for (let file of deleteFiles) {
        deleteFileUrls.push(file.url);
      }
      this.fileUploadService.deleteFiles(deleteFileUrls).subscribe({
        next: () => {},
        error: (err) => {
          this.toastService.showToast("Error deleting the files", "error");
        },
      });
    }
  }
  //#endregion
  setOrderProgress(): void {
    this.orderProgress = [];
    this.orderProgress.push({
      title: "1. Order Placed",
      date: this.order.orderDate,
    });
    this.orderProgress.push({
      title: "2. Upload Payment Details",
      date: !_.isEmpty(this.transaction.documents)
        ? this.transaction.documents[0].uploadDate
        : null,
    });
    this.orderProgress.push({
      title: "3. Awaiting for Payment Confirmation",
      date: this.transaction.statusUpdates?.[this.transaction.statusUpdates.length - 1]?.dateUpdated ?? null,
    });
    this.orderProgress.push({ title: "4. Item for Pickup", date: this.transaction.confirmedDate ?? null });
    this.orderProgress.push({ title: "5. Transaction Complete", date: this.transaction.dateCompleted ?? null });
  }
  setSelectedIndex(index: number) {
    if (this.selectedIndex == index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }
  toggle(step: number): void {
    this.isOpen[step] = !this.isOpen[step];
  }
  isOpen: { [key: number]: boolean } = {
    1: false,
    2: false,
  };
}
