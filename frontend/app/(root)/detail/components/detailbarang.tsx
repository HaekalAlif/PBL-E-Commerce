"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const DetailProduk = () => {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('L')

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'inc') setQuantity(q => q + 1)
    else if (type === 'dec' && quantity > 1) setQuantity(q => q - 1)
  }
  const router = useRouter() 

  return (
    <div className=" bg-[#FFF8F3] py-8 px-6 flex flex-col items-center">
      <h1 className="text-orange-500 font-semibold text-xl mb-6">
        Detail Produk
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-square">
          <Image
            src="/baju.png" 
            alt="Baju Bekas"
            layout="fill"
            objectFit="contain"
            className="rounded-xl"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-orange-500">Baju Bekas</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1 text-yellow-400 text-sm">★★★★★</div>
            <span className="text-gray-500 text-sm">4.5/5</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-black">Rp.20.000</span>
            <span className="line-through text-gray-400 text-sm">Rp.24.000</span>
            <span className="ml-auto text-sm bg-pink-100 text-pink-600 rounded-full px-2 py-0.5">
              -20%
            </span>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Baju bekas Berkualitas
          </p>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">
              Size yang tersedia
            </p>
            <div className="flex gap-2 mt-2">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  className={`px-3 py-1 rounded border ${
                    selectedSize === size
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedSize(size as any)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => handleQuantity('dec')}
              className="w-8 h-8 border rounded text-lg font-semibold"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => handleQuantity('inc')}
              className="w-8 h-8 border rounded text-lg font-semibold"
            >
              +
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              className="border border-orange-400 text-orange-500 rounded px-4 py-2 hover:bg-orange-400 hover:text-white transition duration-200"
              onClick={() => router.push('/keranjang')}
            >
              Checkout Barang
            </button>

            <button
              className="border border-orange-400 text-orange-500 rounded px-4 py-2 hover:bg-orange-400 hover:text-white transition duration-200"
              onClick={() => router.push('/tawar-harga')}
            >
              Tawar Harga
            </button>

            <button
              className="border border-orange-400 text-orange-500 rounded px-4 py-2 hover:bg-orange-400 hover:text-white transition duration-200"
              onClick={() => router.push('/keranjang')}
            >
              Masukan Ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailProduk
