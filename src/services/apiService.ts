/**
 * API服务
 * 统一管理所有对后台的API调用
 */

import apiClient from './apiClient';
import endpoints from './apiEndpoints';

// 用户数据接口
interface UserData {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  [key: string]: any;
}

// 用户资料接口
interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  fullName: string;
  [key: string]: any;
}

// 用户偏好设置接口
interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  [key: string]: any;
}

// 项目数据接口
interface ProjectData {
  name: string;
  description?: string;
  type: string;
  [key: string]: any;
}

// 活动记录接口
interface ActivityRecord {
  id: string | number;
  type: string;
  data?: string;
  timestamp: string;
  [key: string]: any;
}

// 分页响应接口
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

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
  login: async (username: string, password: string): Promise<any> => {
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
   * @param {UserData} userData - 用户数据
   * @returns {Promise<Object>} - 注册结果
   */
  register: async (userData: UserData): Promise<any> => {
    const response = await apiClient.post(endpoints.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * 退出登录
   * @returns {Promise<Object>} - 登出结果
   */
  logout: async (): Promise<any> => {
    const response = await apiClient.post(endpoints.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>} - 用户信息
   */
  getCurrentUser: async (): Promise<any> => {
    const response = await apiClient.get(endpoints.AUTH.CURRENT_USER);
    return response.data;
  },

  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} - 更新结果
   */
  updateUser: async (userId: string, userData: any): Promise<any> => {
    const response = await apiClient.put(endpoints.AUTH.CURRENT_USER, userData);
    return response.data;
  },

  /**
   * 更新用户密码
   * @param {string} oldPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>} - 更新结果
   */
  updatePassword: async (oldPassword: string, newPassword: string): Promise<any> => {
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
  initTestUsers: async (): Promise<any> => {
    const response = await apiClient.post(endpoints.AUTH.INIT_TEST_USERS);
    return response.data;
  },

  /**
   * 记录用户活动
   * @param {string} activityType - 活动类型
   * @param {string} activityData - 活动数据
   * @returns {Promise<Object>} - 记录结果
   */
  recordActivity: async (activityType: string, activityData?: string): Promise<any> => {
    const url = `${endpoints.AUTH.RECORD_ACTIVITY}?activity_type=${activityType}${activityData ? `&activity_data=${encodeURIComponent(activityData)}` : ''}`;
    const response = await apiClient.post(url);
    return response.data;
  },

  /**
   * 获取用户活动记录
   * @param {number} skip - 跳过的记录数
   * @param {number} limit - 返回的记录数
   * @returns {Promise<PaginatedResponse<ActivityRecord>>} - 活动记录
   */
  getUserActivities: async (skip: number = 0, limit: number = 20): Promise<PaginatedResponse<ActivityRecord>> => {
    const response = await apiClient.get(`${endpoints.AUTH.USER_ACTIVITIES}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * 获取所有学生（仅教师可用）
   * @param {number} skip - 跳过的记录数
   * @param {number} limit - 返回的记录数
   * @returns {Promise<PaginatedResponse<UserProfile>>} - 学生列表
   */
  getAllStudents: async (skip: number = 0, limit: number = 100): Promise<PaginatedResponse<UserProfile>> => {
    const response = await apiClient.get(`${endpoints.AUTH.STUDENTS}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * 获取学生活动记录（仅教师可用）
   * @param {string} studentId - 学生ID
   * @param {number} skip - 跳过的记录数
   * @param {number} limit - 返回的记录数
   * @returns {Promise<PaginatedResponse<ActivityRecord>>} - 学生活动记录
   */
  getStudentActivities: async (studentId: string, skip: number = 0, limit: number = 20): Promise<PaginatedResponse<ActivityRecord>> => {
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
   * @returns {Promise<UserProfile>} - 用户资料数据
   */
  getUserProfile: async (userId: string | number): Promise<UserProfile> => {
    const response = await apiClient.get(endpoints.USER.PROFILE(userId));
    return response.data;
  },

  /**
   * 更新用户资料
   * @param {string} userId - 用户ID
   * @param {Partial<UserProfile>} profileData - 要更新的资料数据
   * @returns {Promise<UserProfile>} - 更新结果
   */
  updateUserProfile: async (userId: string | number, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put(endpoints.USER.PROFILE(userId), profileData);
    return response.data;
  },

  /**
   * 获取用户偏好设置
   * @param {string} userId - 用户ID
   * @returns {Promise<UserPreferences>} - 用户偏好设置数据
   */
  getUserPreferences: async (userId: string | number): Promise<UserPreferences> => {
    const response = await apiClient.get(endpoints.USER.PREFERENCES(userId));
    return response.data;
  },

  /**
   * 更新用户偏好设置
   * @param {string} userId - 用户ID
   * @param {Partial<UserPreferences>} preferencesData - 要更新的偏好设置数据
   * @returns {Promise<UserPreferences>} - 更新结果
   */
  updateUserPreferences: async (userId: string | number, preferencesData: Partial<UserPreferences>): Promise<UserPreferences> => {
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
  uploadAvatar: async (userId: string | number, file: File, onProgress?: (percent: number) => void): Promise<any> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.upload(endpoints.USER.AVATAR(userId), formData, onProgress);
    return response.data;
  },

  /**
   * 获取用户项目列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Array<ProjectData>>} - 项目列表
   */
  getUserProjects: async (userId: string | number): Promise<ProjectData[]> => {
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
   * @returns {Promise<Array<ProjectData>>} - 项目列表
   */
  getProjects: async (userId: string | number): Promise<ProjectData[]> => {
    const response = await apiClient.get(`${endpoints.PROJECT.LIST}?user_id=${userId}`);
    return response.data;
  },

  /**
   * 获取项目详情
   * @param {string} projectId - 项目ID
   * @returns {Promise<ProjectData>} - 项目详情
   */
  getProjectById: async (projectId: string | number): Promise<ProjectData> => {
    const response = await apiClient.get(endpoints.PROJECT.DETAIL(projectId));
    return response.data;
  },

  /**
   * 创建新项目
   * @param {ProjectData} projectData - 项目数据
   * @returns {Promise<ProjectData>} - 创建结果
   */
  createProject: async (projectData: ProjectData): Promise<ProjectData> => {
    const response = await apiClient.post(endpoints.PROJECT.CREATE, projectData);
    return response.data;
  },

  /**
   * 更新项目
   * @param {string} projectId - 项目ID
   * @param {Partial<ProjectData>} projectData - 项目数据
   * @returns {Promise<ProjectData>} - 更新结果
   */
  updateProject: async (projectId: string | number, projectData: Partial<ProjectData>): Promise<ProjectData> => {
    const response = await apiClient.put(endpoints.PROJECT.UPDATE(projectId), projectData);
    return response.data;
  },

  /**
   * 删除项目
   * @param {string} projectId - 项目ID
   * @returns {Promise<Object>} - 删除结果
   */
  deleteProject: async (projectId: string | number): Promise<any> => {
    const response = await apiClient.delete(endpoints.PROJECT.DELETE(projectId));
    return response.data;
  },

  /**
   * 恢复已删除的项目
   * @param {string} projectId - 项目ID
   * @returns {Promise<ProjectData>} - 恢复结果
   */
  restoreProject: async (projectId: string | number): Promise<ProjectData> => {
    const response = await apiClient.post(endpoints.PROJECT.RESTORE(projectId));
    return response.data;
  },

  /**
   * 获取项目文件列表
   * @param {string} projectId - 项目ID
   * @returns {Promise<Array<Object>>} - 文件列表
   */
  getProjectFiles: async (projectId: string | number): Promise<any[]> => {
    const response = await apiClient.get(endpoints.PROJECT.FILES(projectId));
    return response.data;
  },

  /**
   * 获取用户文件列表
   * @param {string} projectId - 项目ID
   * @returns {Promise<Array<Object>>} - 文件列表
   */
  getUserFiles: async (projectId: string | number): Promise<any[]> => {
    const response = await apiClient.get(endpoints.PROJECT.USERFILES(projectId));
    return response.data;
  },

  /**
   * 获取项目文件内容
   * @param {string} projectId - 项目ID
   * @param {string} filePath - 文件路径
   * @returns {Promise<string>} - 文件内容
   */
  getProjectFile: async (projectId: string | number, filePath: string): Promise<string> => {
    const response = await apiClient.get(endpoints.PROJECT.FILE(projectId, filePath));
    return response.data;
  },

  /**
   * 获取用户项目列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Array<ProjectData>>} - 项目列表
   */
  getUserProjects: async (userId: string | number): Promise<ProjectData[]> => {
    const response = await apiClient.get(endpoints.PROJECT.USER_PROJECTS(userId));
    return response.data;
  },

  /**
   * 获取项目构建列表
   * @param {string} projectId - 项目ID
   * @returns {Promise<Array<Object>>} - 构建列表
   */
  getProjectBuilds: async (projectId: string | number): Promise<any[]> => {
    const response = await apiClient.get(endpoints.PROJECT.BUILDS(projectId));
    return response.data;
  },

  /**
   * 获取最新构建
   * @param {string} projectId - 项目ID
   * @returns {Promise<Object>} - 构建信息
   */
  getLatestBuild: async (projectId: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.PROJECT.LATEST_BUILD(projectId));
    return response.data;
  }
};

/**
 * LLM相关API
 */
export const llmAPI = {
  /**
   * 获取LLM提供商列表
   * @returns {Promise<Array<Object>>} - 提供商列表
   */
  getProviders: async (): Promise<any[]> => {
    const response = await apiClient.get(endpoints.LLM.PROVIDERS);
    return response.data;
  },

  /**
   * 生成代码
   * @param {Object} params - 生成参数
   * @returns {Promise<Object>} - 生成结果
   */
  generate: async (params: any): Promise<any> => {
    const response = await apiClient.post(endpoints.LLM.GENERATE, params);
    return response.data;
  },

  /**
   * 流式生成代码
   * @param {Object} params - 生成参数
   * @param {Function} onData - 数据回调函数
   * @returns {Promise<void>}
   */
  generateStream: async (params: any, onData: (data: any) => void): Promise<void> => {
    const response = await fetch(endpoints.LLM.GENERATE_STREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`生成失败: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流读取器');
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.slice(5));
            onData(data);
          } catch (err) {
            console.error('解析流数据错误:', err);
          }
        }
      }
    }
  }
};

/**
 * 进度相关API
 */
export const progressAPI = {
  /**
   * 创建进度记录
   * @param {Object} progressData - 进度数据
   * @returns {Promise<Object>} - 创建结果
   */
  createProgress: async (progressData: any): Promise<any> => {
    const response = await apiClient.post(endpoints.PROGRESS.CREATE, progressData);
    return response.data;
  },

  /**
   * 获取进度记录
   * @param {string} id - 进度ID
   * @returns {Promise<Object>} - 进度记录
   */
  getProgress: async (id: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.PROGRESS.GET(id));
    return response.data;
  },

  /**
   * 获取用户进度
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} - 用户进度
   */
  getUserProgress: async (userId: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.PROGRESS.USER_PROGRESS(userId));
    return response.data;
  },

  /**
   * 获取用户项目进度
   * @param {string} userId - 用户ID
   * @param {string} projectId - 项目ID
   * @returns {Promise<Object>} - 项目进度
   */
  getUserProjectProgress: async (userId: string | number, projectId: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.PROGRESS.USER_PROJECT_PROGRESS(userId, projectId));
    return response.data;
  },

  /**
   * 添加里程碑
   * @param {string} progressId - 进度ID
   * @param {Object} milestoneData - 里程碑数据
   * @returns {Promise<Object>} - 添加结果
   */
  addMilestone: async (progressId: string | number, milestoneData: any): Promise<any> => {
    const response = await apiClient.post(endpoints.PROGRESS.ADD_MILESTONE(progressId), milestoneData);
    return response.data;
  },

  /**
   * 开始里程碑
   * @param {string} progressId - 进度ID
   * @param {string} milestoneId - 里程碑ID
   * @returns {Promise<Object>} - 开始结果
   */
  startMilestone: async (progressId: string | number, milestoneId: string | number): Promise<any> => {
    const response = await apiClient.post(endpoints.PROGRESS.START_MILESTONE(progressId, milestoneId));
    return response.data;
  },

  /**
   * 完成里程碑
   * @param {string} progressId - 进度ID
   * @param {string} milestoneId - 里程碑ID
   * @returns {Promise<Object>} - 完成结果
   */
  completeMilestone: async (progressId: string | number, milestoneId: string | number): Promise<any> => {
    const response = await apiClient.post(endpoints.PROGRESS.COMPLETE_MILESTONE(progressId, milestoneId));
    return response.data;
  },

  /**
   * 失败里程碑
   * @param {string} progressId - 进度ID
   * @param {string} milestoneId - 里程碑ID
   * @returns {Promise<Object>} - 失败结果
   */
  failMilestone: async (progressId: string | number, milestoneId: string | number): Promise<any> => {
    const response = await apiClient.post(endpoints.PROGRESS.FAIL_MILESTONE(progressId, milestoneId));
    return response.data;
  },

  /**
   * 重置里程碑
   * @param {string} progressId - 进度ID
   * @param {string} milestoneId - 里程碑ID
   * @returns {Promise<Object>} - 重置结果
   */
  resetMilestone: async (progressId: string | number, milestoneId: string | number): Promise<any> => {
    const response = await apiClient.post(endpoints.PROGRESS.RESET_MILESTONE(progressId, milestoneId));
    return response.data;
  }
};

/**
 * 内容相关API
 */
export const contentAPI = {
  /**
   * 获取实验列表
   * @returns {Promise<Array<Object>>} - 实验列表
   */
  getExperiments: async (): Promise<any[]> => {
    const response = await apiClient.get(endpoints.CONTENT.EXPERIMENTS);
    return response.data;
  },

  /**
   * 获取实验详情
   * @param {string} id - 实验ID
   * @returns {Promise<Object>} - 实验详情
   */
  getExperimentDetail: async (id: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.CONTENT.EXPERIMENT_DETAIL(id));
    return response.data;
  },

  /**
   * 获取课程列表
   * @returns {Promise<Array<Object>>} - 课程列表
   */
  getCourses: async (): Promise<any[]> => {
    const response = await apiClient.get(endpoints.CONTENT.COURSES);
    return response.data;
  },

  /**
   * 获取课程详情
   * @param {string} id - 课程ID
   * @returns {Promise<Object>} - 课程详情
   */
  getCourseDetail: async (id: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.CONTENT.COURSE_DETAIL(id));
    return response.data;
  }
};

/**
 * 构建相关API
 */
export const buildAPI = {
  /**
   * 创建构建
   * @param {Object} buildData - 构建数据
   * @returns {Promise<Object>} - 创建结果
   */
  createBuild: async (buildData: any): Promise<any> => {
    const response = await apiClient.post(endpoints.BUILD.CREATE, buildData);
    return response.data;
  },

  /**
   * 获取构建信息
   * @param {string} id - 构建ID
   * @returns {Promise<Object>} - 构建信息
   */
  getBuild: async (id: string | number): Promise<any> => {
    const response = await apiClient.get(endpoints.BUILD.GET(id));
    return response.data;
  },

  /**
   * 删除构建
   * @param {string} id - 构建ID
   * @returns {Promise<Object>} - 删除结果
   */
  deleteBuild: async (id: string | number): Promise<any> => {
    const response = await apiClient.delete(endpoints.BUILD.DELETE(id));
    return response.data;
  },

  /**
   * 取消构建
   * @param {string} id - 构建ID
   * @returns {Promise<Object>} - 取消结果
   */
  cancelBuild: async (id: string | number): Promise<any> => {
    const response = await apiClient.post(endpoints.BUILD.CANCEL(id));
    return response.data;
  }
};

export default {
  auth: authAPI,
  user: userAPI,
  project: projectAPI,
  llm: llmAPI,
  progress: progressAPI,
  content: contentAPI,
  build: buildAPI
}; 