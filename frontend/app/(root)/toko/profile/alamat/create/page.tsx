"use client";

import { useRouter } from "next/navigation";
import { useAddressForm } from "./hooks/useAddressForm";
import { CreateAddressHeader } from "./components/CreateAddressHeader";
import { AddressFormCard } from "./components/AddressFormCard";

export default function CreateAddressPage() {
  const router = useRouter();
  const {
    formData,
    regionData,
    loading,
    error,
    success,
    updateFormData,
    submitForm,
  } = useAddressForm();

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <CreateAddressHeader />

      <AddressFormCard
        formData={formData}
        regionData={regionData}
        loading={loading}
        error={error}
        success={success}
        onUpdateFormData={updateFormData}
        onSubmit={submitForm}
        onCancel={handleCancel}
      />
    </div>
  );
}
