export interface InvoiceDetails {
  id_tagihan: number;
  kode_tagihan: string;
  total_harga: number;
  biaya_kirim: number;
  opsi_pengiriman: string;
  biaya_admin: number;
  total_tagihan: number;
  metode_pembayaran: string;
  status_pembayaran: string;
  deadline_pembayaran: string;
  midtrans_transaction_id?: string;
  midtrans_payment_type?: string;
  pembelian: {
    id_pembelian: number;
    id_pembeli: number;
    id_alamat: number;
    kode_pembelian: string;
    status_pembelian: string;
    catatan_pembeli?: string;
    detail_pembelian: Array<{
      // Changed from detailPembelian to detail_pembelian to match API
      id_detail: number;
      id_pembelian: number;
      id_barang: number;
      id_toko: number;
      harga_satuan: number;
      jumlah: number;
      subtotal: number;
      barang: {
        id_barang: number;
        nama_barang: string;
        gambar_barang: Array<{
          // Changed from gambarBarang to gambar_barang
          url_gambar: string;
        }>;
      };
    }>;
    alamat: {
      id_alamat: number;
      id_user: number;
      nama_penerima: string;
      no_telepon: string;
      alamat_lengkap: string;
      provinsi: string;
      kota: string;
      kecamatan: string;
      kode_pos: string;
      is_primary: boolean;
      province: { id: string; name: string };
      regency: { id: string; province_id: string; name: string };
      district: { id: string; regency_id: string; name: string };
      village: null | any;
    };
  };
}

export interface PaymentComponentProps {
  invoice: InvoiceDetails;
  paymentStatus: string | null;
  timeLeft: string | null;
  paymentLoading: boolean;
  onPayment: () => void;
}

export interface OrderSummaryProps {
  invoice: InvoiceDetails;
  paymentStatus: string | null;
  timeLeft: string | null;
}

export interface ShippingInfoProps {
  invoice: InvoiceDetails;
}
