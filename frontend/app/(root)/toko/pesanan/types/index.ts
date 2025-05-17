export interface OrderItem {
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

export interface Order {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  catatan_pembeli?: string;
  total: number;
  alamat: {
    nama_penerima: string;
    no_telp: string;
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
    id_detail_pembelian: number;
    nomor_resi: string;
    tanggal_pengiriman: string;
    bukti_pengiriman: string;
    catatan_pengiriman?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface OrderStats {
  new_orders: number;
  processing_orders: number;
  shipped_orders: number;
  completed_orders: number;
}
