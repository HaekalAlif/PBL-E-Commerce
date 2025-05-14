export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export interface GambarBarang {
  id_gambar: number;
  id_barang: number;
  url_gambar: string;
  is_primary: boolean;
  urutan: number;
}

export interface Barang {
  id_barang: number;
  id_toko: number;
  id_kategori: number;
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
  created_at: string;
  updated_at: string;
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
  gambar_barang: GambarBarang[];
  toko: {
    id_toko: number;
    nama_toko: string;
    slug: string;
  };
}
