/**
 * 项目服务 - 管理项目信息和文件路径
 * 基于Backend API的项目管理功能
 */

import { getBackendApiUrl } from '../config'
import configService from '../config/configManager'
import databaseService, { DatabaseProject } from './database'

// 项目信息接口
export interface ProjectInfo {
  id: string
  name: string
  description?: string
  userId: string
  createdAt?: string
  updatedAt?: string
  status?: 'active' | 'archived' | 'deleted'
  settings?: {
    targetChip?: string
    compilerFlags?: string[]
    debugConfig?: any
  }
}

// 项目状态接口
interface ProjectState {
  currentProject: ProjectInfo | null
  projects: ProjectInfo[]
  isLoading: boolean
  lastError: string | null
}

/**
 * 项目服务类
 */
class ProjectService {
  private state: ProjectState = {
    currentProject: null,
    projects: [],
    isLoading: false,
    lastError: null
  }

  private eventHandlers = {
    projectChanged: [] as Array<(project: ProjectInfo | null) => void>,
    projectsUpdated: [] as Array<(projects: ProjectInfo[]) => void>,
    error: [] as Array<(error: string) => void>
  }

  constructor() {
    this.initializeProject()
  }

  /**
   * 初始化项目信息
   */
  private async initializeProject(): Promise<void> {
    // 从localStorage获取当前项目
    const savedProject = this.loadProjectFromStorage()
    if (savedProject) {
      this.state.currentProject = savedProject
      this.emit('projectChanged', savedProject)
    } else {
      // 从数据库获取默认项目
      await this.loadDefaultProjectFromDatabase()
    }

    // 加载项目列表
    await this.loadProjects()
  }

  /**
   * 从数据库加载默认项目
   */
  private async loadDefaultProjectFromDatabase(): Promise<void> {
    try {
      const currentUser = userService.getCurrentUser()
      if (!currentUser) {
        console.warn('没有当前用户，无法加载项目')
        this.setFallbackProject()
        return
      }

      const dbProject = await databaseService.getUserDefaultProject(currentUser.id)
      if (dbProject) {
        const project: ProjectInfo = this.convertDatabaseProjectToProjectInfo(dbProject)

        this.state.currentProject = project
        this.saveProjectToStorage(project)
        this.emit('projectChanged', project)

        console.log('📁 从数据库加载项目:', project)
      } else {
        console.warn('用户没有可用项目')
        this.setFallbackProject()
      }
    } catch (error) {
      console.error('从数据库加载项目失败:', error)
      this.setFallbackProject()
    }
  }

  /**
   * 设置回退项目
   */
  private async setFallbackProject(): Promise<void> {
    try {
      // 尝试从配置服务获取默认配置
      const config = await configService.getConfig()
      const userId = config.currentUser?.id || userService.getUserId() || 'fallback-user'

      const fallbackProject: ProjectInfo = {
        id: 'fallback-project',
        name: 'STM32F103_Demo',
        description: 'STM32F103 演示项目',
        userId: userId,
        status: 'active',
        settings: {
          targetChip: 'STM32F103C8T6',
          compilerFlags: ['-mcpu=cortex-m3', '-std=gnu11', '-DUSE_HAL_DRIVER', '-DSTM32F103xE']
        }
      }

      this.state.currentProject = fallbackProject
      this.saveProjectToStorage(fallbackProject)
      this.emit('projectChanged', fallbackProject)

      console.log('⚠️ 使用回退项目:', fallbackProject)
    } catch (error) {
      console.error('设置回退项目失败:', error)
      // 如果配置服务也失败，使用最基本的回退
      const basicFallback: ProjectInfo = {
        id: 'basic-fallback',
        name: 'Basic Project',
        description: '基础回退项目',
        userId: 'fallback-user',
        status: 'active',
        settings: {
          targetChip: 'STM32F103C8T6',
          compilerFlags: ['-mcpu=cortex-m3', '-std=gnu11']
        }
      }

      this.state.currentProject = basicFallback
      this.emit('projectChanged', basicFallback)
    }
  }

