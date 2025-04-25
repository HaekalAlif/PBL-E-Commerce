'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation'

const products = [
  { image: '/baju.png', name: 'Kaos Polos', price: '20.000.00' },
  { image: '/baju.png', name: 'Kaos Polos', price: '20.000.00' },
  { image: '/baju.png', name: 'Kaos Polos', price: '20.000.00' },
  { image: '/baju.png', name: 'Kaos Polos', price: '20.000.00' },
  { image: '/baju.png', name: 'Kaos Polos', price: '20.000.00' },
];

export default function ProdukUnggulan() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#F79E0E] py-14 px-4 sm:px-6 relative">
      <h2 className="text-[22px] sm:text-[24px] text-white font-semibold text-center mb-10">
        Produk Unggulan
      </h2>

      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={() => scroll('left')}
          className="hidden xl:flex bg-white w-10 h-10 rounded-full items-center justify-center shadow hover:scale-105 transition z-10"
        >
          <ChevronLeft className="text-[#F79E0E]" size={22} />
        </button>

        {/* Slider */}
        <div className="flex justify-center w-full">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide w-full max-w-7xl px-1 sm:px-2 py-4"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-[#FFF8EF] rounded-lg shadow-md overflow-hidden cursor-pointer w-[180px] sm:w-[220px] md:w-[250px] flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 sm:h-56 md:h-72 object-cover rounded-md"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-start sm:items-center p-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">
                      {product.name}
                    </h3>
                    <p className="text-yellow-500 text-sm sm:text-base font-semibold">
                      Rp {product.price}
                    </p>
                  </div>
                  <button
                    className="mt-2 sm:mt-0 bg-[#F79E0E] text-white text-sm sm:text-base py-1 px-3 sm:px-4 rounded cursor-pointer"
                    onClick={() => router.push('/detail')}
                  >
                    Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scroll('right')}
          className="hidden xl:flex bg-white w-10 h-10 rounded-full items-center justify-center shadow hover:scale-105 transition z-10"
        >
          <ChevronRight className="text-[#F79E0E]" size={22} />
        </button>
      </div>
    </section>
  )
}
