// Store types.ts

export interface Owner {
  id_user: number;
  name: string;
  email: string;
  username: string;
}

export interface Store {
  id_toko: number;
  id_pemilik: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  logo: string | null;
  banner: string | null;
  is_deleted: boolean;
  is_verified: boolean; // Add this property to fix the error
  created_at: string;
  updated_at: string;
  pemilik?: Owner;
}

export const ITEMS_PER_PAGE = 10;

export interface StoreFormData {
  nama_toko: string;
  deskripsi: string;
  logo?: File | null;
  banner?: File | null;
  id_pemilik?: number;
}

export interface StoreFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}
