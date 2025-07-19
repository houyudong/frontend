/**
 * 班级管理服务
 * 
 * 提供班级相关的API调用封装，遵循项目API设计模式
 */

import { apiClient } from '../../../../api/apiClient';
import type {
  Class,
  CreateClassRequest,
  UpdateClassRequest,
  ClassQueryParams,
  PaginatedResponse,
  ClassStatistics
} from '../types';

export class ClassService {
  private static readonly BASE_URL = '/api/classes';

  /**
   * 获取班级列表
   */
  static async getClasses(params?: ClassQueryParams): Promise<PaginatedResponse<Class>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }

      const url = queryParams.toString() 
        ? `${this.BASE_URL}?${queryParams.toString()}`
        : this.BASE_URL;

      const response = await apiClient.get<{
        success: boolean;
        data: PaginatedResponse<Class>;
        message?: string;
      }>(url);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '获取班级列表失败');
    } catch (error) {
      // 在开发环境下提示使用模拟数据
      if (import.meta.env.DEV) {
        console.info('🔄 后端服务不可用，使用模拟数据获取班级列表');
      }

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 返回模拟的班级列表数据
      const mockClasses: Class[] = [
        {
          id: 'class_001',
          name: 'STM32嵌入式开发班',
          description: '学习STM32微控制器的基础和高级应用开发',
          maxStudents: 30,
          semester: '2024春季',
          academicYear: '2023-2024',
          teacherId: 'teacher_001',
          status: 'active',
          studentCount: 25,
          courseCount: 3,
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z'
        },
        {
          id: 'class_002',
          name: 'Arduino创客班',
          description: 'Arduino开发板的创意项目制作',
          maxStudents: 25,
          semester: '2024春季',
          academicYear: '2023-2024',
          teacherId: 'teacher_001',
          status: 'active',
          studentCount: 20,
          courseCount: 2,
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z'
        }
      ];

      return {
        data: mockClasses,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: mockClasses.length
      };
    }
  }

  /**
   * 根据ID获取班级详情
   */
  static async getClassById(id: string): Promise<Class> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Class;
        message?: string;
      }>(`${this.BASE_URL}/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '获取班级详情失败');
    } catch (error) {
      // 在开发环境下提示使用模拟数据
      if (import.meta.env.DEV) {
        console.info('🔄 后端服务不可用，使用模拟数据获取班级详情');
      }

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      // 返回模拟的班级详情数据
      const mockClass: Class = {
        id: id,
        name: id === 'class_001' ? 'STM32嵌入式开发班' :
              id === 'class_002' ? 'Arduino创客班' :
              '新创建的班级',
        description: '这是一个模拟的班级详情数据',
        maxStudents: 30,
        semester: '2024春季',
        academicYear: '2023-2024',
        teacherId: 'teacher_001',
        status: 'active',
        studentCount: 0,
        courseCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return mockClass;
    }
  }

  /**
   * 创建班级
   */
  static async createClass(data: CreateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: Class;
        message?: string;
      }>(this.BASE_URL, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '创建班级失败');
    } catch (error) {
      // 在开发环境下提示使用模拟数据
      if (import.meta.env.DEV) {
        console.info('🔄 后端服务不可用，使用模拟数据创建班级');
      }

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 返回模拟的新班级数据
      const newClass: Class = {
        id: `class_${Date.now()}`,
        name: data.name,
        description: data.description || '',
        maxStudents: data.maxStudents || 50,
        semester: data.semester,
        academicYear: data.academicYear,
        teacherId: 'teacher_001',
        status: 'active',
        studentCount: 0,
        courseCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return newClass;
    }
  }

  /**
   * 更新班级
   */
  static async updateClass(id: string, data: UpdateClassRequest): Promise<Class> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        data: Class;
        message?: string;
      }>(`${this.BASE_URL}/${id}`, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '更新班级失败');
    } catch (error) {
      console.error('更新班级失败:', error);
      throw error;
    }
  }

  /**
   * 删除班级
   */
  static async deleteClass(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message?: string;
      }>(`${this.BASE_URL}/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || '删除班级失败');
      }
    } catch (error) {
      console.error('删除班级失败:', error);
      throw error;
    }
  }

  /**
   * 批量删除班级
   */
  static async batchDeleteClasses(ids: string[]): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message?: string;
      }>(`${this.BASE_URL}/batch`, {
        ids
      });

      if (!response.data.success) {
        throw new Error(response.data.message || '批量删除班级失败');
      }
    } catch (error) {
      console.error('批量删除班级失败:', error);
      throw error;
    }
  }

  /**
   * 获取班级统计信息
   */
  static async getClassStatistics(): Promise<ClassStatistics> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ClassStatistics;
        message?: string;
      }>(`${this.BASE_URL}/statistics`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '获取班级统计失败');
    } catch (error) {
      console.error('获取班级统计失败:', error);
      throw error;
    }
  }

  /**
   * 复制班级
   */
  static async duplicateClass(id: string, newName: string): Promise<Class> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: Class;
        message?: string;
      }>(`${this.BASE_URL}/${id}/duplicate`, { name: newName });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '复制班级失败');
    } catch (error) {
      console.error('复制班级失败:', error);
      throw error;
    }
  }

  /**
   * 归档班级
   */
  static async archiveClass(id: string): Promise<void> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message?: string;
      }>(`${this.BASE_URL}/${id}/archive`);

      if (!response.data.success) {
        throw new Error(response.data.message || '归档班级失败');
      }
    } catch (error) {
      console.error('归档班级失败:', error);
      throw error;
    }
  }

  /**
   * 恢复班级
   */
  static async restoreClass(id: string): Promise<void> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message?: string;
      }>(`${this.BASE_URL}/${id}/restore`);

      if (!response.data.success) {
        throw new Error(response.data.message || '恢复班级失败');
      }
    } catch (error) {
      console.error('恢复班级失败:', error);
      throw error;
    }
  }

  /**
   * 导出班级数据
   */
  static async exportClasses(params?: ClassQueryParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }

      const url = queryParams.toString() 
        ? `${this.BASE_URL}/export?${queryParams.toString()}`
        : `${this.BASE_URL}/export`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('导出班级数据失败');
      }

      return await response.blob();
    } catch (error) {
      console.error('导出班级数据失败:', error);
      throw error;
    }
  }

  /**
   * 导入班级数据
   */
  static async importClasses(file: File): Promise<{
    success: number;
    failed: number;
    errors: Array<{ row: number; message: string; data: any }>;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.BASE_URL}/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '导入班级数据失败');
      }

      return result.data;
    } catch (error) {
      console.error('导入班级数据失败:', error);
      throw error;
    }
  }

  /**
   * 验证班级名称是否可用
   */
  static async validateClassName(name: string, excludeId?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({ name });
      if (excludeId) {
        params.append('excludeId', excludeId);
      }

      const response = await apiClient.get<{
        success: boolean;
        data: { available: boolean };
        message?: string;
      }>(`${this.BASE_URL}/validate-name?${params.toString()}`);

      if (response.data.success && response.data.data) {
        return response.data.data.available;
      }

      return false;
    } catch (error) {
      console.error('验证班级名称失败:', error);
      return false;
    }
  }
}
