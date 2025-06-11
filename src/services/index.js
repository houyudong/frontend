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
  contentAPI
} from './apiService';

// 认证服务 (向后兼容)
export const login = (...args) => apiService.auth.login(...args);
export const logout = (...args) => apiService.auth.logout(...args);
export const register = (...args) => apiService.auth.register(...args);
export const getCurrentUser = (...args) => apiService.auth.getCurrentUser(...args);
export const updatePassword = (...args) => apiService.auth.updatePassword(...args);
export const getAllStudents = (...args) => apiService.auth.getAllStudents(...args);
export const getStudentActivities = (...args) => apiService.auth.getStudentActivities(...args);

// 这些函数在apiService中没有直接对应，保留原有实现
export const isAuthenticated = () => {
  // 开发模式开关
  const DEV_MODE_BYPASS_AUTH = false;

  // 如果开发模式开关打开，始终返回已登录
  if (DEV_MODE_BYPASS_AUTH) {
    return true;
  }
  return !!localStorage.getItem('auth_token');
};

export const getUserRole = () => {
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
export const getUserProfile = (...args) => apiService.user.getUserProfile(...args);
export const updateUserProfile = (...args) => apiService.user.updateUserProfile(...args);
export const getUserPreferences = (...args) => apiService.user.getUserPreferences(...args);
export const updateUserPreferences = (...args) => apiService.user.updateUserPreferences(...args);
export const uploadAvatar = (...args) => apiService.user.uploadAvatar(...args);
export const getUserProjects = (...args) => apiService.user.getUserProjects(...args);

// 进度服务 (向后兼容)
export const getUserProgress = (...args) => apiService.progress.getUserProgress(...args);
export const getCourseProgress = (...args) => apiService.progress.getCourseProgress(...args);
export const updateExperimentStatus = (...args) => apiService.progress.updateExperimentStatus(...args);
export const getUserAchievements = (...args) => apiService.progress.getUserAchievements(...args);
export const getUserActivities = (...args) => apiService.auth.getUserActivities(...args);

// 这个函数在apiService中没有直接对应，保留原有实现
export const calculateCourseProgress = (courseProgress) => {
  if (!courseProgress || !courseProgress.modules || courseProgress.modules.length === 0) {
    return 0;
  }

  const totalModules = courseProgress.modules.length;
  const completedModulesSum = courseProgress.modules.reduce((sum, module) => sum + module.progress, 0);
  return Math.round(completedModulesSum / totalModules);
};

// 实验和课程服务 (向后兼容)
export const getExperiments = (...args) => apiService.content.getExperiments(...args);
export const getExperimentById = (...args) => apiService.content.getExperimentById(...args);
export const getCourses = (...args) => apiService.content.getCourses(...args);
export const getCourseById = (...args) => apiService.content.getCourseById(...args);

// 代码生成服务 (向后兼容) - 使用llmAPI
export const generateCode = (...args) => apiService.llm.generateCode(...args);
export const generateCodeStream = (...args) => apiService.llm.generateCodeStream(...args);

// 设备服务 (向后兼容) - 这些功能将通过stmclient的websocket接口实现
// 暂时提供占位符函数，避免导入错误
export const getDevices = () => Promise.resolve([]);
export const connectDevice = () => Promise.resolve(null);
export const disconnectDevice = () => Promise.resolve(true);
export const flashFirmware = () => Promise.resolve(false);
export const openSerial = () => Promise.resolve(false);
export const writeSerial = () => Promise.resolve(false);
export const readSerial = () => Promise.resolve('');

// 注意：串口功能将通过stmclient中的websocket接口来实现
// 这些函数已被移除，请使用deviceAPI中的相关函数
