/**
 * 学生进度分析数据管理Hook
 * 
 * 管理学生进度分析相关的状态和数据获取
 */

import { useState, useEffect, useCallback } from 'react';
import {
  StudentProgressDetail,
  ClassProgressAnalytics,
  StudentComparison,
  LearningPathAnalysis,
  ProgressFilters
} from '../types/studentProgress';
import {
  getStudentProgress,
  getClassProgress,
  getStudentComparison,
  getLearningPathAnalysis,
  exportProgressReport
} from '../services/studentProgressService';

interface UseStudentProgressState {
  // 数据状态
  studentProgress: StudentProgressDetail | null;
  classProgress: ClassProgressAnalytics | null;
  studentComparison: StudentComparison | null;
  learningPathAnalysis: LearningPathAnalysis | null;
  
  // 加载状态
  studentLoading: boolean;
  classLoading: boolean;
  comparisonLoading: boolean;
  pathLoading: boolean;
  exportLoading: boolean;
  
  // 错误状态
  error: string | null;
  
  // 筛选条件
  filters: ProgressFilters;
}

interface UseStudentProgressActions {
  // 数据获取
  fetchStudentProgress: (studentId: string, includeDetails?: boolean) => Promise<void>;
  fetchClassProgress: (classId: string, filters?: ProgressFilters) => Promise<void>;
  fetchStudentComparison: (studentIds: string[]) => Promise<void>;
  fetchLearningPathAnalysis: (pathId: string) => Promise<void>;
  
  // 数据导出
  exportReport: (type: 'student' | 'class', id: string, format: 'pdf' | 'excel' | 'csv') => Promise<void>;
  
  // 状态管理
  setFilters: (filters: ProgressFilters) => void;
  clearError: () => void;
  reset: () => void;
}

type UseStudentProgressReturn = UseStudentProgressState & UseStudentProgressActions;

const initialState: UseStudentProgressState = {
  studentProgress: null,
  classProgress: null,
  studentComparison: null,
  learningPathAnalysis: null,
  
  studentLoading: false,
  classLoading: false,
  comparisonLoading: false,
  pathLoading: false,
  exportLoading: false,
  
  error: null,
  
  filters: {}
};

export const useStudentProgress = (): UseStudentProgressReturn => {
  const [state, setState] = useState<UseStudentProgressState>(initialState);

  // 获取单个学生进度
  const fetchStudentProgress = useCallback(async (
    studentId: string, 
    includeDetails = true
  ) => {
    setState(prev => ({ ...prev, studentLoading: true, error: null }));
    
    try {
      const data = await getStudentProgress(studentId, includeDetails);
      setState(prev => ({
        ...prev,
        studentProgress: data,
        studentLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取学生进度失败',
        studentLoading: false
      }));
    }
  }, []);

  // 获取班级进度
  const fetchClassProgress = useCallback(async (
    classId: string, 
    filters?: ProgressFilters
  ) => {
    setState(prev => ({ ...prev, classLoading: true, error: null }));
    
    try {
      const data = await getClassProgress(classId, filters);
      setState(prev => ({
        ...prev,
        classProgress: data,
        classLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取班级进度失败',
        classLoading: false
      }));
    }
  }, []);

  // 获取学生对比数据
  const fetchStudentComparison = useCallback(async (studentIds: string[]) => {
    setState(prev => ({ ...prev, comparisonLoading: true, error: null }));
    
    try {
      const data = await getStudentComparison(studentIds);
      setState(prev => ({
        ...prev,
        studentComparison: data,
        comparisonLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取对比数据失败',
        comparisonLoading: false
      }));
    }
  }, []);

  // 获取学习路径分析
  const fetchLearningPathAnalysis = useCallback(async (pathId: string) => {
    setState(prev => ({ ...prev, pathLoading: true, error: null }));
    
    try {
      const data = await getLearningPathAnalysis(pathId);
      setState(prev => ({
        ...prev,
        learningPathAnalysis: data,
        pathLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取路径分析失败',
        pathLoading: false
      }));
    }
  }, []);

  // 导出报告
  const exportReport = useCallback(async (
    type: 'student' | 'class',
    id: string,
    format: 'pdf' | 'excel' | 'csv'
  ) => {
    setState(prev => ({ ...prev, exportLoading: true, error: null }));
    
    try {
      const blob = await exportProgressReport(type, id, format);
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `progress_report_${type}_${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setState(prev => ({ ...prev, exportLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '导出失败',
        exportLoading: false
      }));
    }
  }, []);

  // 设置筛选条件
  const setFilters = useCallback((filters: ProgressFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 重置状态
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    fetchStudentProgress,
    fetchClassProgress,
    fetchStudentComparison,
    fetchLearningPathAnalysis,
    exportReport,
    setFilters,
    clearError,
    reset
  };
};
