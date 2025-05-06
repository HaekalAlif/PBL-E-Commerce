"use client";

import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileContent } from "./components/ProfileContent";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { useProfile } from "./hooks/useProfile";

export default function ProfilePage() {
  const { userData, loading, error } = useProfile();

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <ProfileHeader
        title="Profile Saya"
        description="Kelola informasi profil Anda untuk keamanan akun"
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <ProfileContent userData={userData} />
    </>
  );
}
