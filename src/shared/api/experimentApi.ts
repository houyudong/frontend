import { apiClient } from './apiClient';

// 实验模板类型（对应数据库experiment_templates表）
export interface ExperimentTemplate {
  id: string;
  name: string;
  project_name: string;
  category: string;
  difficulty: number;
  duration: number;
  description: string;
  learning_objectives?: string[];
  theory?: string;
  key_functions?: string[];
  verification_points?: string[];
  test_cases?: string[];
  hints?: string[];
  challenges?: string[];
  resources?: string[];
  assessment?: any;
  chip_model: string;
  template_path: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 用户实验记录类型（对应数据库user_experiments表）
export interface UserExperiment {
  id: string;
  user_id: string;
  template_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  progress: number;
  workspace_path: string;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
  // 关联的模板信息
  template?: ExperimentTemplate;
}

// 开始实验请求类型
export interface StartExperimentRequest {
  template_id: string;
}

// 更新实验进度请求类型
export interface UpdateExperimentRequest {
  progress?: number;
  status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

// 开始实验响应类型
export interface StartExperimentResponse {
  id: string;
  user_id: string;
  template_id: string;
  status: string;
  progress: number;
  workspace_path: string;
  started_at: string;
  created_at: string;
  updated_at: string;
}

// API响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 实验API类
export class ExperimentApi {
  // 获取所有实验模板
  static async getExperimentTemplates(): Promise<ExperimentTemplate[]> {
    const response = await apiClient.get<ApiResponse<ExperimentTemplate[]>>('/api/experiments');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch experiment templates');
  }

  // 获取用户实验记录
  static async getUserExperiments(userId: string): Promise<UserExperiment[]> {
    const response = await apiClient.get<ApiResponse<UserExperiment[]>>(`/api/users/${userId}/experiments`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch user experiments');
  }

  // 开始新实验
  static async startExperiment(userId: string, templateId: string): Promise<StartExperimentResponse> {
    const response = await apiClient.post<ApiResponse<StartExperimentResponse>>(
      `/api/users/${userId}/experiments`,
      { template_id: templateId }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to start experiment');
  }

  // 获取特定实验详情
  static async getExperimentDetail(userId: string, experimentId: string): Promise<UserExperiment> {
    const response = await apiClient.get<ApiResponse<UserExperiment>>(
      `/api/users/${userId}/experiments/${experimentId}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch experiment detail');
  }

  // 更新实验进度
  static async updateExperiment(
    userId: string,
    experimentId: string,
    updateData: UpdateExperimentRequest
  ): Promise<UserExperiment> {
    const response = await apiClient.put<ApiResponse<UserExperiment>>(
      `/api/users/${userId}/experiments/${experimentId}`,
      updateData
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update experiment');
  }

  // 删除用户实验
  static async deleteExperiment(userId: string, experimentId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/users/${userId}/experiments/${experimentId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete experiment');
    }
  }
}

// 导出默认实例
export const experimentApi = ExperimentApi;
