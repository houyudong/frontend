/**
 * 错误处理工具
 * 提供统一的错误处理和用户友好的错误提示
 */

export interface ErrorInfo {
  message: string
  code?: string
  details?: any
  timestamp: Date
}

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical'

class ErrorHandler {
  private errorLog: ErrorInfo[] = []
  private maxLogSize = 100

  /**
   * 处理错误
   */
  handle(error: any, level: ErrorLevel = 'error', context?: string): ErrorInfo {
    const errorInfo: ErrorInfo = {
      message: this.extractMessage(error),
      code: this.extractCode(error),
      details: error,
      timestamp: new Date()
    }

    // 记录错误
    this.log(errorInfo, level, context)

    // 根据级别显示用户提示
    this.showUserNotification(errorInfo, level, context)

    return errorInfo
  }

  /**
   * 安全执行异步函数
   */
  async safeExecute<T>(
    fn: () => Promise<T>,
    fallback?: T,
    context?: string
  ): Promise<T | undefined> {
    try {
      return await fn()
    } catch (error) {
      this.handle(error, 'error', context)
      return fallback
    }
  }

  /**
   * 安全执行同步函数
   */
  safeExecuteSync<T>(
    fn: () => T,
    fallback?: T,
    context?: string
  ): T | undefined {
    try {
      return fn()
    } catch (error) {
      this.handle(error, 'error', context)
      return fallback
    }
  }

  /**
   * 网络错误处理
   */
  handleNetworkError(error: any, context?: string): ErrorInfo {
    let message = '网络连接失败'
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      message = '无法连接到服务器，请检查网络连接'
    } else if (error.status) {
      switch (error.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '身份验证失败'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务暂时不可用'
          break
        default:
          message = `网络错误 (${error.status})`
      }
    }

    return this.handle({ ...error, message }, 'error', context)
  }

  /**
   * 文件操作错误处理
   */
  handleFileError(error: any, operation: string, filePath?: string): ErrorInfo {
    let message = `文件${operation}失败`
    
    if (filePath) {
      message += `: ${filePath}`
    }

    if (error.message?.includes('permission')) {
      message += ' (权限不足)'
    } else if (error.message?.includes('not found')) {
      message += ' (文件不存在)'
    } else if (error.message?.includes('space')) {
      message += ' (磁盘空间不足)'
    }

    return this.handle({ ...error, message }, 'error', `文件操作-${operation}`)
  }

  /**
   * 提取错误消息
   */
  private extractMessage(error: any): string {
    if (typeof error === 'string') {
      return error
    }
    
    if (error?.message) {
      return error.message
    }
    
    if (error?.error?.message) {
      return error.error.message
    }
    
    return '未知错误'
  }

  /**
   * 提取错误代码
   */
  private extractCode(error: any): string | undefined {
    return error?.code || error?.status?.toString()
  }

  /**
   * 记录错误
   */
  private log(errorInfo: ErrorInfo, level: ErrorLevel, context?: string): void {
    const logMessage = `[${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${errorInfo.message}`
    
    switch (level) {
      case 'info':
        console.info(logMessage, errorInfo.details)
        break
      case 'warning':
        console.warn(logMessage, errorInfo.details)
        break
      case 'error':
      case 'critical':
        console.error(logMessage, errorInfo.details)
        break
    }

    // 添加到错误日志
    this.errorLog.unshift(errorInfo)
    
    // 限制日志大小
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize)
    }
  }

  /**
   * 显示用户通知
   */
  private showUserNotification(errorInfo: ErrorInfo, level: ErrorLevel, context?: string): void {
    // 只对错误和严重错误显示用户提示
    if (level === 'error' || level === 'critical') {
      // 这里可以集成通知系统
      console.log('用户通知:', errorInfo.message)
    }
  }

  /**
   * 获取错误日志
   */
  getErrorLog(): ErrorInfo[] {
    return [...this.errorLog]
  }

  /**
   * 清除错误日志
   */
  clearErrorLog(): void {
    this.errorLog = []
  }

  /**
   * 检查是否有严重错误
   */
  hasCriticalErrors(): boolean {
    return this.errorLog.some(error => 
      error.details?.level === 'critical' || 
      error.message.includes('critical') ||
      error.message.includes('严重')
    )
  }
}

// 创建全局实例
const errorHandler = new ErrorHandler()

export default errorHandler

/**
 * 便捷函数
 */
export const handleError = (error: any, context?: string) => 
  errorHandler.handle(error, 'error', context)

export const handleWarning = (error: any, context?: string) => 
  errorHandler.handle(error, 'warning', context)

export const handleNetworkError = (error: any, context?: string) => 
  errorHandler.handleNetworkError(error, context)

export const handleFileError = (error: any, operation: string, filePath?: string) => 
  errorHandler.handleFileError(error, operation, filePath)

export const safeExecute = <T>(fn: () => Promise<T>, fallback?: T, context?: string) => 
  errorHandler.safeExecute(fn, fallback, context)

export const safeExecuteSync = <T>(fn: () => T, fallback?: T, context?: string) => 
  errorHandler.safeExecuteSync(fn, fallback, context)
