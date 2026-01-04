// Admin Service - Only for superuser operations

import { BaseService } from './base.service';
import { UserResponse, UserCreate } from '../dto';

export class AdminService extends BaseService {
  /**
   * Create a new user (superuser only)
   */
  async createUser(
    userData: UserCreate,
    token: string
  ): Promise<UserResponse | null> {
    const response = await this.requestWithAuth<UserResponse>(
      '/api/auth/admin/users',
      token,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    if (response.error) {
      throw new Error(response.error.detail || 'Failed to create user');
    }

    return response.data || null;
  }

  /**
   * Get all users (superuser only)
   */
  async getUsers(token: string): Promise<UserResponse[]> {
    const response = await this.requestWithAuth<UserResponse[]>(
      '/api/auth/admin/users',
      token,
      {
        method: 'GET',
      }
    );

    if (response.error) {
      throw new Error(response.error.detail || 'Failed to get users');
    }

    return response.data || [];
  }

  /**
   * Delete a user (superuser only)
   */
  async deleteUser(
    userId: string,
    token: string
  ): Promise<UserResponse | null> {
    const response = await this.requestWithAuth<UserResponse>(
      `/api/auth/admin/users/${userId}`,
      token,
      {
        method: 'DELETE',
      }
    );

    if (response.error) {
      throw new Error(response.error.detail || 'Failed to delete user');
    }

    return response.data || null;
  }
}

