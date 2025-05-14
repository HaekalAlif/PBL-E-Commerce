export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
  url_gambar?: string; // Add url_gambar field for images from the server
}

export interface BarangFormData {
  nama_barang: string;
  id_kategori: string;
  deskripsi_barang: string;
  harga: string;
  grade: string;
  status_barang: string;
  stok: string;
  kondisi_detail: string;
  berat_barang: string;
  dimensi: string;
  slug?: string; // Add slug field for existing products
}

// Add a new interface for server images
export interface GambarBarang {
  id_gambar: number;
  id_barang: number;
  url_gambar: string;
  is_primary: boolean;
  urutan: number;
}
