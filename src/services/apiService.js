/**
 * API服务
 * 统一管理所有对后台的API调用
 */

import apiClient from './apiClient';
import endpoints from './apiEndpoints';

/**
 * 认证相关API
 */
export const authAPI = {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<Object>} - 登录结果
   */
  login: async (username, password) => {
    const response = await apiClient.post(endpoints.AUTH.LOGIN, {
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  },

  /**
   * 用户注册
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} - 注册结果
   */
  register: async (userData) => {
    const response = await apiClient.post(endpoints.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * 退出登录
   * @returns {Promise<Object>} - 登出结果
   */
  logout: async () => {
    const response = await apiClient.post(endpoints.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} - 用户信息
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(endpoints.AUTH.CURRENT_USER);
    return response.data;
  },

  /**
   * 更新用户密码
   * @param {string} oldPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>} - 更新结果
   */
  updatePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.put(endpoints.AUTH.UPDATE_PASSWORD, {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * 初始化测试用户
   * @returns {Promise<Object>} - 初始化结果
   */
  initTestUsers: async () => {
    const response = await apiClient.post(endpoints.AUTH.INIT_TEST_USERS);
    return response.data;
  },

  /**
   * 记录用户活动
   * @param {string} activityType - 活动类型
   * @param {string} activityData - 活动数据
   * @returns {Promise<Object>} - 记录结果
   */
  recordActivity: async (activityType, activityData) => {
    const url = `${endpoints.AUTH.RECORD_ACTIVITY}?activity_type=${activityType}${activityData ? `&activity_data=${encodeURIComponent(activityData)}` : ''}`;
    const response = await apiClient.post(url);
    return response.data;
  },

  /**
   * 获取用户活动记录
   * @param {number} skip - 跳过的记录数
   * @param {number} limit - 返回的记录数
   * @returns {Promise<Object>} - 活动记录
   */
  getUserActivities: async (skip = 0, limit = 20) => {
    const response = await apiClient.get(`${endpoints.AUTH.USER_ACTIVITIES}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * 获取所有学生（仅教师可用）
   * @param {number} skip - 跳过的记录数
   * @param {number} limit - 返回的记录数
   * @returns {Promise<Object>} - 学生列表
   */
  getAllStudents: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`${endpoints.AUTH.STUDENTS}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * 获取学生活动记录（仅教师可用）
   * @param {string} studentId - 学生ID
   * @param {number} skip - 跳过的记录数
   * @param {number} limit - 返回的记录数
   * @returns {Promise<Object>} - 学生活动记录
   */
  getStudentActivities: async (studentId, skip = 0, limit = 20) => {
    const response = await apiClient.get(`${endpoints.AUTH.STUDENTS}/${studentId}/activities?skip=${skip}&limit=${limit}`);
    return response.data;
  }
};

/**
 * 用户相关API
 */
export const userAPI = {
  /**
   * 获取用户资料
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} - 用户资料数据
   */
  getUserProfile: async (userId) => {
    const response = await apiClient.get(endpoints.USER.PROFILE(userId));
    return response.data;
  },

  /**
   * 更新用户资料
   * @param {string} userId - 用户ID
   * @param {Object} profileData - 要更新的资料数据
   * @returns {Promise<Object>} - 更新结果
   */
  updateUserProfile: async (userId, profileData) => {
    const response = await apiClient.put(endpoints.USER.PROFILE(userId), profileData);
    return response.data;
  },

  /**
   * 获取用户偏好设置
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} - 用户偏好设置数据
   */
  getUserPreferences: async (userId) => {
    const response = await apiClient.get(endpoints.USER.PREFERENCES(userId));
    return response.data;
  },

  /**
   * 更新用户偏好设置
   * @param {string} userId - 用户ID
   * @param {Object} preferencesData - 要更新的偏好设置数据
   * @returns {Promise<Object>} - 更新结果
   */
  updateUserPreferences: async (userId, preferencesData) => {
    const response = await apiClient.put(endpoints.USER.PREFERENCES(userId), preferencesData);
    return response.data;
  },

  /**
   * 上传用户头像
   * @param {string} userId - 用户ID
   * @param {File} file - 头像文件
   * @param {Function} onProgress - 上传进度回调函数
   * @returns {Promise<Object>} - 上传结果
   */
  uploadAvatar: async (userId, file, onProgress) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.upload(endpoints.USER.AVATAR(userId), formData, onProgress);
    return response.data;
  },

  /**
   * 获取用户项目列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Array<Object>>} - 项目列表
   */
  getUserProjects: async (userId) => {
    const response = await apiClient.get(endpoints.USER.PROJECTS(userId));
    return response.data;
  }
};

/**
 * 项目相关API
 */
export const projectAPI = {
  /**
   * 获取项目列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Array<Object>>} - 项目列表
   */
  getProjects: async (userId) => {
    const response = await apiClient.get(`${endpoints.PROJECT.LIST}?user_id=${userId}`);
    return response.data;
  },

  /**
   * 获取项目详情
   * @param {string} projectId - 项目ID
   * @returns {Promise<Object>} - 项目详情
   */
  getProjectById: async (projectId) => {
    const response = await apiClient.get(endpoints.PROJECT.DETAIL(projectId));
    return response.data;
  },

  /**
   * 创建新项目
   * @param {Object} projectData - 项目数据
   * @returns {Promise<Object>} - 创建结果
   */
  createProject: async (projectData) => {
    const response = await apiClient.post(endpoints.PROJECT.CREATE, projectData);
    return response.data;
  },

  /**
   * 更新项目
   * @param {string} projectId - 项目ID
   * @param {Object} projectData - 项目数据
   * @returns {Promise<Object>} - 更新结果
   */
  updateProject: async (projectId, projectData) => {
    const response = await apiClient.put(endpoints.PROJECT.UPDATE(projectId), projectData);
    return response.data;
  },

  /**
   * 删除项目
   * @param {string} projectId - 项目ID
   * @returns {Promise<Object>} - 删除结果
   */
  deleteProject: async (projectId) => {
    const response = await apiClient.delete(endpoints.PROJECT.DELETE(projectId));
    return response.data;
  },

  /**
   * 获取项目文件
   * @param {string} projectId - 项目ID
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} - 文件内容
   */
  getProjectFile: async (projectId, filePath) => {
    const response = await apiClient.get(endpoints.PROJECT.FILE(projectId, filePath));
    return response.data;
  },

  /**
   * 保存项目文件
   * @param {string} projectId - 项目ID
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Promise<Object>} - 保存结果
   */
  saveProjectFile: async (projectId, filePath, content) => {
    const response = await apiClient.post(endpoints.PROJECT.FILES(projectId), {
      path: filePath,
      content
    });
    return response.data;
  },

  /**
   * 删除项目文件
   * @param {string} projectId - 项目ID
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} - 删除结果
   */
  deleteProjectFile: async (projectId, filePath) => {
    const requestData = {
      project_id: projectId,
      file_path: filePath
    };
    
    console.log('删除文件请求参数:', {
      projectId,
      filePath,
      requestData,
      url: `${endpoints.PROJECT.DETAIL(projectId)}/files/delete`
    });
    
    const response = await apiClient.post(`${endpoints.PROJECT.DETAIL(projectId)}/files/delete`, requestData);
    return response.data;
  },

  /**
   * 删除项目目录
   * @param {string} projectId - 项目ID
   * @param {string} dirPath - 目录路径
   * @returns {Promise<Object>} - 删除结果
   */
  deleteProjectDirectory: async (projectId, dirPath) => {
    const response = await apiClient.post(`${endpoints.PROJECT.DETAIL(projectId)}/directories/delete`, {
      project_id: projectId,
      dir_path: dirPath
    });
    return response.data;
  },

  /**
   * 构建项目
   * @param {string} projectId - 项目ID
   * @returns {Promise<Object>} - 构建结果
   */
  buildProject: async (projectId) => {
    // 使用BUILD.CREATE端点
    const response = await apiClient.post(endpoints.BUILD.CREATE, { project_id: projectId });
    return response.data;
  },

  /**
   * 获取构建日志
   * @param {string} projectId - 项目ID
   * @param {string} buildId - 构建ID
   * @returns {Promise<Object>} - 构建日志
   */
  getBuildLog: async (projectId, buildId) => {
    const response = await apiClient.get(endpoints.PROJECT.BUILD_LOG(projectId, buildId));
    return response.data;
  }
};

// 代码生成相关API已被LLM API替代

/**
 * LLM相关API
 */
export const llmAPI = {
  /**
   * 获取可用的LLM提供商
   * @returns {Promise<Object>} - 提供商列表
   */
  getProviders: async () => {
    const response = await apiClient.get(endpoints.LLM.PROVIDERS);
    return response.data;
  },

  /**
   * 生成代码
   * @param {string} prompt - 用户提示
   * @param {string} mcuModel - MCU型号
   * @param {Array<string>} features - 功能列表
   * @param {string} provider - 提供商类型
   * @returns {Promise<Object>} - 生成的代码结果
   */
  generateCode: async (prompt, mcuModel = '', features = [], provider = '') => {
    const response = await apiClient.post(endpoints.LLM.GENERATE, {
      prompt,
      mcu_model: mcuModel,
      features,
      provider
    });
    return response.data;
  },

  /**
   * 流式生成代码
   * @param {string} prompt - 用户提示
   * @param {string} mcuModel - MCU型号
   * @param {Array<string>} features - 功能列表
   * @param {string} provider - 提供商类型
   * @param {Object} callbacks - 回调函数对象
   * @returns {Promise<string>} - 生成的代码
   */
  generateCodeStream: async (prompt, mcuModel = '', features = [], provider = '', callbacks) => {
    return await apiClient.stream(endpoints.LLM.GENERATE_STREAM, {
      prompt,
      mcu_model: mcuModel,
      features,
      provider
    }, callbacks);
  }
};

/**
 * 进度跟踪相关API
 */
export const progressAPI = {
  /**
   * 获取用户学习进度
   * @param {string} userId - 用户ID
   * @param {boolean} detailed - 是否返回详细进度数据
   * @returns {Promise<Object>} - 用户进度数据
   */
  getUserProgress: async (userId, detailed = false) => {
    const response = await apiClient.get(endpoints.PROGRESS.USER_PROGRESS(userId), {
      params: { detailed }
    });
    return response.data;
  },

  /**
   * 获取特定课程的进度
   * @param {string} userId - 用户ID
   * @param {string} courseId - 课程ID
   * @returns {Promise<Object>} - 课程进度数据
   */
  getCourseProgress: async (userId, courseId) => {
    // 使用USER_PROGRESS端点，添加courseId参数
    const response = await apiClient.get(endpoints.PROGRESS.USER_PROGRESS(userId), {
      params: { courseId }
    });
    return response.data;
  },

  /**
   * 更新实验状态
   * @param {string} userId - 用户ID
   * @param {string} courseId - 课程ID
   * @param {string} moduleId - 模块ID
   * @param {string} experimentId - 实验ID
   * @param {string} status - 状态 (not_started, in_progress, completed)
   * @param {number} score - 得分 (可选)
   * @returns {Promise<Object>} - 更新结果
   */
  updateExperimentStatus: async (userId, courseId, moduleId, experimentId, status, score) => {
    const response = await apiClient.put(endpoints.PROGRESS.EXPERIMENT_STATUS(experimentId), {
      userId,
      courseId,
      moduleId,
      status,
      score
    });
    return response.data;
  },

  /**
   * 获取用户成就
   * @param {string} userId - 用户ID
   * @returns {Promise<Array<Object>>} - 成就列表
   */
  getUserAchievements: async (userId) => {
    const response = await apiClient.get(endpoints.PROGRESS.ACHIEVEMENTS, {
      params: { userId }
    });
    return response.data;
  }
};

/**
 * 课程和实验相关API
 */
export const contentAPI = {
  /**
   * 获取实验列表
   * @returns {Promise<Array<Object>>} - 实验列表
   */
  getExperiments: async () => {
    const response = await apiClient.get(endpoints.CONTENT.EXPERIMENTS);
    return response.data;
  },

  /**
   * 获取实验详情
   * @param {string} id - 实验ID
   * @returns {Promise<Object>} - 实验详情
   */
  getExperimentById: async (id) => {
    const response = await apiClient.get(endpoints.CONTENT.EXPERIMENT_DETAIL(id));
    return response.data;
  },

  /**
   * 获取课程列表
   * @returns {Promise<Array<Object>>} - 课程列表
   */
  getCourses: async () => {
    const response = await apiClient.get(endpoints.CONTENT.COURSES);
    return response.data;
  },

  /**
   * 获取课程详情
   * @param {string} id - 课程ID
   * @returns {Promise<Object>} - 课程详情
   */
  getCourseById: async (id) => {
    const response = await apiClient.get(endpoints.CONTENT.COURSE_DETAIL(id));
    return response.data;
  }
};

// 设备相关API已被stmclient替代

// 导出所有API服务
export default {
  auth: authAPI,
  user: userAPI,
  project: projectAPI,
  llm: llmAPI,
  progress: progressAPI,
  content: contentAPI
};
