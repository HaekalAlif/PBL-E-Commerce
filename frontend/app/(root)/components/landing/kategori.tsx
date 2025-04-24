'use client';

import React from 'react';
import {
  FaTshirt, FaTv, FaMotorcycle, FaCar, FaShoppingBag, FaCouch,
  FaDumbbell, FaThLarge, FaLaptop, FaApple
} from 'react-icons/fa';

const categories = [
  { name: 'Pakaian', icon: <FaTshirt /> },
  { name: 'Elektronik', icon: <FaTv /> },
  { name: 'Laptop', icon: <FaLaptop /> },
  { name: 'Motor', icon: <FaMotorcycle /> },
  { name: 'Mobil', icon: <FaCar /> },
  { name: 'Aksesoris', icon: <FaShoppingBag /> },
  { name: 'Perabotan', icon: <FaCouch /> },
  { name: 'Handphone', icon: <FaApple /> },
  { name: 'Olahraga', icon: <FaDumbbell /> },
  { name: 'Lain - Lain', icon: <FaThLarge /> },
];

export default function Kategori() {
  return (
    <section className="py-10 bg-[#FFF8EF]">
      <h2 className="text-[28px] text-center font-semibold text-[#F79E0E] mb-8 max-sm:text-[24px]">
        Kategori
      </h2>
      <div className="px-4">
        <div className="flex overflow-x-auto gap-4 scrollbar-hide md:justify-center md:flex-wrap">
          {categories.slice(0, 8).map((cat, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-[#F79E0E] text-white w-24 h-24 md:w-36 md:h-32 rounded-lg flex flex-col justify-center items-center text-sm md:text-md gap-1 md:gap-2 shadow-md hover:scale-105 transition"
            >
              <div className="text-xl md:text-3xl">{cat.icon}</div>
              <span className="text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