  /**
   * 转换数据库项目为项目信息
   */
  private convertDatabaseProjectToProjectInfo(dbProject: DatabaseProject): ProjectInfo {
    return {
      id: dbProject.id,
      name: dbProject.id, // 使用ID作为名称
      description: dbProject.description || '',
      userId: dbProject.user_id,
      status: dbProject.is_active ? 'active' : 'archived',
      createdAt: dbProject.created_at,
      updatedAt: dbProject.updated_at,
      settings: {
        targetChip: dbProject.chip_model,
        compilerFlags: this.getCompilerFlags(dbProject.chip_model),
        debugConfig: dbProject.project_config
      }
    }
  }

  /**
   * 根据芯片型号获取编译器标志
   */
  private getCompilerFlags(chipModel: string): string[] {
    if (chipModel.includes('STM32F1')) {
      return ['-mcpu=cortex-m3', '-std=gnu11', '-DUSE_HAL_DRIVER', '-DSTM32F103xE']
    } else if (chipModel.includes('STM32F4')) {
      return ['-mcpu=cortex-m4', '-std=gnu11', '-DUSE_HAL_DRIVER', '-DSTM32F407xx']
    } else if (chipModel.includes('STM32H7')) {
      return ['-mcpu=cortex-m7', '-std=gnu11', '-DUSE_HAL_DRIVER', '-DSTM32H743xx']
    } else {
      return ['-mcpu=cortex-m3', '-std=gnu11', '-DUSE_HAL_DRIVER', '-DSTM32F103xE']
    }
  }

  /**
   * 从localStorage加载项目信息
   */
  private loadProjectFromStorage(): ProjectInfo | null {
    try {
      const projectJson = localStorage.getItem('stm32ide_current_project')
      if (projectJson) {
        return JSON.parse(projectJson)
      }
    } catch (error) {
      console.error('加载项目信息失败:', error)
    }
    return null
  }

  /**
   * 保存项目信息到localStorage
   */
  private saveProjectToStorage(project: ProjectInfo): void {
    try {
      localStorage.setItem('stm32ide_current_project', JSON.stringify(project))
    } catch (error) {
      console.error('保存项目信息失败:', error)
    }
  }

  /**
   * 清除项目信息
   */
  private clearProjectFromStorage(): void {
    try {
      localStorage.removeItem('stm32ide_current_project')
    } catch (error) {
      console.error('清除项目信息失败:', error)
    }
  }

  /**
   * 加载项目列表
   */
  async loadProjects(): Promise<ProjectInfo[]> {
    const userId = userService.getUserId()
    if (!userId) {
      return []
    }

    this.state.isLoading = true
    this.state.lastError = null

    try {
      const response = await fetch(`${getBackendApiUrl()}/users/${userId}/projects`)

      if (response.ok) {
        const projectsData = await response.json()
        const projects: ProjectInfo[] = projectsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          userId: p.user_id || p.userId,
          createdAt: p.created_at || p.createdAt,
          updatedAt: p.updated_at || p.updatedAt,
          status: p.status || 'active',
          settings: p.settings
        }))

        this.state.projects = projects
        this.emit('projectsUpdated', projects)

