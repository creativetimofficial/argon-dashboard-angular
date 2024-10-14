import { Injectable } from '@angular/core';
import { ColumnType, TableColumn } from 'src/app/models/util/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  // Method to create a TableColumn object for each field
  createTableColumn(fieldName: string, fieldConfig): TableColumn {
    const config = fieldConfig[fieldName] || { type: ColumnType.string };  // Default to string type if not found

    return {
      field: fieldName,
      header: this.generateHeader(fieldName),    // Generate a header based on field name
      type: config.type,                         // Column type from fieldConfig
      hidden: config.hidden ?? false,            // Hidden from fieldConfig, default to false
      editable: config.editable ?? false,        // Editable from fieldConfig, default to false
      required: config.required ?? false         // Required, from fieldConfid, default to false
    };
  }

  // Method to generate a header for the field (can be customized)
  generateHeader(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);  // Capitalize the first letter of the field
  }

  sortDataSet(sortOrder: any[] ,dataSet) {
    return dataSet.sort((a, b) => {
      return sortOrder.indexOf(a.field) - sortOrder.indexOf(b.field);
    });
  }
}
