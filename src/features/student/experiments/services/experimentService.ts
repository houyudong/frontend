/**
 * 实验服务层
 * 
 * 参考STMIde的服务层架构
 * 处理实验相关的业务逻辑和API调用
 */

import {
  ExperimentTemplate,
  UserExperiment,
  EXPERIMENT_URL_TO_ID
} from '../types/experimentTypes';
import { experimentConfig, API_ENDPOINTS } from '../config';

/**
 * 实验服务类
 */
export class ExperimentService {
  private baseUrl: string;
  private cache: Map<string, any> = new Map();
  private cacheTimestamps: Map<string, number> = new Map();

  constructor() {
    this.baseUrl = experimentConfig.apiBaseUrl;
  }

  /**
   * 通用HTTP请求方法
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Bypass-Auth': 'true',
        'Authorization': 'Bearer dev-token',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  /**
   * 缓存管理
   */
  private isCacheValid(key: string): boolean {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;
    
    return Date.now() - timestamp < experimentConfig.cacheTimeout;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  private getCache(key: string): any {
    if (this.isCacheValid(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  /**
   * 获取所有实验模板
   */
  async getExperimentTemplates(): Promise<ExperimentTemplate[]> {
    const cacheKey = 'experiment_templates';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const templates = await this.request<ExperimentTemplate[]>(API_ENDPOINTS.TEMPLATES);
      this.setCache(cacheKey, templates);
      return templates;
    } catch (error) {
      console.error('获取实验模板失败:', error);
      // 返回模拟数据作为后备
      return this.getMockTemplates();
    }
  }

  /**
   * 根据ID获取实验模板
   */
  async getExperimentTemplate(id: string): Promise<ExperimentTemplate | null> {
    try {
      return await this.request<ExperimentTemplate>(API_ENDPOINTS.TEMPLATE_BY_ID(id));
    } catch (error) {
      console.error('获取实验模板失败:', error);
      return this.getMockTemplate(id);
    }
  }

  /**
   * 根据URL名称获取实验模板
   */
  async getExperimentTemplateByUrl(urlName: string): Promise<ExperimentTemplate | null> {
    const experimentId = EXPERIMENT_URL_TO_ID[urlName];
    if (!experimentId) return null;
    
    return this.getExperimentTemplate(experimentId);
  }

  /**
   * 获取用户实验列表
   */
  async getUserExperiments(userId: string): Promise<UserExperiment[]> {
    const cacheKey = `user_experiments_${userId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const experiments = await this.request<UserExperiment[]>(API_ENDPOINTS.USER_EXPERIMENTS(userId));
      this.setCache(cacheKey, experiments);
      return experiments;
    } catch (error) {
      console.error('获取用户实验失败:', error);
      return [];
    }
  }

  /**
   * 开始实验
   */
  async startExperiment(userId: string, templateId: string): Promise<any> {
    try {
      const result = await this.request(API_ENDPOINTS.START_EXPERIMENT(userId), {
        method: 'POST',
        body: JSON.stringify({ template_id: templateId })
      });
      
      // 清除相关缓存
      this.cache.delete(`user_experiments_${userId}`);
      
      return result;
    } catch (error) {
      console.error('开始实验失败:', error);
      throw error;
    }
  }

  /**
   * 删除实验
   */
  async deleteExperiment(userId: string, experimentId: number): Promise<void> {
    try {
      await this.request(API_ENDPOINTS.DELETE_EXPERIMENT(userId, experimentId), {
        method: 'DELETE'
      });
      
      // 清除相关缓存
      this.cache.delete(`user_experiments_${userId}`);
    } catch (error) {
      console.error('删除实验失败:', error);
      throw error;
    }
  }

  /**
   * 更新实验进度
   */
  async updateExperimentProgress(userId: string, experimentId: string, progress: number): Promise<void> {
    try {
      await this.request(`/users/${userId}/experiments/${experimentId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ progress })
      });
      
      // 清除相关缓存
      this.cache.delete(`user_experiments_${userId}`);
    } catch (error) {
      console.error('更新实验进度失败:', error);
      throw error;
    }
  }

  /**
   * 完成实验
   */
  async completeExperiment(userId: string, experimentId: string, score?: number): Promise<void> {
    try {
      await this.request(`/users/${userId}/experiments/${experimentId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ score })
      });
      
      // 清除相关缓存
      this.cache.delete(`user_experiments_${userId}`);
    } catch (error) {
      console.error('完成实验失败:', error);
      throw error;
    }
  }

  /**
   * 模拟数据 - 实验模板
   */
  private getMockTemplates(): ExperimentTemplate[] {
    return [
      {
        id: '2',
        name: 'LED基础控制',
        description: '学习STM32 GPIO控制LED的基本方法',
        category: 'basic',
        difficulty: 1,
        duration: 45,
        chip_model: 'STM32F103',
        is_active: true
      },
      {
        id: '3',
        name: 'LED闪烁控制',
        description: '实现LED的周期性闪烁效果',
        category: 'basic',
        difficulty: 1,
        duration: 50,
        chip_model: 'STM32F103',
        is_active: true
      }
      // 可以添加更多模拟数据
    ];
  }

  /**
   * 模拟数据 - 单个实验模板
   */
  private getMockTemplate(id: string): ExperimentTemplate | null {
    const templates = this.getMockTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * 清除特定缓存
   */
  clearCacheByKey(key: string): void {
    this.cache.delete(key);
    this.cacheTimestamps.delete(key);
  }
}

// 导出单例实例
export const experimentService = new ExperimentService();
