"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckout } from "./hooks/useCheckout";
import { StoreCheckoutCard } from "./components/StoreCheckoutCard";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingAddressCard } from "./components/ShippingAddressCard";
import { ShippingMethodCard } from "./components/ShippingMethodCard";
import { StoreNotesCard } from "./components/StoreNotesCard";
import { OfferSavingsCard } from "./components/OfferSavingsCard";

const CheckoutSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50/40 to-white">
    {/* Background Pattern */}
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl" />
    </div>

    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          {/* Title Skeleton */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="h-10 w-48 rounded-full bg-gradient-to-r from-amber-200/70 to-amber-300/70" />
            <div className="h-4 w-64 rounded-full bg-amber-100/60" />
          </div>

          {/* Store Cards Skeleton */}
          {[1, 2].map((store) => (
            <div key={store} className="space-y-6">
              {/* Store Header */}
              <div className="bg-white rounded-xl shadow-md border border-amber-100/50 overflow-hidden">
                <div className="p-6 border-b border-amber-100/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-200/60 to-amber-300/60" />
                    <div className="space-y-2">
                      <div className="h-5 w-40 rounded-full bg-gradient-to-r from-amber-200/70 to-amber-300/70" />
                      <div className="h-4 w-24 rounded-full bg-amber-100/50" />
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="p-6 space-y-6">
                  {[1, 2].map((product) => (
                    <div key={product} className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-100/40 to-amber-200/40" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-3/4 rounded-full bg-gradient-to-r from-amber-100/60 to-amber-200/60" />
                        <div className="h-4 w-1/3 rounded-full bg-amber-100/40" />
                        <div className="h-5 w-1/4 rounded-full bg-gradient-to-r from-amber-200/60 to-amber-300/60" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Card Skeleton */}
              <div className="bg-white rounded-xl shadow-md border border-amber-100/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-200/60 to-amber-300/60" />
                    <div className="space-y-2">
                      <div className="h-5 w-40 rounded-full bg-gradient-to-r from-amber-200/70 to-amber-300/70" />
                      <div className="h-4 w-64 rounded-full bg-amber-100/50" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2].map((address) => (
                      <div
                        key={address}
                        className="p-4 rounded-xl border border-amber-100/50 bg-gradient-to-r from-amber-50/30 to-amber-100/30"
                      >
                        <div className="space-y-2">
                          <div className="h-4 w-1/3 rounded-full bg-gradient-to-r from-amber-100/60 to-amber-200/60" />
                          <div className="h-4 w-1/4 rounded-full bg-amber-100/40" />
                          <div className="h-4 w-2/3 rounded-full bg-amber-100/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-xl shadow-md border border-amber-100/50 p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-200/60 to-amber-300/60" />
              <div className="h-6 w-40 rounded-full bg-gradient-to-r from-amber-200/70 to-amber-300/70" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <div className="h-4 w-32 rounded-full bg-amber-100/50" />
                  <div className="h-4 w-24 rounded-full bg-gradient-to-r from-amber-100/60 to-amber-200/60" />
                </div>
              ))}

              <div className="h-px w-full bg-amber-100/30 my-4" />

              <div className="flex justify-between items-center">
                <div className="h-5 w-20 rounded-full bg-gradient-to-r from-amber-200/70 to-amber-300/70" />
                <div className="h-6 w-32 rounded-full bg-gradient-to-r from-amber-300/70 to-amber-400/70" />
              </div>

              <div className="pt-4">
                <div className="h-12 w-full rounded-lg bg-gradient-to-r from-amber-300/60 to-amber-400/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");
  const multiStore = searchParams?.get("multi_store") === "true";
  const fromOffer = searchParams?.get("from_offer") === "true";

  const {
    loading,
    processingCheckout,
    addresses,
    storeCheckouts,
    subtotal,
    totalShipping,
    adminFee,
    total,
    totalSavings,
    isFromOffer,
    handleShippingChange,
    handleAddressChange,
    handleNotesChange,
    calculateShipping,
    handleCheckout,
    allStoresReadyForCheckout,
  } = useCheckout(code ?? null, multiStore, fromOffer);

  if (loading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 to-white">
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#F79E0E] to-[#FFB648] bg-clip-text text-transparent">
            Checkout Pesanan
          </h1>
          <p className="text-gray-600 mt-2">
            Kode: {code}
            {fromOffer && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                📢 Dari Penawaran
              </span>
            )}
            {multiStore && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                🏪 Multi Toko
              </span>
            )}
          </p>
        </div>

        {/* Show offer savings banner if applicable */}
        {(isFromOffer || fromOffer) && totalSavings > 0 && (
          <div className="mb-8">
            <OfferSavingsCard totalSavings={totalSavings} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {storeCheckouts.map((store, storeIndex) => (
              <div key={store.id_toko} className="space-y-6">
                <StoreCheckoutCard store={store} fromOffer={fromOffer} />
                <ShippingAddressCard
                  store={store}
                  addresses={addresses}
                  storeIndex={storeIndex}
                  onAddressChange={handleAddressChange}
                  onCalculateShipping={() => calculateShipping(storeIndex)}
                />
                {store.shippingOptions.length > 0 && (
                  <ShippingMethodCard
                    store={store}
                    storeIndex={storeIndex}
                    onShippingChange={handleShippingChange}
                  />
                )}
                <StoreNotesCard
                  store={store}
                  storeIndex={storeIndex}
                  onNotesChange={handleNotesChange}
                />
              </div>
            ))}
          </div>

          {/* Order Summary - Right Side */}
          <div className="w-full lg:w-[380px]">
            <OrderSummary
              subtotal={subtotal}
              totalShipping={totalShipping}
              adminFee={adminFee}
              total={total}
              totalSavings={totalSavings}
              isFromOffer={isFromOffer || fromOffer}
              processingCheckout={processingCheckout}
              allStoresReadyForCheckout={allStoresReadyForCheckout}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
