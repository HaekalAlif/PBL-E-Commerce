"use client";

import { AddressForm } from "./components/AddressForm";
import { AddressHeader } from "../components/AddressHeader";
import { useAddressForm } from "./hooks/useAddressForm";

export default function CreateAddressPage() {
  const {
    formData,
    loading,
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
  } = useAddressForm();

  return (
    <>
      <AddressHeader
        title="Tambah Alamat"
        description="Tambahkan alamat pengiriman baru"
      />

      <AddressForm
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
        success={null}
      />
    </>
  );
}
