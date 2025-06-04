export interface SaldoPenjual {
  id_saldo_penjual: number;
  id_user: number;
  saldo_tersedia: number;
  saldo_tertahan: number;
  total_saldo: number;
  created_at: string;
  updated_at: string;
  user: {
    id_user: number;
    name: string;
    email: string;
  };
  pengajuan_pencairan?: PengajuanPencairan[];
}

export interface SaldoPerusahaan {
  id_saldo_perusahaan: number;
  id_pembelian: number;
  id_penjual: number;
  jumlah_saldo: number;
  status: "Menunggu Penyelesaian" | "Siap Dicairkan" | "Dicairkan";
  created_at: string;
  updated_at: string;
  pembelian: {
    id_pembelian: number;
    kode_pembelian: string;
    status_pembelian: string;
    created_at: string;
  };
  penjual: {
    id_user: number;
    name: string;
    email: string;
  };
}

export interface PengajuanPencairan {
  id_pencairan: number;
  id_user: number;
  id_saldo_penjual: number;
  jumlah_dana: number;
  keterangan: string;
  nomor_rekening: string;
  nama_bank: string;
  nama_pemilik_rekening: string;
  tanggal_pengajuan: string;
  status_pencairan: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  tanggal_pencairan?: string;
  catatan_admin?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

export interface WithdrawalFormData {
  jumlah_dana: number;
  keterangan: string;
  nomor_rekening: string;
  nama_bank: string;
  nama_pemilik_rekening: string;
}

export interface WithdrawalRequest {
  id_pencairan: number;
  id_user: number;
  id_saldo_penjual: number;
  jumlah_dana: number;
  keterangan: string;
  nomor_rekening: string;
  nama_bank: string;
  nama_pemilik_rekening: string;
  tanggal_pengajuan: string;
  status_pencairan: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  tanggal_pencairan?: string;
  catatan_admin?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
  saldo_penjual?: SaldoPenjual;
  creator?: {
    id_user: number;
    name: string;
    email: string;
  };
  updater?: {
    id_user: number;
    name: string;
    email: string;
  };
}
