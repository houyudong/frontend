/**
 * 实验工具函数
 * 
 * 提供实验相关的通用工具函数
 */

import { ExperimentTemplate, UserExperiment } from '../types/experiment';
import { EXPERIMENTS_CONFIG, DIFFICULTY_LEVELS, EXPERIMENT_STATUS } from '../config';

/**
 * 根据实验ID获取URL名称
 */
export const getExperimentUrlName = (experimentId: string): string => {
  const config = EXPERIMENTS_CONFIG[experimentId as keyof typeof EXPERIMENTS_CONFIG];
  return config?.urlName || experimentId;
};

/**
 * 根据URL名称获取实验ID
 */
export const getExperimentIdByUrl = (urlName: string): string | null => {
  const entry = Object.entries(EXPERIMENTS_CONFIG).find(([_, config]) => config.urlName === urlName);
  return entry ? entry[0] : null;
};

/**
 * 获取实验配置信息
 */
export const getExperimentConfig = (experimentId: string) => {
  return EXPERIMENTS_CONFIG[experimentId as keyof typeof EXPERIMENTS_CONFIG] || null;
};

/**
 * 获取难度级别信息
 */
export const getDifficultyInfo = (difficulty: number) => {
  return DIFFICULTY_LEVELS[difficulty as keyof typeof DIFFICULTY_LEVELS] || null;
};

/**
 * 获取实验状态信息
 */
export const getStatusInfo = (status: string) => {
  return EXPERIMENT_STATUS[status as keyof typeof EXPERIMENT_STATUS] || null;
};

/**
 * 格式化实验时长
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
};

/**
 * 计算实验进度百分比
 */
export const calculateProgress = (userExperiment: UserExperiment): number => {
  if (!userExperiment) return 0;
  
  switch (userExperiment.status) {
    case 'not_started':
      return 0;
    case 'in_progress':
      return userExperiment.progress || 0;
    case 'completed':
      return 100;
    case 'failed':
      return userExperiment.progress || 0;
    default:
      return 0;
  }
};

/**
 * 获取实验状态颜色类名
 */
export const getStatusColorClass = (status: string): string => {
  const statusInfo = getStatusInfo(status);
  if (!statusInfo) return 'bg-gray-100 text-gray-800';
  
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[statusInfo.color] || 'bg-gray-100 text-gray-800';
};

/**
 * 获取难度颜色类名
 */
export const getDifficultyColorClass = (difficulty: number): string => {
  const difficultyInfo = getDifficultyInfo(difficulty);
  if (!difficultyInfo) return 'bg-gray-100 text-gray-800';
  
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800'
  };
  
  return colorMap[difficultyInfo.color] || 'bg-gray-100 text-gray-800';
};

/**
 * 获取进度条颜色类名
 */
export const getProgressColorClass = (progress: number): string => {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 30) return 'bg-yellow-500';
  return 'bg-gray-300';
};

/**
 * 过滤实验模板
 */
export const filterExperiments = (
  templates: ExperimentTemplate[],
  filters: {
    category?: string;
    difficulty?: number;
    search?: string;
  }
): ExperimentTemplate[] => {
  return templates.filter(template => {
    // 分类过滤
    if (filters.category && template.category !== filters.category) {
      return false;
    }
    
    // 难度过滤
    if (filters.difficulty && template.difficulty !== filters.difficulty) {
      return false;
    }
    
    // 搜索过滤
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const searchFields = [
        template.name,
        template.description,
        template.project_name
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchFields.includes(search)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * 排序实验模板
 */
export const sortExperiments = (
  templates: ExperimentTemplate[],
  sortField: string,
  sortDirection: 'asc' | 'desc'
): ExperimentTemplate[] => {
  return [...templates].sort((a, b) => {
    let aValue: any = a[sortField as keyof ExperimentTemplate] || 0;
    let bValue: any = b[sortField as keyof ExperimentTemplate] || 0;
    
    // 字符串比较
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    let result = 0;
    if (aValue > bValue) result = 1;
    if (aValue < bValue) result = -1;
    
    return sortDirection === 'desc' ? -result : result;
  });
};

/**
 * 获取实验分类统计
 */
export const getExperimentStats = (templates: ExperimentTemplate[]) => {
  const stats = {
    total: templates.length,
    byCategory: {} as Record<string, number>,
    byDifficulty: {} as Record<number, number>
  };
  
  templates.forEach(template => {
    // 分类统计
    if (template.category) {
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
    }
    
    // 难度统计
    if (template.difficulty) {
      stats.byDifficulty[template.difficulty] = (stats.byDifficulty[template.difficulty] || 0) + 1;
    }
  });
  
  return stats;
};

/**
 * 获取用户实验统计
 */
export const getUserExperimentStats = (userExperiments: UserExperiment[]) => {
  const stats = {
    total: userExperiments.length,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    failed: 0,
    averageProgress: 0
  };
  
  let totalProgress = 0;
  
  userExperiments.forEach(experiment => {
    switch (experiment.status) {
      case 'completed':
        stats.completed++;
        break;
      case 'in_progress':
        stats.inProgress++;
        break;
      case 'not_started':
        stats.notStarted++;
        break;
      case 'failed':
        stats.failed++;
        break;
    }
    
    totalProgress += experiment.progress || 0;
  });
  
  stats.averageProgress = userExperiments.length > 0 ? totalProgress / userExperiments.length : 0;
  
  return stats;
};

/**
 * 验证实验名称格式
 */
export const isValidExperimentName = (name: string): boolean => {
  // 检查是否为有效的URL名称
  return Object.values(EXPERIMENTS_CONFIG).some(config => config.urlName === name);
};

/**
 * 生成实验面包屑导航
 */
export const generateBreadcrumbs = (experimentName?: string) => {
  const breadcrumbs = [
    { name: '首页', path: '/' },
    { name: '实验中心', path: '/experiments' }
  ];
  
  if (experimentName) {
    const experimentId = getExperimentIdByUrl(experimentName);
    const config = experimentId ? getExperimentConfig(experimentId) : null;
    
    if (config) {
      breadcrumbs.push({
        name: config.urlName,
        path: `/experiments/${experimentName}`
      });
    }
  }
  
  return breadcrumbs;
};
