'use client';

import { useState } from 'react';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <section className="bg-amber-50 p-4 sm:p-6 flex justify-center border-t-2">
      <div className="text-center w-full max-w-md">
        <h2 className="text-base sm:text-lg font-semibold text-dark">Dapatkan Update Barang</h2>
        <p className="text-sm text-orange-600 mt-1 mb-4">
          Dapatkan informasi terbaru tentang barang terbaru langsung di email Anda!
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email Anda..."
            className="p-2 sm:rounded-l-lg rounded-md border focus:outline-none w-full sm:w-72 bg-white"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-md sm:rounded-r-lg hover:bg-orange-600"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default SubscribeSection;
