import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Component, OnInit } from '@angular/core';
import { ColumnType, TableColumn } from 'src/app/models/util/table.model';
import { Product } from 'src/app/models/product.model';
import { TableService } from 'src/app/services/util/table.service';
import { finalize } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  sortOrder: string[] = ["imgURL", "code", "name", "isSet", "price"]
  dataColumns: TableColumn[] = []
  products: Product[];
  selectedFiles: { record: any; file: File; imgPreviewURL: string }[] = [];

  // Single fieldConfig map to hold all dynamic properties for each field
  fieldConfig: Record<string, { type: ColumnType; hidden?: boolean; editable?: boolean; required?: boolean }> = {
    imgURL: { type: ColumnType.image, hidden: false, editable: false },
    code: { type: ColumnType.text, hidden: false, required: true, editable: true },
    name: { type: ColumnType.text, hidden: false, required: true, editable: true },
    isSet: { type: ColumnType.checkbox, hidden: true, editable: false },
    price: { type: ColumnType.number, hidden: false, required: true, editable: true }
  };

  constructor(private recordService: FirestoreService, private tableService: TableService, private storage: AngularFireStorage) {
    recordService.collectionName = "Products"
  }

  ngOnInit() {
    this.recordService.getRecords().subscribe(data => {
      this.products = data;
      // this.dataColumns = this.tableService.sortDataSet(this.sortOrder, this.tableService.generateDataColumns(this.products));

      this.dataColumns = this.sortOrder.map(fieldName => this.tableService.createTableColumn(fieldName, this.fieldConfig));

      console.log(data);
      console.log(this.dataColumns);
    });

  }

  // saveProducts(records: any[]) {
  //    // Assuming records can contain both new and updated items
  //   const updates = records.filter(record => record.isEditing); // or however you want to differentiate

  //   if (updates.length) {
  //     this.productService.updateProducts(updates).then(() => {
  //       console.log('Updated products saved!');
  //       // this.loadProducts(); // Reload products if needed to reflect changes
  //     }).catch(error => {
  //       console.error('Error updating products:', error);
  //     });
  //   }

  //   const newRecords = records.filter(record => !record.isEditing); // Extract new records
  //   if (newRecords.length) {
  //     this.productService.addProducts(newRecords).then(() => {
  //       console.log('New products saved!');
  //     }).catch(error => {
  //       console.error('Error saving new products:', error);
  //     });
  //   }
  // }
  saveProducts(records: any[]) {
    const uploadPromises = records.map(record => {
      if (this.selectedFiles.some(file => file.record === record)) {
        const selectedFile = this.selectedFiles.find(file => file.record === record);
        return this.uploadImage(selectedFile.file, record);
      }
      return Promise.resolve(); // No upload needed
    });
  
    Promise.all(uploadPromises).then(() => {
      const { updates, newRecords } = records.reduce((acc, record) => {
        const { isEditing, imgPreviewURL, ...filteredRecord } = record; // Exclude specific fields
      
        if (isEditing) {
          acc.updates.push(filteredRecord); // Add to updates if isEditing is true
        } else {
          acc.newRecords.push(filteredRecord); // Add to newRecords if isEditing is false
        }
      
        return acc; // Return the accumulator
      }, { updates: [], newRecords: [] }); // Initialize the accumulator
  
      if (updates.length) {
        this.recordService.updateRecords(updates).then(() => {
          console.log('Updated products saved!');
        }).catch(error => {
          console.error('Error updating products:', error);
        });
      }
  
      if (newRecords.length) {
        this.recordService.addRecords(newRecords).then(() => {
          console.log('New products saved!');
        }).catch(error => {
          console.error('Error saving new products:', error);
        });
      }
    }).catch(error => {
      console.error('Error uploading images:', error);
    });
  }

  deleteProduct(record: any) {
    // Call your service to delete the record from Firestore
    this.recordService.deleteRecord(record.id).then(() => {
      console.log('Product deleted!');
    }).catch(error => {
      console.error('Error deleting product:', error);
    });
  }

  
  handleImageSelection(event: { record: any; file: File; imgPreviewURL: string }) {
    this.selectedFiles.push(event);
  }

  // Method to handle image upload
  uploadImage(file: File, record: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = `products/${file.name}`; // Adjust the path as needed
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.storage.ref(filePath).getDownloadURL().subscribe(url => {
            record.imgURL = url; // Assuming imgURL is the field for the image
            resolve(); // Resolve when done
          }, reject); // Handle error in getting download URL
        })
      ).subscribe();
    });
  }

}
