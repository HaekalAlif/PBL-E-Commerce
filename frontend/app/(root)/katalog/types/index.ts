export interface Product {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  deskripsi_barang: string;
  status_barang: string;
  grade: string;
  stok: number;
  gambarBarang?: Array<{
    id_gambar_barang: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
  gambar_barang?: Array<{
    id_gambar: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
  toko: {
    id_toko: number;
    nama_toko: string;
    slug: string;
    alamat_toko?: Array<{
      provinsi: string;
      kota: string;
      province?: {
        id: string;
        name: string;
      };
      regency?: {
        id: string;
        name: string;
      };
    }>;
  };
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
}

export interface Category {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  deskripsi?: string;
  logo?: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  name: string;
  province_id: string;
}

export interface FilterOptions {
  category: string | null; // slug kategori
  province: string | null;
  regency: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  grade: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface ProductsResponse {
  status: string;
  data: {
    data: Product[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface CategoriesResponse {
  status: string;
  data: Category[];
}

export interface LocationResponse {
  status: string;
  data: Province[] | Regency[];
}
