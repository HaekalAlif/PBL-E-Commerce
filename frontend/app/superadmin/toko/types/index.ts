// Store types.ts

export type User = {
  id_user: number;
  name: string;
  email: string;
  username: string;
};

export type Store = {
  id_toko: number;
  id_user: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  user?: User;
};

export const ITEMS_PER_PAGE = 10;

export type StoreFormData = {
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
};

export type StoreFilterParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
};