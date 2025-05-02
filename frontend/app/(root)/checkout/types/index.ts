export interface CheckoutProduct {
  id_barang: number;
  nama_barang: string;
  harga: number;
  jumlah: number;
  subtotal: number;
  gambar_barang?: {
    url_gambar: string;
  }[];
  toko: {
    id_toko: number;
    nama_toko: string;
    slug?: string;
  };
}

export interface Address {
  id_alamat: number;
  nama_penerima: string;
  no_telp: string;
  alamat_lengkap: string;
  kode_pos: string;
  is_primary: boolean;
  province: {
    id: number;
    name: string;
  };
  regency: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  village: {
    id: number;
    name: string;
  };
}

export interface ShippingOption {
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface StoreCheckout {
  id_toko: number;
  nama_toko: string;
  products: CheckoutProduct[];
  subtotal: number;
  selectedAddressId: number | null;
  shippingOptions: ShippingOption[];
  selectedShipping: string | null;
  shippingCost: number;
  notes: string;
  isLoadingShipping: boolean;
}
