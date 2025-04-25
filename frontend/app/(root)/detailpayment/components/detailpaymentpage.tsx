'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const products = [
  { id: 1, name: 'Kaos Polos', price: 20000, image: '/baju.png' },
  { id: 2, name: 'Kaos Polos', price: 20000, image: '/baju.png' },
];

const banks = [
  { name: 'Bank BNI', logo: '/bni.png' },
  { name: 'Bank BCA', logo: '/bca.png' },
  { name: 'Bank BRI', logo: '/bri.png' },
  { name: 'Bank Mandiri', logo: '/mandiri.png' },
];

export default function DetailPembayaranComp() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const subtotal = products.reduce((acc, p) => acc + p.price, 0);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
      <h1 className="text-center text-xl font-semibold text-[#F79E0E] mb-8">
        Detail Pembayaran
      </h1>

      {/* Alamat */}
      <div className="bg-white rounded-md shadow-md p-4 max-w-5xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mx-4">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-8 flex-1">
            <div className="text-red-500 font-medium w-full sm:w-auto">
              Alamat Pengiriman
              <div className="text-black mt-1 text-sm font-medium">
                <p>Muhammad Sumbul</p>
                <p>1234567889</p>
              </div>
            </div>
            <div className="text-sm text-wrap my-auto">
              <p>Jalan Agus Salim No 32, Jebres, Surakarta, Jawa Tengah</p>
              <p className="text-xs text-red-500 mt-1">
                Pastikan alamat ini benar sebelum melanjutkan pembayaran.
              </p>
            </div>
          </div>

          <button
            className="text-[#F79E0E] text-sm font-semibold self-end md:self-start  my-auto"
            onClick={() => router.push('/user/alamat')}
          >
            Ubah
          </button>
        </div>
      </div>

      {/* Summary & Payment */}
      <div className="bg-white rounded-md shadow-md p-4 max-w-5xl mx-auto space-y-6">
        {/* Summary */}
        <div>
          <h2 className="font-semibold text-md mb-4">Summary</h2>
          {products.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-md p-2 mb-2"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <span className="text-md font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-medium">Rp{item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Metode Pengiriman */}
        <div>
          <h2 className="font-semibold text-md mb-1">Metode Pengiriman</h2>
          <p className="text-sm text-gray-600">Gratis</p>
        </div>

        {/* Rangkuman Harga */}
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="font-bold">Subtotal</span>
            <span >Rp{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak Perkiraan</span>
            <span>Rp{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between ">
            <span>Perkiraan Pengiriman & Penanganan</span>
            <span>Rp{subtotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div>
          <h2 className="font-semibold text-md mb-2">Metode Pembayaran</h2>
          <p className="text-sm mb-2 text-gray-600">Pilih Bank</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {banks.map(bank => (
              <label
                key={bank.name}
                className={`flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 `}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    width={40}
                    height={40}
                  />
                  <span className="text-sm">{bank.name}</span>
                </div>
                <input
                  type="radio"
                  name="bank"
                  className=""
                  checked={selectedBank === bank.name}
                  onChange={() => setSelectedBank(bank.name)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Total + Bayar */}
        <div className="text-right mt-4">
          <p className="font-bold text-md mb-4">
            Total: Rp{subtotal.toLocaleString()}
          </p>
          <button
            className="w-full md:w-48 bg-[#F79E0E] text-white py-2 rounded font-semibold hover:opacity-90 transition cursor-pointer"
            onClick={() => router.push('/konfirmasipembayaran')}
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  )
}
