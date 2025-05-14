import { LucideIcon } from "lucide-react";

export interface UserData {
  id_user?: number;
  username: string;
  name?: string;
  email: string;
  no_hp?: string;
  foto_profil?: string;
  is_verified?: boolean;
  role_name?: string;
}

export interface ProfileHeaderProps {
  title: string;
  description: string;
}

export interface InfoFieldProps {
  label: string;
  value: string | undefined;
  icon: LucideIcon;
  verified?: boolean;
}

export interface ProfileContentProps {
  userData: UserData;
  onEditClick: () => void;
}
