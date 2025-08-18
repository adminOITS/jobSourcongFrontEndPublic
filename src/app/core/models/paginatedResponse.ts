export interface PaginatedResponse<T> {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}
