export interface OrderItem {
  productId: string;
  name: string;
  variantName: string;
  quantity: number;
  priceSell: number;
}

export interface OrderShippingAddress {
  customerName: string;
  phone: string;
  address: string;
}

export interface AdminOrder {
  _id: string;
  orderCode: string;
  userId: string;
  items: OrderItem[];
  originalTotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: OrderShippingAddress;
  paymentMethod: string;
  status: string; 
  paymentStatus: 'UNPAID' | 'PAID';
  cancelReason?: string;
  createdAt: string;
  note?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}