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

export interface FormData {
  nama_pengirim: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
}

export interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
  villages: Village[];
}

export interface LoadingStates {
  provinces: boolean;
  regencies: boolean;
  districts: boolean;
  villages: boolean;
  form: boolean;
  data: boolean;
}
