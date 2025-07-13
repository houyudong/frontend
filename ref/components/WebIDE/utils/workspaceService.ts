import axios from 'axios';
import { WORKSPACE_API } from '../constants';

interface Workspace {
  id: string;
  name: string;
  path: string;
  files: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
  }>;
}

interface WorkspaceResponse {
  success: boolean;
  data: Workspace;
  error?: string;
}

/**
 * 创建工作区
 * @param {string} name - 工作区名称
 * @returns {Promise<WorkspaceResponse>} 工作区响应
 */
export const createWorkspace = async (name: string): Promise<WorkspaceResponse> => {
  try {
    const response = await axios.post(WORKSPACE_API.CREATE, { name });
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as Workspace,
      error: error instanceof Error ? error.message : '创建工作区失败'
    };
  }
};

/**
 * 获取工作区列表
 * @returns {Promise<WorkspaceResponse>} 工作区响应
 */
export const getWorkspaces = async (): Promise<WorkspaceResponse> => {
  try {
    const response = await axios.get(WORKSPACE_API.LIST);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as Workspace,
      error: error instanceof Error ? error.message : '获取工作区列表失败'
    };
  }
};

/**
 * 获取工作区详情
 * @param {string} id - 工作区ID
 * @returns {Promise<WorkspaceResponse>} 工作区响应
 */
export const getWorkspace = async (id: string): Promise<WorkspaceResponse> => {
  try {
    const response = await axios.get(`${WORKSPACE_API.GET}/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as Workspace,
      error: error instanceof Error ? error.message : '获取工作区详情失败'
    };
  }
};

/**
 * 更新工作区
 * @param {string} id - 工作区ID
 * @param {Partial<Workspace>} data - 工作区数据
 * @returns {Promise<WorkspaceResponse>} 工作区响应
 */
export const updateWorkspace = async (
  id: string,
  data: Partial<Workspace>
): Promise<WorkspaceResponse> => {
  try {
    const response = await axios.put(`${WORKSPACE_API.UPDATE}/${id}`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as Workspace,
      error: error instanceof Error ? error.message : '更新工作区失败'
    };
  }
};

/**
 * 删除工作区
 * @param {string} id - 工作区ID
 * @returns {Promise<WorkspaceResponse>} 工作区响应
 */
export const deleteWorkspace = async (id: string): Promise<WorkspaceResponse> => {
  try {
    const response = await axios.delete(`${WORKSPACE_API.DELETE}/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as Workspace,
      error: error instanceof Error ? error.message : '删除工作区失败'
    };
  }
}; 