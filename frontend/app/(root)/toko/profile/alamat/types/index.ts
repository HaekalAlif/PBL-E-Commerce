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
