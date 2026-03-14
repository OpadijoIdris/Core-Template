export interface OrderStats {
  PENDING: number;
  PAID: number;
  CANCELLED: number;
  FULFILLED: number;
}

export interface AnalyticsData {
  orders: {
    total: number;
    status: OrderStats;
  };
  revenue: {
    total: number;
    today: number;
    month: number;
    projected: number;
  };
  refunds: {
    count: number;
    amount: number;
  };
  inventory: {
    lowStock: number;
    outOfStock: number;
  };
  chat: {
    openConversations: number;
  };
}

export interface RevenueTrendPoint {
  date: string;
  label: string;
  revenue: number;
}

export interface RevenueTrendsResponse {
  success: boolean;
  data: RevenueTrendPoint[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}
