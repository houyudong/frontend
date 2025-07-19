/**
 * 实验相关的React Hook
 * 
 * 提供实验数据管理和状态控制
 */

import { useState, useEffect, useCallback } from 'react';
import { ExperimentTemplate, UserExperiment } from '../types/experimentTypes';
import { experimentService } from '../services/experimentService';

interface UseExperimentsReturn {
  // 数据状态
  templates: ExperimentTemplate[];
  userExperiments: UserExperiment[];
  loading: boolean;
  error: string | null;
  
  // 操作方法
  loadTemplates: () => Promise<void>;
  loadUserExperiments: (userId: string) => Promise<void>;
  startExperiment: (userId: string, templateId: string) => Promise<any>;
  deleteExperiment: (userId: string, experimentId: number) => Promise<void>;
  updateProgress: (userId: string, experimentId: string, progress: number) => Promise<void>;
  completeExperiment: (userId: string, experimentId: string, score?: number) => Promise<void>;
  
  // 工具方法
  getTemplateById: (id: string) => ExperimentTemplate | undefined;
  getUserExperimentByTemplateId: (templateId: string) => UserExperiment | undefined;
  clearError: () => void;
  refresh: () => Promise<void>;
}

/**
 * 实验管理Hook
 */
export const useExperiments = (userId?: string): UseExperimentsReturn => {
  const [templates, setTemplates] = useState<ExperimentTemplate[]>([]);
  const [userExperiments, setUserExperiments] = useState<UserExperiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 加载实验模板
   */
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const templatesData = await experimentService.getExperimentTemplates();
      setTemplates(templatesData);
    } catch (err) {
      setError('加载实验模板失败');
      console.error('加载实验模板失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 加载用户实验
   */
  const loadUserExperiments = useCallback(async (targetUserId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const experimentsData = await experimentService.getUserExperiments(targetUserId);
      setUserExperiments(experimentsData);
    } catch (err) {
      setError('加载用户实验失败');
      console.error('加载用户实验失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 开始实验
   */
  const startExperiment = useCallback(async (targetUserId: string, templateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await experimentService.startExperiment(targetUserId, templateId);
      
      // 重新加载用户实验列表
      await loadUserExperiments(targetUserId);
      
      return result;
    } catch (err) {
      setError('开始实验失败');
      console.error('开始实验失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUserExperiments]);

  /**
   * 删除实验
   */
  const deleteExperiment = useCallback(async (targetUserId: string, experimentId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await experimentService.deleteExperiment(targetUserId, experimentId);
      
      // 从本地状态中移除
      setUserExperiments(prev => prev.filter(exp => exp.id !== experimentId));
    } catch (err) {
      setError('删除实验失败');
      console.error('删除实验失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 更新实验进度
   */
  const updateProgress = useCallback(async (targetUserId: string, experimentId: string, progress: number) => {
    try {
      await experimentService.updateExperimentProgress(targetUserId, experimentId, progress);
      
      // 更新本地状态
      setUserExperiments(prev => prev.map(exp => 
        exp.experiment_id === experimentId 
          ? { ...exp, progress, status: progress >= 100 ? 'completed' : 'in_progress' }
          : exp
      ));
    } catch (err) {
      setError('更新进度失败');
      console.error('更新进度失败:', err);
      throw err;
    }
  }, []);

  /**
   * 完成实验
   */
  const completeExperiment = useCallback(async (targetUserId: string, experimentId: string, score?: number) => {
    try {
      await experimentService.completeExperiment(targetUserId, experimentId, score);
      
      // 更新本地状态
      setUserExperiments(prev => prev.map(exp => 
        exp.experiment_id === experimentId 
          ? { ...exp, status: 'completed', progress: 100, score, completion_time: new Date().toISOString() }
          : exp
      ));
    } catch (err) {
      setError('完成实验失败');
      console.error('完成实验失败:', err);
      throw err;
    }
  }, []);

  /**
   * 根据ID获取模板
   */
  const getTemplateById = useCallback((id: string): ExperimentTemplate | undefined => {
    return templates.find(template => template.id === id);
  }, [templates]);

  /**
   * 根据模板ID获取用户实验
   */
  const getUserExperimentByTemplateId = useCallback((templateId: string): UserExperiment | undefined => {
    return userExperiments.find(exp => exp.experiment_id === templateId);
  }, [userExperiments]);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 刷新数据
   */
  const refresh = useCallback(async () => {
    await loadTemplates();
    if (userId) {
      await loadUserExperiments(userId);
    }
  }, [loadTemplates, loadUserExperiments, userId]);

  // 初始化加载
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    if (userId) {
      loadUserExperiments(userId);
    }
  }, [loadUserExperiments, userId]);

  return {
    // 数据状态
    templates,
    userExperiments,
    loading,
    error,
    
    // 操作方法
    loadTemplates,
    loadUserExperiments,
    startExperiment,
    deleteExperiment,
    updateProgress,
    completeExperiment,
    
    // 工具方法
    getTemplateById,
    getUserExperimentByTemplateId,
    clearError,
    refresh
  };
};

/**
 * 单个实验详情Hook
 */
export const useExperimentDetail = (experimentId: string) => {
  const [experiment, setExperiment] = useState<ExperimentTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExperiment = useCallback(async () => {
    if (!experimentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const experimentData = await experimentService.getExperimentTemplate(experimentId);
      setExperiment(experimentData);
    } catch (err) {
      setError('加载实验详情失败');
      console.error('加载实验详情失败:', err);
    } finally {
      setLoading(false);
    }
  }, [experimentId]);

  useEffect(() => {
    loadExperiment();
  }, [loadExperiment]);

  return {
    experiment,
    loading,
    error,
    reload: loadExperiment
  };
};
