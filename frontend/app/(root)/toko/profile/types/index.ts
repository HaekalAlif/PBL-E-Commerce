export interface UserData {
  id_user: number;
  email: string;
  has_store: boolean;
  store?: {
    id_toko: number;
    nama_toko: string;
    slug: string;
  };
}

export interface StoreProfile {
  id_toko: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreAddress {
  id_alamat_toko: number;
  id_toko: number;
  nama_pengirim: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  province?: {
    id: string;
    name: string;
  };
  regency?: {
    id: string;
    name: string;
  };
  district?: {
    id: string;
    name: string;
  };
}

export interface StoreFormData {
  nama_toko: string;
  deskripsi: string;
  kontak: string;
}
