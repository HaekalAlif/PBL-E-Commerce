'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  { image: '/camera.png', name: 'Kamera HD', price: '1.200.000' },
  { image: '/camera.png', name: 'Nama Barang', price: '2.500.000' },
  { image: '/camera.png', name: 'Nama Barang', price: '3.800.000' },
  { image: '/camera.png', name: 'Nama Barang', price: '4.100.000' },
  { image: '/camera.png', name: 'Nama Barang', price: '5.000.000' },
];

export default function ProdukUnggulan() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#F79E0E] py-14 px-6 relative">
      <h2 className="text-[28px] text-white font-semibold text-center mb-10">
        Produk Unggulan
      </h2>

      <div className="flex items-center justify-center gap-4">
        {/* Panah kiri */}
        <button
          onClick={() => scroll('left')}
          className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:scale-105 transition z-10"
        >
          <ChevronLeft className="text-[#F79E0E]" size={22} />
        </button>

        {/* Slider */}
        <div className="flex justify-center">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide w-full max-w-7xl px-2 py-4"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-[#FFF8EF] rounded-lg shadow-md overflow-hidden cursor-pointer w-[250px] flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-md"
                />
                <div className="flex justify-between items-center p-2">
                  <div>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-yellow-500 font-semibold">
                      Rp {product.price}
                    </p>
                  </div>
                  <button className="bg-[#F79E0E] text-white py-1 px-4 rounded">
                    Beli Barang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panah kanan */}
        <button
          onClick={() => scroll('right')}
          className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:scale-105 transition z-10"
        >
          <ChevronRight className="text-[#F79E0E]" size={22} />
        </button>
      </div>
    </section>
  );
}
