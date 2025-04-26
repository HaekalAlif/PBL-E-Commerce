export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  is_active: boolean;
  is_deleted: boolean;
  logo?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KategoriFormState {
  nama_kategori: string;
  is_active: boolean;
}

export interface FormDataWithTyping extends FormData {
  append(name: string, value: string | Blob): void;
  get(name: string): string | null;
}

export const ITEMS_PER_PAGE = 10;
