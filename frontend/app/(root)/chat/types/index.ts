export interface Message {
  id_pesan: number;
  id_ruang_chat: number;
  id_user: number;
  tipe_pesan: string;
  isi_pesan: string;
  harga_tawar: number | null;
  status_penawaran: string | null;
  id_barang: number | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id_user: number;
    name: string;
  };
}
