"use client";

import { useCart } from "./hooks/useCart";
import { CartLoading } from "./components/CartLoading";
import { EmptyCart } from "./components/EmptyCart";
import { StoreGroupCard } from "./components/StoreGroupCard";
import { OrderSummary } from "./components/OrderSummary";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    cartItems,
    storeGroups,
    loading,
    processingCheckout,
    allSelected,
    subTotal,
    total,
    isProductAvailable,
    handleSelectItem,
    handleSelectStoreItems,
    handleSelectAll,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout,
    handleMakeOffer,
    getAvailableSelectedCount,
  } = useCart();

  if (loading) return <CartLoading />;
  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-white py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-10 pb-4">
          Keranjang Belanja
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Select All Card */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  className="text-amber-400 border-amber-200 data-[state=checked]:bg-amber-400"
                />
                <label
                  htmlFor="select-all"
                  className="text-amber-500 font-medium"
                >
                  Pilih Semua Barang
                </label>
              </div>
            </div>

            {/* Store Groups */}
            {storeGroups.map((store) => (
              <StoreGroupCard
                key={store.id_toko}
                store={store}
                onSelectStore={handleSelectStoreItems}
                onSelectItem={handleSelectItem}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                isProductAvailable={isProductAvailable}
              />
            ))}
          </div>

          {/* Order Summary - Now static */}
          <div className="lg:col-span-4">
            <OrderSummary
              subTotal={subTotal}
              total={total}
              itemCount={getAvailableSelectedCount()}
              processingCheckout={processingCheckout}
              onCheckout={handleCheckout}
              onMakeOffer={handleMakeOffer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
