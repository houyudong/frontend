/**
 * 统一文件下载服务 - 消除重复的下载逻辑
 * 专注于单文件下载，确保设备稳定性和用户体验
 */

import configService from '../config/configManager'

// 下载选项接口
export interface DownloadOptions {
  headers?: Record<string, string>
  expectedContentType?: string
  timeout?: number
  retries?: number
  fetchOptions?: RequestInit
}

// 下载结果接口
export interface DownloadResult {
  data: ArrayBuffer
  size: number
  contentType: string
  url: string
  downloadTime: number
  success: boolean
}

/**
 * 统一文件下载服务类 - 专注单文件下载，确保稳定性
 */
class FileDownloadService {
  private readonly DEFAULT_TIMEOUT = 30000 // 30秒
  private readonly DEFAULT_RETRIES = 2 // 减少重试次数，避免设备压力
  private isDownloading = false // 防止并发下载

  /**
   * 通用文件下载方法 - 简化版本，专注稳定性，集成模态框
   */
  async downloadFile(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    // 防止并发下载，保护设备稳定性
    if (this.isDownloading) {
      throw new Error('文件下载正在进行中，请等待完成后再试')
    }

    const startTime = Date.now()
    this.isDownloading = true
    const fileName = this.getFileName(url)

    try {
      console.log(`📥 开始下载文件: ${fileName}`)

      // 🔧 移除文件下载模态框：主要用于内部调试，不需要用户提示

      // 获取认证头
      const authHeaders = await configService.getAuthHeaders()

      // 构建请求配置
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          ...authHeaders,
          ...options.headers
        },
        ...options.fetchOptions
      }

      // 执行下载（支持重试）
      const response = await this.downloadWithRetry(url, fetchOptions, options.retries || this.DEFAULT_RETRIES)

      // 验证响应
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status} ${response.statusText}`)
      }

      // 简化的内容类型检查
      const contentType = response.headers.get('content-type') || ''

      // 下载数据
      const data = await response.arrayBuffer()
      const downloadTime = Date.now() - startTime

      const result: DownloadResult = {
        data,
        size: data.byteLength,
        contentType,
        url,
        downloadTime,
        success: true
      }

      console.log(`✅ 文件下载完成: ${fileName} (${this.formatFileSize(result.size)}, ${downloadTime}ms)`)

      // 🔧 移除下载成功模态框：静默下载，减少干扰

      return result

    } catch (error) {
      const downloadTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : '下载失败'

      console.error(`❌ 文件下载失败: ${fileName} (${downloadTime}ms)`, errorMessage)

      // 🔧 下载失败只在控制台记录，不显示模态框

      // 返回失败结果而不是抛出异常，便于上层处理
      return {
        data: new ArrayBuffer(0),
        size: 0,
        contentType: '',
        url,
        downloadTime,
        success: false
      }

    } finally {
      this.isDownloading = false
    }
  }

  /**
   * 带重试的下载 - 简化版本
   */
  private async downloadWithRetry(url: string, options: RequestInit, retries: number): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`🔄 重试下载 (${attempt}/${retries})`)
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        return response

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (attempt < retries) {
          // 简化重试延迟：固定2秒
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    throw lastError || new Error('下载失败')
  }

  /**
   * 下载HEX文件
   */
  async downloadHexFile(): Promise<DownloadResult> {
    const url = await configService.getHexFileUrl()

    return this.downloadFile(url, {
      expectedContentType: 'application/octet-stream',
      retries: 3
    })
  }

  /**
   * 下载ELF文件
   */
  async downloadElfFile(): Promise<DownloadResult> {
    const url = await configService.getElfFileUrl()

    return this.downloadFile(url, {
      expectedContentType: 'application/x-executable',
      retries: 3
    })
  }

  /**
   * 下载BIN文件
   */
  async downloadBinFile(): Promise<DownloadResult> {
    const filePaths = await configService.getFilePaths()
    const url = await configService.getFileDownloadUrl(filePaths.binFile)

    return this.downloadFile(url, {
      expectedContentType: 'application/octet-stream',
      retries: 3
    })
  }

  /**
   * 下载任意项目文件
   */
  async downloadProjectFile(filePath: string): Promise<DownloadResult> {
    const url = await configService.getFileDownloadUrl(filePath)

    return this.downloadFile(url, {
      retries: 2
    })
  }

  /**
   * 获取文件下载URL（不下载）
   */
  async getFileDownloadUrl(filePath: string): Promise<string> {
    return configService.getFileDownloadUrl(filePath)
  }

  /**
   * 获取HEX文件URL
   */
  async getHexFileUrl(): Promise<string> {
    return configService.getHexFileUrl()
  }

  /**
   * 获取ELF文件URL
   */
  async getElfFileUrl(): Promise<string> {
    return configService.getElfFileUrl()
  }

  /**
   * 验证文件是否存在（HEAD请求）
   */
  async checkFileExists(filePath: string): Promise<boolean> {
    try {
      const url = await configService.getFileDownloadUrl(filePath)
      const authHeaders = await configService.getAuthHeaders()

      const response = await fetch(url, {
        method: 'HEAD',
        headers: authHeaders
      })

      return response.ok

    } catch (error) {
      console.warn(`检查文件存在性失败: ${filePath}`, error)
      return false
    }
  }

  /**
   * 获取文件信息（不下载内容）
   */
  async getFileInfo(filePath: string): Promise<{
    exists: boolean
    size?: number
    contentType?: string
    lastModified?: Date
  }> {
    try {
      const url = await configService.getFileDownloadUrl(filePath)
      const authHeaders = await configService.getAuthHeaders()

      const response = await fetch(url, {
        method: 'HEAD',
        headers: authHeaders
      })

      if (!response.ok) {
        return { exists: false }
      }

      const contentLength = response.headers.get('content-length')
      const contentType = response.headers.get('content-type')
      const lastModified = response.headers.get('last-modified')

      return {
        exists: true,
        size: contentLength ? parseInt(contentLength, 10) : undefined,
        contentType: contentType || undefined,
        lastModified: lastModified ? new Date(lastModified) : undefined
      }

    } catch (error) {
      console.warn(`获取文件信息失败: ${filePath}`, error)
      return { exists: false }
    }
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * 获取文件名（用于日志显示）
   */
  private getFileName(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      return pathParts[pathParts.length - 1] || 'unknown'
    } catch {
      return url.substring(url.lastIndexOf('/') + 1) || 'unknown'
    }
  }

  /**
   * 检查是否正在下载
   */
  isDownloadInProgress(): boolean {
    return this.isDownloading
  }
}

// 创建全局实例
const fileDownloadService = new FileDownloadService()

export default fileDownloadService
