export interface Product {
  id_barang: number;
  id_toko: number;
  id_kategori: number;
  slug: string;
  nama_barang: string;
  deskripsi_barang: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  kategori?: Category;
  toko?: Store;
  gambar_barang: ProductImage[];
}

export interface Category {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  deskripsi_kategori?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id_toko: number;
  id_user: number;
  nama_toko: string;
  slug: string;
  deskripsi?: string;
  alamat?: string;
  kontak?: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id_gambar: number;
  id_barang: number;
  url_gambar: string;
  is_primary: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  nama_barang: string;
  id_kategori: number;
  deskripsi_barang: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
}

export const PRODUCT_STATUS = {
  Tersedia: "Available",
  Terjual: "Sold",
  Habis: "Out of Stock",
};

export const GRADE_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];

export const ITEMS_PER_PAGE = 10;
