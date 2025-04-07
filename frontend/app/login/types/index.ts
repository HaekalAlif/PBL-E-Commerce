export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponseUser {
  role: number;
  role_name?: string;
}

export interface LoginResponse {
  user: LoginResponseUser;
}
