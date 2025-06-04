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
  user?: {
    id_user: number;
    name: string;
    email: string;
    username: string;
  };
  saldo_penjual?: {
    id_saldo_penjual: number;
    saldo_tersedia: number;
    saldo_tertahan: number;
    total_saldo: number;
  };
  creator?: {
    id_user: number;
    name: string;
  };
  updater?: {
    id_user: number;
    name: string;
  };
}

export interface PencairanStats {
  pencairan_statuses: Record<string, number>;
  total_amount: number;
  approved_amount: number;
  pending_amount: number;
  monthly_stats: Array<{
    year: number;
    month: number;
    count: number;
    total_amount: number;
  }>;
  recent_pencairan: PengajuanPencairan[];
}

export interface PencairanFilterValues {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  page?: number;
  per_page?: number;
}

export const PENCAIRAN_STATUS_LABELS: Record<string, string> = {
  Menunggu: "Pending",
  Diproses: "Processing",
  Selesai: "Completed",
  Ditolak: "Rejected",
};
