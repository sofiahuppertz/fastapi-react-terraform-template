// Services index - Export all services and types

import { AuthService } from './auth.service';
import { AdminService } from './admin.service';
import { CommonService } from './common.service';
import { ProjectService } from './project.service';
import { MarketStudyService } from './market-study.service';

export { BaseService } from './base.service';
export { AuthService } from './auth.service';
export { AdminService } from './admin.service';
export { CommonService } from './common.service';
export { ProjectService } from './project.service';
export { MarketStudyService } from './market-study.service';

// Export types
export * from './types';

// Export DTOs
export * from '../dto';

// Service instances (singletons)
export const authService = new AuthService();
export const adminService = new AdminService();
export const commonService = new CommonService();
export const projectService = new ProjectService();
export const marketStudyService = new MarketStudyService();
