export interface Region {
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

export interface EditAddressFormProps {
  formData: AddressFormData;
  loading: boolean;
  loadingData: boolean;
  error: string | null;
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  loadingProvinces: boolean;
  loadingRegencies: boolean;
  loadingDistricts: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}
