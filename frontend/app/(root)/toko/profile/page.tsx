"use client";

import { useStoreProfile } from "./hooks/useStoreProfile";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { NoStoreCard } from "./components/NoStoreCard";
import { StoreInfoCard } from "./components/StoreInfoCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const {
    profile,
    loading,
    error,
    storeAddresses,
    loadingAddresses,
    addressError,
    isUpdating,
    updateStoreProfile,
    deleteStore,
    copyStoreLink,
  } = useStoreProfile();

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <ProfileHeader />

      {error && (
        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <ProfileSkeleton />
      ) : !profile ? (
        <NoStoreCard />
      ) : (
        <StoreInfoCard
          profile={profile}
          storeAddresses={storeAddresses}
          loadingAddresses={loadingAddresses}
          addressError={addressError}
          isUpdating={isUpdating}
          onUpdate={updateStoreProfile}
          onDelete={deleteStore}
          onCopyLink={copyStoreLink}
        />
      )}
    </div>
  );
}