        console.log(`📁 加载了 ${projects.length} 个项目`)
        return projects
      } else {
        throw new Error(`加载项目列表失败: ${response.statusText}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载项目列表失败'
      this.state.lastError = errorMessage
      this.emit('error', errorMessage)
      console.error('❌ 加载项目列表失败:', errorMessage)
      return []
    } finally {
      this.state.isLoading = false
    }
  }

  /**
   * 创建新项目
   */
  async createProject(projectData: Omit<ProjectInfo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ProjectInfo | null> {
    const userId = userService.getUserId()
    if (!userId) {
      this.emit('error', '用户未登录')
      return null
    }

    this.state.isLoading = true

    try {
      const response = await fetch(`${getBackendApiUrl()}/users/${userId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...projectData,
          user_id: userId
        })
      })

      if (response.ok) {
        const projectData = await response.json()
        const project: ProjectInfo = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          userId: projectData.user_id,
          createdAt: projectData.created_at,
          updatedAt: projectData.updated_at,
          status: projectData.status || 'active',
          settings: projectData.settings
        }

        // 更新项目列表
        this.state.projects.push(project)
        this.emit('projectsUpdated', this.state.projects)

        console.log('✅ 项目创建成功:', project)
        return project
      } else {
        throw new Error(`创建项目失败: ${response.statusText}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建项目失败'
      this.state.lastError = errorMessage
      this.emit('error', errorMessage)
      console.error('❌ 创建项目失败:', errorMessage)
      return null
    } finally {
      this.state.isLoading = false
    }
  }

  /**
   * 切换当前项目
   */
  async switchProject(projectId: string): Promise<boolean> {
    const project = this.state.projects.find(p => p.id === projectId)
    if (!project) {
      this.emit('error', '项目不存在')
      return false
    }

    this.state.currentProject = project
    this.saveProjectToStorage(project)
    this.emit('projectChanged', project)

    console.log('📁 切换到项目:', project.name)
    return true
  }

  /**
   * 更新项目信息
   */
  async updateProject(projectId: string, updates: Partial<ProjectInfo>): Promise<boolean> {
    const userId = userService.getUserId()
    if (!userId) {
      return false
    }

    try {
      const response = await fetch(`${getBackendApiUrl()}/users/${userId}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        // 更新本地项目信息
        const projectIndex = this.state.projects.findIndex(p => p.id === projectId)
        if (projectIndex >= 0) {
          this.state.projects[projectIndex] = { ...this.state.projects[projectIndex], ...updates }
          this.emit('projectsUpdated', this.state.projects)
        }

        // 如果是当前项目，也更新当前项目
        if (this.state.currentProject?.id === projectId) {
          this.state.currentProject = { ...this.state.currentProject, ...updates }
          this.saveProjectToStorage(this.state.currentProject)
          this.emit('projectChanged', this.state.currentProject)
        }

        return true
      }
    } catch (error) {
      console.error('更新项目失败:', error)
    }

    return false
  }

  /**
   * 删除项目
   */
  async deleteProject(projectId: string): Promise<boolean> {
    const userId = userService.getUserId()
    if (!userId) {
      return false
    }

    try {
      const response = await fetch(`${getBackendApiUrl()}/users/${userId}/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // 从项目列表中移除
        this.state.projects = this.state.projects.filter(p => p.id !== projectId)
        this.emit('projectsUpdated', this.state.projects)

        // 如果删除的是当前项目，清除当前项目
        if (this.state.currentProject?.id === projectId) {
          this.state.currentProject = null
          this.clearProjectFromStorage()
          this.emit('projectChanged', null)
        }

        return true
      }
    } catch (error) {
      console.error('删除项目失败:', error)
    }

    return false
  }

  // 文件下载功能已移至 fileDownloadService
  // 项目服务专注于项目管理功能

  /**
   * 事件监听器
   */
  on(event: 'projectChanged', handler: (project: ProjectInfo | null) => void): void
  on(event: 'projectsUpdated', handler: (projects: ProjectInfo[]) => void): void
  on(event: 'error', handler: (error: string) => void): void
  on(event: string, handler: any): void {
    if (this.eventHandlers[event as keyof typeof this.eventHandlers]) {
      this.eventHandlers[event as keyof typeof this.eventHandlers].push(handler)
    }
  }

  /**
   * 移除事件监听器
   */
  off(event: string, handler: any): void {
    const handlers = this.eventHandlers[event as keyof typeof this.eventHandlers]
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers[event as keyof typeof this.eventHandlers]
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`项目事件处理器错误 [${event}]:`, error)
        }
      })
    }
  }

  /**
   * 获取当前项目
   */
  getCurrentProject(): ProjectInfo | null {
    return this.state.currentProject
  }

  /**
   * 获取当前项目ID
   */
  getCurrentProjectId(): string | null {
    return this.state.currentProject?.id || null
  }

  /**
   * 获取项目列表
   */
  getProjects(): ProjectInfo[] {
    return [...this.state.projects]
  }

  /**
   * 检查是否正在加载
   */
  isLoading(): boolean {
    return this.state.isLoading
  }

  /**
   * 获取最后的错误
   */
  getLastError(): string | null {
    return this.state.lastError
  }

  /**
   * 获取状态
   */
  getState(): ProjectState {
    return { ...this.state }
  }
}

// 创建全局实例
const projectService = new ProjectService()

export default projectService
