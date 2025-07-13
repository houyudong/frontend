/**
 * 统一错误处理服务 - 提供鲁棒的错误处理机制
 */

import { produce } from 'immer'
import consoleService from './console'

// 错误级别
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// 错误类型
export enum ErrorType {
  NETWORK = 'network',
  WEBSOCKET = 'websocket',
  COMPILE = 'compile',
  DEBUG = 'debug',
  FILE_SYSTEM = 'file_system',
  USER_INPUT = 'user_input',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

// 错误信息接口
export interface ErrorInfo {
  id: string
  type: ErrorType
  level: ErrorLevel
  message: string
  details?: any
  stack?: string
  timestamp: Date
  context?: Record<string, any>
  userAction?: string
  resolved?: boolean
}

// 错误处理配置
interface ErrorHandlerConfig {
  maxErrors: number
  enableConsoleOutput: boolean
  enableLocalStorage: boolean
  enableUserNotification: boolean
}

class ErrorHandlerService {
  private errors: ErrorInfo[] = []
  private config: ErrorHandlerConfig = {
    maxErrors: 100,
    enableConsoleOutput: true,
    enableLocalStorage: true,
    enableUserNotification: true
  }

  constructor() {
    this.setupGlobalErrorHandlers()
    this.loadStoredErrors()
  }

  /**
   * 处理错误
   */
  handleError(
    error: Error | string | any,
    type: ErrorType = ErrorType.UNKNOWN,
    level: ErrorLevel = ErrorLevel.ERROR,
    context?: Record<string, any>,
    userAction?: string
  ): ErrorInfo {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      type,
      level,
      message: this.extractMessage(error),
      details: error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      context,
      userAction,
      resolved: false
    }

    this.addError(errorInfo)
    this.processError(errorInfo)

    return errorInfo
  }

  /**
   * 处理网络错误
   */
  handleNetworkError(error: any, url?: string, method?: string): ErrorInfo {
    const context = { url, method }
    const userAction = '请检查网络连接或稍后重试'
    
    return this.handleError(
      error,
      ErrorType.NETWORK,
      ErrorLevel.ERROR,
      context,
      userAction
    )
  }

  /**
   * 处理WebSocket错误
   */
  handleWebSocketError(error: any, action?: string): ErrorInfo {
    const context = { action }
    const userAction = 'WebSocket连接异常，正在尝试重连'
    
    return this.handleError(
      error,
      ErrorType.WEBSOCKET,
      ErrorLevel.WARNING,
      context,
      userAction
    )
  }

  /**
   * 处理编译错误
   */
  handleCompileError(error: any, file?: string, line?: number): ErrorInfo {
    const context = { file, line }
    const userAction = '请检查代码语法错误'
    
    return this.handleError(
      error,
      ErrorType.COMPILE,
      ErrorLevel.ERROR,
      context,
      userAction
    )
  }

  /**
   * 处理文件系统错误
   */
  handleFileSystemError(error: any, operation?: string, filePath?: string): ErrorInfo {
    const context = { operation, filePath }
    const userAction = '请检查文件权限或磁盘空间'
    
    return this.handleError(
      error,
      ErrorType.FILE_SYSTEM,
      ErrorLevel.ERROR,
      context,
      userAction
    )
  }

  /**
   * 处理用户输入错误
   */
  handleUserInputError(message: string, field?: string): ErrorInfo {
    const context = { field }
    const userAction = '请检查输入内容是否正确'
    
    return this.handleError(
      new Error(message),
      ErrorType.USER_INPUT,
      ErrorLevel.WARNING,
      context,
      userAction
    )
  }

  /**
   * 安全执行异步函数
   */
  async safeExecute<T>(
    fn: () => Promise<T>,
    errorType: ErrorType = ErrorType.UNKNOWN,
    fallback?: T,
    context?: Record<string, any>
  ): Promise<T | undefined> {
    try {
      return await fn()
    } catch (error) {
      this.handleError(error, errorType, ErrorLevel.ERROR, context)
      return fallback
    }
  }

  /**
   * 安全执行同步函数
   */
  safeExecuteSync<T>(
    fn: () => T,
    errorType: ErrorType = ErrorType.UNKNOWN,
    fallback?: T,
    context?: Record<string, any>
  ): T | undefined {
    try {
      return fn()
    } catch (error) {
      this.handleError(error, errorType, ErrorLevel.ERROR, context)
      return fallback
    }
  }

  /**
   * 标记错误为已解决
   */
  resolveError(errorId: string): void {
    this.errors = produce(this.errors, draft => {
      const error = draft.find(e => e.id === errorId)
      if (error) {
        error.resolved = true
      }
    })
    this.saveErrors()
  }

