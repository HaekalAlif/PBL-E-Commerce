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

export interface OrderDetail {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  catatan_pembeli?: string;
  total: number;
  alamat: {
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
  items: OrderItem[];
  pengiriman?: {
    id_pengiriman: number;
    nomor_resi: string;
    tanggal_pengiriman: string;
    bukti_pengiriman?: string;
    catatan_pengiriman?: string;
  };
  komplain?: Komplain;
}

export interface ShippingFormData {
  nomor_resi: string;
  catatan_pengiriman?: string;
  bukti_pengiriman: File | null;
}

export interface Komplain {
  id_komplain: number;
  id_user: number;
  id_pembelian: number;
  alasan_komplain: string;
  isi_komplain: string;
  bukti_komplain: string;
  status_komplain: string;
  admin_notes?: string;
  processed_by?: number;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  retur?: {
    id_retur: number;
    alasan_retur: string;
    deskripsi_retur: string;
    foto_bukti: string;
    status_retur: string;
    admin_notes?: string;
    tanggal_pengajuan: string;
    tanggal_disetujui?: string;
    tanggal_selesai?: string;
  };
}
