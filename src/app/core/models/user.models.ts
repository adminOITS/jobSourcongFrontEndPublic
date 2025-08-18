export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  password: string;
  passwordConfirmation: string;
  token: string;
}

export interface ResetPasswordRequest {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId?: string;
  staffId?: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
}

export enum UserRole {
  RECRUITER = 'RECRUITER',
  VALIDATOR = 'VALIDATOR',
  HR = 'HR',
  HR_ADMIN = 'HR_ADMIN',
}
