// Authentication DTOs

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  is_superuser: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Admin DTOs

export interface UserResponse {
  id: string;
  email: string;
  is_superuser: boolean;
  last_connected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  is_superuser?: boolean;
}

export interface PasswordUpdateRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordUpdateResponse {
  message: string;
  success: boolean;
}
