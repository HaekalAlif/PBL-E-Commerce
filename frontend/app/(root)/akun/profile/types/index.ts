export interface UserData {
  id_user?: number;
  username?: string;
  name?: string;
  email?: string;
  no_hp?: string;
  foto_profil?: string | null;
  tanggal_lahir?: string | null;
  role?: number;
  role_name?: string;
  is_verified?: boolean;
  is_active?: boolean;
}

export interface InfoFieldProps {
  label: string;
  value?: string | null;
  icon: React.FC<{ className?: string }>;
  verified?: boolean;
}
