export interface AttachmentResponse {
  attachmentType: AttachmentType;
  url: string;
  contentType: ContentType;
}
export interface UploadRequest {
  contentType: ContentType;
  attachmentType?: AttachmentType;
}

export enum AttachmentType {
  LOGO = 'LOGO',
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
  CERTIFICATE = 'CERTIFICATE',
  OTHER = 'OTHER',
}
export interface AttachmentRequest {
  fileName: string;
  contentType: ContentType;
  size: string;
  key: string;
  entityType?: EntityType;
  entityId?: string;
}

export enum EntityType {
  COMPANY = 'COMPANY',
  CANDIDATE = 'CANDIDATE',
}
export enum ContentType {
  JPEG = 'JPEG',
  JPG = 'JPG',
  PNG = 'PNG',
  PDF = 'PDF',
  DOC = 'DOC',
  DOCX = 'DOCX',
  XLS = 'XLS',
  XLSX = 'XLSX',
  PPT = 'PPT',
  PPTX = 'PPTX',
  OTHER = 'OTHER',
}
export interface AttachmentUploadResponse {
  key: string;
  url: string;
  expiredAt: string;
}
