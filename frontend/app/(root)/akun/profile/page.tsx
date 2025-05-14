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
    <div className="space-y-6">
      <ProfileHeader
        title="Profile Saya"
        description="Kelola informasi profil Anda untuk keamanan akun"
      />

      {error && (
        <div className="mb-6 p-4 bg-orange-50 text-orange-600 rounded-lg border border-orange-200 text-sm">
          {error}
        </div>
      )}

      <ProfileContent userData={userData} />
    </div>
  );
}
