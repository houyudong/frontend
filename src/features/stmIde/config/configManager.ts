/**
 * 简化配置服务 - 测试阶段专用
 * 移除所有不必要的复杂功能，专注核心需求
 */

import { config } from './index'

/**
 * 简化的配置管理服务类 - 测试阶段专用
 */
class ConfigManagerService {
  // 测试阶段固定配置
  private readonly TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000'
  private readonly TEST_PROJECT_ID = 'test'

  /**
   * 获取当前用户ID
   */
  async getUserId(): Promise<string> {
    return this.TEST_USER_ID
  }

  /**
   * 获取当前项目ID
   */
  async getProjectId(): Promise<string> {
    return this.TEST_PROJECT_ID
  }

  /**
   * 获取Backend API基础URL
   */
  async getBackendUrl(): Promise<string> {
    const { host, port, protocol, apiPrefix } = config.backend
    return `${protocol}://${host}:${port}${apiPrefix}`
  }

  /**
   * 获取STMClient URL
   */
  async getSTMClientUrl(): Promise<string> {
    const { host, port, protocol } = config.stmClient
    return `${protocol}://${host}:${port}`
  }

  /**
   * 获取WebSocket URL
   */
  async getWebSocketUrl(): Promise<string> {
    const { host, port, wsProtocol } = config.stmClient
    return `${wsProtocol}://${host}:${port}/ws`
  }

  /**
   * 构建API端点URL - 自动替换占位符
   */
  async getApiEndpoint(template: string): Promise<string> {
    const userId = this.TEST_USER_ID
    const projectId = this.TEST_PROJECT_ID
    const baseUrl = await this.getBackendUrl()

    return template
      .replace('{userId}', userId)
      .replace('{projectId}', projectId)
      .replace('{baseUrl}', baseUrl)
  }

  /**
   * 获取认证头
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    return {
      'Content-Type': 'application/json',
      'X-Bypass-Auth': 'true',
      'X-User-ID': this.TEST_USER_ID,
      'X-Project-ID': this.TEST_PROJECT_ID,
      'Authorization': `Bearer dev-token-${this.TEST_USER_ID}`,
      'X-Device-ID': 'stmide-client-001'
    }
  }

  /**
   * 获取文件路径配置
   */
  async getFilePaths(): Promise<{ hexFile: string; elfFile: string; binFile: string }> {
    return {
      hexFile: 'build/firmware.hex',
      elfFile: 'build/firmware.elf',  // 修正为与debug工程一致的文件名
      binFile: 'build/firmware.bin'
    }
  }

  async getDeviceConfig(): Promise<{
    linkType: string
    chipFamily: string
    transportMode: string
    verify: boolean
  }> {
    return {
      linkType: 'stlink',
      chipFamily: 'stm32f1x',
      transportMode: 'swd',
      verify: true
    }
  }

  async getFlashConfig(autoRun: boolean = true): Promise<{
    link_type: string
    chip_family: string
    verify: boolean
    auto_run: boolean
  }> {
    const deviceConfig = await this.getDeviceConfig()
    return {
      link_type: deviceConfig.linkType,
      chip_family: deviceConfig.chipFamily,
      verify: deviceConfig.verify,
      auto_run: autoRun
    }
  }

  async getDebugConfig(): Promise<{
    link_type: string
    chip_family: string
    transport_mode: string
  }> {
    const deviceConfig = await this.getDeviceConfig()
    return {
      link_type: deviceConfig.linkType,
      chip_family: deviceConfig.chipFamily,
      transport_mode: deviceConfig.transportMode
    }
  }

  /**
   * 获取编译相关配置
   */
  async getCompileConfig(): Promise<{
    endpoint: string
    statusEndpoint: string
    headers: Record<string, string>
  }> {
    const compileEndpoint = await this.getApiEndpoint('{baseUrl}/users/{userId}/projects/{projectId}/compile')
    const statusEndpoint = await this.getApiEndpoint('{baseUrl}/users/{userId}/projects/{projectId}/compile-status')
    const headers = await this.getAuthHeaders()

    return {
      endpoint: compileEndpoint,
      statusEndpoint: statusEndpoint,
      headers: headers
    }
  }

  /**
   * 获取文件下载URL
   */
  async getFileDownloadUrl(filePath: string): Promise<string> {
    const template = '{baseUrl}/users/{userId}/projects/{projectId}/files/download?path=' + encodeURIComponent(filePath)
    return this.getApiEndpoint(template)
  }

  /**
   * 获取HEX文件下载URL
   */
  async getHexFileUrl(): Promise<string> {
    const filePaths = await this.getFilePaths()
    return this.getFileDownloadUrl(filePaths.hexFile)
  }

  /**
   * 获取ELF文件下载URL
   */
  async getElfFileUrl(): Promise<string> {
    const filePaths = await this.getFilePaths()
    return this.getFileDownloadUrl(filePaths.elfFile)
  }

  /**
   * 检查是否为开发模式
   */
  async isDevelopmentMode(): Promise<boolean> {
    return true // 测试阶段始终为开发模式
  }

  /**
   * 检查是否启用测试模式
   */
  async isTestMode(): Promise<boolean> {
    return true // 测试阶段始终为测试模式
  }

  /**
   * 验证配置完整性
   */
  async validateConfig(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    try {
      // 简单验证
      if (!this.TEST_USER_ID) {
        errors.push('缺少用户ID')
      }

      if (!this.TEST_PROJECT_ID) {
        errors.push('缺少项目ID')
      }

      const backendUrl = await this.getBackendUrl()
      if (!backendUrl) {
        errors.push('缺少Backend URL配置')
      }

    } catch (error) {
      errors.push(`配置验证失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }

    return {
      valid: errors.length === 0,
      errors: errors
    }
  }

  /**
   * 获取配置统计信息
   */
  getStats(): any {
    return {
      initialized: true,
      currentUser: this.TEST_USER_ID,
      currentProject: this.TEST_PROJECT_ID,
      environment: 'development'
    }
  }

  // ========== 兼容性方法（保持API一致性）==========

  /**
   * 初始化（空实现，保持兼容性）
   */
  async initialize(): Promise<void> {
    // 测试阶段不需要复杂的初始化
    console.log('🧪 测试模式配置已就绪')
  }

  /**
   * 获取当前用户（简化版本）
   */
  async getCurrentUser(): Promise<any> {
    return {
      id: this.TEST_USER_ID,
      username: 'test_user',
      email: 'test@stm32ide.com'
    }
  }

  /**
   * 获取当前项目（简化版本）
   */
  async getCurrentProject(): Promise<any> {
    return {
      id: this.TEST_PROJECT_ID,
      user_id: this.TEST_USER_ID,
      platform: 'course',
      description: '测试项目'
    }
  }

  /**
   * 重新加载配置（空实现）
   */
  async reload(): Promise<void> {
    console.log('🔄 测试模式配置重新加载')
  }
}

// 创建全局实例
const configService = new ConfigManagerService()

export default configService