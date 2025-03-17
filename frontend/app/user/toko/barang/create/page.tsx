"use client";

import React from "react";
import BarangForm from "../components/BarangForm";
import useBarangForm from "../hooks/useBarangForm";

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tambah Barang</h1>

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
