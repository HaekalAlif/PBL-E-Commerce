"use client";

import { Loader2 } from "lucide-react";
import { useCheckout } from "./hooks/useCheckout";
import { StoreCheckoutCard } from "./components/StoreCheckoutCard";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingAddressCard } from "./components/ShippingAddressCard";
import { ShippingMethodCard } from "./components/ShippingMethodCard";
import { StoreNotesCard } from "./components/StoreNotesCard";
import { StoreTotalCard } from "./components/StoreTotalCard";

export default function Checkout() {
  const {
    loading,
    processingCheckout,
    addresses,
    storeCheckouts,
    subtotal,
    totalShipping,
    adminFee,
    total,
    handleShippingChange,
    handleAddressChange,
    handleNotesChange,
    calculateShipping,
    handleCheckout,
    allStoresReadyForCheckout,
  } = useCheckout();

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading checkout details...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {storeCheckouts.map((store, storeIndex) => (
            <div key={store.id_toko} className="space-y-6">
              <StoreCheckoutCard store={store} />

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

              <StoreTotalCard store={store} />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <OrderSummary
            subtotal={subtotal}
            totalShipping={totalShipping}
            adminFee={adminFee}
            total={total}
            processingCheckout={processingCheckout}
            allStoresReadyForCheckout={allStoresReadyForCheckout}
            handleCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
