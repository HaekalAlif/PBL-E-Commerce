export interface OrderItem {
  id_detail_pembelian: number;
  id_barang: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  barang: {
    id_barang: number;
    nama_barang: string;
    slug: string;
    gambar_barang?: Array<{ url_gambar: string }>;
  };
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
    email: string;
  };
}

export interface Komplain {
  id_komplain: number;
  id_user: number;
  id_pembelian: number;
  alasan_komplain: string;
  isi_komplain: string;
  bukti_komplain?: string;
  status_komplain: string;
  created_at: string;
  updated_at: string;
  retur?: {
    id_retur: number;
    alasan_retur: string;
    deskripsi_retur: string;
    foto_bukti?: string;
    status_retur: string;
    created_at: string;
    updated_at: string;
  };
}

export interface OrderDetail {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  catatan_pembeli?: string;
  alamat: {
    id_alamat: number;
    nama_penerima: string;
    no_telepon: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
  pembeli: {
    id_user: number;
    name: string;
    email: string;
  };
  items: Array<{
    id_detail_pembelian: number;
    id_barang: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    barang: {
      id_barang: number;
      nama_barang: string;
      slug: string;
      deskripsi: string;
      harga: number;
      stok: number;
      gambarBarang: Array<{
        id_gambar: number;
        nama_file: string;
        path_file: string;
        is_primary: boolean;
      }>;
    };
  }>;
  total: number;
  pengiriman?: {
    id_pengiriman: number;
    nomor_resi: string;
    catatan_pengiriman?: string;
    bukti_pengiriman?: string;
    tanggal_pengiriman: string;
  };
  review?: Review;
  komplain?: Komplain;
}

export interface ShippingFormData {
  nomor_resi: string;
  catatan_pengiriman?: string;
  bukti_pengiriman: File;
}
