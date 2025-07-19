/**
 * 班级管理Hook
 * 
 * 提供班级管理的状态和操作方法
 */

import { useState, useEffect, useCallback } from 'react';
import { ClassService } from '../services/classService';
import type {
  Class,
  CreateClassRequest,
  UpdateClassRequest,
  ClassQueryParams,
  UseClassManagementReturn,
  NotificationConfig
} from '../types';

export const useClassManagement = (): UseClassManagementReturn => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState<Partial<ClassQueryParams>>({});

  // 获取班级列表
  const fetchClasses = useCallback(async (params?: ClassQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: ClassQueryParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        ...params
      };

      const response = await ClassService.getClasses(queryParams);
      
      setClasses(response.data);
      setPagination(prev => ({
        ...prev,
        current: response.page,
        pageSize: response.pageSize,
        total: response.total
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取班级列表失败';
      setError(errorMessage);
      console.error('获取班级列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  // 创建班级
  const createClass = useCallback(async (data: CreateClassRequest): Promise<Class> => {
    try {
      setError(null);
      const newClass = await ClassService.createClass(data);

      // 直接添加到本地状态，而不是重新获取列表
      setClasses(prev => [newClass, ...prev]);

      // 更新总数
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));

      return newClass;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建班级失败';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // 更新班级
  const updateClass = useCallback(async (id: string, data: UpdateClassRequest): Promise<Class> => {
    try {
      setError(null);
      const updatedClass = await ClassService.updateClass(id, data);
      
      // 更新本地状态
      setClasses(prev => prev.map(cls => 
        cls.id === id ? updatedClass : cls
      ));
      
      return updatedClass;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新班级失败';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // 删除班级
  const deleteClass = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await ClassService.deleteClass(id);
      
      // 从本地状态中移除
      setClasses(prev => prev.filter(cls => cls.id !== id));
      
      // 如果当前页没有数据了，回到上一页
      const remainingCount = classes.length - 1;
      if (remainingCount === 0 && pagination.current > 1) {
        setPagination(prev => ({
          ...prev,
          current: prev.current - 1
        }));
      } else {
        // 刷新当前页
        await fetchClasses();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除班级失败';
      setError(errorMessage);
      throw err;
    }
  }, [classes.length, pagination.current, fetchClasses]);

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
  const setFiltersCallback = useCallback((newFilters: Partial<ClassQueryParams>) => {
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      current: 1 // 重置到第一页
    }));
  }, []);

  // 初始加载
  useEffect(() => {
    fetchClasses();
  }, [pagination.current, pagination.pageSize, filters]);

  return {
    classes,
    loading,
    error,
    pagination,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    setPage,
    setPageSize,
    setFilters: setFiltersCallback
  };
};

// 班级详情Hook
export const useClassDetail = (classId: string) => {
  const [classDetail, setClassDetail] = useState<Class | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClassDetail = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);
      const detail = await ClassService.getClassById(classId);
      setClassDetail(detail);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取班级详情失败';
      setError(errorMessage);
      console.error('获取班级详情失败:', err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassDetail();
  }, [fetchClassDetail]);

  return {
    classDetail,
    loading,
    error,
    refetch: fetchClassDetail
  };
};

// 班级统计Hook
export const useClassStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await ClassService.getClassStatistics();
      setStatistics(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取统计信息失败';
      setError(errorMessage);
      console.error('获取班级统计失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

// 班级操作Hook
export const useClassActions = () => {
  const [loading, setLoading] = useState(false);

  // 复制班级
  const duplicateClass = useCallback(async (classId: string, newName: string): Promise<Class> => {
    try {
      setLoading(true);
      const duplicatedClass = await ClassService.duplicateClass(classId, newName);
      return duplicatedClass;
    } catch (err) {
      console.error('复制班级失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 归档班级
  const archiveClass = useCallback(async (classId: string): Promise<void> => {
    try {
      setLoading(true);
      await ClassService.archiveClass(classId);
    } catch (err) {
      console.error('归档班级失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 恢复班级
  const restoreClass = useCallback(async (classId: string): Promise<void> => {
    try {
      setLoading(true);
      await ClassService.restoreClass(classId);
    } catch (err) {
      console.error('恢复班级失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 导出班级
  const exportClasses = useCallback(async (params?: ClassQueryParams): Promise<void> => {
    try {
      setLoading(true);
      const blob = await ClassService.exportClasses(params);
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `班级列表_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('导出班级失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 导入班级
  const importClasses = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const result = await ClassService.importClasses(file);
      return result;
    } catch (err) {
      console.error('导入班级失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    duplicateClass,
    archiveClass,
    restoreClass,
    exportClasses,
    importClasses
  };
};

// 表单验证Hook
export const useClassFormValidation = () => {
  const validateClassName = useCallback(async (name: string, excludeId?: string): Promise<boolean> => {
    if (!name.trim()) return false;
    
    try {
      return await ClassService.validateClassName(name, excludeId);
    } catch (err) {
      console.error('验证班级名称失败:', err);
      return false;
    }
  }, []);

  return {
    validateClassName
  };
};
