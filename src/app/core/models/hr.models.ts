import { BaseEntity } from './base.entity';

export interface H_R_Request {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  email: string;
}

export interface H_R_Response extends BaseEntity {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  email: string;
  isEnabled: boolean;
  role: 'HR';
}
