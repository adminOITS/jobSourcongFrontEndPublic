import { BaseEntity } from './base.entity';

export interface ValidatorRequest {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  email: string;
}

export interface ValidatorResponse extends BaseEntity {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  email: string;
  isEnabled: boolean;
  staffRole: 'VALIDATOR';
}
