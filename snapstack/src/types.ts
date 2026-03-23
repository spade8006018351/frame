export type FrameCategory = 'Cute' | 'Minimal' | 'Couple';

export interface FrameStyle {
  id: string;
  name: string;
  category: FrameCategory;
  color: string;
  previewUrl: string;
  borderWidth?: string;
  pattern?: string;
  price?: number;
}

export interface CartItem {
  id: string;
  image: string;
  caption: string;
  frameId: string;
  frameName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Printed' | 'Shipped' | 'Delivered';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  image_url: string;
  frame_type: string;
  quantity: number;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'UPI' | 'COD';
}
