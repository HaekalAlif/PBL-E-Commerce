"use client";

import { useEditAddress } from "./hooks/useEditAddress";
import { EditAddressForm } from "./components/EditAddressForm";
import { AddressHeader } from "../../components/AddressHeader";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F79E0E]" />
      </div>
    );
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
