/**
 * 实验分析数据管理Hook
 * 
 * 管理实验分析相关的状态和数据获取
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ExperimentAnalytics,
  ExperimentAnalyticsRequest,
  BatchExperimentAnalytics,
  StudentExperimentPerformance,
  ExperimentComparison,
  ExperimentFilters,
  ExperimentImprovementSuggestions
} from '../types/experimentAnalytics';
import {
  getExperimentAnalytics,
  getBatchExperimentAnalytics,
  getStudentExperimentPerformance,
  getExperimentComparison,
  getExperimentImprovementSuggestions,
  exportExperimentReport
} from '../services/experimentAnalyticsService';

interface UseExperimentAnalyticsState {
  // 数据状态
  analytics: ExperimentAnalytics | null;
  batchAnalytics: BatchExperimentAnalytics | null;
  studentPerformance: StudentExperimentPerformance | null;
  comparison: ExperimentComparison | null;
  suggestions: ExperimentImprovementSuggestions | null;
  
  // 加载状态
  loading: boolean;
  batchLoading: boolean;
  studentLoading: boolean;
  comparisonLoading: boolean;
  suggestionsLoading: boolean;
  exportLoading: boolean;
  
  // 错误状态
  error: string | null;
  
  // 筛选条件
  filters: ExperimentFilters;
}

interface UseExperimentAnalyticsActions {
  // 数据获取
  fetchAnalytics: (request: ExperimentAnalyticsRequest) => Promise<void>;
  fetchBatchAnalytics: (filters?: ExperimentFilters) => Promise<void>;
  fetchStudentPerformance: (studentId: string) => Promise<void>;
  fetchComparison: (experimentIds: string[]) => Promise<void>;
  fetchSuggestions: (experimentId: string) => Promise<void>;
  
  // 数据导出
  exportReport: (experimentId: string, format: 'pdf' | 'excel' | 'csv') => Promise<void>;
  
  // 状态管理
  setFilters: (filters: ExperimentFilters) => void;
  clearError: () => void;
  reset: () => void;
}

type UseExperimentAnalyticsReturn = UseExperimentAnalyticsState & UseExperimentAnalyticsActions;

const initialState: UseExperimentAnalyticsState = {
  analytics: null,
  batchAnalytics: null,
  studentPerformance: null,
  comparison: null,
  suggestions: null,
  
  loading: false,
  batchLoading: false,
  studentLoading: false,
  comparisonLoading: false,
  suggestionsLoading: false,
  exportLoading: false,
  
  error: null,
  
  filters: {}
};

export const useExperimentAnalytics = (): UseExperimentAnalyticsReturn => {
  const [state, setState] = useState<UseExperimentAnalyticsState>(initialState);

  // 获取单个实验分析数据
  const fetchAnalytics = useCallback(async (request: ExperimentAnalyticsRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await getExperimentAnalytics(request);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          analytics: response.data,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || '获取数据失败',
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取数据失败',
        loading: false
      }));
    }
  }, []);

  // 获取批量实验分析数据
  const fetchBatchAnalytics = useCallback(async (filters?: ExperimentFilters) => {
    setState(prev => ({ ...prev, batchLoading: true, error: null }));
    
    try {
      const data = await getBatchExperimentAnalytics(filters);
      setState(prev => ({
        ...prev,
        batchAnalytics: data,
        batchLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取批量数据失败',
        batchLoading: false
      }));
    }
  }, []);

  // 获取学生实验表现数据
  const fetchStudentPerformance = useCallback(async (studentId: string) => {
    setState(prev => ({ ...prev, studentLoading: true, error: null }));
    
    try {
      const data = await getStudentExperimentPerformance(studentId);
      setState(prev => ({
        ...prev,
        studentPerformance: data,
        studentLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取学生数据失败',
        studentLoading: false
      }));
    }
  }, []);

  // 获取实验对比数据
  const fetchComparison = useCallback(async (experimentIds: string[]) => {
    setState(prev => ({ ...prev, comparisonLoading: true, error: null }));
    
    try {
      const data = await getExperimentComparison(experimentIds);
      setState(prev => ({
        ...prev,
        comparison: data,
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

  // 获取改进建议
  const fetchSuggestions = useCallback(async (experimentId: string) => {
    setState(prev => ({ ...prev, suggestionsLoading: true, error: null }));
    
    try {
      const data = await getExperimentImprovementSuggestions(experimentId);
      setState(prev => ({
        ...prev,
        suggestions: data,
        suggestionsLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取建议失败',
        suggestionsLoading: false
      }));
    }
  }, []);

  // 导出报告
  const exportReport = useCallback(async (
    experimentId: string, 
    format: 'pdf' | 'excel' | 'csv'
  ) => {
    setState(prev => ({ ...prev, exportLoading: true, error: null }));
    
    try {
      const blob = await exportExperimentReport(experimentId, format);
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `experiment_report_${experimentId}.${format}`;
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
  const setFilters = useCallback((filters: ExperimentFilters) => {
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
    fetchAnalytics,
    fetchBatchAnalytics,
    fetchStudentPerformance,
    fetchComparison,
    fetchSuggestions,
    exportReport,
    setFilters,
    clearError,
    reset
  };
};
