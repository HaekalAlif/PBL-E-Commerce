"use client";

import { EditAddressForm } from "./components/EditAddressForm";
import { AddressHeader } from "../../components/AddressHeader";
import { EditAddressSkeleton } from "./components/EditAddressSkeleton";
import { useEditAddress } from "./hooks/useEditAddress";

export default function EditAddressPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    formData,
    loading,
    loadingData,
    error,
    provinces,
    regencies,
    districts,
    loadingProvinces,
    loadingRegencies,
    loadingDistricts,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit,
    handleCancel,
  } = useEditAddress(params.id);

  if (loadingData) {
    return <EditAddressSkeleton />;
  }

  return (
    <>
      <AddressHeader
        title="Edit Alamat"
        description="Perbarui informasi alamat pengiriman Anda"
      />

      <EditAddressForm
        formData={formData}
        loading={loading}
        error={error}
        provinces={provinces}
        regencies={regencies}
        districts={districts}
        loadingProvinces={loadingProvinces}
        loadingRegencies={loadingRegencies}
        loadingDistricts={loadingDistricts}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleSubmit}
        onCancel={handleCancel}
        loadingData={false}
      />
    </>
  );
}
