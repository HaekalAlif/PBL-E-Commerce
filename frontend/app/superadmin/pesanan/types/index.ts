export type Customer = {
  id_user: number;
  name: string;
  email: string;
  username: string;
};

// Add User type definition - same as Customer for compatibility
export type User = {
  id_user: number;
  name: string;
  email: string;
  username: string;
};

export type Address = {
  id_alamat: number;
  alamat: string;
  kode_pos: string;
  province?: {
    name: string;
  };
  regency?: {
    name: string;
  };
  district?: {
    name: string;
  };
  village?: {
    name: string;
  };
};

export type Store = {
  id_toko: number;
  nama_toko: string;
  slug: string;
};

export type Product = {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  gambar_barang?: ProductImage[]; // Changed from gambarBarang to gambar_barang to match backend
};

// Add ProductImage type definition similar to the one in barang types
export interface ProductImage {
  id_gambar: number;
  id_barang: number;
  url_gambar: string;
  is_primary: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

// Add ShippingInfo type definition
export interface ShippingInfo {
  id_pengiriman: number;
  id_detail_pembelian: number;
  nomor_resi: string;
  tanggal_pengiriman: string;
  catatan_pengiriman: string | null;
  bukti_pengiriman: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id_detail_pembelian: number;
  id_pembelian: number;
  id_barang: number;
  id_toko: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  barang: Product;
  toko: Store;
  pengiriman_pembelian?: ShippingInfo; // Ensure this matches exactly what comes from backend
}

export interface Order {
  id_pembelian: number;
  kode_pembelian: string;
  id_pembeli: number;
  id_alamat: number;
  status_pembelian: OrderStatus;
  catatan_pembeli: string | null;
  admin_notes: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  pembeli: User;
  alamat: Address;
  detail_pembelian: OrderDetail[];
  tagihan: Invoice | null;
  calculated_total: number;
}

export type OrderStatus =
  | "Menunggu Pembayaran"
  | "Dibayar"
  | "Diproses"
  | "Dikirim"
  | "Selesai"
  | "Dibatalkan";

export type PaymentStatus = "Menunggu" | "Dibayar" | "Expired" | "Gagal";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  "Menunggu Pembayaran": "Menunggu Pembayaran",
  Dibayar: "Dibayar",
  Diproses: "Diproses",
  Dikirim: "Dikirim",
  Selesai: "Selesai",
  Dibatalkan: "Dibatalkan",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  Menunggu: "Belum Dibayar",
  Dibayar: "Sukses",
  Expired: "Kadaluwarsa",
};

export interface OrderFilters {
  search?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export type OrderStats = {
  order_statuses: Record<string, number>;
  payment_statuses: Record<string, number>;
  last_week_orders: {
    date: string;
    count: number;
  }[];
  monthly_revenue: number;
};

// Add Invoice type definition
export interface Invoice {
  id_tagihan: number;
  id_pembelian: number;
  kode_tagihan: string;
  total_harga: number;
  biaya_kirim: number;
  opsi_pengiriman: string;
  biaya_admin: number;
  total_tagihan: number;
  metode_pembayaran: string;
  status_pembayaran: PaymentStatus;
  deadline_pembayaran: string | null;
  created_at: string;
  updated_at: string;
  group_id?: string; // For multi-store orders
}
