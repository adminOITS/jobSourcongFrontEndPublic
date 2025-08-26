import { BaseEntity } from './base.entity';
import { JobCategory } from './category.models';
import { CandidateShortResponse } from './candidate.models';
import { AttachmentResponse } from './attachment.models';

export interface PreSignedUploadResponse {
  uploadUrl: string;
  downloadUrl: string;
  key: string;
}

export interface ProfileShortResponseDto extends BaseEntity {
  profileTitle: string;
  category: JobCategory;
  candidate: CandidateShortResponse;
  resumeLink?: string;
  resumeUploadResponse?: PreSignedUploadResponse;
  resumeAttachment?: AttachmentResponse;
  score?: number;
  matchingResultDetails?: MatchingResultResponseDto;
}

export interface MatchingResultResponseDto {
  createdAt: string;
  updatedAt: string;
  matchDetails: OpenAiMatchDetailsResponseDto;
}

export interface OpenAiMatchDetailsResponseDto {
  skills_match: MatchComponentDTO;
  location_match: MatchComponentDTO;
  language_match: MatchComponentDTO;
  education_match: MatchComponentDTO;
  profile_title_match: MatchComponentDTO;
  experience_match: MatchComponentDTO;
  growth_potential?: string;
  estimated_seniority?: string;
  reasoning?: string;
  recommended_training?: string[];
  red_flags?: Record<string, string>;
}

export interface MatchComponentDTO {
  matched: string[];
  missing: string[];
  score: number;
}

export interface OfferTopMatchFilterRequest {
  limit?: number;
  profileKey?: string;
  scoreKey?: string;
}

export interface PaginatedNoSqlResponse<T> {
  data: T[];
  hasNext: boolean;
  nextKey?: {
    profileId: string;
    score: number;
  };
  previousKey?: {
    profileId: string;
    score: number;
  };
  totalCount?: number;
  limit: number;
}

export enum MatchingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PublishStatus {
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  SCHEDULED = 'SCHEDULED',
}
