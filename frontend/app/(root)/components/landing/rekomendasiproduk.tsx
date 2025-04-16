'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'Pakaian', 'Elektronik', 'Motor', 'Mobil', 'Aksesoris', 'Perabotan', 'Olahraga', 'Lain - Lain'
];

const products = Array(8).fill({
  image: '/camera.png',
  name: 'Nama Barang',
  price: '100.000.00'
});

export default function Rekomendasi() {
  const router = useRouter();

  const handleProduk = () => {
    router.push('/produk');
  };

  return (
    <div className="bg-white">
      <h1 className="text-center text-[#F79E0E] text-4xl font-bold h-24 flex items-center justify-center">
        Rekomendasi
      </h1>

      <div className="bg-amber-50 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 xl:px-12 2xl:px-48">
          {/* Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/4 h-auto lg:h-[700px] mb-8 lg:mb-0">
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Filter</h2>
            <h3 className="text-lg font-semibold mb-4">Filter Kategori</h3>
            {categories.map((cat, index) => (
              <label key={index} className="flex items-center mb-2">
                <input type="radio" name="category" className="mr-2" />
                {cat}
              </label>
            ))}
            <h3 className="text-lg font-semibold mt-6 mb-4">Harga</h3>
            <div className="mb-4">
              <input
                type="number"
                placeholder="Range Harga Minimum"
                className="w-full p-2 border rounded-md mb-2"
              />
              <input
                type="number"
                placeholder="Range Harga Maksimum"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button className="w-full bg-[#F79E0E] text-white py-2 rounded-md mb-2">
              Terapkan
            </button>
            <button className="w-full text-[#F79E0E] border border-[#F79E0E] py-2 rounded-md">
              Reset Filter
            </button>
          </div>

          {/* Product Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-md"
                />

                {/* Tombol dan Info */}
                <div className="flex flex-col gap-2 p-2 bg-[#F79E0E] lg:flex-wrap lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg text-white font-medium">{product.name}</h3>
                    <p className="text-white">Rp {product.price}</p>
                  </div>
                  <button className="bg-white text-[#F79E0E] py-1 px-4 rounded text-sm hover:bg-[#F79E0E] hover:text-white transition">
                    Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          onClick={handleProduk}
          className="text-right text-[#F79E0E] mt-6 px-4 md:px-8 xl:px-12 2xl:px-48 cursor-pointer"
        >
          Lihat Semua
        </p>
      </div>
    </div>
  );
}
