// Common/Reference data DTOs

export interface Country {
  name: string;
  code: string;
  display: string;
}

export interface AppStoreInfo {
  name: string;
  code: string;
}

// Pagination DTOs
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}
