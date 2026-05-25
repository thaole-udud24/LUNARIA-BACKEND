export interface OrderItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  img: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

export type PaymentMethodType = 'COD' | 'BANK' | 'MOMO';
