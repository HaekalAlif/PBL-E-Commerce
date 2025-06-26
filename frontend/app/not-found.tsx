"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-orange-300 animate-bounce delay-300" />
        <Sparkles className="absolute top-40 right-32 w-4 h-4 text-amber-400 animate-bounce delay-700" />
        <Sparkles className="absolute bottom-32 left-1/4 w-5 h-5 text-orange-400 animate-bounce delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Modern 404 Design */}
        <div className="relative mb-12">
          {/* Large 404 with gradient */}
          <div className="text-[8rem] md:text-[12rem] lg:text-[14rem] font-black bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent select-none leading-none">
            404
          </div>

          {/* Floating shopping bag with glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-xl scale-150 animate-pulse"></div>
              <ShoppingBag className="relative w-20 h-20 md:w-28 md:h-28 text-orange-500 animate-float" />
            </div>
          </div>
        </div>

        {/* Content with modern typography */}
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              Oops! <span className="text-orange-500">Halaman</span> Hilang
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto">
              Sepertinya halaman yang Anda cari sedang liburan.
              <br className="hidden md:block" />
              Mari jelajahi koleksi produk amazing kami!
            </p>
          </div>

          {/* Modern Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 min-w-[200px]"
            >
              <Home className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Kembali ke Beranda</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              href="/katalog"
              className="group relative inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-orange-600 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 min-w-[200px]"
            >
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Jelajahi Produk</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Additional Info */}
          <div className="pt-8">
            <p className="text-sm text-slate-500">
              Error Code: 404 • Page Not Found
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
