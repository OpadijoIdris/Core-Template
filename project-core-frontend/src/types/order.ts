import { User } from "./user";

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'FULFILLED';
export type PaymentProvider = 'STRIPE' | 'PAYSTACK';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type RefundStatus = 'NONE' | 'REQUESTED' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export type OrderAuditAction = 
  | 'ORDER_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'ORDER_CANCELLED'
  | 'ORDER_FULFILLED'
  | 'REFUND_REQUESTED'
  | 'REFUND_SUCCESS'
  | 'REFUND_FAILED'
  | 'STATUS_UPDATED';

export interface OrderAudit {
  id: string;
  orderId: string;
  action: OrderAuditAction;
  performedBy?: string;
  role?: string;
  reason?: string;
  metadata?: any;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  product?: {
    id: string;
    name: string;
  };
  price: string | number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  user?: Partial<User>;
  status: OrderStatus;
  payment_provider: PaymentProvider;
  payment_status: PaymentStatus;
  payment_reference?: string;
  refundStatus: RefundStatus;
  refundAmount?: string | number;
  refundReference?: string;
  refundedAt?: string;
  cancelledAt?: string;
  total: string | number;
  subtotal: string | number;
  currency: string;
  itemsCount?: number;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  data: {
    meta: OrderMeta;
    orders: Order[];
  };
}

export interface AdminSingleOrderResponse {
  success: boolean;
  data: Order;
}
