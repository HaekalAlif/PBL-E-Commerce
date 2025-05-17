"use client";

import { useEffect } from "react";
import { useOrders } from "./hooks/useOrders";
import { OrderStatsCards } from "./components/OrderStats";
import { OrderTable } from "./components/OrderTable";
import { OrderHeader } from "./components/OrderHeader";

export default function OrdersPage() {
  const { orders, loading, error, orderStats, refreshOrders } = useOrders();

  // Initial data fetch
  useEffect(() => {
    refreshOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 space-y-6">
      <OrderHeader />
      <OrderStatsCards stats={orderStats} loading={loading} />
      <OrderTable
        orders={orders}
        loading={loading}
        error={error}
        orderStats={orderStats}
        onRefresh={refreshOrders}
      />
    </div>
  );
}
