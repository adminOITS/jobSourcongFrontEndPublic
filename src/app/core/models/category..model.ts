import { BaseEntity } from './base.entity';

export interface CategoryResponse extends BaseEntity {
  name: string;
}

export interface CategoryRequest {
  name: string;
}

export interface CategoryShortResponse {
  id: string;
  name: string;
}

export interface SubCategoryResponse extends BaseEntity {
  name: string;
  category: CategoryResponse;
}

export interface SubCategoryRequest {
  name: string;
}

export interface SubCategoryShortResponse {
  id: string;
  name: string;
}
