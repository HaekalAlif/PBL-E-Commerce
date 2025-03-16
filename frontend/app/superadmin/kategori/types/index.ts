export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
}

export interface KategoriFormData {
  nama_kategori: string;
  is_active: boolean;
}

export const ITEMS_PER_PAGE = 10;
