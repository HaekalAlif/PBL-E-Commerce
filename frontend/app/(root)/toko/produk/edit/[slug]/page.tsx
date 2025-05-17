"use client";

import React from "react";
import BarangForm from "./components/BarangForm";
import { BarangFormHeader } from "./components/BarangFormHeader";
import useBarangForm from "./hooks/useBarangForm";

export default function EditBarangPage({
  params,
}: {
  params: { slug: string };
}) {
  const {
    formData,
    imageFiles,
    kategoriList,
    isSubmitting,
    isLoading,
    errors,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleRemoveImage,
    setPrimaryImage,
    handleSubmit,
  } = useBarangForm(params.slug);

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <BarangFormHeader
          productName={formData.nama_barang}
          isLoading={isLoading}
        />

        <div className="max-w-4xl mx-auto">
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
            isEdit={true}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
