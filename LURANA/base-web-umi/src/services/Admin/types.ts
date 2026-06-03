// Thống kê tổng quan cho từng thẻ
export interface StatSummary {
  count: number;
  potentialRevenue: number;
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

// Sản phẩm bán chạy
export interface BestSeller {
  id: string;
  name: string;
  imageUrl: string;
}

// Tổng hợp payload trả về từ API
export interface DashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    revenue: RevenueData;
    bestSellers: BestSeller[];
  };
}