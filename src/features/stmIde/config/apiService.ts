/**
 * API 服务 - 重构版本，移除硬编码，使用动态配置
 * 移动到config目录，作为配置相关的服务
 */

import { getBackendBaseUrl, config } from './index'
import { handleNetworkError, handleFileError } from '../utils/errorHandler'

class ApiService {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = getBackendBaseUrl()
    this.headers = config.development.defaultHeaders
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text() as unknown as T
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw handleNetworkError(error)
      } else {
        throw handleFileError(error as Error)
      }
    }
  }

  /**
   * 动态构建API端点 - 需要用户ID和项目ID
   */
  private buildEndpoint(template: string, userId: string, projectId: string): string {
    return template
      .replace('{userId}', userId)
      .replace('{projectId}', projectId)
  }

  // 文件相关 API - 需要传入用户ID和项目ID
  async getFiles(userId: string, projectId: string, path?: string): Promise<any> {
    let endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/files', userId, projectId)

    if (path) {
      endpoint += `?path=${encodeURIComponent(path)}`
    }

    console.log('📁 获取文件列表:', path || '根目录')
    return this.request(endpoint)
  }

  async createFile(userId: string, projectId: string, parentPath: string, fileName: string, content: string = ''): Promise<any> {
    const filePath = parentPath ? `${parentPath}/${fileName}` : fileName
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/files/create', userId, projectId)

    console.log('📄 创建文件:', filePath)

    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        file_path: filePath,  // Backend期望的字段名
        content: content
      })
    })
  }

  async createFolder(userId: string, projectId: string, parentPath: string, folderName: string): Promise<any> {
    const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/directories/create', userId, projectId)

    console.log('📁 创建文件夹:', folderPath)

    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        dir_path: folderPath  // Backend期望的字段名
      })
    })
  }

  async deleteFile(userId: string, projectId: string, filePath: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/files/delete', userId, projectId)

    console.log('🗑️ 删除文件:', filePath)

    return this.request(endpoint, {
      method: 'POST',  // Backend使用POST方法
      body: JSON.stringify({
        file_path: filePath  // Backend期望的字段名
      })
    })
  }

  async renameFile(userId: string, projectId: string, oldPath: string, newName: string): Promise<any> {
    const pathParts = oldPath.split('/')
    pathParts[pathParts.length - 1] = newName
    const newPath = pathParts.join('/')

    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/files/rename', userId, projectId)

    console.log('✏️ 重命名文件:', oldPath, '->', newPath)

    return this.request(endpoint, {
      method: 'POST',  // Backend使用POST方法
      body: JSON.stringify({
        old_path: oldPath,  // Backend期望的字段名
        new_path: newPath   // Backend期望的字段名
      })
    })
  }

  async getFileContent(userId: string, projectId: string, filePath: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/files/get', userId, projectId)

    console.log('📖 获取文件内容:', filePath)

    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        file_path: filePath  // Backend期望的字段名
      })
    })
  }

  async saveFileContent(userId: string, projectId: string, filePath: string, content: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/files/save', userId, projectId)

    console.log('💾 保存文件内容:', filePath)

    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        file_path: filePath,  // Backend期望的字段名
        content: content
      })
    })
  }

  // 编译相关 API
  async compileProject(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/compile', userId, projectId)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  async cleanProject(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/clean', userId, projectId)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  // 调试相关 API
  async startDebug(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/debug/start', userId, projectId)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  // 符号搜索 API
  async searchSymbol(userId: string, projectId: string, symbol: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/symbols/search', userId, projectId)
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symbol })
    })
  }

  async stopDebug(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/debug/stop', userId, projectId)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  async debugStep(userId: string, projectId: string, action: 'continue' | 'step-over' | 'step-into' | 'step-out'): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/debug/{action}', userId, projectId)
      .replace('{action}', action)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  // 设备相关 API
  async getDeviceStatus(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/device/status', userId, projectId)
    return this.request(endpoint)
  }

  async connectDevice(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/device/connect', userId, projectId)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  async disconnectDevice(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/device/disconnect', userId, projectId)
    return this.request(endpoint, {
      method: 'POST'
    })
  }

  // 项目信息相关 API
  async getProjectInfo(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}', userId, projectId)

    console.log('📋 获取项目信息:', projectId)
    return this.request(endpoint)
  }

  async getProjectConfig(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/config', userId, projectId)

    console.log('📋 获取项目配置:', projectId)
    return this.request(endpoint)
  }

  async getUserFiles(userId: string, projectId: string): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/userfiles', userId, projectId)

    console.log('💾 获取用户文件会话数据:', projectId)
    return this.request(endpoint, {
      method: 'GET'
    })
  }

  async saveUserFiles(userId: string, projectId: string, sessionData: any): Promise<any> {
    const endpoint = this.buildEndpoint('/api/users/{userId}/projects/{projectId}/userfiles', userId, projectId)

    console.log('💾 保存用户文件会话数据:', projectId)

    return this.request(endpoint, {
      method: 'PUT', // Backend使用PUT方法更新
      body: JSON.stringify(sessionData)
    })
  }

  // 更新认证头
  updateHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers }
  }
}

// 创建全局实例
const apiService = new ApiService()

export default apiService
