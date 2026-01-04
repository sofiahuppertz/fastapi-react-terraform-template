// Project DTOs

import { BaseResponse } from '../services/types';

export interface ProjectCreateRequest {
  name: string;
  global_context?: string;
  description?: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  global_context?: string;
  description?: string;
}

export interface ProjectResponse extends BaseResponse {
  name: string;
  global_context?: string;
  description: string | null;
  market_studies: any[]; // Will be populated with market studies
}

export interface ProjectDeleteResponse {
  message: string;
}
