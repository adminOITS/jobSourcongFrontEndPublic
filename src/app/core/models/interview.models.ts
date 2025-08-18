import { ApplicationResponse } from './application.models';
import { BaseEntity, SearchQuery } from './base.entity';

export type CandidateStatus = 'activeSearch' | 'openToOpportunities';
export type ProgressLevel = 'low' | 'advanced' | 'veryAdvanced';
export type AvailabilityStatus = 'immediatelyAvailable' | 'withNotice';

export interface RecruitmentProcess {
  hasOther: boolean | string;
  progressLevel?: ProgressLevel;
}

export interface Mobility {
  mobile: boolean;
  mobilityZone?: string;
}

export interface CompensationDetails {
  grossTotal: number;
  fixedPortion: number;
  benefits: number;
}

export interface Compensation {
  currency: string;

  current: CompensationDetails;
  desired: CompensationDetails;
}

export interface NoticeDetails {
  duration: string;
  isNegotiable: boolean;
  availabilityDate: Date;
}

export interface Availability {
  status: AvailabilityStatus;
  noticeDetails?: NoticeDetails;
}

export interface EssentialPoints {
  matchingClientCriteria: string;
  additionalStrengths: string;
}

export interface Experience {
  relevantSkills: string;
}

export interface InterviewDataResponse extends BaseEntity {
  application?: ApplicationResponse;
  currentlyEmployed: boolean;
  motivationForChange: string;
  candidateStatus: CandidateStatus;
  otherRecruitmentProcesses: RecruitmentProcess;
  mobility: Mobility;
  compensation: Compensation;
  availability: Availability;
  videoInterviewDate: Date;
  essentialPoints: EssentialPoints;
  experience: Experience;
  personality: {
    softSkills: string;
  };
  motivationsAndExpectations: string;
  trainingPlans: string;
  references: string;
}
export interface InterviewDataRequest {
  currentlyEmployed: boolean;
  motivationForChange: string;
  candidateStatus: CandidateStatus;

  otherRecruitmentProcesses: RecruitmentProcess;
  mobility: Mobility;
  compensation: Compensation;
  availability: Availability;
  videoInterviewDate: Date;
  essentialPoints: EssentialPoints;
  experience: Experience;
  personality: {
    softSkills: string;
  };
  motivationsAndExpectations: string;
  trainingPlans: string;
  references: string;
}

export type InterviewType = 'TECHNICAL' | 'HR';
export type InterviewStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'NO_SHOW';
export enum InterviewStatusEnum {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
}
export interface InterviewRequest {
  // interviewerId: string;
  //applicationId: string;
  scheduledDateTime: Date;
  interviewDuration: number;
  meetingLink: string;
  type: InterviewType;
}
export interface InterviewResponse extends BaseEntity {
  interviewer: InterviewerDto;
  application?: ApplicationResponse;
  scheduledDateTime: Date;
  interviewDuration: number;
  meetingLink: string;
  type: InterviewType;
  status: InterviewStatus;
}

export interface InterviewerDto {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UpdateInterviewStatusRequest {
  status: InterviewStatus;
}

export interface InterviewSearchRequest extends SearchQuery {
  type?: InterviewType;
  status?: InterviewStatus;
  scheduledDateTimeFrom?: Date;
  scheduledDateTimeTo?: Date;
  createdAtFrom?: string;
  createdAtTo?: string;
}
