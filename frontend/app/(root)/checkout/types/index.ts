export interface Address {
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
  created_at?: string;
  updated_at?: string;
  district?: {
    id: number;
    name: string;
  };
  regency?: {
    id: number;
    name: string;
  };
  province?: {
    id: number;
    name: string;
  };
}

export interface AlamatToko {
  id_alamat_toko: number;
  id_toko: number;
  nama_pengirim: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
  province?: {
    id: number;
    name: string;
  };
  regency?: {
    id: number;
    name: string;
  };
  district?: {
    id: number;
    name: string;
  };
}

// Use Address interface for AlamatUser
export type AlamatUser = Address;

export interface ProductImage {
  id: number;
  id_barang: number;
  url: string;
  is_primary: boolean;
}

export interface Toko {
  id_toko: number;
  id_user: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  alamat_toko?: AlamatToko[];
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
  berat_barang: number;
  dimensi: string;
  is_deleted: boolean;
  created_by: number;
  updated_by: number;
  gambar_barang?: ProductImage[];
  toko?: Toko;
}

export interface ShippingOption {
  service: string;
  description: string;
  cost: number;
  etd: string;
  courier_name?: string;
  service_code?: string;
  courier_code?: string;
  full_service_name?: string; // Add this for complete service name
}

export interface StoreCheckout {
  id_toko: number;
  nama_toko: string;
  products: ProductInCheckout[];
  subtotal: number;
  selectedAddressId: number | null;
  shippingOptions: ShippingOption[];
  selectedShipping: string | null;
  shippingCost: number;
  notes: string;
  isLoadingShipping: boolean;
}

// Add missing interfaces for offer functionality
export interface DetailPembelianAPI {
  id_detail: number;
  id_pembelian: number;
  id_barang: number;
  id_toko: number;
  id_keranjang: number;
  id_pesan?: number;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  barang?: Barang;
  toko?: Toko;
  is_from_offer?: boolean;
  savings?: number;
  original_price?: number;
  pesanPenawaran?: any;
}

export interface ProductInCheckout {
  id_barang: number;
  nama_barang: string;
  harga: number;
  jumlah: number;
  subtotal: number;
  gambar_barang: ProductImage[];
  toko: {
    id_toko: number;
    nama_toko: string;
  };
  is_from_offer?: boolean;
  offer_price?: number;
  original_price?: number;
  savings?: number;
}

export interface DetailPembelian {
  id_detail: number;
  id_pembelian: number;
  id_barang: number;
  id_toko: number;
  id_keranjang: number;
  id_pesan?: number;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  barang?: Barang;
  toko?: Toko;
}

export interface PengirimanPembelian {
  id_pengiriman: number;
  id_detail_pembelian: number;
  nomor_resi: string;
  tanggal_pengiriman: string;
  bukti_pengiriman: string;
  catatan_pengiriman: string;
  detailPembelian?: DetailPembelian;
}

export interface Pembelian {
  id_pembelian: number;
  id_pembeli: number;
  id_alamat: number;
  kode_pembelian: string;
  status_pembelian: string;
  catatan_pembeli: string;
  is_deleted: boolean;
  created_by: number;
  updated_by: number;
  tagihan?: Tagihan;
  detailPembelian?: DetailPembelian[];
  alamat?: AlamatUser;
  pengiriman?: PengirimanPembelian;
}

export interface Tagihan {
  id_tagihan: number;
  id_pembelian: number;
  kode_tagihan: string;
  total_harga: number;
  biaya_kirim: number;
  opsi_pengiriman: string;
  biaya_admin: number;
  total_tagihan: number;
  metode_pembayaran: string;
  status_pembayaran: string;
  deadline_pembayaran?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaldoPerusahaan {
  id_saldo: number;
  id_pembelian: number;
  id_user: number;
  jumlah: number;
  tipe: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id_review: number;
  id_pembelian: number;
  id_user: number;
  rating: number;
  komentar: string;
  created_at?: string;
  updated_at?: string;
}

export interface Komplain {
  id_komplain: number;
  id_pembelian: number;
  id_user: number;
  alasan: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  retur?: Retur[];
}

export interface Retur {
  id_retur: number;
  id_komplain: number;
  id_barang: number;
  jumlah: number;
  alasan: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
