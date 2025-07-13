import axios from 'axios';
import { FILE_API } from '../constants';

interface File {
  id: string;
  name: string;
  path: string;
  type: string;
  content?: string;
}

interface FileResponse {
  success: boolean;
  data: File;
  error?: string;
}

/**
 * 创建文件
 * @param {string} workspaceId - 工作区ID
 * @param {string} name - 文件名
 * @param {string} content - 文件内容
 * @returns {Promise<FileResponse>} 文件响应
 */
export const createFile = async (
  workspaceId: string,
  name: string,
  content: string
): Promise<FileResponse> => {
  try {
    const response = await axios.post(FILE_API.CREATE, {
      workspaceId,
      name,
      content
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as File,
      error: error instanceof Error ? error.message : '创建文件失败'
    };
  }
};

/**
 * 获取文件列表
 * @param {string} workspaceId - 工作区ID
 * @returns {Promise<FileResponse>} 文件响应
 */
export const getFiles = async (workspaceId: string): Promise<FileResponse> => {
  try {
    const response = await axios.get(`${FILE_API.LIST}/${workspaceId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as File,
      error: error instanceof Error ? error.message : '获取文件列表失败'
    };
  }
};

/**
 * 获取文件内容
 * @param {string} fileId - 文件ID
 * @returns {Promise<FileResponse>} 文件响应
 */
export const getFileContent = async (fileId: string): Promise<FileResponse> => {
  try {
    const response = await axios.get(`${FILE_API.GET_CONTENT}/${fileId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as File,
      error: error instanceof Error ? error.message : '获取文件内容失败'
    };
  }
};

/**
 * 更新文件
 * @param {string} fileId - 文件ID
 * @param {Partial<File>} data - 文件数据
 * @returns {Promise<FileResponse>} 文件响应
 */
export const updateFile = async (
  fileId: string,
  data: Partial<File>
): Promise<FileResponse> => {
  try {
    const response = await axios.put(`${FILE_API.UPDATE}/${fileId}`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as File,
      error: error instanceof Error ? error.message : '更新文件失败'
    };
  }
};

/**
 * 删除文件
 * @param {string} fileId - 文件ID
 * @returns {Promise<FileResponse>} 文件响应
 */
export const deleteFile = async (fileId: string): Promise<FileResponse> => {
  try {
    const response = await axios.delete(`${FILE_API.DELETE}/${fileId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: {} as File,
      error: error instanceof Error ? error.message : '删除文件失败'
    };
  }
}; 