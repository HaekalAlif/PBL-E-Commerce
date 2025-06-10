export interface StoreProfile {
  id_toko: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id_user: number;
    name: string;
    email: string;
  };
  alamat_toko: StoreAddress[];
}

export interface StoreAddress {
  id_alamat_toko: number;
  nama_pengirim: string;
  no_telepon: string;
  alamat_lengkap: string;
  kode_pos: string;
  is_primary: boolean;
  province: {
    id: string;
    name: string;
  };
  regency: {
    id: string;
    name: string;
  };
  district: {
    id: string;
    name: string;
  };
}

export interface StoreStatistics {
  total_products: number;
  total_orders_completed: number;
  total_revenue: number;
  success_rate: number;
  store_join_date: string;
  avg_response_time: string;
}

export interface StoreRating {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: number]: number;
  };
}

export interface StoreProduct {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kategori: {
    id_kategori: number;
    nama_kategori: string;
    slug: string;
  };
  gambarBarang: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
}

export interface StoreReview {
  id_review: number;
  rating: number;
  komentar: string;
  image_review?: string;
  created_at: string;
  user: {
    id_user: number;
    name: string;
  };
  pembelian: {
    id_pembelian: number;
    kode_pembelian: string;
    detailPembelian?: Array<{
      barang: {
        id_barang: number;
        nama_barang: string;
        gambarBarang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
        gambar_barang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
      };
    }>;
    detail_pembelian?: Array<{
      barang: {
        id_barang: number;
        nama_barang: string;
        gambarBarang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
        gambar_barang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
      };
    }>;
  };
}

export interface StoreCategory {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  product_count: number;
}

export interface StoreData {
  store: StoreProfile;
  statistics: StoreStatistics;
  rating: StoreRating;
}
