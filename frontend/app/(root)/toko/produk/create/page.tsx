"use client";

import React from "react";
import BarangForm from "./components/BarangForm";
import { BarangFormHeader } from "./components/BarangFormHeader";
import useBarangForm from "./hooks/useBarangForm";

export default function CreateBarangPage() {
  const {
    formData,
    imageFiles,
    kategoriList,
    isSubmitting,
    errors,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleRemoveImage,
    setPrimaryImage,
    handleSubmit,
  } = useBarangForm();

  return (
    <div className="max-w-4xl mx-auto">
      <BarangFormHeader />

      <BarangForm
        formData={formData}
        imageFiles={imageFiles}
        kategoriList={kategoriList}
        isSubmitting={isSubmitting}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage}
        setPrimaryImage={setPrimaryImage}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
