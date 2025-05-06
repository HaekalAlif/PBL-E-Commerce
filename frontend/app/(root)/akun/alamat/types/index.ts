export interface Address {
  id_alamat: number;
  nama_penerima: string;
  no_telepon: string;
  alamat_lengkap: string;
  kecamatan?: string;
  kota?: string;
  provinsi: string;
  kode_pos: string;
  is_primary: boolean;
  province?: { id: string; name: string };
  regency?: { id: string; name: string };
  district?: { id: string; name: string };
  village?: { id: string; name: string };
}

export interface AddressCardProps {
  address: Address;
  onSetPrimary: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isSettingPrimary: boolean;
  isDeleting: boolean;
}
