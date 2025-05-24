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
  id_pembeli: number;
  id_alamat: number;
  kode_pembelian: string;
  status_pembelian: string;
  catatan_pembeli: string | null;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  calculated_total: number;
  detail_pembelian: Array<{
    id_detail: number;
    id_pembelian: number;
    id_barang: number;
    id_toko: number;
    harga_satuan: number;
    jumlah: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    barang: Barang;
    pengiriman_pembelian?: PengirimanPembelian;
  }>;
  tagihan?: Tagihan;
  pengiriman: null;
  alamat: AlamatUser;
  review?: Review;
  komplain?: Komplain;
}

export interface Barang {
  id_barang: number;
  id_kategori: number;
  id_toko: number;
  nama_barang: string;
  slug: string;
  deskripsi_barang: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kondisi_detail: string;
  berat_barang: string;
  dimensi: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  gambar_barang: GambarBarang[];
}

export interface GambarBarang {
  id_gambar: number;
  id_barang: number;
  url_gambar: string;
  urutan: number;
  is_primary: boolean;
  created_at: string;
}

export interface PengirimanPembelian {
  id_pengiriman: number;
  id_detail_pembelian: number;
  nomor_resi: string;
  tanggal_pengiriman: string;
  bukti_pengiriman: string;
  catatan_pengiriman: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tagihan {
  id_tagihan: number;
  id_pembelian: number;
  kode_tagihan: string;
  group_id: string;
  total_harga: number;
  biaya_kirim: number;
  opsi_pengiriman: string;
  biaya_admin: number;
  total_tagihan: number;
  metode_pembayaran: string;
  midtrans_transaction_id: string;
  midtrans_payment_type: string | null;
  midtrans_status: string;
  status_pembayaran: string;
  deadline_pembayaran: string;
  tanggal_pembayaran: string;
  snap_token: string;
  payment_url: string;
  created_at: string;
  updated_at: string;
}

export interface AlamatUser {
  id_alamat: number;
  id_user: number;
  nama_penerima: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  province: Province;
  regency: Regency;
  district: District;
  village: null;
}

export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface District {
  id: string;
  regency_id: string;
  name: string;
}

export interface Review {
  id_review: number;
  id_user: number;
  id_pembelian: number;
  rating: number;
  komentar: string;
  image_review?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id_user: number;
    name: string;
    username: string;
    foto_profil?: string;
  };
}

export interface Komplain {
  id_komplain: number;
  id_user: number;
  id_pembelian: number;
  alasan_komplain: string;
  isi_komplain: string;
  bukti_komplain: string;
  status_komplain: string;
  admin_notes: string | null;
  processed_by: number | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  retur: any | null;
}

export const trackingSteps = [
  {
    status: "Pesanan Dibuat",
    icon: Package,
    description: "Pesanan telah diterima",
  },
  {
    status: "Pembayaran",
    icon: CreditCard,
    description: "Pembayaran telah dikonfirmasi",
  },
  {
    status: "Diproses",
    icon: PackageCheck,
    description: "Pesanan sedang diproses",
  },
  {
    status: "Dikirim",
    icon: Truck,
    description: "Pesanan dalam pengiriman",
  },
  {
    status: "Diterima",
    icon: Home,
    description: "Pesanan telah diterima pembeli",
  },
  {
    status: "Selesai",
    icon: ThumbsUp,
    description: "Pesanan telah diselesaikan",
  },
] as const;

export const statusToStepMap = {
  Draft: 0,
  "Menunggu Pembayaran": 0,
  Dibayar: 1,
  Diproses: 2,
  Dikirim: 3,
  Diterima: 4,
  Selesai: 5,
  Dibatalkan: -1,
} as const;
