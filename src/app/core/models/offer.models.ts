import { Currency } from '../types';
import { BaseEntity, SearchQuery } from './base.entity';
import { CompanyResponse, CompanyShortResponse } from './company.models';
import { SubCategoryShortResponse } from './category..model';
import { StaffResponse, StaffShortResponse } from './staff.models';

export interface OfferAdditionalInfoRequest {
  name: string;
  proficiency: Proficiency;
  requirementLevel: RequirementLevel;
  description: string;
}

export interface OfferAdditionalInfoResponse
  extends OfferAdditionalInfoRequest,
    BaseEntity {}

export interface OfferSkillRequest {
  skillName: string;
  proficiency: Proficiency;
  requirementLevel: RequirementLevel;
  description: string;
  skillType: SkillType;
}
export type Proficiency = 'EXPERT' | 'ADVANCED' | 'INTERMEDIATE' | 'BEGINNER';
export type SkillType = 'FUNCTIONAL_SKILL' | 'TECHNICAL_SKILL';

export interface OfferSkillResponse extends OfferSkillRequest, BaseEntity {}

export interface OfferLanguageRequest {
  language: string;
  proficiency: LanguageProficiency;
  requirementLevel: RequirementLevel;
  description: string;
}
export type LanguageProficiency =
  | 'NATIVE'
  | 'ADVANCED'
  | 'INTERMEDIATE'
  | 'BEGINNER';

export interface OfferLanguageResponse
  extends OfferLanguageRequest,
    BaseEntity {}

export interface workMode {}

export interface OfferExperienceRequest {
  title: string;
  companyName: string;
  description: string;
  yearsRequired: number;
  requirementLevel: RequirementLevel;
}

export interface OfferExperienceResponse
  extends OfferExperienceRequest,
    BaseEntity {}

export interface OfferEducationRequest {
  degree: string;
  field: string;
  institution: string;
  requirementLevel: RequirementLevel;
  description: string;
}
export type RequirementLevel = 'REQUIRED' | 'OPTIONAL' | 'PREFERRED';
export interface OfferEducationResponse
  extends OfferEducationRequest,
    BaseEntity {}

export interface OfferRequest {
  title: string;
  category: string;
  employmentType: EmploymentType;
  city: string;
  country: string;
  workMode: WorkMode;
  description: string;
  minRemuneration?: number;
  maxRemuneration?: number;
  currency: string;
  zipCode: string;
  skills: OfferSkillRequest[];
  notes: string;
  benefits: string;

  languages: OfferLanguageRequest[];
  educations: OfferEducationRequest[];
  experiences: OfferExperienceRequest[];
  additionalInfos: OfferAdditionalInfoRequest[];
  contractType?: ContractType;
}
export type ContractType =
  | 'CDI'
  | 'CDD'
  | 'INTERNSHIP'
  | 'FREELANCE_CONTRACT'
  | 'TEMPORARY_CONTRACT';

export interface OfferJobDetails {
  title: string;
  category: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  contractType: ContractType;
  city: string;
  country: string;
  zipCode: string;
  minRemuneration?: number;
  maxRemuneration?: number;
  currency: string;
}

export interface OfferDescription {
  description: string;
}

export interface OfferBenefits {
  benefits: string;
}

export interface OfferNotes {
  notes: string;
}

export interface OfferResponse extends BaseEntity {
  title: string;
  status: OfferStatus;
  employmentType: EmploymentType;
  workMode: WorkMode;
  contractType: ContractType;
  city: string;
  country: string;
  description: string;
  minRemuneration?: number;
  maxRemuneration?: number;
  zipCode: string;
  candidatesApplied?: number;
  completedInterviews?: number;
  skills: OfferSkillResponse[];
  languages: OfferLanguageResponse[];
  educations: OfferEducationResponse[];
  experiences: OfferExperienceResponse[];
  additionalInfo: OfferAdditionalInfoResponse[];
  company: CompanyResponse;
  currency: string;
  category: string;
  benefits: string;
  notes: string;
}

export interface OfferShortResponse extends BaseEntity {
  title: string;
  status: OfferStatus;
  employmentType: EmploymentType;
  contractType: ContractType;
  workMode: WorkMode;
  city: string;
  country: string;
  company?: CompanyShortResponse;
  category: string;
  applicationsCount?: number;
  interviewsCount?: number;
  validatorOfferAssignment?: StaffOfferAssignmentResponse;
  recruiterOfferAssignment?: StaffOfferAssignmentResponse;
}
export interface StaffOfferAssignmentResponse extends BaseEntity {
  staff: StaffShortResponse;
}

export type OfferStatus = 'OPEN' | 'HOLD' | 'CLOSE';
export type EmploymentType =
  | 'FULL_TIME'
  | 'FREELANCE'
  | 'PART_TIME'
  | 'INTERNSHIP'
  | 'TEMPORARY';

export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';

export interface JobOfferFilterRequest extends SearchQuery {
  status?: OfferStatus;
  contractType?: ContractType;
  workMode?: WorkMode;
  startDate?: string;
  endDate?: string;
  employmentType?: EmploymentType;
}
export interface RecentOffer extends OfferShortResponse {
  lastAccessed?: string;
}
