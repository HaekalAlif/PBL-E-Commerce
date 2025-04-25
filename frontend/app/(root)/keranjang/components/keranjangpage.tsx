'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  image: string;
};

const initialCart: (Product & { quantity: number })[] = [
  {
    id: 1,
    name: 'Baju di toko',
    size: 'XL',
    color: 'White',
    price: 20000,
    image: '/baju.png',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Baju di toko',
    size: 'L',
    color: 'White',
    price: 20000,
    image: '/baju.png',
    quantity: 1,
  },
];

export default function KeranjangPage() {
  const router = useRouter() 
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.2;
  const shipping = 8800;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
      <h1 className="text-center text-2xl font-semibold text-[#F79E0E] mb-10">
        Keranjang
      </h1>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 my">
        {/* Cart Items */}
        <div className="md:col-span-2 bg-white rounded-md shadow p-4">
          {cart.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Ukuran: {product.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Color: {product.color}
                  </p>
                  <p className="text-md font-bold mt-1">
                    Rp{product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="bg-gray-200 px-2 rounded"
                  onClick={() => updateQuantity(product.id, -1)}
                >
                  −
                </button>
                <span className="min-w-[24px] text-center">
                  {product.quantity}
                </span>
                <button
                  className="bg-gray-200 px-2 rounded"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-md shadow p-6">
          <h3 className="text-sm font-semibold text-[#F79E0E] mb-4">
            Ringkasan Pesanan
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                Rp{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Diskon (-20%)</span>
              <span>−Rp{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pengiriman</span>
              <span>Rp{shipping.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold mt-4 border-t pt-4">
            <span>Total</span>
            <span>Rp{total.toLocaleString()}</span>
          </div>

          <div className="flex gap-2 mt-4 md:flex-col lg:flex-row">
            <input
              type="text"
              placeholder="Tambahkan kode promo"
              className="flex-1 p-2 border rounded text-sm"
            />
            <button className="bg-[#F79E0E] text-white px-4 py-2 rounded text-sm md:w-full lg:w-auto">
              Terapkan
            </button>
          </div>

          <button
            className="w-full mt-4 bg-[#F79E0E] text-white py-2 rounded font-semibold hover:opacity-90 transition cursor-pointer"
            onClick={() => router.push('/detailpayment')}
          >
            Detail Pembayaran
          </button>
        </div>
      </div>
    </div>
  )
}
