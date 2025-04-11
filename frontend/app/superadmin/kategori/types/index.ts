export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  slug_kategori: string;
  is_deleted: boolean;
  parent_id: number | null; // Add this property to fix the error
  icon_url: string | null; // Add this property to fix the error
  created_at: string;
  updated_at: string;
}

export interface KategoriFormData {
  nama_kategori: string;
  parent_id?: number | null;
  icon_url?: string | null;
}

export const ITEMS_PER_PAGE = 10;
