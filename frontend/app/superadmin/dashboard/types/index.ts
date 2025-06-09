export interface DashboardOverview {
  total_users: number;
  total_stores: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  monthly_revenue: number;
}

export interface DashboardGrowth {
  new_users_this_month: number;
  new_orders_this_month: number;
  user_growth_percentage: number;
  order_growth_percentage: number;
}

export interface DashboardPendingItems {
  pending_payments: number;
  pending_withdrawals: number;
  pending_complaints: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  growth: DashboardGrowth;
  pending_items: DashboardPendingItems;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  successful_payments: number;
  total_payments: number;
  formatted_date: string;
}

export interface UserGrowthData {
  date: string;
  total_users: number;
  regular_users: number;
  seller_users: number;
  formatted_date: string;
}

export interface TopProduct {
  id_barang: number;
  nama_barang: string;
  gambar_barang: string | null;
  nama_toko: string;
  total_sold: number;
  total_revenue: number;
  avg_price: number;
}

export interface RecentActivity {
  kode_pembelian: string;
  customer_name: string;
  total_harga: number;
  status_pembelian: string;
  created_at: string;
  activity_type: "order" | "payment";
}

export interface OrderStatusDistribution {
  status_pembelian: string;
  count: number;
  total_value: number;
}

export interface PaymentMethod {
  metode_pembayaran: string;
  count: number;
  total_amount: number;
}

export interface RegionalData {
  province_name: string;
  order_count: number;
  total_revenue: number;
}

export interface DashboardFilters {
  period: "7" | "30" | "90" | "365";
  dateRange?: {
    from: string;
    to: string;
  };
}
