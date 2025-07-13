/**
 * 专业日志系统 - 结构化日志记录
 * 支持多级别、多输出、性能监控和错误追踪
 */

import { produce } from 'immer'

// 日志级别
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

// 日志条目接口
export interface LogEntry {
  timestamp: Date
  level: LogLevel
  logger: string
  message: string
  data?: any
  error?: Error
  context?: Record<string, any>
  performance?: {
    duration?: number
    memory?: number
  }
}

// 日志输出器接口
export interface LogAppender {
  name: string
  append(entry: LogEntry): void
  flush?(): Promise<void>
  close?(): Promise<void>
}

// 控制台输出器
class ConsoleAppender implements LogAppender {
  name = 'console'

  append(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const level = LogLevel[entry.level]
    const prefix = `[${timestamp}] [${level}] [${entry.logger}]`
    
    const style = this.getStyle(entry.level)
    
    if (entry.error) {
      console.error(`${prefix} ${entry.message}`, entry.error, entry.data)
    } else {
      const logFn = this.getLogFunction(entry.level)
      logFn(`%c${prefix} ${entry.message}`, style, entry.data)
    }
  }

  private getStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.TRACE:
        return 'color: #888'
      case LogLevel.DEBUG:
        return 'color: #0066cc'
      case LogLevel.INFO:
        return 'color: #009900'
      case LogLevel.WARN:
        return 'color: #ff9900'
      case LogLevel.ERROR:
        return 'color: #cc0000; font-weight: bold'
      case LogLevel.FATAL:
        return 'color: #ffffff; background-color: #cc0000; font-weight: bold'
      default:
        return ''
    }
  }

  private getLogFunction(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        return console.debug
      case LogLevel.INFO:
        return console.info
      case LogLevel.WARN:
        return console.warn
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error
      default:
        return console.log
    }
  }
}

// 内存输出器 - 用于日志查看器
class MemoryAppender implements LogAppender {
  name = 'memory'
  private entries: LogEntry[] = []
  private maxEntries: number

  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries
  }

  append(entry: LogEntry): void {
    this.entries.push(entry)
    
    // 保持最大条目数限制
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries)
    }
  }

  getEntries(filter?: {
    level?: LogLevel
    logger?: string
    since?: Date
  }): LogEntry[] {
    let filtered = this.entries

    if (filter) {
      if (filter.level !== undefined) {
        filtered = filtered.filter(entry => entry.level >= filter.level!)
      }
      if (filter.logger) {
        filtered = filtered.filter(entry => entry.logger.includes(filter.logger!))
      }
      if (filter.since) {
        filtered = filtered.filter(entry => entry.timestamp >= filter.since!)
      }
    }

    return filtered
  }

  clear(): void {
    this.entries = []
  }
}

// 日志配置
interface LoggerConfig {
  level: LogLevel
  appenders: LogAppender[]
  enablePerformanceTracking: boolean
  enableContextTracking: boolean
}

/**
 * 日志器类
 */
export class Logger {
  private name: string
  private config: LoggerConfig
  private context: Record<string, any> = {}
  private static globalAppenders: LogAppender[] = []
  private static memoryAppender: MemoryAppender

  constructor(name: string, config?: Partial<LoggerConfig>) {
    this.name = name
    this.config = {
      level: LogLevel.INFO,
      appenders: Logger.globalAppenders.length > 0 ? Logger.globalAppenders : [new ConsoleAppender()],
      enablePerformanceTracking: true,
      enableContextTracking: true,
      ...config
    }

    // 确保内存输出器存在
    if (!Logger.memoryAppender) {
      Logger.memoryAppender = new MemoryAppender()
      this.config.appenders.push(Logger.memoryAppender)
    }
  }

  /**
   * 设置全局输出器
   */
  static setGlobalAppenders(appenders: LogAppender[]): void {
    Logger.globalAppenders = appenders
  }

  /**
   * 获取内存输出器
   */
  static getMemoryAppender(): MemoryAppender {
    return Logger.memoryAppender
  }

  /**
   * 设置上下文
   */
  setContext(key: string, value: any): Logger {
    this.context = produce(this.context, draft => {
      draft[key] = value
    })
    return this
  }

  /**
   * 清除上下文
   */
  clearContext(): Logger {
    this.context = {}
    return this
  }

  /**
   * 创建子日志器
   */
  child(name: string, context?: Record<string, any>): Logger {
    const childLogger = new Logger(`${this.name}.${name}`, this.config)
    if (context) {
      childLogger.context = { ...this.context, ...context }
    } else {
      childLogger.context = { ...this.context }
    }
    return childLogger
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (level < this.config.level) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      logger: this.name,
      message,
      data,
      error,
      context: this.config.enableContextTracking ? { ...this.context } : undefined
    }

    // 添加性能信息
    if (this.config.enablePerformanceTracking && (performance as any).memory) {
      entry.performance = {
        memory: (performance as any).memory.usedJSHeapSize
      }
    }

    // 输出到所有输出器
    this.config.appenders.forEach(appender => {
      try {
        appender.append(entry)
      } catch (error) {
        console.error('日志输出器错误:', error)
      }
    })
  }

  /**
   * 性能计时器
   */
  time(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.debug(`⏱️ ${label}`, { duration: `${duration.toFixed(2)}ms` })
    }
  }

  /**
   * 异步操作包装器
   */
  async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.info(`✅ ${label} 完成`, { duration: `${duration.toFixed(2)}ms` })
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.error(`❌ ${label} 失败`, { duration: `${duration.toFixed(2)}ms`, error })
      throw error
    }
  }

  // 日志级别方法
  trace(message: string, data?: any): void {
    this.log(LogLevel.TRACE, message, data)
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.WARN, message, data, error)
  }

  error(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, data, error)
  }

  fatal(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.FATAL, message, data, error)
  }

  /**
   * 条件日志
   */
  debugIf(condition: boolean, message: string, data?: any): void {
    if (condition) this.debug(message, data)
  }

  infoIf(condition: boolean, message: string, data?: any): void {
    if (condition) this.info(message, data)
  }

  warnIf(condition: boolean, message: string, data?: any, error?: Error): void {
    if (condition) this.warn(message, data, error)
  }

  errorIf(condition: boolean, message: string, data?: any, error?: Error): void {
    if (condition) this.error(message, data, error)
  }
}

// 创建根日志器
export const rootLogger = new Logger('Root')

// 导出便捷函数
export const createLogger = (name: string, config?: Partial<LoggerConfig>): Logger => {
  return new Logger(name, config)
}

export default Logger
