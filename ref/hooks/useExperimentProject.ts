import { useState, useEffect, useCallback } from 'react';
import { Project, ExperimentApi } from '../../../shared/api/experimentApi';

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: 'source' | 'header' | 'config' | 'documentation' | 'other';
  editable: boolean;
  size: number;
  lastModified: string;
}

export interface ProjectStructure {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: ProjectStructure[];
  size?: number;
  lastModified?: string;
}

export interface UseExperimentProjectState {
  project: Project | null;
  files: ProjectFile[];
  structure: ProjectStructure[];
  loading: boolean;
  error: string | null;
}

export interface UseExperimentProjectActions {
  loadProject: (projectId: string) => Promise<void>;
  loadProjectFiles: (projectId: string) => Promise<void>;
  loadProjectStructure: (projectId: string) => Promise<void>;
  refreshProject: () => Promise<void>;
  clearError: () => void;
}

export interface UseExperimentProjectReturn extends UseExperimentProjectState, UseExperimentProjectActions {}

/**
 * 实验项目管理Hook
 * 提供项目详情、文件结构和内容的状态管理
 */
export const useExperimentProject = (projectId?: string): UseExperimentProjectReturn => {
  const [state, setState] = useState<UseExperimentProjectState>({
    project: null,
    files: [],
    structure: [],
    loading: false,
    error: null,
  });

  // 加载项目详情
  const loadProject = useCallback(async (projectId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const project = await ExperimentApi.getProjectById('user-id', projectId);
      setState(prev => ({ ...prev, project, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load project',
        loading: false
      }));
    }
  }, []);

  // 加载项目文件
  const loadProjectFiles = useCallback(async (projectId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // 模拟项目文件数据
      const mockFiles: ProjectFile[] = [
        {
          name: 'main.c',
          path: '/src/main.c',
          content: `#include "main.h"

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, GPIO_PIN_SET);
    HAL_Delay(500);
    HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, GPIO_PIN_RESET);
    HAL_Delay(500);
  }
}`,
          type: 'source',
          editable: true,
          size: 256,
          lastModified: new Date().toISOString()
        },
        {
          name: 'main.h',
          path: '/inc/main.h',
          content: `#ifndef __MAIN_H
#define __MAIN_H

#include "stm32f1xx_hal.h"

#define LED_Pin GPIO_PIN_5
#define LED_GPIO_Port GPIOA

void SystemClock_Config(void);
void MX_GPIO_Init(void);

#endif`,
          type: 'header',
          editable: true,
          size: 128,
          lastModified: new Date().toISOString()
        }
      ];

      setState(prev => ({ ...prev, files: mockFiles, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load project files',
        loading: false
      }));
    }
  }, []);

  // 加载项目结构
  const loadProjectStructure = useCallback(async (projectId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // 模拟项目结构数据
      const mockStructure: ProjectStructure[] = [
        {
          name: 'src',
          type: 'directory',
          path: '/src',
          children: [
            {
              name: 'main.c',
              type: 'file',
              path: '/src/main.c',
              size: 256,
              lastModified: new Date().toISOString()
            }
          ]
        },
        {
          name: 'inc',
          type: 'directory',
          path: '/inc',
          children: [
            {
              name: 'main.h',
              type: 'file',
              path: '/inc/main.h',
              size: 128,
              lastModified: new Date().toISOString()
            }
          ]
        }
      ];

      setState(prev => ({ ...prev, structure: mockStructure, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load project structure',
        loading: false
      }));
    }
  }, []);

  // 刷新项目数据
  const refreshProject = useCallback(async () => {
    if (projectId) {
      await Promise.all([
        loadProject(projectId),
        loadProjectFiles(projectId),
        loadProjectStructure(projectId)
      ]);
    }
  }, [projectId, loadProject, loadProjectFiles, loadProjectStructure]);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 自动加载数据
  useEffect(() => {
    if (projectId) {
      refreshProject();
    }
  }, [projectId, refreshProject]);

  return {
    ...state,
    loadProject,
    loadProjectFiles,
    loadProjectStructure,
    refreshProject,
    clearError,
  };
};
