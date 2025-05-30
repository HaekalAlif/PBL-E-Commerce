export interface Komplain {
  id_komplain: number;
  id_user: number;
  id_pembelian: number;
  alasan_komplain: string;
  isi_komplain: string;
  bukti_komplain: string;
  status_komplain: string;
  admin_notes?: string;
  processed_by?: number;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id_user: number;
    name: string;
    email: string;
  };
  pembelian?: {
    id_pembelian: number;
    kode_pembelian: string;
    status_pembelian: string;
    catatan_pembeli?: string;
    detail_pembelian: Array<{
      id_detail: number;
      id_pembelian: number;
      id_barang: number;
      barang: {
        id_barang: number;
        nama_barang: string;
        harga: number;
      };
    }>;
  };
  retur?: {
    id_retur: number;
    alasan_retur: string;
    deskripsi_retur: string;
    foto_bukti: string;
    status_retur: string;
    admin_notes?: string;
    tanggal_pengajuan: string;
    tanggal_disetujui?: string;
    tanggal_selesai?: string;
    processedBy?: {
      id_user: number;
      name: string;
    };
  };
}

export interface KomplainStats {
  complaint_statuses: Record<string, number>;
  complaint_types: Record<string, number>;
  last_week_complaints: {
    date: string;
    count: number;
  }[];
}

export interface KomplainFilterValues {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export const KOMPLAIN_STATUS_LABELS: Record<string, string> = {
  Menunggu: "Waiting",
  Diproses: "In Progress",
  Selesai: "Completed",
};