  /**
   * 获取错误列表
   */
  getErrors(filter?: {
    type?: ErrorType
    level?: ErrorLevel
    resolved?: boolean
    since?: Date
  }): ErrorInfo[] {
    let filtered = this.errors

    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(e => e.type === filter.type)
      }
      if (filter.level) {
        filtered = filtered.filter(e => e.level === filter.level)
      }
      if (filter.resolved !== undefined) {
        filtered = filtered.filter(e => e.resolved === filter.resolved)
      }
      if (filter.since) {
        filtered = filtered.filter(e => e.timestamp >= filter.since!)
      }
    }

    return filtered
  }

  /**
   * 清除错误
   */
  clearErrors(filter?: { type?: ErrorType; level?: ErrorLevel }): void {
    if (filter) {
      this.errors = this.errors.filter(error => {
        if (filter.type && error.type === filter.type) return false
        if (filter.level && error.level === filter.level) return false
        return true
      })
    } else {
      this.errors = []
    }
    this.saveErrors()
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): Record<string, number> {
    const stats = {
      total: this.errors.length,
      unresolved: this.errors.filter(e => !e.resolved).length,
      critical: this.errors.filter(e => e.level === ErrorLevel.CRITICAL).length,
      error: this.errors.filter(e => e.level === ErrorLevel.ERROR).length,
      warning: this.errors.filter(e => e.level === ErrorLevel.WARNING).length,
      info: this.errors.filter(e => e.level === ErrorLevel.INFO).length
    }

    // 按类型统计
    Object.values(ErrorType).forEach(type => {
      stats[type] = this.errors.filter(e => e.type === type).length
    })

    return stats
  }

  // 私有方法
  private addError(errorInfo: ErrorInfo): void {
    this.errors = produce(this.errors, draft => {
      draft.push(errorInfo)
      
      // 保持最大错误数限制
      if (draft.length > this.config.maxErrors) {
        draft.splice(0, draft.length - this.config.maxErrors)
      }
    })
    this.saveErrors()
  }

  private processError(errorInfo: ErrorInfo): void {
    // 输出到控制台
    if (this.config.enableConsoleOutput) {
      this.outputToConsole(errorInfo)
    }

    // 用户通知
    if (this.config.enableUserNotification && errorInfo.level !== ErrorLevel.INFO) {
      this.notifyUser(errorInfo)
    }
  }

  private outputToConsole(errorInfo: ErrorInfo): void {
    const message = `[${errorInfo.type.toUpperCase()}] ${errorInfo.message}`
    
    switch (errorInfo.level) {
      case ErrorLevel.CRITICAL:
      case ErrorLevel.ERROR:
        consoleService.error(message, 'ErrorHandler')
        break
      case ErrorLevel.WARNING:
        consoleService.warning(message, 'ErrorHandler')
        break
      case ErrorLevel.INFO:
        consoleService.info(message, 'ErrorHandler')
        break
    }
  }

  private notifyUser(errorInfo: ErrorInfo): void {
    // 这里可以集成通知系统
    if (errorInfo.userAction) {
      console.log(`💡 建议: ${errorInfo.userAction}`)
    }
  }

  private extractMessage(error: any): string {
    if (typeof error === 'string') return error
    if (error instanceof Error) return error.message
    if (error?.message) return error.message
    return '未知错误'
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private setupGlobalErrorHandlers(): void {
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        event.reason,
        ErrorType.SYSTEM,
        ErrorLevel.ERROR,
        { type: 'unhandledrejection' }
      )
    })

    // 捕获全局错误
    window.addEventListener('error', (event) => {
      this.handleError(
        event.error || event.message,
        ErrorType.SYSTEM,
        ErrorLevel.ERROR,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      )
    })
  }

  private saveErrors(): void {
    if (!this.config.enableLocalStorage) return
    
    try {
      const recentErrors = this.errors.slice(-50) // 只保存最近50个错误
      localStorage.setItem('stmide_errors', JSON.stringify(recentErrors))
    } catch (error) {
      console.warn('无法保存错误信息到本地存储:', error)
    }
  }

  private loadStoredErrors(): void {
    if (!this.config.enableLocalStorage) return
    
    try {
      const stored = localStorage.getItem('stmide_errors')
      if (stored) {
        const errors = JSON.parse(stored)
        this.errors = errors.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }))
      }
    } catch (error) {
      console.warn('无法加载存储的错误信息:', error)
    }
  }
}

// 创建全局实例
const errorHandler = new ErrorHandlerService()

export default errorHandler
