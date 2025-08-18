import {
  AttachmentRequest,
  AttachmentResponse,
  AttachmentUploadResponse,
  UploadRequest,
} from './attachment.models';
import { BaseEntity, SearchQuery } from './base.entity';
import { CandidateShortResponse, SkillResponse } from './candidate.models';

export interface ProfileResponse extends BaseEntity {
  profileTitle: string;
  category: string;
  resumeLink: string;
  skills: SkillResponse[];
  candidate?: CandidateShortResponse;
}

export interface ProfileShortResponse extends BaseEntity {
  id: string;
  profileTitle: string;
  category: string;
  candidate: CandidateShortResponse;
  resumeAttachment?: AttachmentResponse;
  resumeUploadResponse?: AttachmentUploadResponse;
}

export interface ProfileRequest {
  profileTitle: string;
  category: string;
  resumeUploadRequest?: UploadRequest;
  skillIds: string[];
}

export interface ProfileFilterRequest extends SearchQuery {
  startDate?: string;
  endDate?: string;
}
