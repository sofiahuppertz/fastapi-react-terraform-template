// Market Study DTOs

import { BaseResponse, AppStore, MarketStudyStatus, KeywordGroup } from '../services/types';

export enum PipelineStep {
  /**
   * Enum for market study pipeline steps.
   * 
   * Pipeline Flow:
   *     FETCH_APP_METADATA → FETCH_KEYWORDS → CLASSIFY_KEYWORDS → STOP
   *     GENERATE_METADATA (independent, runs separately)
   */
  FETCH_APP_METADATA = "fetch_app_metadata",
  FETCH_KEYWORDS = "fetch_keywords",
  CLASSIFY_KEYWORDS = "classify_keywords",
  GENERATE_METADATA = "generate_metadata"
}

export interface MarketStudyCreateRequest {
  country: string;
  app_store: AppStore;
  app_id: string;
  project_id: string;
  app_context?: string;
}

export interface MarketStudyUpdateRequest {
  country?: string;
  app_name?: string;
  app_store?: AppStore;
  app_id?: string;
  app_context?: string;
}

export interface MarketStudyResponse extends BaseResponse {
  country: string;
  app_store: AppStore;
  app_id: string;
  app_name: string;
  status: MarketStudyStatus;
  error_message: string | null;
  failed_step: PipelineStep | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  hidden_keywords: string | null;
  short_description: string | null;
  long_description: string | null;
  app_context: string | null;
  keyword_classification_reasoning: string | null;
  app_metadata_reasoning: string | null;
  project_id: string;
  keywords: KeywordResponse[];
}

export interface MarketStudyDeleteResponse {
  message: string;
}

export interface MarketStudyRunResponse {
  message: string;
  market_study_id: string;
  status: MarketStudyStatus;
}

export interface FetchKeywordsResponse {
  message: string;
  market_study_id: string;
  status: MarketStudyStatus;
}

export interface GenerateMetadataResponse {
  message: string;
  market_study_id: string;
  status: MarketStudyStatus;
}

// Keyword DTOs
export interface KeywordResponse extends BaseResponse {
  market_study_id: string;
  keyword: string;
  generic: boolean;
  volume: number;
  difficulty: number;
  kei: number;
  group: KeywordGroup | null;
  reason: string | null;
}

export interface KeywordUpdateRequest {
  generic?: boolean;
  group?: KeywordGroup | null;
  reason?: string;
}

// App Metadata DTOs
export interface AppMetadataResponse extends BaseResponse {
  app_id: string;
  app_store: AppStore;
  app_type: 'main' | 'competitor';
  market_study_id?: string;
  main_app_id?: string;
  title: string;
  icon: string | null;
  size: number | null;
  rating: number | null;
  price: number | null;
  release_date: string | null;
  short_description: string | null;
  long_description: string | null;
  subtitle: string | null;
  promotional_text: string | null;
  screenshots: Record<string, any> | null;
  genres: Record<string, any> | null;
  developer: Record<string, any> | null;
  feature_graphic: string | null;
  similar_apps: Record<string, any> | null;
  permissions: Record<string, any> | null;
}

export interface AppMetadatasResponse {
  main_app: AppMetadataResponse | null;
  competitors: AppMetadataResponse[];
}

