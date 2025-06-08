"use client";

import { useRouter } from "next/navigation";
import { useEditAddressForm } from "./hooks/useEditAddressForm";
import { EditAddressHeader } from "./components/EditAddressHeader";
import { EditFormCard } from "./components/EditFormCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditAddressPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;

  const {
    formData,
    regionData,
    loading,
    error,
    success,
    updateFormData,
    submitForm,
  } = useEditAddressForm(id);

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <EditAddressHeader />

      {loading.data ? (
        <LoadingSkeleton />
      ) : (
        <EditFormCard
          formData={formData}
          regionData={regionData}
          loading={loading}
          error={error}
          success={success}
          onUpdateFormData={updateFormData}
          onSubmit={submitForm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
