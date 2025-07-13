import { useState, useCallback } from 'react';
import axios from 'axios';
import { PROJECT_API } from '../constants/api';

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ProjectFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: ProjectFile[];
}

interface UseWorkspaceReturn {
  projects: Project[];
  currentProject: Project | null;
  projectFiles: ProjectFile[];
  currentFile: ProjectFile | null;
  fileContent: string;
  isLoading: boolean;
  error: Error | null;
  expandedDirs: Record<string, boolean>;
  fetchProjects: (userId: string) => Promise<void>;
  createProject: (userId: string, projectName: string) => Promise<void>;
  openProject: (userId: string, projectId: string) => Promise<void>;
  createNewFile: (userId: string, projectName: string, fileName: string, content?: string, directory?: string) => Promise<void>;
  createNewFolder: (userId: string, projectName: string, folderName: string, parentDir?: string) => Promise<void>;
  deleteFile: (userId: string, projectName: string, filePath: string) => Promise<void>;
  deleteFolder: (userId: string, projectName: string, folderPath: string) => Promise<void>;
  renameFile: (userId: string, projectName: string, oldPath: string, newPath: string) => Promise<void>;
  renameFolder: (userId: string, projectName: string, oldPath: string, newPath: string) => Promise<void>;
  toggleDirectory: (path: string) => void;
}

/**
 * useWorkspace - 工作区管理钩子
 * 
 * 提供项目和工作区文件的管理功能，包括：
 * - 项目列表获取
 * - 项目创建和打开
 * - 文件和文件夹的创建、删除、重命名
 * - 目录展开/折叠状态管理
 * 
 * @returns {UseWorkspaceReturn} 工作区管理相关状态和方法
 */
export const useWorkspace = (): UseWorkspaceReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [currentFile, setCurrentFile] = useState<ProjectFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({});

  // 获取项目列表
  const fetchProjects = useCallback(async (userId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get(PROJECT_API.GET_PROJECTS(userId));
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('获取项目列表失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 创建新项目
  const createProject = useCallback(async (userId: string, projectName: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post(PROJECT_API.CREATE_PROJECT(userId), {
        name: projectName
      });
      setProjects(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('创建项目失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 打开项目
  const openProject = useCallback(async (userId: string, projectId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get(PROJECT_API.GET_PROJECT(userId, projectId));
      setCurrentProject(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('打开项目失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 创建新文件
  const createNewFile = useCallback(async (
    userId: string,
    projectName: string,
    fileName: string,
    content: string = '',
    directory: string = ''
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post(PROJECT_API.CREATE_FILE(userId, projectName), {
        name: fileName,
        content,
        directory
      });
      setProjectFiles(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('创建文件失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 创建新文件夹
  const createNewFolder = useCallback(async (
    userId: string,
    projectName: string,
    folderName: string,
    parentDir: string = ''
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post(PROJECT_API.CREATE_FOLDER(userId, projectName), {
        name: folderName,
        directory: parentDir
      });
      setProjectFiles(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('创建文件夹失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 删除文件
  const deleteFile = useCallback(async (
    userId: string,
    projectName: string,
    filePath: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.delete(PROJECT_API.DELETE_FILE(userId, projectName, filePath));
      setProjectFiles(prev => prev.filter(file => file.path !== filePath));
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('删除文件失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 删除文件夹
  const deleteFolder = useCallback(async (
    userId: string,
    projectName: string,
    folderPath: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.delete(PROJECT_API.DELETE_FOLDER(userId, projectName, folderPath));
      setProjectFiles(prev => prev.filter(file => !file.path.startsWith(folderPath)));
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('删除文件夹失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 重命名文件
  const renameFile = useCallback(async (
    userId: string,
    projectName: string,
    oldPath: string,
    newPath: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.put(PROJECT_API.RENAME_FILE(userId, projectName), {
        oldPath,
        newPath
      });
      setProjectFiles(prev => prev.map(file =>
        file.path === oldPath ? { ...file, path: newPath } : file
      ));
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('重命名文件失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 重命名文件夹
  const renameFolder = useCallback(async (
    userId: string,
    projectName: string,
    oldPath: string,
    newPath: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.put(PROJECT_API.RENAME_FOLDER(userId, projectName), {
        oldPath,
        newPath
      });
      setProjectFiles(prev => prev.map(file =>
        file.path.startsWith(oldPath)
          ? { ...file, path: file.path.replace(oldPath, newPath) }
          : file
      ));
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('重命名文件夹失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 切换目录展开/折叠状态
  const toggleDirectory = useCallback((path: string): void => {
    setExpandedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  }, []);

  return {
    projects,
    currentProject,
    projectFiles,
    currentFile,
    fileContent,
    isLoading,
    error,
    expandedDirs,
    fetchProjects,
    createProject,
    openProject,
    createNewFile,
    createNewFolder,
    deleteFile,
    deleteFolder,
    renameFile,
    renameFolder,
    toggleDirectory
  };
}; 