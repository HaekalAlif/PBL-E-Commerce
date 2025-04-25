'use client';

import React from 'react';
import { FaTag, FaComments, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const features = [
  {
    icon: <FaTag className="text-2xl sm:text-3xl lg:text-4xl" />,
    title: 'Transparansi Harga',
    description: 'Harga yang jelas dan transparan untuk semua pembeli.',
    bgColor: 'bg-white',
    textColor: 'text-black',
  },
  {
    icon: <FaComments className="text-2xl sm:text-3xl lg:text-4xl" />,
    title: 'Dukungan Live Chat & Penawaran',
    description: 'Ajukan pertanyaan langsung dan dapatkan penawaran terbaik.',
    bgColor: 'bg-white',
    textColor: 'text-black',
  },
  {
    icon: <FaCheckCircle className="text-2xl sm:text-3xl lg:text-4xl" />,
    title: '100% Keamanan',
    description: 'Sistem transaksi aman dan terpercaya.',
    bgColor: 'bg-white',
    textColor: 'text-black',
  },
  {
    icon: <FaShieldAlt className="text-2xl sm:text-3xl lg:text-4xl" />,
    title: 'Garansi Keamanan Transaksi',
    description: 'Garansi uang kembali jika transaksi tidak sesuai.',
    bgColor: 'bg-white',
    textColor: 'text-black',
  },
];

const Kelebihan = () => {
  return (
    <div className="bg-amber-50 py-8 px-2 sm:py-12 sm:px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-0 rounded-xl overflow-hidden max-sm:px-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-4 sm:p-6 flex flex-col items-center text-center ${feature.bgColor} ${feature.textColor} border border-gray-200 
              lg:border-r lg:last:border-r-0 
              hover:bg-[#F79E0E] hover:text-white transition duration-300 rounded-xl lg:rounded-none`}
          >
            <div className="mb-3 sm:mb-4">{feature.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
            <p className="text-xs sm:text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kelebihan;
