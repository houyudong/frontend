/**
 * 学生管理服务
 * 
 * 提供学生相关的API调用封装，遵循项目API设计模式
 */

import { apiClient } from '../../../../api/apiClient';
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentQueryParams,
  PaginatedResponse,
  StudentStatistics,
  BatchStudentOperation,
  ImportResult
} from '../types';

export class StudentService {
  private static readonly BASE_URL = '/api/students';

  /**
   * 获取学生列表
   */
  static async getStudents(params?: StudentQueryParams): Promise<PaginatedResponse<Student>> {
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
        data: PaginatedResponse<Student>;
        message?: string;
      }>(url);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '获取学生列表失败');
    } catch (error) {
      console.error('获取学生列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据班级ID获取学生列表
   */
  static async getStudentsByClassId(classId: string, params?: Omit<StudentQueryParams, 'classId'>): Promise<PaginatedResponse<Student>> {
    return this.getStudents({ ...params, classId });
  }

  /**
   * 根据ID获取学生详情
   */
  static async getStudentById(id: string): Promise<Student> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Student;
        message?: string;
      }>(`${this.BASE_URL}/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '获取学生详情失败');
    } catch (error) {
      console.error('获取学生详情失败:', error);
      throw error;
    }
  }

  /**
   * 创建学生
   */
  static async createStudent(data: CreateStudentRequest): Promise<Student> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: Student;
        message?: string;
      }>(this.BASE_URL, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '创建学生失败');
    } catch (error) {
      console.error('创建学生失败:', error);
      throw error;
    }
  }

  /**
   * 更新学生信息
   */
  static async updateStudent(id: string, data: UpdateStudentRequest): Promise<Student> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        data: Student;
        message?: string;
      }>(`${this.BASE_URL}/${id}`, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '更新学生信息失败');
    } catch (error) {
      console.error('更新学生信息失败:', error);
      throw error;
    }
  }

  /**
   * 删除学生
   */
  static async deleteStudent(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message?: string;
      }>(`${this.BASE_URL}/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || '删除学生失败');
      }
    } catch (error) {
      console.error('删除学生失败:', error);
      throw error;
    }
  }

  /**
   * 批量操作学生
   */
  static async batchOperation(operation: BatchStudentOperation): Promise<void> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message?: string;
      }>(`${this.BASE_URL}/batch`, operation);

      if (!response.data.success) {
        throw new Error(response.data.message || '批量操作失败');
      }
    } catch (error) {
      console.error('批量操作学生失败:', error);
      throw error;
    }
  }

  /**
   * 获取学生统计信息
   */
  static async getStudentStatistics(classId?: string): Promise<StudentStatistics> {
    try {
      const url = classId 
        ? `${this.BASE_URL}/statistics?classId=${classId}`
        : `${this.BASE_URL}/statistics`;

      const response = await apiClient.get<{
        success: boolean;
        data: StudentStatistics;
        message?: string;
      }>(url);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '获取学生统计失败');
    } catch (error) {
      console.error('获取学生统计失败:', error);
      throw error;
    }
  }

  /**
   * 移动学生到其他班级
   */
  static async moveStudentsToClass(studentIds: string[], targetClassId: string): Promise<void> {
    return this.batchOperation({
      studentIds,
      operation: 'move',
      targetClassId
    });
  }

  /**
   * 激活学生
   */
  static async activateStudents(studentIds: string[]): Promise<void> {
    return this.batchOperation({
      studentIds,
      operation: 'activate'
    });
  }

  /**
   * 停用学生
   */
  static async deactivateStudents(studentIds: string[]): Promise<void> {
    return this.batchOperation({
      studentIds,
      operation: 'deactivate'
    });
  }

  /**
   * 暂停学生
   */
  static async suspendStudents(studentIds: string[]): Promise<void> {
    return this.batchOperation({
      studentIds,
      operation: 'suspend'
    });
  }

  /**
   * 学生毕业
   */
  static async graduateStudents(studentIds: string[]): Promise<void> {
    return this.batchOperation({
      studentIds,
      operation: 'graduate'
    });
  }

  /**
   * 导出学生数据
   */
  static async exportStudents(params?: StudentQueryParams): Promise<Blob> {
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
        throw new Error('导出学生数据失败');
      }

      return await response.blob();
    } catch (error) {
      console.error('导出学生数据失败:', error);
      throw error;
    }
  }

  /**
   * 导入学生数据
   */
  static async importStudents(file: File, classId?: string): Promise<ImportResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (classId) {
        formData.append('classId', classId);
      }

      const response = await fetch(`${this.BASE_URL}/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '导入学生数据失败');
      }

      return result.data;
    } catch (error) {
      console.error('导入学生数据失败:', error);
      throw error;
    }
  }

  /**
   * 验证学号是否可用
   */
  static async validateStudentId(studentId: string, excludeId?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({ studentId });
      if (excludeId) {
        params.append('excludeId', excludeId);
      }

      const response = await apiClient.get<{
        success: boolean;
        data: { available: boolean };
        message?: string;
      }>(`${this.BASE_URL}/validate-student-id?${params.toString()}`);

      if (response.data.success && response.data.data) {
        return response.data.data.available;
      }

      return false;
    } catch (error) {
      console.error('验证学号失败:', error);
      return false;
    }
  }

  /**
   * 验证用户名是否可用
   */
  static async validateUsername(username: string, excludeId?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({ username });
      if (excludeId) {
        params.append('excludeId', excludeId);
      }

      const response = await apiClient.get<{
        success: boolean;
        data: { available: boolean };
        message?: string;
      }>(`${this.BASE_URL}/validate-username?${params.toString()}`);

      if (response.data.success && response.data.data) {
        return response.data.data.available;
      }

      return false;
    } catch (error) {
      console.error('验证用户名失败:', error);
      return false;
    }
  }

  /**
   * 重置学生密码
   */
  static async resetStudentPassword(id: string): Promise<{ temporaryPassword: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: { temporaryPassword: string };
        message?: string;
      }>(`${this.BASE_URL}/${id}/reset-password`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || '重置密码失败');
    } catch (error) {
      console.error('重置学生密码失败:', error);
      throw error;
    }
  }
}
