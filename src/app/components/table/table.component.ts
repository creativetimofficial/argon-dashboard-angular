import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableColumn, ColumnType } from 'src/app/models/util/table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  constructor(private sanitizer: DomSanitizer) {}

  //add and row action buttons
  @Input() useBasicTable: boolean = true;
  @Input() theme: string = "primary" // css purpose only

  // bottom action button
  @Input() showBottomActionButton: boolean = false;
  @Input() bottomActionButtonTitle: string;
  @Output() bottomActionButtonClick = new EventEmitter<void>();
  @Input() bottomActionHTML: string = "";
  sanitizedBottomActionDescription: SafeHtml;
  
  @Input() title: string = 'Table Title'
  @Input() dataColumns: TableColumn[]
  @Input() data: any[]

  @Output() saveRecords = new EventEmitter<any[]>();
  @Output() deleteRecord = new EventEmitter<any>();
  @Output() imageSelected = new EventEmitter<{ record: any; file: File; imgPreviewURL: string }>();
  
  ColumnType = ColumnType
  showAddRow = false
  hasChanges = false
  newRecords: any[] = []; // array to hold multiple new rows

  ngOnInit() {
    console.log(this.data);
    this.sanitizedBottomActionDescription = this.sanitizer.bypassSecurityTrustHtml(this.bottomActionHTML);
  }

  // Method to validate records
  validateRecord(record: any): boolean {
    for (const col of this.dataColumns) {
      if (col.required && !record[col.field]) {
        return false; // Return false if any required field is empty
      }
    }
    return true; // All required fields are filled
  }

  // Method to add a new empty row
  addRow() {
    // Add a new row for input
    const newRow = {}; // Initialize based on your model
    this.newRecords.push(newRow);
    this.showAddRow = true; // Optionally show the input row
    this.hasChanges = true;
  }

  // Method to remove a specific new row
  removeNewRow(row: any) {
    this.newRecords = this.newRecords.filter(r => r !== row); // Filter out the specific row
    if (this.newRecords.length === 0) {
      this.hasChanges = false; // Reset flag if there are no new rows
    }
  }

  // Method to edit a record
  editRow(item: any) {
    // Set the row to edit mode
    item.isEditing = true;
    this.hasChanges = true;
  }

  // Method to remove a record
  removeRow(item: any) {
    this.deleteRecord.emit(item);
    this.data = this.data.filter(i => i !== item); // Remove the item from data
    // this.hasChanges = true; // Set the flag to true when an item is deleted
  }

  // Method to save all new records
  saveAll() {
    // Combine new records and modified existing records
    const recordsToSave = [...this.newRecords, ...this.data.filter(item => item.isEditing)];
    
    // Validate records before saving
    const allValid = recordsToSave.every(record => this.validateRecord(record));

    if (allValid) {
      console.log(recordsToSave); // Log the records to be saved
      this.saveRecords.emit(recordsToSave); // Emit new records to be saved in the parent component
      this.newRecords = []; // Clear the array after saving
      this.hasChanges = false; // Reset the changes flag
    } else {
      alert('Please fill all required fields.'); // Show a feedback alert if validation fails
    }
  }


  onImageChange(event: any, record: any) {
    debugger;
    const file = event.target.files[0];
    if (file) {
      const imgPreviewURL = URL.createObjectURL(file);
      // Update the record with the new preview URL
      record.imgPreviewURL = imgPreviewURL;
      // Emit the selected file along with its preview URL if needed
      this.imageSelected.emit({ record, file, imgPreviewURL });
    }
  }

  onBottomActionButtonClick(): void {
    this.bottomActionButtonClick.emit(); // Emit the event
  }
  
}
