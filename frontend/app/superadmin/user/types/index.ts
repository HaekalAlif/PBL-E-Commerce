export interface User {
  id_user: number;
  username: string;
  name: string;
  email: string;
  no_hp: string | null;
  tanggal_lahir: string | null;
  foto_profil: string | null;
  role: number;
  is_verified: boolean;
  is_active: boolean;
  is_deleted: boolean;
  role_name?: string;
}

export interface UserFormData {
  username: string;
  name: string;
  email: string;
  password?: string;
  no_hp?: string;
  tanggal_lahir?: string;
  role: number;
  is_verified: boolean;
  is_active: boolean;
}

// Role mapping - constants used throughout the application
export const ROLES = {
  0: "Super Admin",
  1: "Admin",
  2: "User",
};

export const ITEMS_PER_PAGE = 10;
