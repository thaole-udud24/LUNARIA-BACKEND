export type AccountTabType = 'PROFILE' | 'ADDRESSES' | 'ORDERS' | 'CHANGE_PASSWORD';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  avatar: string;
}

export interface UserAddress {
  id: number;
  isDefault: boolean;
  fullName: string;
  phone: string;
  addressDetail: string;
}

export interface UserOrder {
  id: string;
  orderCode: string;
  date: string;
  status: 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  total: number;
  itemCount: number;
  productName: string;
}
