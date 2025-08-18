import { BaseEntity, SearchQuery } from './base.entity';
import { OfferShortResponse } from './offer.models';
import { ProfileShortResponse } from './profile.models';

export interface ApplicationResponse extends BaseEntity {
  profile: ProfileShortResponse;
  status: ApplicationStatus;
  jobOffer: OfferShortResponse;
}

export type ApplicationStatus =
  | 'NEW'
  | 'SUBMITTED_TO_HR'
  | 'REJECTED_BY_HR'
  | 'CANCELLED_BY_HR'
  | 'INVALIDATED_BY_HR'
  | 'PUSHED_TO_VALIDATOR'
  | 'ACCEPTED_BY_VALIDATOR'
  | 'REJECTED_BY_VALIDATOR'
  | 'CANCELLED_BY_RECRUITER'
  | 'WITHDRAWN_BY_CANDIDATE';

export enum ApplicationStatusEnum {
  NEW = 'NEW',
  SUBMITTED_TO_HR = 'SUBMITTED_TO_HR',
  REJECTED_BY_HR = 'REJECTED_BY_HR',
  CANCELLED_BY_HR = 'CANCELLED_BY_HR',
  INVALIDATED_BY_HR = 'INVALIDATED_BY_HR',
  PUSHED_TO_VALIDATOR = 'PUSHED_TO_VALIDATOR',
  ACCEPTED_BY_VALIDATOR = 'ACCEPTED_BY_VALIDATOR',
  REJECTED_BY_VALIDATOR = 'REJECTED_BY_VALIDATOR',
  CANCELLED_BY_RECRUITER = 'CANCELLED_BY_RECRUITER',
  WITHDRAWN_BY_CANDIDATE = 'WITHDRAWN_BY_CANDIDATE',
}
export interface ApplicationSearchRequest extends SearchQuery {
  status?: ApplicationStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export interface TransitionCommentRequest {
  comment: string;
}

export interface ApplicationCommentAction {
  actionLabel: string;
  commentRequired: boolean;

  actionFunction: (status: TransitionCommentRequest) => void;
}

export interface ApplicationHistoryRecord extends BaseEntity {
  application?: ApplicationResponse;
  status: ApplicationStatus;
  comment: string;
}
