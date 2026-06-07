export type OrderStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId?: string;
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
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
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
