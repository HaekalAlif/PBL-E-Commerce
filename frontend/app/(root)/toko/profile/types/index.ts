export interface StoreProfile {
  id_toko: number;
  id_user: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  kontak: string;
  is_active: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export interface StoreContentProps {
  profile: StoreProfile | null;
  error: string | null;
}
