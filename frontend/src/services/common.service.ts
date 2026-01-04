// Common Service for reference data

import { BaseService } from './base.service';
import { Country, AppStoreInfo } from '../dto';

export class CommonService extends BaseService {
  /**
   * Get all available countries
   */
  async getCountries(): Promise<Country[]> {
    const response = await this.request<Country[]>('/api/common/countries', {
      method: 'GET',
    });

    return response.data || [];
  }

  /**
   * Get all available app stores
   */
  async getAppStores(): Promise<AppStoreInfo[]> {
    const response = await this.request<AppStoreInfo[]>('/api/common/app-stores', {
      method: 'GET',
    });

    return response.data || [];
  }
}
