import { Timestamp } from "firebase/firestore";


export interface Inventory {
  productCode: string;
  variants?: Variant[];
  isSet: boolean;
  dateUpdated: Timestamp;
  sizes?: Size[];
}

export interface Variant {
  code: string;
  name: string;
  price?: number;
  quantity: number;
  sizes?: Size[];
  imgURL?: string
}

export interface Size {
  size: string;
  quantity: number;
}
