import {
  AttachmentResponse,
  AttachmentUploadResponse,
  UploadRequest,
} from './attachment.models';
import { BaseEntity, SearchQuery } from './base.entity';
import { AddressModel } from './candidate.models';
import { H_R_Request } from './hr.models';

export interface CompanyRequest {
  name: string;
  address: AddressModel;
  contact: string;
  email: string;
  webSiteLink: string;
  sector: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  companySize: CompanySize;
  foundedYear: number;
  staffHr?: H_R_Request;
  logoUploadRequest?: UploadRequest;
}

export interface CompanyResponse extends BaseEntity {
  name: string;
  description?: string;
  websiteLink?: string;
  address: AddressModel;
  contact?: string;
  email?: string;
  sector?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoAttachment?: AttachmentResponse;
  logoUploadResponse?: AttachmentUploadResponse;
  companySize?: CompanySize;
  foundedYear?: number;
  status?: CompanyStatus;
}

export type CompanyStatus = 'PENDING' | 'VALIDATED' | 'BLOCKED';
export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5001-10000'
  | '10000+';
export interface CompanyShortResponse {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface CompanySearchRequest extends SearchQuery {
  status?: CompanyStatus;
}
