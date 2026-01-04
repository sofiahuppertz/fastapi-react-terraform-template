// Project Service

import { BaseService } from './base.service';
import {
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectResponse,
  ProjectDeleteResponse,
  PaginatedResponse,
  PaginationParams,
} from '../dto';

export class ProjectService extends BaseService {
  /**
   * Create a new project
   */
  async createProject(
    data: ProjectCreateRequest,
    accessToken: string
  ): Promise<ProjectResponse | null> {
    const response = await this.requestWithAuth<ProjectResponse>(
      '/api/projects/',
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return response.data || null;
  }

  /**
   * Get all projects for the authenticated user (paginated)
   */
  async getAllProjects(
    accessToken: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ProjectResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.page_size) {
      queryParams.append('page_size', params.page_size.toString());
    }

    const url = `/api/projects/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await this.requestWithAuth<PaginatedResponse<ProjectResponse>>(
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
   * Update an existing project
   */
  async updateProject(
    projectId: string,
    data: ProjectUpdateRequest,
    accessToken: string
  ): Promise<ProjectResponse | null> {
    const response = await this.requestWithAuth<ProjectResponse>(
      `/api/projects/${projectId}`,
      accessToken,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    return response.data || null;
  }

  /**
   * Delete a project
   */
  async deleteProject(
    projectId: string,
    accessToken: string
  ): Promise<ProjectDeleteResponse | null> {
    const response = await this.requestWithAuth<ProjectDeleteResponse>(
      `/api/projects/${projectId}`,
      accessToken,
      {
        method: 'DELETE',
      }
    );

    return response.data || null;
  }
}
