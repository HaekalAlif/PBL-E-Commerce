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
  id_user: number;
  nama_penerima: string;
  no_telepon: string;
  alamat_lengkap: string;
  kode_pos: string;
  is_primary: boolean;
  province?: {
    id: string;
    name: string;
  };
  regency?: {
    id: string;
    name: string;
  };
  district?: {
    id: string;
    name: string;
  };
  village?: {
    id: string;
    name: string;
  };
}

export interface ProductInCheckout {
  id_barang: number;
  nama_barang: string;
  harga: number;
  jumlah: number;
  subtotal: number;
  gambar_barang?: Array<{
    id_gambar: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
  toko: {
    id_toko: number;
    nama_toko: string;
  };
  is_from_offer?: boolean;
  offer_price?: number;
  original_price?: number;
  savings?: number;
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
  alamat_toko?: string; // Add store address
  kontak?: string; // Add store contact
  deskripsi?: string; // Add store description
  products: ProductInCheckout[];
  subtotal: number;
  selectedAddressId: number | null;
  shippingOptions: ShippingOption[];
  selectedShipping: string | null;
  shippingCost: number;
  notes: string;
  isLoadingShipping: boolean;
}

// Update interface for DetailPembelianAPI
export interface DetailPembelianAPI {
  id_detail: number;
  id_pembelian: number;
  id_barang: number;
  id_toko: number;
  id_pesan?: number | null;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  barang: {
    id_barang: number;
    id_toko: number;
    nama_barang: string;
    harga: number;
    gambar_barang?: Array<{
      id_gambar: number;
      url_gambar: string;
      is_primary: boolean;
    }>;
    toko?: {
      id_toko: number;
      nama_toko: string;
      slug: string;
      deskripsi: string;
      kontak: string;
      alamat_toko?: Array<{
        id_alamat_toko: number;
        nama_pengirim: string;
        no_telepon: string;
        alamat_lengkap: string;
        kode_pos: string;
        is_primary: boolean;
        province?: {
          id: string;
          name: string;
        };
        regency?: {
          id: string;
          name: string;
        };
        district?: {
          id: string;
          name: string;
        };
      }>;
    };
  };
  toko: {
    id_toko: number;
    nama_toko: string;
    slug: string;
    deskripsi: string;
    kontak: string;
    alamat_toko: Array<{
      id_alamat_toko: number;
      nama_pengirim: string;
      no_telepon: string;
      alamat_lengkap: string;
      kode_pos: string;
      is_primary: boolean;
      province?: {
        id: string;
        name: string;
      };
      regency?: {
        id: string;
        name: string;
      };
      district?: {
        id: string;
        name: string;
      };
    }>;
  };
  pesan_penawaran?: {
    id_pesan: number;
    harga_tawar: number;
  } | null;
  is_from_offer?: boolean;
  offer_price?: number;
  original_price?: number;
  savings?: number;
}
