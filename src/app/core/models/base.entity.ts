export interface BaseEntity {
  id: string;
  createdAt?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface SearchQuery {
  keyword?: string;
  size?: number;
  page?: number;
}
