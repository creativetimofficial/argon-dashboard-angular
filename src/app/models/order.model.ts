export interface Order {
  idNo: string;
  orderDate: string;
  orderNo: string;
  products: OrderProduct[];
  totalPrice: number;
}
export interface OrderProduct {
  price: number,
  productCode: string,
  quantity: number,
  size: string,
  variantCode: string,
  variantName: string,
  productName: string
}