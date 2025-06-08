"use client";

import { useStoreAddresses } from "./hooks/useStoreAddresses";
import { AddressHeader } from "./components/AddressHeader";
import { AddressSkeleton } from "./components/AddressSkeleton";
import { EmptyAddressCard } from "./components/EmptyAddressCard";
import { AddressList } from "./components/AddressList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function StoreAddressesPage() {
  const {
    addresses,
    loading,
    error,
    actionLoading,
    deleteAddress,
    setAsPrimary,
  } = useStoreAddresses();

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <AddressHeader />

      {error && (
        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <AddressSkeleton />
      ) : addresses.length === 0 ? (
        <EmptyAddressCard />
      ) : (
        <AddressList
          addresses={addresses}
          actionLoading={actionLoading}
          onSetAsPrimary={setAsPrimary}
          onDelete={deleteAddress}
        />
      )}
    </div>
  );
}
