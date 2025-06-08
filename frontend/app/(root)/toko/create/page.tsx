"use client";

import { useStoreForm } from "./hooks/useStoreForm";
import { CreateStoreHeader } from "./components/CreateStoreHeader";
import { StoreFormCard } from "./components/StoreFormCard";

export default function CreateStorePage() {
  const { formData, formStates, updateFormData, submitForm, handleCancel } =
    useStoreForm();

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <CreateStoreHeader />

      <StoreFormCard
        formData={formData}
        formStates={formStates}
        onUpdateFormData={updateFormData}
        onSubmit={submitForm}
        onCancel={handleCancel}
      />
    </div>
  );
}
