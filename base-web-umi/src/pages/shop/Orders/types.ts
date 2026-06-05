export type OrderStatus = 'ALL' | 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface TrackingStep {
  title: string;
  description: string;
  time: string;
  completed: boolean;
}

export interface OrderData {
  id: string;
  orderCode: string;
  date: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'UNPAID';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
  trackingSteps: TrackingStep[];
}
