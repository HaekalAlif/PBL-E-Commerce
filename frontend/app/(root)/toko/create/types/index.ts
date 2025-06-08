export interface StoreFormData {
  nama_toko: string;
  deskripsi: string;
  kontak: string;
}

export interface FormStates {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
}
