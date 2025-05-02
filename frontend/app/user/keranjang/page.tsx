"use client";

import { useCart } from "./hooks/useCart";
import { CartLoading } from "./components/CartLoading";
import { EmptyCart } from "./components/EmptyCart";
import { StoreGroupCard } from "./components/StoreGroupCard";
import { OrderSummary } from "./components/OrderSummary";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  className="mr-3"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  Select All Items
                </label>
              </div>
            </CardHeader>
          </Card>

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
  );
}
