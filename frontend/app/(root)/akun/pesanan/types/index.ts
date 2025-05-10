export interface OrderItem {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  alamat: {
    nama_penerima: string;
    alamat_lengkap: string;
    regency: { name: string };
  };
  detail_pembelian: Array<{
    id_detail_pembelian: number;
    harga_satuan: number;
    jumlah: number;
    subtotal: number;
    barang: {
      nama_barang: string;
      gambar_barang?: Array<{ url_gambar: string }>;
    };
  }>;
  tagihan?: {
    id_tagihan: number;
    kode_tagihan: string;
    total_tagihan: number;
    status_pembayaran: string;
    metode_pembayaran: string;
  };
}

export interface OrderCardProps {
  order: OrderItem;
  onOrderClick: (kode: string) => void;
}

export interface OrderListProps {
  orders: OrderItem[];
  activeTab: string;
  searchQuery: string;
  onSearch: (value: string) => void;
  onTabChange: (value: string) => void;
  refetchOrders: () => void;
}
