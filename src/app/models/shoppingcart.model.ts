
export interface CartItem {
    cartID?: number,
    idNo: string,
    orderDate: string,
    productCode: string,
    variantCode: string,
    price: number,
    totalPrice: number,
    imgURL?: string, 
    size?: string,
    quantity: number,
    name: string,
    selected?: boolean,
    maxQuantity?: number,
    productName? : string
  }
