import { AttachmentResponse } from './attachment.models';
import { BaseEntity, SearchQuery } from './base.entity';
import { LanguageProficiency, Proficiency } from './offer.models';

export interface SkillModel {
  id: string;
  skillName: string;
  proficiency: string;
  isRequired: boolean;
}

export interface ExperienceModel {
  id: string;
  title: string;
  company: string;
  description: string;
  yearsRequired: number;
  isRequired: boolean;
}

export interface EducationModel {
  id: string;
  degree: string;
  field: string;
  institution: string;
}

export interface LanguageModel {
  id: string;
  languageName: string;
  proficiency: string;
}

// Skill Models
export interface SkillRequest {
  name: string;
  proficiencyLevel: Proficiency;
}

export interface SkillResponse extends BaseEntity {
  name: string;
  proficiencyLevel: Proficiency;
}

// Experience Models
export interface ExperienceRequest {
  jobTitle: string;
  company: string;
  description: string;
  startDate: string | null;
  endDate?: string | null; // Optional for current positions
  current: boolean;
  location: string;
}

export interface ExperienceResponse extends BaseEntity {
  jobTitle: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string; // Optional for current positions
  current: boolean;
  location: string;
}

// Education Models
export interface EducationRequest {
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate?: string | null; // Optional for ongoing education
  current: boolean;
  location: string;
}

export interface EducationResponse extends BaseEntity {
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location: string;
}

// Language Models
export interface LanguageRequest {
  language: string;
  proficiencyLevel: LanguageProficiency;
}

export interface LanguageResponse extends BaseEntity {
  id: string;
  language: string;
  proficiencyLevel: LanguageProficiency;
}

export interface AddressModel {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface CandidateRequest {
  firstName: string;
  lastName: string;
  phone: string;
  address: AddressModel;
  email: string;
  skills?: SkillRequest[];
  experiences?: ExperienceRequest[];
  education?: EducationRequest[];
  languages?: LanguageRequest[];
}

export interface CandidateResponse extends BaseEntity {
  firstName: string;
  lastName: string;
  phone: string;
  address: AddressModel;
  email: string;
  // status: string;
  skills: SkillResponse[];
  experiences: ExperienceResponse[];
  education: EducationResponse[];
  languages: LanguageResponse[];
  socialLinks: SocialLinksResponse;
  candidateCreationSource: CandidateCreationSource;
  candidateValidationStatus: CandidateValidationStatus;
  candidateAvailabilityStatus: CandidateAvailabilityStatus;
}

export interface SocialLinksResponse {
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  otherUrl: string;
}

export interface CandidateShortResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export type CandidateCreationSource =
  | 'MANUAL'
  | 'AI_GENERATED'
  | 'EXTERNAL_SYNC';

export type CandidateValidationStatus = 'INVALIDATED' | 'VERIFIED';

export enum CandidateValidationStatusEnum {
  INVALIDATED = 'INVALIDATED',
  VERIFIED = 'VERIFIED',
}
export enum CandidateAvailabilityStatusEnum {
  REACHABLE = 'REACHABLE',
  UNREACHABLE = 'UNREACHABLE',
}

export type CandidateAvailabilityStatus = 'REACHABLE' | 'UNREACHABLE';

export interface CandidateSearchRequest extends SearchQuery {
  validationStatus?: CandidateValidationStatus;
  availabilityStatus?: CandidateAvailabilityStatus;
  creationSource?: CandidateCreationSource;
  startDate?: string;
  endDate?: string;
}

export interface CandidateAIProcessingHistoryResponseDto extends BaseEntity {
  status: ProcessingStatus;
  candidate?: CandidateShortResponse;
  resumeAttachment: AttachmentResponse;
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface CandidateAiProcessingStatisticsResponse {
  totalProcessed: number | null;
  inProgress: number | null;
  failed: number | null;
  successful: number | null;
}

export interface AiCandidateProcessingHistoryFilter extends SearchQuery {
  status?: ProcessingStatus;
  startDate?: string;
  endDate?: string;
}

export interface CandidateAiProcessingStatisticsResponse {
  totalProcessed: number | null;
  inProgress: number | null;
  failed: number | null;
  successful: number | null;
}
