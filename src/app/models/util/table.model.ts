export enum ColumnType {
  hidden = 'hidden',
  custom = 'custom',
  string = 'string',
  text = 'text',
  number = 'number',
  date = 'date',
  range = 'range',
  checkbox = 'checkbox',
  dropDown = 'dropdown',
  image = 'image', 
  link = 'link'
}

export interface TableColumn {
  field: string; // keyof T; // it's not keyof T, because it can be dot-notation like user.location.id
  header?: string;
  type?: ColumnType;
  hidden?: boolean;
  editable?: boolean; 
  required?: boolean;
}