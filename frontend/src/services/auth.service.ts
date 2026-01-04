// Authentication Service

import { BaseService } from './base.service';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  PasswordUpdateRequest,
  PasswordUpdateResponse,
} from '../dto';

export class AuthService extends BaseService {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse | null> {
    // Convert to form-data format as required by the API
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: data.username,
        password: data.password,
      }),
    });

    if (response.error) {
      throw new Error(response.error.detail || 'Login failed');
    }

    return response.data || null;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
    const response = await this.request<RefreshTokenResponse>('/api/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    return response.data || null;
  }

  /**
   * Check if JWT token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return true; // Consider invalid tokens as expired
    }
  }

  /**
   * Get token expiration time in seconds
   */
  getTokenExpirationTime(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp;
    } catch (error) {
      console.error('Failed to get token expiration time:', error);
      return null;
    }
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(token: string): number {
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) {
      return 0;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const secondsUntilExpiration = expirationTime - currentTime;
    return Math.max(0, secondsUntilExpiration * 1000); // Convert to milliseconds
  }

  /**
   * Store tokens in localStorage
   */
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Clear stored tokens
   */
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Auto-refresh token if needed
   */
  async ensureValidToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    // Check if access token is expired using JWT parsing
    if (!this.isTokenExpired(accessToken)) {
      return accessToken;
    }

    // Access token is expired, try to refresh
    try {
      const refreshResponse = await this.refreshToken(refreshToken);
      if (refreshResponse) {
        this.storeTokens(refreshResponse.access_token, refreshToken);
        return refreshResponse.access_token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    // If refresh fails, clear tokens
    this.clearTokens();
    return null;
  }

  /**
   * Update user password
   */
  async updatePassword(data: PasswordUpdateRequest, token: string): Promise<PasswordUpdateResponse | null> {
    const response = await this.request<PasswordUpdateResponse>('/api/auth/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.error) {
      throw new Error(response.error.detail || 'Failed to update password');
    }

    return response.data || null;
  }
}
