import {
  Package,
  CreditCard,
  PackageCheck,
  Truck,
  Home,
  ThumbsUp,
} from "lucide-react";

export interface OrderDetail {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  catatan_pembeli?: string;
  created_at: string;
  updated_at: string;
  alamat: {
    nama_penerima: string;
    no_telp: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
  detailPembelian: Array<{
    id_detail_pembelian: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    barang: {
      nama_barang: string;
      slug: string;
      gambar_barang?: Array<{ url_gambar: string }>;
    };
  }>;
  tagihan?: {
    id_tagihan: number;
    kode_tagihan: string;
    total_harga: number;
    biaya_kirim: number;
    biaya_admin: number;
    total_tagihan: number;
    status_pembayaran: string;
    metode_pembayaran: string;
    deadline_pembayaran?: string;
    tanggal_pembayaran?: string;
    midtrans_payment_type?: string;
    opsi_pengiriman?: string;
  };
  tracking_info?: {
    resi?: string;
    courier?: string;
  };
}

export const trackingSteps = [
  {
    status: "Order Placed",
    icon: Package,
    description: "Your order has been received",
  },
  {
    status: "Payment",
    icon: CreditCard,
    description: "Payment has been confirmed",
  },
  {
    status: "Processing",
    icon: PackageCheck,
    description: "Your order is being processed",
  },
  {
    status: "Shipped",
    icon: Truck,
    description: "Your order has been shipped",
  },
  {
    status: "Delivered",
    icon: Home,
    description: "Package has been delivered",
  },
  {
    status: "Completed",
    icon: ThumbsUp,
    description: "Order completed",
  },
] as const;
