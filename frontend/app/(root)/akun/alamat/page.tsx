"use client";

import { AddressCard } from "./components/AddressCard";
import { AddressEmpty } from "./components/AddressEmpty";
import { AddressSkeleton } from "./components/AddressSkeleton";
import { AddressHeader } from "./components/AddressHeader";
import { useAddresses } from "./hooks/useAddresses";

export default function AddressPage() {
  const {
    addresses,
    loading,
    error,
    isDeleting,
    isSettingPrimary,
    handleSetPrimaryAddress,
    handleDeleteAddress,
  } = useAddresses();

  if (loading) {
    return <AddressSkeleton />;
  }

  return (
    <>
      <AddressHeader
        title="Daftar Alamat"
        description="Kelola alamat pengiriman untuk kemudahan berbelanja"
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <AddressEmpty />
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id_alamat}
              address={address}
              onSetPrimary={handleSetPrimaryAddress}
              onDelete={handleDeleteAddress}
              isSettingPrimary={isSettingPrimary}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </>
  );
}
