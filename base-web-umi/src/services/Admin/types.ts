// Thống kê tổng quan cho từng thẻ
export interface StatSummary {
  count: number;
  potentialRevenue: number;
  ringPercent?: number;
}

export interface DashboardStats {
  newOrders: StatSummary;
  processedOrders: StatSummary;
  deliveredOrders: StatSummary;
  newCustomers: StatSummary;
}

// Dữ liệu đơn hàng mới
export interface RecentOrder {
  id: string;
  orderId?: string;
  orderCode?: string;
  status?: string;
  productName: string;
  quantity: number;
  price: number;
  createdAt: string;
  imageUrl: string;
}

// Dữ liệu cho biểu đồ
export interface ChartDataPoint {
  label: string;
  salesQuantity: number;
  revenue: number;
}

export interface RevenueData {
  total: number;
  chartData: ChartDataPoint[];
}

export interface BestSeller {
  id: string;
  name: string;
  imageUrl: string;
  sales?: number;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    revenue: RevenueData;
    revenueWeek?: RevenueData;
    revenueMonth?: RevenueData;
    revenueYear?: RevenueData;
    bestSellers: BestSeller[];
  };
}
export interface ReportsResponse {
  success: boolean;
  data: {
    kpis: {
      totalRevenue: { value: number; trend: number; type: 'up' | 'down' };
      netProfit: { value: number; trend: number; type: 'up' | 'down' };
      discounts: { value: number; trend: number; type: 'up' | 'down' };
      aov: { value: number; trend: number; type: 'up' | 'down' };
    };
    trendData: Array<{
      label: string;
      revenue: number;
      profit: number;
    }>;
    categoryData: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    topProducts: Array<{
      id: string;
      name: string;
      sku: string;
      sales: number;
      revenue: number;
      status: string;
      image: string;
    }>;
  };
}