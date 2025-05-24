import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyCart() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-white">
      <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-6">
            Keranjang Belanja
          </h1>
          <Card className="border-amber-100/50 shadow-xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0  opacity-5" />
              <div className="relative p-12 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6 shadow-inner">
                  <ShoppingCart className="h-12 w-12 text-amber-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Keranjang Kamu Kosong
                </h2>
                <p className="text-gray-600 mb-8 max-w-sm">
                  Yuk mulai belanja dan tambahkan produk ke keranjangmu
                </p>
                <Button
                  onClick={() => router.push("/user/katalog")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Mulai Belanja
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
