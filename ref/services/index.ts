/**
 * 服务索引文件
 *
 * 导出所有服务，方便统一导入
 */

// API客户端
export { default as apiClient, createApiClient } from './apiClient';

// 缓存管理器
export { default as cacheManager } from './cacheManager';

// 统一API服务
import apiService from './apiService';
export { default as api } from './apiService';
export {
  authAPI,
  userAPI,
  projectAPI,
  llmAPI,
  progressAPI,
  contentAPI,
  buildAPI
} from './apiService';

// 认证服务 (向后兼容)
export const login = (...args: Parameters<typeof apiService.auth.login>) => apiService.auth.login(...args);
export const logout = (...args: Parameters<typeof apiService.auth.logout>) => apiService.auth.logout(...args);
export const register = (...args: Parameters<typeof apiService.auth.register>) => apiService.auth.register(...args);
export const getCurrentUser = (...args: Parameters<typeof apiService.auth.getCurrentUser>) => apiService.auth.getCurrentUser(...args);
export const updatePassword = (...args: Parameters<typeof apiService.auth.updatePassword>) => apiService.auth.updatePassword(...args);
export const getAllStudents = (...args: Parameters<typeof apiService.auth.getAllStudents>) => apiService.auth.getAllStudents(...args);
export const getStudentActivities = (...args: Parameters<typeof apiService.auth.getStudentActivities>) => apiService.auth.getStudentActivities(...args);

// 这些函数在apiService中没有直接对应，保留原有实现
export const isAuthenticated = (): boolean => {
  // 开发模式开关
  const DEV_MODE_BYPASS_AUTH = false;

  // 如果开发模式开关打开，始终返回已登录
  if (DEV_MODE_BYPASS_AUTH) {
    return true;
  }
  return !!localStorage.getItem('auth_token');
};

export const getUserRole = (): string | null => {
  // 开发模式开关
  const DEV_MODE_BYPASS_AUTH = false;

  // 如果开发模式开关打开，返回学生角色
  if (DEV_MODE_BYPASS_AUTH) {
    return 'student';
  }

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user.role;
  } catch (e) {
    console.error('解析用户信息失败:', e);
    return null;
  }
};

// 用户服务 (向后兼容)
export const getUserProfile = (...args: Parameters<typeof apiService.user.getUserProfile>) => apiService.user.getUserProfile(...args);
export const updateUserProfile = (...args: Parameters<typeof apiService.user.updateUserProfile>) => apiService.user.updateUserProfile(...args);
export const getUserPreferences = (...args: Parameters<typeof apiService.user.getUserPreferences>) => apiService.user.getUserPreferences(...args);
export const updateUserPreferences = (...args: Parameters<typeof apiService.user.updateUserPreferences>) => apiService.user.updateUserPreferences(...args);
export const uploadAvatar = (...args: Parameters<typeof apiService.user.uploadAvatar>) => apiService.user.uploadAvatar(...args);
export const getUserProjects = (...args: Parameters<typeof apiService.user.getUserProjects>) => apiService.user.getUserProjects(...args);

// 进度服务 (向后兼容)
export const getUserProgress = (...args: Parameters<typeof apiService.progress.getUserProgress>) => apiService.progress.getUserProgress(...args);
export const getCourseProgress = (...args: Parameters<typeof apiService.progress.getUserProjectProgress>) => apiService.progress.getUserProjectProgress(...args);
export const updateExperimentStatus = (...args: Parameters<typeof apiService.progress.completeMilestone>) => apiService.progress.completeMilestone(...args);
export const getUserAchievements = (...args: Parameters<typeof apiService.progress.getProgress>) => apiService.progress.getProgress(...args);
export const getUserActivities = (...args: Parameters<typeof apiService.auth.getUserActivities>) => apiService.auth.getUserActivities(...args);

// 这个函数在apiService中没有直接对应，保留原有实现
export const calculateCourseProgress = (courseProgress: { modules?: Array<{ progress: number }> }): number => {
  if (!courseProgress || !courseProgress.modules || courseProgress.modules.length === 0) {
    return 0;
  }

  const totalModules = courseProgress.modules.length;
  const completedModulesSum = courseProgress.modules.reduce((sum, module) => sum + module.progress, 0);
  return Math.round(completedModulesSum / totalModules);
};

// 实验和课程服务 (向后兼容)
export const getExperiments = (...args: Parameters<typeof apiService.content.getExperiments>) => apiService.content.getExperiments(...args);
export const getExperimentById = (...args: Parameters<typeof apiService.content.getExperimentDetail>) => apiService.content.getExperimentDetail(...args);
export const getCourses = (...args: Parameters<typeof apiService.content.getCourses>) => apiService.content.getCourses(...args);
export const getCourseById = (...args: Parameters<typeof apiService.content.getCourseDetail>) => apiService.content.getCourseDetail(...args);

// 代码生成服务 (向后兼容) - 使用llmAPI
export const generateCode = (...args: Parameters<typeof apiService.llm.generate>) => apiService.llm.generate(...args);
export const generateCodeStream = (...args: Parameters<typeof apiService.llm.generateStream>) => apiService.llm.generateStream(...args);

// 设备服务 (向后兼容) - 这些功能将通过stmclient的websocket接口实现
// 暂时提供占位符函数，避免导入错误
export const getDevices = (): Promise<any[]> => Promise.resolve([]);
export const connectDevice = (): Promise<any> => Promise.resolve(null);
export const disconnectDevice = (): Promise<boolean> => Promise.resolve(true);
export const flashFirmware = (): Promise<boolean> => Promise.resolve(false);
export const openSerial = (): Promise<boolean> => Promise.resolve(false);
export const writeSerial = (): Promise<boolean> => Promise.resolve(false);
export const readSerial = (): Promise<string> => Promise.resolve('');

// 注意：串口功能将通过stmclient中的websocket接口来实现
// 这些函数已被移除，请使用deviceAPI中的相关函数 