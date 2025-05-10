"use client";

import { useState } from "react";
import { OrderHeader } from "./components/OrderHeader";
import { OrderList } from "./components/OrderList";
import { OrderSkeleton } from "./components/OrderSkeleton";
import { useOrders } from "./hooks/useOrders";

export default function OrderPage() {
  const { orders, loading, error, refetchOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  if (loading) {
    return <OrderSkeleton />;
  }

  return (
    <div className="space-y-6">
      <OrderHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <OrderList
        orders={orders}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        refetchOrders={refetchOrders}
      />
    </div>
  );
}
