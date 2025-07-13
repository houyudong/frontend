import { backendConfig } from '../../../config';

// API相关常量
export const API_BASE_URL = backendConfig.apiPrefix;
export const STM_SERVICE_URL = backendConfig.baseUrl;

// ST-Link API - 使用stmgdbserver服务
export const STLINK_API = {
  CONNECT: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks/:id/connect`,
  DISCONNECT: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks/:id/disconnect`,
  GET_INFO: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks/:id`,
  GET_CHIP_INFO: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks/:id/chip`,
  GET_STATUS: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks/:id/status`,
  GET_ALL: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks`,
  DETECT: `${STM_SERVICE_URL}${API_BASE_URL}/stlinks/detect`,
};

// 固件API - 使用stmgdbserver服务
export const FIRMWARE_API = {
  FLASH: `${STM_SERVICE_URL}${API_BASE_URL}/flashes/flash`,
  GET_STATUS: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/flashes/${id}`,
};

// 编译API - 使用stmgdbserver服务
export const COMPILER_API = {
  COMPILE: `${STM_SERVICE_URL}${API_BASE_URL}/builds/project/:id`,
  GET_BUILD: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/builds/${id}`,
  GET_PROJECT_BUILDS: (projectId: string) => `${STM_SERVICE_URL}${API_BASE_URL}/builds/project/${projectId}`,
  GET_LATEST_BUILD: (projectId: string) => `${STM_SERVICE_URL}${API_BASE_URL}/builds/project/${projectId}/latest`,
};

// 项目API - 使用stmgdbserver服务
export const PROJECT_API = {
  GET_ALL: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects`,
  CREATE: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects`,
  GET_BY_ID: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}`,
  UPDATE: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}`,
  DELETE: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}`,
  GET_CONFIG: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/config`,
  UPDATE_CONFIG: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/config`,
  GET_COMPILE_STATUS: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/compile-status`,
  UPDATE_COMPILE_STATUS: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/compile-status`,
  // 文件相关API
  GET_FILES: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/files`,
  GET_USERFILES: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/userfiles`,
  GET_FILE: (id: string, path: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/files/${encodeURIComponent(path)}`,
  SAVE_FILE: (id: string, path: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects/${id}/files/${encodeURIComponent(path)}`,
  GET_FILE_CONTENT: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files/content`,
  // 新增API端点
  GET_PROJECTS: (userId: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects`,
  CREATE_PROJECT: (userId: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects`,
  GET_PROJECT: (userId: string, projectId: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectId}`,
  CREATE_FILE: (userId: string, projectName: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectName}/files`,
  CREATE_FOLDER: (userId: string, projectName: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectName}/folders`,
  DELETE_FILE: (userId: string, projectName: string, filePath: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectName}/files/${encodeURIComponent(filePath)}`,
  DELETE_FOLDER: (userId: string, projectName: string, folderPath: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectName}/folders/${encodeURIComponent(folderPath)}`,
  RENAME_FILE: (userId: string, projectName: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectName}/files/rename`,
  RENAME_FOLDER: (userId: string, projectName: string) => `${STM_SERVICE_URL}${API_BASE_URL}/workspace/users/${userId}/projects/${projectName}/folders/rename`,
};

// 调试API - 使用stmgdbserver服务
export const DEBUG_API = {
  START_SESSION: `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions`,
  GET_SESSIONS: `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions`,
  GET_SESSION: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions/${id}`,
  STOP_SESSION: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions/${id}/stop`,
  SEND_COMMAND: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions/${id}/command`,
  GET_BREAKPOINTS: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions/${id}/breakpoints`,
  SET_BREAKPOINT: (id: string) => `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions/${id}/breakpoints`,
  DELETE_BREAKPOINT: (id: string, bpId: string) => `${STM_SERVICE_URL}${API_BASE_URL}/debug/sessions/${id}/breakpoints/${bpId}`,
};

// GDB服务器API - 使用stmgdbserver服务
export const GDBSERVER_API = {
  START: `${STM_SERVICE_URL}${API_BASE_URL}/gdbserver/start`,
  STOP: `${STM_SERVICE_URL}${API_BASE_URL}/gdbserver/stop`,
  STATUS: `${STM_SERVICE_URL}${API_BASE_URL}/gdbserver/status`,
  CONFIG: `${STM_SERVICE_URL}${API_BASE_URL}/gdbserver/config`,
};

// 工作区API - 使用后端服务
export const WORKSPACE_API = {
  GET_PROJECTS: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects`,
  GET_FILES: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files`,
  SAVE_FILE: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files`,
  UPDATE_FILE: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files`,
  DELETE_FILE: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files`,
  LIST_FILES: `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files/list`,
};

export default {
  API_BASE_URL,
  STM_SERVICE_URL,
  STLINK_API,
  FIRMWARE_API,
  COMPILER_API,
  PROJECT_API,
  DEBUG_API,
  GDBSERVER_API,
  WORKSPACE_API,
}; 