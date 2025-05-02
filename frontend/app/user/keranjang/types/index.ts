export interface CartItem {
  id_keranjang: number;
  id_barang: number;
  jumlah: number;
  is_selected: boolean;
  barang: {
    id_barang: number;
    nama_barang: string;
    harga: number;
    status_barang: string;
    stok: number;
    slug: string;
    gambarBarang?: Array<{
      url_gambar: string;
    }>;
    gambar_barang?: Array<{
      url_gambar: string;
    }>;
    toko: {
      id_toko: number;
      nama_toko: string;
      slug: string;
    };
  };
}

export interface StoreGroup {
  id_toko: number;
  nama_toko: string;
  slug: string;
  items: CartItem[];
  allSelected: boolean;
}
