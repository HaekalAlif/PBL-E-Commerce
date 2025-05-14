export interface Product {
  kategori: any;
  id_barang: number;
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
  barangList: Product[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => Promise<void>;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export interface ProductTableProps {
  products: Product[];
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
}

export interface ProductContentProps {
  barangList: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
}
