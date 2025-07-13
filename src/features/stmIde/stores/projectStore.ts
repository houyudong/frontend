import { create } from 'zustand'
import apiService from '../config/apiService'
import configService from '../config/configManager'

interface ProjectInfo {
  id: string
  name: string
  description?: string
  chipModel?: string
  programmingLanguage?: string
  platform?: string
  createdAt?: string
  updatedAt?: string
}

interface SessionData {
  openFiles: Array<{
    path: string
    active: boolean
    cursorPosition?: { line: number; column: number }
  }>
  fileChanges: Record<string, any>
  sessionData: {
    cursorPosition?: { line: number; column: number }
    [key: string]: any
  }
}

interface ProjectStore {
  // 项目信息
  currentProject: ProjectInfo | null
  isLoading: boolean
  error: string | null

  // 会话数据
  sessionData: SessionData | null
  isSessionLoading: boolean

  // 操作方法
  loadProject: (projectId?: string) => Promise<void>
  loadSessionData: (projectId?: string) => Promise<void>
  saveSessionData: (sessionData: Partial<SessionData>) => Promise<void>
  updateProjectInfo: (info: Partial<ProjectInfo>) => void

  // 重置
  reset: () => void
}

const useProjectStore = create<ProjectStore>((set, get) => ({
  // 初始状态
  currentProject: null,
  isLoading: false,
  error: null,
  sessionData: null,
  isSessionLoading: false,

  // 加载项目信息
  loadProject: async (projectId?: string) => {
    const targetProjectId = projectId || 'test' // 使用默认项目ID

    set({ isLoading: true, error: null })

    try {
      console.log('📋 加载项目信息:', targetProjectId)

      // 获取用户ID并调用后端API获取项目信息
      const userId = await configService.getUserId()
      const response = await apiService.getProjectInfo(userId, targetProjectId)

      console.log('📋 API响应数据:', response)

      // 处理响应数据，支持多种数据格式
      let projectData = null
      if (response) {
        if (response.success && response.data) {
          projectData = response.data
        } else if (response.data) {
          projectData = response.data
        } else if (response.name || response.project) {
          projectData = response
        }
      }

      const projectInfo: ProjectInfo = {
        id: targetProjectId,
        name: projectData?.name || projectData?.project || projectData?.project_name || targetProjectId,
        description: projectData?.description || projectData?.project_description || '基于STM32的嵌入式开发项目',
        chipModel: projectData?.chip_model || projectData?.chipModel || projectData?.target_chip || 'STM32F103',
        programmingLanguage: projectData?.programming_language || projectData?.programmingLanguage || projectData?.language || 'C',
        platform: projectData?.platform || projectData?.target_platform || 'STM32',
        createdAt: projectData?.created_at || projectData?.createdAt || projectData?.create_time,
        updatedAt: projectData?.updated_at || projectData?.updatedAt || projectData?.update_time
      }

      set({
        currentProject: projectInfo,
        isLoading: false,
        error: null
      })

      console.log('✅ 项目信息加载成功:', projectInfo)
    } catch (error) {
      console.error('❌ 项目信息加载失败:', error)

      // 使用默认项目信息作为后备
      const fallbackProject: ProjectInfo = {
        id: targetProjectId,
        name: 'STM32项目',
        description: '项目信息加载失败',
        chipModel: 'Unknown',
        programmingLanguage: 'C',
        platform: 'STM32'
      }

      set({
        currentProject: fallbackProject,
        isLoading: false,
        error: error instanceof Error ? error.message : '加载失败'
      })
    }
  },

  // 加载会话数据
  loadSessionData: async (projectId?: string) => {
    const targetProjectId = projectId || get().currentProject?.id || 'test'

    set({ isSessionLoading: true })

    try {
      console.log('💾 加载会话数据:', targetProjectId)

      // 获取用户ID并调用API
      const userId = await configService.getUserId()
      const response = await apiService.getUserFiles(userId, targetProjectId)

      if (response && response.success) {
        const sessionData: SessionData = {
          openFiles: response.data?.open_files || response.open_files || [],
          fileChanges: response.data?.file_changes || response.file_changes || {},
          sessionData: response.data?.session_data || response.session_data || {}
        }

        set({
          sessionData,
          isSessionLoading: false
        })

        console.log('✅ 会话数据加载成功:', sessionData.openFiles.length, '个打开的文件')
        return sessionData
      } else {
        set({
          sessionData: null,
          isSessionLoading: false
        })
        console.log('📝 没有会话数据')
        return null
      }
    } catch (error) {
      console.error('❌ 会话数据加载失败:', error)
      set({
        sessionData: null,
        isSessionLoading: false
      })
      return null
    }
  },

  // 保存会话数据
  saveSessionData: async (newSessionData: Partial<SessionData>) => {
    const { currentProject, sessionData } = get()

    if (!currentProject) {
      console.warn('⚠️ 没有当前项目，无法保存会话数据')
      return
    }

    try {
      const updatedSessionData = {
        ...sessionData,
        ...newSessionData
      }

      console.log('💾 保存会话数据:', currentProject.id)

      // 获取用户ID并保存会话数据
      const userId = await configService.getUserId()
      await apiService.saveUserFiles(userId, currentProject.id, updatedSessionData)

      set({ sessionData: updatedSessionData })

      console.log('✅ 会话数据保存成功')
    } catch (error) {
      console.error('❌ 会话数据保存失败:', error)
    }
  },

  // 更新项目信息
  updateProjectInfo: (info: Partial<ProjectInfo>) => {
    const { currentProject } = get()
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          ...info
        }
      })
    }
  },

  // 重置状态
  reset: () => {
    set({
      currentProject: null,
      isLoading: false,
      error: null,
      sessionData: null,
      isSessionLoading: false
    })
  }
}))

export default useProjectStore
