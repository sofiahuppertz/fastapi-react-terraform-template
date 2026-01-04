// Market Study Service

import { BaseService } from './base.service';
import type { MarketStudyStatus } from './types';
import {
  MarketStudyCreateRequest,
  MarketStudyUpdateRequest,
  MarketStudyResponse,
  MarketStudyDeleteResponse,
  KeywordResponse,
  KeywordUpdateRequest,
  AppMetadatasResponse,
  PaginatedResponse,
  PaginationParams,
  PipelineStep,
} from '../dto';

export interface PollOptions {
  intervalMs?: number;
  timeoutMs?: number;
  maxRetries?: number;
  onProgress?: (status: MarketStudyStatus, marketStudy: MarketStudyResponse) => void;
}

export type TokenGetter = () => Promise<string | null> | string | null;

export class MarketStudyService extends BaseService {
  /**
   * Create a new market study
   */
  async createMarketStudy(
    data: MarketStudyCreateRequest,
    accessToken: string
  ): Promise<MarketStudyResponse> {
    const response = await this.requestWithAuth<MarketStudyResponse>(
      '/api/market-studies/',
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (response.error) {
      throw new Error(response.error.detail || 'Failed to create market study');
    }

    if (!response.data) {
      throw new Error('No data returned from server');
    }

    return response.data;
  }

  /**
   * Get a single market study by ID
   */
  async  getMarketStudy(
    marketStudyId: string,
    accessToken: string
  ): Promise<MarketStudyResponse | null> {
    const response = await this.requestWithAuth<MarketStudyResponse>(
      `/api/market-studies/${marketStudyId}`,
      accessToken,
      {
        method: 'GET',
      }
    );

    return response.data || null;
  }

  /**
   * Get all market studies for a specific project (paginated)
   */
  async getProjectMarketStudies(
    projectId: string,
    accessToken: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<MarketStudyResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const url = `/api/market-studies/project/${projectId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await this.requestWithAuth<PaginatedResponse<MarketStudyResponse>>(
      url,
      accessToken,
      {
        method: 'GET',
      }
    );

    return response.data || {
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    };
  }

  /**
   * Update a market study
   */
  async updateMarketStudy(
    marketStudyId: string,
    data: MarketStudyUpdateRequest,
    accessToken: string
  ): Promise<MarketStudyResponse | null> {
    const response = await this.requestWithAuth<MarketStudyResponse>(
      `/api/market-studies/${marketStudyId}`,
      accessToken,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    return response.data || null;
  }

  /**
   * Delete a market study
   */
  async deleteMarketStudy(
    marketStudyId: string,
    accessToken: string
  ): Promise<MarketStudyDeleteResponse | null> {
    const response = await this.requestWithAuth<MarketStudyDeleteResponse>(
      `/api/market-studies/${marketStudyId}`,
      accessToken,
      {
        method: 'DELETE',
      }
    );

    return response.data || null;
  }

  /**
   * Run a background task for a specific market study
   */
  async runBackgroundTask(
    marketStudyId: string,
    step: PipelineStep,
    accessToken: string
  ): Promise<{ message: string; market_study_id: string; step: string; status: string } | null> {
    const response = await this.requestWithAuth<{ message: string; market_study_id: string; step: string; status: string }>(
      `/api/market-studies/${marketStudyId}/run-background-task/${step}`,
      accessToken,
      {
        method: 'POST',
      }
    );

    return response.data || null;
  }

  /**
   * Fetch and classify keywords (background task)
   */
  async fetchAndClassifyKeywords(
    marketStudyId: string,
    accessToken: string
  ): Promise<{ message: string; market_study_id: string; step: string; status: string } | null> {
    return this.runBackgroundTask(marketStudyId, PipelineStep.FETCH_APP_METADATA, accessToken);
  }

  /**
   * Get all keywords for a specific market study
   */
  async getKeywords(
    marketStudyId: string,
    accessToken: string
  ): Promise<KeywordResponse[]> {
    const response = await this.requestWithAuth<KeywordResponse[]>(
      `/api/market-studies/${marketStudyId}/keywords`,
      accessToken,
      {
        method: 'GET',
      }
    );

    return response.data || [];
  }

  /**
   * Update a keyword
   */
  async updateKeyword(
    keywordId: string,
    data: KeywordUpdateRequest,
    accessToken: string
  ): Promise<KeywordResponse | null> {
    const response = await this.requestWithAuth<KeywordResponse>(
      `/api/market-studies/keywords/${keywordId}`,
      accessToken,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    return response.data || null;
  }

  /**
   * Generate app metadata (background task)
   */
  async generateAppMetadata(
    marketStudyId: string,
    accessToken: string
  ): Promise<{ message: string; market_study_id: string; step: string; status: string } | null> {
    return this.runBackgroundTask(marketStudyId, PipelineStep.GENERATE_METADATA, accessToken);
  }

  /**
   * Get app metadatas (main app and competitors)
   */
  async getAppMetadatas(
    marketStudyId: string,
    accessToken: string
  ): Promise<AppMetadatasResponse | null> {
    const response = await this.requestWithAuth<AppMetadatasResponse>(
      `/api/market-studies/${marketStudyId}/app-metadatas`,
      accessToken,
      {
        method: 'GET',
      }
    );

    return response.data || null;
  }

  /**
   * Poll market study status until completed or failed
   * @param marketStudyId - The market study ID to poll
   * @param getAccessToken - Function that returns a fresh/valid access token
   * @param options - Polling options (interval, timeout, progress callback)
   * @returns Promise that resolves when status is 'completed' or 'failed'
   * @throws Error if timeout is reached or max retries exceeded
   */
  async pollUntilCompleted(
    marketStudyId: string,
    getAccessToken: TokenGetter,
    options: PollOptions = {}
  ): Promise<MarketStudyResponse> {
    const {
      intervalMs = 30000, // Default: 30 seconds
      timeoutMs = 1800000, // Default: 30 minutes
      maxRetries = 5, // Default: 5 consecutive retries for transient errors
      onProgress,
    } = options;

    const startTime = Date.now();
    let consecutiveErrors = 0;

    const poll = async (): Promise<MarketStudyResponse> => {
      // Check for timeout
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('Market study polling timeout exceeded');
      }

      try {
        // Get fresh token on each poll iteration
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error('Authentication failed - unable to get valid token');
        }

        // Fetch current status
        const marketStudy = await this.getMarketStudy(marketStudyId, accessToken);

        if (!marketStudy) {
          // Treat null response as a transient error, not a definitive "not found"
          // The backend might be temporarily unavailable (Cloud Run cold start, etc.)
          consecutiveErrors++;
          console.warn(`[Polling] Failed to fetch market study (attempt ${consecutiveErrors}/${maxRetries})`);

          if (consecutiveErrors >= maxRetries) {
            throw new Error('Market study not found after multiple retries');
          }

          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, intervalMs));
          return poll();
        }

        // Reset error counter on successful fetch
        consecutiveErrors = 0;

        // Call progress callback if provided
        if (onProgress) {
          onProgress(marketStudy.status, marketStudy);
        }

        // Check if completed or failed
        if (marketStudy.status === 'completed' || marketStudy.status === 'failed') {
          return marketStudy;
        }

        // Still in progress, wait and poll again
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        return poll();
      } catch (error: any) {
        // Handle transient network errors gracefully
        consecutiveErrors++;
        console.warn(`[Polling] Error fetching market study (attempt ${consecutiveErrors}/${maxRetries}):`, error.message);

        if (consecutiveErrors >= maxRetries) {
          throw error;
        }

        // Wait and retry on transient errors
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        return poll();
      }
    };

    return poll();
  }

  /**
   * Poll and fetch keywords (convenience method)
   * Starts keyword fetching and waits until completed
   */
  async fetchAndWaitForKeywords(
    marketStudyId: string,
    getAccessToken: TokenGetter,
    options: PollOptions = {}
  ): Promise<{ marketStudy: MarketStudyResponse; keywords: KeywordResponse[] }> {
    // Get initial token
    const initialToken = await getAccessToken();
    if (!initialToken) {
      throw new Error('Authentication failed - unable to get valid token');
    }

    // Start keyword fetching
    await this.fetchAndClassifyKeywords(marketStudyId, initialToken);

    // Poll until completed (uses fresh token on each iteration)
    const marketStudy = await this.pollUntilCompleted(
      marketStudyId,
      getAccessToken,
      options
    );

    // Fetch keywords with fresh token
    const finalToken = await getAccessToken();
    if (!finalToken) {
      throw new Error('Authentication failed - unable to get valid token');
    }
    const keywords = await this.getKeywords(marketStudyId, finalToken);

    return { marketStudy, keywords };
  }

  /**
   * Generate metadata and wait for completion (convenience method)
   */
  async generateAndWaitForMetadata(
    marketStudyId: string,
    getAccessToken: TokenGetter,
    options: PollOptions = {}
  ): Promise<MarketStudyResponse> {
    // Get initial token
    const initialToken = await getAccessToken();
    if (!initialToken) {
      throw new Error('Authentication failed - unable to get valid token');
    }

    // Start metadata generation
    await this.generateAppMetadata(marketStudyId, initialToken);

    // Poll until completed (uses fresh token on each iteration)
    return this.pollUntilCompleted(marketStudyId, getAccessToken, options);
  }
}
