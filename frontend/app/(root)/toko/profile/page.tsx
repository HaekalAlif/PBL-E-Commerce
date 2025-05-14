"use client";

import { StoreContent } from "./components/StoreContent";
import { StoreSkeleton } from "./components/StoreSkeleton";
import { useStoreProfile } from "./hooks/useStoreProfile";

export default function StoreProfilePage() {
  const { profile, loading, error } = useStoreProfile();

  if (loading) {
    return <StoreSkeleton />;
  }

  return <StoreContent profile={profile} error={error} />;
}
