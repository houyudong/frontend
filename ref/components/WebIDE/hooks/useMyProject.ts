import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PROJECT_API } from '../constants';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  files: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
    content?: string;
  }>;
}

interface UseMyProjectReturn {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  createProject: (name: string, description: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

/**
 * useMyProject - 项目管理Hook
 * 
 * 用于管理用户的项目列表和当前选中的项目。
 * 
 * @returns {UseMyProjectReturn} 项目状态和操作方法
 */
const useMyProject = (): UseMyProjectReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(PROJECT_API.LIST);
      setProjects(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取项目列表失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (name: string, description: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(PROJECT_API.CREATE, { name, description });
      setProjects(prev => [...prev, response.data]);
    } catch (error) {
      setError(error instanceof Error ? error.message : '创建项目失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.put(`${PROJECT_API.UPDATE}/${id}`, data);
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? { ...project, ...response.data } : project
        )
      );
      if (currentProject?.id === id) {
        setCurrentProject(prev => prev ? { ...prev, ...response.data } : null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新项目失败');
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${PROJECT_API.DELETE}/${id}`);
      setProjects(prev => prev.filter(project => project.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除项目失败');
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const selectProject = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${PROJECT_API.GET}/${id}`);
      setCurrentProject(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取项目详情失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    currentProject,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    refreshProjects: fetchProjects
  };
};

export default useMyProject; 