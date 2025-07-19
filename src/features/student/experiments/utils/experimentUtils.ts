/**
 * 实验工具函数
 * 
 * 提供实验相关的通用工具函数
 */

import { ExperimentTemplate, UserExperiment, EXPERIMENT_URL_TO_ID } from '../types/experimentTypes';
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
  return EXPERIMENT_URL_TO_ID[urlName] || null;
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
  
  if (remainingMinutes === 0) {
    return `${hours}小时`;
  }
  
  return `${hours}小时${remainingMinutes}分钟`;
};

/**
 * 获取难度颜色类名
 */
export const getDifficultyColorClass = (difficulty: number): string => {
  const colorMap = {
    1: 'green',
    2: 'blue', 
    3: 'orange'
  };
  return colorMap[difficulty as keyof typeof colorMap] || 'gray';
};

/**
 * 获取状态颜色类名
 */
export const getStatusColorClass = (status: string): string => {
  const colorMap = {
    'not_started': 'gray',
    'in_progress': 'blue',
    'completed': 'green',
    'failed': 'red'
  };
  return colorMap[status as keyof typeof colorMap] || 'gray';
};

/**
 * 计算实验完成进度
 */
export const calculateProgress = (userExperiments: UserExperiment[]): {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
} => {
  const total = userExperiments.length;
  const completed = userExperiments.filter(exp => exp.status === 'completed').length;
  const inProgress = userExperiments.filter(exp => exp.status === 'in_progress').length;
  const notStarted = userExperiments.filter(exp => exp.status === 'not_started').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    completionRate
  };
};

/**
 * 根据分类过滤实验
 */
export const filterExperimentsByCategory = (
  experiments: ExperimentTemplate[], 
  category: string
): ExperimentTemplate[] => {
  if (category === 'all') {
    return experiments;
  }
  return experiments.filter(exp => exp.category === category);
};

/**
 * 根据难度过滤实验
 */
export const filterExperimentsByDifficulty = (
  experiments: ExperimentTemplate[], 
  difficulty: number
): ExperimentTemplate[] => {
  if (difficulty === 0) {
    return experiments;
  }
  return experiments.filter(exp => exp.difficulty === difficulty);
};

/**
 * 搜索实验
 */
export const searchExperiments = (
  experiments: ExperimentTemplate[], 
  searchTerm: string
): ExperimentTemplate[] => {
  if (!searchTerm.trim()) {
    return experiments;
  }
  
  const term = searchTerm.toLowerCase();
  return experiments.filter(exp => 
    exp.name.toLowerCase().includes(term) ||
    exp.description?.toLowerCase().includes(term) ||
    exp.learning_objectives?.some(obj => obj.toLowerCase().includes(term))
  );
};

/**
 * 排序实验
 */
export const sortExperiments = (
  experiments: ExperimentTemplate[], 
  sortBy: 'name' | 'difficulty' | 'duration' | 'order_index',
  sortOrder: 'asc' | 'desc' = 'asc'
): ExperimentTemplate[] => {
  return [...experiments].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'difficulty':
        aValue = a.difficulty || 0;
        bValue = b.difficulty || 0;
        break;
      case 'duration':
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
      case 'order_index':
        aValue = a.order_index || 0;
        bValue = b.order_index || 0;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * 验证实验名称
 */
export const isValidExperimentName = (experimentName: string): boolean => {
  return Object.keys(EXPERIMENT_URL_TO_ID).includes(experimentName);
};

/**
 * 获取实验类型标签
 */
export const getExperimentTypeLabel = (category: string): string => {
  const labelMap = {
    'basic': '基础实验',
    'intermediate': '中级实验',
    'advanced': '高级实验',
    'project': '综合项目'
  };
  return labelMap[category as keyof typeof labelMap] || '未知类型';
};

/**
 * 格式化时间戳
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '无效时间';
  }
};

/**
 * 计算学习时间
 */
export const calculateStudyTime = (startTime?: string, endTime?: string): number => {
  if (!startTime || !endTime) return 0;
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / (1000 * 60)); // 返回分钟数
  } catch (error) {
    return 0;
  }
};

/**
 * 生成实验报告数据
 */
export const generateExperimentReport = (userExperiment: UserExperiment, template: ExperimentTemplate) => {
  const studyTime = calculateStudyTime(userExperiment.start_time, userExperiment.completion_time);
  
  return {
    experimentName: template.name,
    status: userExperiment.status,
    progress: userExperiment.progress,
    score: userExperiment.score || 0,
    studyTime,
    startTime: userExperiment.start_time,
    completionTime: userExperiment.completion_time,
    difficulty: template.difficulty,
    category: template.category
  };
};
