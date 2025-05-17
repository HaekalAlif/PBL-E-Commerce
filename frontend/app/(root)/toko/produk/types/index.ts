export interface Product {
  id: any;
  kategori: any;
  id_barang: number;  // Make sure this exists
  id_kategori: number;
  id_toko: number;
  nama_barang: string;
  slug: string;
  harga: number;
  stok: number;
  deskripsi?: string;
  status_barang: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  gambar_barang?: Array<{
    id_gambar: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
}

export interface PaginatedResponse {
  current_page: number;
  data: Product[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface ProductListProps {
  products: Product[];
  searchQuery: string;
  activeFilter: string;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  onSearch: (value: string) => void;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
  refetchProducts: () => void;
}
