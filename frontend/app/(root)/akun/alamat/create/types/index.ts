export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}

export interface Village {
  id: string;
  name: string;
}

export interface AddressFormData {
  nama_penerima: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
}

export interface Region {
  id: string;
  name: string;
}
