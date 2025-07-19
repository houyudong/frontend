/**
 * 学生管理Hook
 * 
 * 提供学生管理的状态和操作方法
 */

import { useState, useEffect, useCallback } from 'react';
import { StudentService } from '../services/studentService';
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentQueryParams,
  BatchStudentOperation,
  UseStudentManagementReturn
} from '../types';

export const useStudentManagement = (initialClassId?: string): UseStudentManagementReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState<Partial<StudentQueryParams>>({
    classId: initialClassId
  });

  // 获取学生列表
  const fetchStudents = useCallback(async (params?: StudentQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: StudentQueryParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        ...params
      };

      const response = await StudentService.getStudents(queryParams);
      
      setStudents(response.data);
      setPagination(prev => ({
        ...prev,
        current: response.page,
        pageSize: response.pageSize,
        total: response.total
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取学生列表失败';
      setError(errorMessage);
      console.error('获取学生列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  // 创建学生
  const createStudent = useCallback(async (data: CreateStudentRequest): Promise<Student> => {
    try {
      setError(null);
      const newStudent = await StudentService.createStudent(data);
      
      // 刷新列表
      await fetchStudents();
      
      return newStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建学生失败';
      setError(errorMessage);
      throw err;
    }
  }, [fetchStudents]);

  // 更新学生
  const updateStudent = useCallback(async (id: string, data: UpdateStudentRequest): Promise<Student> => {
    try {
      setError(null);
      const updatedStudent = await StudentService.updateStudent(id, data);
      
      // 更新本地状态
      setStudents(prev => prev.map(student => 
        student.id === id ? updatedStudent : student
      ));
      
      return updatedStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新学生信息失败';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // 删除学生
  const deleteStudent = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await StudentService.deleteStudent(id);
      
      // 从本地状态中移除
      setStudents(prev => prev.filter(student => student.id !== id));
      
      // 如果当前页没有数据了，回到上一页
      const remainingCount = students.length - 1;
      if (remainingCount === 0 && pagination.current > 1) {
        setPagination(prev => ({
          ...prev,
          current: prev.current - 1
        }));
      } else {
        // 刷新当前页
        await fetchStudents();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除学生失败';
      setError(errorMessage);
      throw err;
    }
  }, [students.length, pagination.current, fetchStudents]);

  // 批量操作学生
  const batchOperation = useCallback(async (operation: BatchStudentOperation): Promise<void> => {
    try {
      setError(null);
      await StudentService.batchOperation(operation);
      
      // 刷新列表
      await fetchStudents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批量操作失败';
      setError(errorMessage);
      throw err;
    }
  }, [fetchStudents]);

  // 设置页码
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
  }, []);

  // 设置页面大小
  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: 1, // 重置到第一页
      pageSize
    }));
  }, []);

  // 设置过滤条件
  const setFiltersCallback = useCallback((newFilters: Partial<StudentQueryParams>) => {
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      current: 1 // 重置到第一页
    }));
  }, []);

  // 初始加载
  useEffect(() => {
    fetchStudents();
  }, [pagination.current, pagination.pageSize, filters]);

  return {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    batchOperation,
    setPage,
    setPageSize,
    setFilters: setFiltersCallback
  };
};

// 学生详情Hook
export const useStudentDetail = (studentId: string) => {
  const [studentDetail, setStudentDetail] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentDetail = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);
      const detail = await StudentService.getStudentById(studentId);
      setStudentDetail(detail);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取学生详情失败';
      setError(errorMessage);
      console.error('获取学生详情失败:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentDetail();
  }, [fetchStudentDetail]);

  return {
    studentDetail,
    loading,
    error,
    refetch: fetchStudentDetail
  };
};

// 学生统计Hook
export const useStudentStatistics = (classId?: string) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await StudentService.getStudentStatistics(classId);
      setStatistics(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取统计信息失败';
      setError(errorMessage);
      console.error('获取学生统计失败:', err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
};

// 学生操作Hook
export const useStudentActions = () => {
  const [loading, setLoading] = useState(false);

  // 移动学生到其他班级
  const moveStudents = useCallback(async (studentIds: string[], targetClassId: string): Promise<void> => {
    try {
      setLoading(true);
      await StudentService.moveStudentsToClass(studentIds, targetClassId);
    } catch (err) {
      console.error('移动学生失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 激活学生
  const activateStudents = useCallback(async (studentIds: string[]): Promise<void> => {
    try {
      setLoading(true);
      await StudentService.activateStudents(studentIds);
    } catch (err) {
      console.error('激活学生失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 停用学生
  const deactivateStudents = useCallback(async (studentIds: string[]): Promise<void> => {
    try {
      setLoading(true);
      await StudentService.deactivateStudents(studentIds);
    } catch (err) {
      console.error('停用学生失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 暂停学生
  const suspendStudents = useCallback(async (studentIds: string[]): Promise<void> => {
    try {
      setLoading(true);
      await StudentService.suspendStudents(studentIds);
    } catch (err) {
      console.error('暂停学生失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 学生毕业
  const graduateStudents = useCallback(async (studentIds: string[]): Promise<void> => {
    try {
      setLoading(true);
      await StudentService.graduateStudents(studentIds);
    } catch (err) {
      console.error('学生毕业失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 导出学生
  const exportStudents = useCallback(async (params?: StudentQueryParams): Promise<void> => {
    try {
      setLoading(true);
      const blob = await StudentService.exportStudents(params);
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `学生列表_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('导出学生失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 导入学生
  const importStudents = useCallback(async (file: File, classId?: string) => {
    try {
      setLoading(true);
      const result = await StudentService.importStudents(file, classId);
      return result;
    } catch (err) {
      console.error('导入学生失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 重置密码
  const resetPassword = useCallback(async (studentId: string) => {
    try {
      setLoading(true);
      const result = await StudentService.resetStudentPassword(studentId);
      return result;
    } catch (err) {
      console.error('重置密码失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    moveStudents,
    activateStudents,
    deactivateStudents,
    suspendStudents,
    graduateStudents,
    exportStudents,
    importStudents,
    resetPassword
  };
};

// 表单验证Hook
export const useStudentFormValidation = () => {
  const validateStudentId = useCallback(async (studentId: string, excludeId?: string): Promise<boolean> => {
    if (!studentId.trim()) return false;
    
    try {
      return await StudentService.validateStudentId(studentId, excludeId);
    } catch (err) {
      console.error('验证学号失败:', err);
      return false;
    }
  }, []);

  const validateUsername = useCallback(async (username: string, excludeId?: string): Promise<boolean> => {
    if (!username.trim()) return false;
    
    try {
      return await StudentService.validateUsername(username, excludeId);
    } catch (err) {
      console.error('验证用户名失败:', err);
      return false;
    }
  }, []);

  return {
    validateStudentId,
    validateUsername
  };
};
