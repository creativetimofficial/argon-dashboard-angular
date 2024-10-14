export interface Product {
  id: string; // Ensure this is included
  imageUrl?: string, // not required
  code: string,
  name: string,
  isSet: boolean,
  price: number,
  isEditing?: boolean
}

export interface Variant {
  name: string,
  price: number,
  quantity?: number,
  size?: Size[]
}

export interface Size {
  name: string,
  quantity: number
}