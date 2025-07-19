import { useState, useEffect, useCallback } from 'react';
import { ExperimentTemplate, Project, ExperimentApi } from '../../../api/experimentApi';
import { EnhancedExperimentDetail } from '../types';
import { experiments, experimentsList } from '../data/experiments';

export interface UseExperimentsState {
  templates: ExperimentTemplate[];
  userProjects: Project[];
  loading: boolean;
  error: string | null;
}

export interface UseExperimentsActions {
  loadTemplates: () => Promise<void>;
  loadUserProjects: (userId: string) => Promise<void>;
  startExperiment: (userId: string, templateId: string) => Promise<Project>;
  refreshData: (userId: string) => Promise<void>;
  clearError: () => void;
}

export interface UseExperimentsReturn extends UseExperimentsState, UseExperimentsActions {}

/**
 * 实验管理Hook
 * 提供实验模板和用户项目的状态管理
 */
export const useExperiments = (userId?: string): UseExperimentsReturn => {
  const [state, setState] = useState<UseExperimentsState>({
    templates: [],
    userProjects: [],
    loading: false,
    error: null,
  });

  // 加载实验模板
  const loadTemplates = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const templates = await ExperimentApi.getExperimentTemplates();
      setState(prev => ({ ...prev, templates, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load templates',
        loading: false
      }));
    }
  }, []);

  // 加载用户项目
  const loadUserProjects = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const projects = await ExperimentApi.getUserProjects(userId);
      setState(prev => ({ ...prev, userProjects: projects, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load user projects',
        loading: false
      }));
    }
  }, []);

  // 开始实验
  const startExperiment = useCallback(async (userId: string, templateId: string): Promise<Project> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const project = await ExperimentApi.startExperiment(userId, templateId);
      
      // 更新用户项目列表
      setState(prev => ({
        ...prev,
        userProjects: [...prev.userProjects, project],
        loading: false
      }));
      
      return project;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start experiment',
        loading: false
      }));
      throw error;
    }
  }, []);

  // 刷新数据
  const refreshData = useCallback(async (userId: string) => {
    await Promise.all([
      loadTemplates(),
      loadUserProjects(userId)
    ]);
  }, [loadTemplates, loadUserProjects]);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 自动加载数据
  useEffect(() => {
    loadTemplates();
    if (userId) {
      loadUserProjects(userId);
    }
  }, [userId, loadTemplates, loadUserProjects]);

  return {
    ...state,
    loadTemplates,
    loadUserProjects,
    startExperiment,
    refreshData,
    clearError,
  };
};

/**
 * 实验详情Hook
 * 获取单个实验的详细信息
 * 遵循DRY原则，统一使用后端API作为数据源
 */
export const useExperimentDetail = (experimentId: string) => {
  const [experiment, setExperiment] = useState<ExperimentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`开始加载实验详情: ${experimentId}`);

        // 使用后端API获取实验详情，遵循奥卡姆原则统一数据源
        const experimentData = await ExperimentApi.getExperimentTemplate(experimentId);

        console.log(`实验详情加载成功:`, experimentData);
        setExperiment(experimentData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '加载实验详情失败';
        setError(errorMessage);
        console.error('加载实验详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    if (experimentId) {
      loadExperiment();
    }
  }, [experimentId]);

  return { experiment, loading, error };
};
