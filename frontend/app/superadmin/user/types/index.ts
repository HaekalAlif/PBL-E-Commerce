export interface User {
  id_user: number;
  name: string;
  email: string;
  username: string;
  role_name: "user" | "admin" | "superadmin";
  is_deleted: boolean;
  has_store: boolean; // Add this property to fix the error
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  name: string;
  email: string;
  username: string;
  password?: string; // Optional for updates
  role_name: "user" | "admin" | "superadmin";
}

// Role mapping - constants used throughout the application
export const ROLES = {
  0: "Super Admin",
  1: "Admin",
  2: "User",
};

export const ITEMS_PER_PAGE = 10;
