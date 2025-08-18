import { BaseEntity } from './base.entity';

export interface StaffRequest {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  email: string;
}

export interface StaffShortResponse extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
}

export interface StaffResponse extends BaseEntity {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  email: string;
  role: StaffRole;
  isEnabled: boolean;
  appUser?: AppUser;
}
export interface AppUser {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  firstName: string;
  lastName: string;
  companyId: string;
}

export interface OfferStaffResponse {
  staff: StaffShortResponse;
  selected: boolean;
}

export type StaffRole = 'RECRUITER' | 'VALIDATOR' | 'HR_ADMIN';
