import { Order, OrderStatus, Customer, OrderDetail } from "../../pesanan/types";

export type PaymentStatus =
  | "Menunggu"
  | "Dibayar"
  | "Expired"
  | "Gagal"
  | "Refund";

export interface Payment {
  id_tagihan: number;
  id_pembelian: number;
  kode_tagihan: string;
  total_harga: number;
  biaya_kirim: number;
  opsi_pengiriman: string;
  biaya_admin: number;
  total_tagihan: number;
  metode_pembayaran: string;
  midtrans_transaction_id: string | null;
  midtrans_payment_type: string | null;
  midtrans_status: string | null;
  status_pembayaran: PaymentStatus;
  deadline_pembayaran: string | null;
  tanggal_pembayaran: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  refund_date: string | null;
  refunded_by: number | null;
  snap_token: string | null;
  payment_url: string | null;
  group_id: string | null;
  created_at: string;
  updated_at: string;
  pembelian?: Order; // The related order
}

export interface PaymentWithOrder extends Payment {
  pembelian: Order;
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  Menunggu: "Waiting for Payment",
  Dibayar: "Paid",
  Expired: "Expired",
  Gagal: "Failed",
  Refund: "Refunded",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  credit_card: "Credit Card",
  qris: "QRIS",
  cstore: "Convenience Store",
};

export interface PaymentFilters {
  search?: string;
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  per_page?: number;
}

export type PaymentStats = {
  payment_statuses: Record<string, number>;
  payment_methods: Record<string, number>;
  last_week_payments: {
    date: string;
    amount: number;
  }[];
  monthly_revenue: number;
  success_rate: number;
};
