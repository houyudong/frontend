/**
 * API端点定义
 * 集中管理所有API端点
 */

import { getApiUrl, getWsUrl } from '../config';

const API_BASE_URL = getApiUrl();
const WS_BASE_URL = getWsUrl();

/**
 * 认证相关端点
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  CURRENT_USER: `${API_BASE_URL}/users/me`,
  UPDATE_PASSWORD: `${API_BASE_URL}/users/password`,
  INIT_TEST_USERS: `${API_BASE_URL}/users/init-test-users`,
  RECORD_ACTIVITY: `${API_BASE_URL}/users/activity`,
  USER_ACTIVITIES: `${API_BASE_URL}/users/activities`,
  STUDENTS: `${API_BASE_URL}/users/students`
} as const;

/**
 * 用户相关端点
 */
export const USER_ENDPOINTS = {
  PROFILE: (userId: string | number) => `${API_BASE_URL}/users/${userId}/profile`,
  PREFERENCES: (userId: string | number) => `${API_BASE_URL}/users/${userId}/preferences`,
  AVATAR: (userId: string | number) => `${API_BASE_URL}/users/${userId}/avatar`,
  PROJECTS: (userId: string | number) => `${API_BASE_URL}/users/${userId}/projects`
} as const;

/**
 * 项目相关端点
 */
export const PROJECT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/workspace/projects`,
  DETAIL: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}`,
  CREATE: `${API_BASE_URL}/workspace/projects`,
  UPDATE: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}`,
  DELETE: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}`,
  RESTORE: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}/restore`,
  FILES: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}/files`,
  USERFILES: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}/userfiles`,
  FILE: (projectId: string | number, filePath: string) => `${API_BASE_URL}/workspace/projects/${projectId}/files/${encodeURIComponent(filePath)}`,
  USER_PROJECTS: (userId: string | number) => `${API_BASE_URL}/workspace/users/${userId}/projects`,
  BUILDS: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}/builds`,
  LATEST_BUILD: (projectId: string | number) => `${API_BASE_URL}/workspace/projects/${projectId}/builds/latest`
} as const;

/**
 * LLM相关端点
 */
export const LLM_ENDPOINTS = {
  PROVIDERS: `${API_BASE_URL}/llm/providers`,
  GENERATE: `${API_BASE_URL}/llm/generate`,
  GENERATE_STREAM: `${API_BASE_URL}/llm/generate/stream`
} as const;

/**
 * 进度跟踪相关端点
 */
export const PROGRESS_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/progress`,
  GET: (id: string | number) => `${API_BASE_URL}/progress/${id}`,
  USER_PROGRESS: (userId: string | number) => `${API_BASE_URL}/progress/users/${userId}`,
  USER_PROJECT_PROGRESS: (userId: string | number, projectId: string | number) => `${API_BASE_URL}/progress/users/${userId}/projects/${projectId}`,
  ADD_MILESTONE: (progressId: string | number) => `${API_BASE_URL}/progress/${progressId}/milestones`,
  START_MILESTONE: (progressId: string | number, milestoneId: string | number) => `${API_BASE_URL}/progress/${progressId}/milestones/${milestoneId}/start`,
  COMPLETE_MILESTONE: (progressId: string | number, milestoneId: string | number) => `${API_BASE_URL}/progress/${progressId}/milestones/${milestoneId}/complete`,
  FAIL_MILESTONE: (progressId: string | number, milestoneId: string | number) => `${API_BASE_URL}/progress/${progressId}/milestones/${milestoneId}/fail`,
  RESET_MILESTONE: (progressId: string | number, milestoneId: string | number) => `${API_BASE_URL}/progress/${progressId}/milestones/${milestoneId}/reset`
} as const;

/**
 * 课程和实验相关端点
 */
export const CONTENT_ENDPOINTS = {
  EXPERIMENTS: `${API_BASE_URL}/experiments`,
  EXPERIMENT_DETAIL: (id: string | number) => `${API_BASE_URL}/experiments/${id}`,
  COURSES: `${API_BASE_URL}/courses`,
  COURSE_DETAIL: (id: string | number) => `${API_BASE_URL}/courses/${id}`
} as const;

/**
 * 构建相关端点
 */
export const BUILD_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/workspace/builds`,
  GET: (id: string | number) => `${API_BASE_URL}/workspace/builds/${id}`,
  DELETE: (id: string | number) => `${API_BASE_URL}/workspace/builds/${id}`,
  CANCEL: (id: string | number) => `${API_BASE_URL}/workspace/builds/${id}/cancel`
} as const;

/**
 * WebSocket端点
 */
export const WEBSOCKET_ENDPOINTS = {
  BUILD_LOG: (buildId: string | number) => `${WS_BASE_URL}/ws/builds/${buildId}/log`,
  PROGRESS: (progressId: string | number) => `${WS_BASE_URL}/ws/progress/${progressId}`
} as const;

// 导出所有端点
export default {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  PROJECT: PROJECT_ENDPOINTS,
  LLM: LLM_ENDPOINTS,
  PROGRESS: PROGRESS_ENDPOINTS,
  CONTENT: CONTENT_ENDPOINTS,
  BUILD: BUILD_ENDPOINTS,
  WEBSOCKET: WEBSOCKET_ENDPOINTS
} as const; 