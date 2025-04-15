// app/components/FeatureSection.tsx

'use client';

import React from 'react';
import { FaTag, FaComments, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const features = [
  {
    icon: <FaTag size={40}  />, 
    title: 'Transparansi Harga', 
    description: 'Harga yang jelas dan transparan untuk semua pembeli.',
    bgColor: 'bg-white',
    textColor: 'text-black'
  },
  {
    icon: <FaComments size={40} />, 
    title: 'Dukungan Live Chat & Penawaran', 
    description: 'Ajukan pertanyaan langsung dan dapatkan penawaran terbaik.',
    bgColor: 'bg-white',
    textColor: 'text-black'
  },
  {
    icon: <FaCheckCircle size={40}  />, 
    title: '100% Keamanan', 
    description: 'Sistem transaksi aman dan terpercaya.',
    bgColor: 'bg-white',
    textColor: 'text-black'
  },
  {
    icon: <FaShieldAlt size={40} />, 
    title: 'Garansi Keamanan Transaksi', 
    description: 'Garansi uang kembali jika transaksi tidak sesuai.',
    bgColor: 'bg-white',
    textColor: 'text-black'
  }
];

const Kelebihan = () => {
  return (
    <div className='bg-amber-50 py-12'>
    <div className="flex max-w-6xl mx-auto shadow-xl">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex-1 p-6 flex flex-col items-center text-center ${feature.bgColor} ${feature.textColor} ${index === 0 ? 'rounded-l-xl' : ''} ${index === features.length - 1 ? 'rounded-r-xl' : ''} ${index !== features.length - 1 ? 'border-r border-gray-200' : ''} hover:bg-[#F79E0E] hover:text-white transition duration-300`}
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Kelebihan;   