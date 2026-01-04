// Base service class with common functionality

import { ApiResponse, ErrorResponse } from './types';

export class BaseService {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    // Use environment variable or fallback to provided baseUrl or default
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data as ErrorResponse,
        };
      }

      return {
        data: data as T,
      };
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  protected getAuthHeaders(token: string): HeadersInit {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  protected async requestWithAuth<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...this.getAuthHeaders(token),
        ...options.headers,
      },
    });
  }
}
