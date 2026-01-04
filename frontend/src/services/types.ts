// Base types and common interfaces

export interface BaseResponse {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorResponse {
  detail: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
}

// Common enums
export type AppStore = 'android' | 'iphone';
export type MarketStudyStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type KeywordGroup = 'top' | 'next' | 'too_difficult';

export interface Country {
  name: string;
  code: string;
  display: string;
}

export interface AppStoreInfo {
  name: string;
  code: string;
}
