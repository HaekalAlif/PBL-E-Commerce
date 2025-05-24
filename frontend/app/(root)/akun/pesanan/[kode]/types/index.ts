import {
  Package,
  CreditCard,
  PackageCheck,
  Truck,
  Home,
  ThumbsUp,
} from "lucide-react";

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

// Update OrderDetail interface to include review
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
    id_keranjang: number | null;
    id_pesan: number | null;
    harga_satuan: number;
    jumlah: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    barang: {
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
      gambar_barang: Array<{
        id_gambar: number;
        id_barang: number;
        url_gambar: string;
        urutan: number;
        is_primary: boolean;
        created_at: string;
      }>;
    };
    pengiriman_pembelian?: {
      id_pengiriman: number;
      id_detail_pembelian: number;
      nomor_resi: string;
      tanggal_pengiriman: string;
      bukti_pengiriman: string;
      catatan_pengiriman: string | null;
      created_at: string;
      updated_at: string;
    };
  }>;
  tagihan?: {
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
  };
  alamat: {
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
    province: {
      id: string;
      name: string;
    };
    regency: {
      id: string;
      province_id: string;
      name: string;
    };
    district: {
      id: string;
      regency_id: string;
      name: string;
    };
    village: null;
  };
  pengiriman: null;
  review?: Review;
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
    status: "Sampai",
    icon: Home,
    description: "Paket telah sampai",
  },
  {
    status: "Selesai",
    icon: ThumbsUp,
    description: "Pesanan selesai",
  },
] as const;
