export interface OverviewData {
  total_revenue: number;
  revenue_growth: number;
  total_orders: number;
  orders_growth: number;
  total_products: number;
  available_balance: number;
}

export interface SalesTrendData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
}

export interface CustomerAnalyticsData {
  unique_customers: number;
  repeat_customers: number;
  retention_rate: number;
}

export interface ProductPerformanceData {
  total_products: number;
  sold_products: number;
  conversion_rate: number;
  average_rating: number;
}

export interface RecentActivityData {
  type: string;
  message: string;
  product: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface RevenueAnalyticsData {
  period: string;
  revenue: number;
}

export interface AnalyticsData {
  top_products: TopProduct[];
  overview: OverviewData;
  sales_trend: SalesTrendData[];
  order_status_distribution: OrderStatusData[];
  customer_analytics: CustomerAnalyticsData;
  product_performance: ProductPerformanceData;
  recent_activities: RecentActivityData[];
  revenue_analytics: RevenueAnalyticsData[];
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface TopProduct {
  product: {
    id_barang: number;
    nama_barang: string;
    harga: number;
    gambarBarang?: Array<{ url_gambar: string }>;
  };
  total_sold: number;
  total_revenue: number;
}
