import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, TrendingDown, Package, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { StoreCheckout } from "../types";

interface StoreCheckoutCardProps {
  store: StoreCheckout;
  fromOffer?: boolean;
}

export function StoreCheckoutCard({
  store,
  fromOffer = false,
}: StoreCheckoutCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder-product.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${imagePath}`;
  };

  const getTotalSavings = () => {
    return store.products.reduce(
      (total, product) => total + (product.savings || 0),
      0
    );
  };

  // Get store name - now with proper data from API
  const getStoreName = () => {
    // With the updated API response, we should have proper store name
    if (
      store.nama_toko &&
      store.nama_toko !== "Unknown Shop" &&
      store.nama_toko !== `Store ${store.id_toko}`
    ) {
      return store.nama_toko;
    }

    // Try to get from the first product's toko info as fallback
    const firstProduct = store.products[0];
    if (
      firstProduct?.toko?.nama_toko &&
      firstProduct.toko.nama_toko !== "Unknown Shop"
    ) {
      return firstProduct.toko.nama_toko;
    }

    // Final fallback
    return `Store ${store.id_toko}`;
  };

  const storeName = getStoreName();

  return (
    <Card className="border-amber-100/60 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="border-b border-amber-100/50 relative overflow-hidden">
        <CardTitle className="flex items-start justify-between relative z-10">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-xl shadow-md ring-2 ring-white/50">
              <Store className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-2 leading-tight">
                  {storeName}
                </h3>

                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-700 font-medium px-3 py-1 border border-green-200/60 rounded-full"
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
                    Verified Store
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/60 px-2.5 py-1 rounded-full border border-amber-100/60">
                    <Package className="h-3.5 w-3.5 text-[#F79E0E]" />
                    <span className="font-medium">
                      {store.products.length}{" "}
                      {store.products.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Savings indicator */}
          {fromOffer && getTotalSavings() > 0 && (
            <div className="text-right bg-white/90 p-3 rounded-xl border border-green-200/60 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mb-1">
                <TrendingDown className="h-3 w-3" />
                <span>Total Savings</span>
              </div>
              <div className="text-green-700 font-bold text-md">
                {formatCurrency(getTotalSavings())}
              </div>
            </div>
          )}
        </CardTitle>
        {/* Store contact info with improved layout */}
        <div>
          {store.alamat_toko && (
            <div className="flex items-start gap-2 text-sm text-gray-600 bg-white/70 rounded-lg border border-amber-100/40 mb-3">
              <MapPin className="h-5 w-5 text-[#F79E0E]" />
              <span className="line-clamp-2 leading-relaxed">
                {store.alamat_toko}
              </span>
            </div>
          )}

          {store.kontak && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70  rounded-lg border border-amber-100/40 py-1">
              <Phone className="h-5 w-5 text-[#F79E0E]" />
              <span className="font-medium">{store.kontak}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Product list with enhanced styling */}
        <div className="divide-y divide-amber-100/40">
          {store.products.map((product, idx) => (
            <div
              key={`${product.id_barang}-${idx}`}
              className="group/item p-2 hover:bg-amber-50/30 transition-all duration-200"
            >
              <div className="flex gap-5 items-start">
                {/* Product image with enhanced styling */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/60 shadow-sm group-hover/item:shadow-md transition-all duration-300">
                  <Image
                    src={getImageUrl(product.gambar_barang?.[0]?.url_gambar)}
                    alt={product.nama_barang}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay for better interaction feedback */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product details with improved typography */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover/item:text-[#F79E0E] transition-colors duration-200 text-base">
                    {product.nama_barang}
                  </h4>

                  {/* Product badges */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.is_from_offer && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 border border-green-200/60 rounded-full"
                      >
                        💰 Special Offer
                      </Badge>
                    )}
                  </div>

                  {/* Pricing section with enhanced layout */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                      {/* Original price (if from offer) */}
                      {product.is_from_offer && product.original_price && (
                        <div className="text-xs text-gray-500 line-through font-medium">
                          {formatCurrency(product.original_price)}
                        </div>
                      )}

                      {/* Current price and quantity */}
                      <div className="text-sm text-gray-700 font-medium">
                        <span className="text-[#F79E0E] font-semibold">
                          {formatCurrency(product.harga)}
                        </span>
                        <span className="text-gray-500 mx-2">×</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">
                          {product.jumlah}
                        </span>
                      </div>

                      {/* Savings indicator */}
                      {product.is_from_offer &&
                        product.savings &&
                        product.savings > 0 && (
                          <div className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-200/60">
                            <TrendingDown className="h-3 w-3" />
                            Save {formatCurrency(product.savings)}
                          </div>
                        )}
                    </div>

                    {/* Subtotal with enhanced styling */}
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-medium mb-1">
                        Subtotal
                      </div>
                      <div className="text-lg font-bold text-[#F79E0E]">
                        {formatCurrency(product.subtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Store summary with enhanced design */}
        <div className="border-t border-amber-100/50 p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#F79E0E] rounded-full" />
                <span className="text-sm font-semibold text-gray-700">
                  Store Subtotal ({store.products.length}{" "}
                  {store.products.length === 1 ? "item" : "items"})
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(store.subtotal)}
              </span>
            </div>

            {getTotalSavings() > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-amber-200/40">
                <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  Total Store Savings
                </span>
                <span className="text-sm font-bold text-green-600">
                  -{formatCurrency(getTotalSavings())}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
