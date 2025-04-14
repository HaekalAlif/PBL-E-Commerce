'use client';

import Copyright from "./copyright";

const FooterComp = () => {
  return (
    <footer className="text-white p-8" style={{ backgroundImage: 'url(/footer.png)', backgroundSize: 'cover' }}>
      <div className="container mx-auto grid grid-cols-5 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
          <p className="text-sm mb-4">
            Platform e-commerce terpercaya yang menyediakan berbagai produk berkualitas dengan harga terbaik. Belanja mudah, aman, dan nyaman!
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Akun Saya</h3>
          <ul className="text-sm space-y-2">
            <li>Pesanan Saya</li>
            <li>Pengaturan Akun</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Bantuan</h3>
          <ul className="text-sm space-y-2">
            <li>Hubungi Kami</li>
            <li>FAQ</li>
            <li>Syarat & Ketentuan</li>
            <li>Informasi Pengiriman</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Belanja & Transaksi</h3>
          <ul className="text-sm space-y-2">
            <li>Cara Berbelanja</li>
            <li>Metode Pembayaran</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Instagram</h3>
        </div>
      </div>
      <Copyright/>
    </footer>
  );
};

export default FooterComp;