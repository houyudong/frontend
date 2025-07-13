/**
 * 应用核心管理器 - 统一管理应用生命周期、状态和服务
 * 基于专业IDE架构设计，提供鲁棒性、稳定性和专业度
 */

import { EventEmitter } from 'eventemitter3'
import { produce } from 'immer'
import { Logger } from './Logger'
import { ErrorHandler } from './ErrorHandler'
import { ServiceManager } from './ServiceManager'
import { StateManager } from './StateManager'
import { ConfigManager } from './ConfigManager'
import { PerformanceMonitor } from './PerformanceMonitor'

// 应用状态接口
export interface AppState {
  // 生命周期状态
  isInitialized: boolean
  isReady: boolean
  isShuttingDown: boolean
  
  // 连接状态
  isOnline: boolean
  wsConnected: boolean
  backendConnected: boolean
  
  // 用户会话
  userId?: string
  projectId?: string
  sessionId?: string
  
  // 系统状态
  systemHealth: 'healthy' | 'warning' | 'error'
  lastError?: string
  
  // 性能指标
  performance: {
    memoryUsage: number
    cpuUsage: number
    responseTime: number
  }
}

// 应用事件类型
export type AppEvent = 
  | 'initialized'
  | 'ready'
  | 'shutdown'
  | 'error'
  | 'stateChanged'
  | 'serviceRegistered'
  | 'serviceUnregistered'

/**
 * 应用核心类 - 单例模式
 */
export class AppCore extends EventEmitter<AppEvent> {
  private static instance: AppCore
  private state: AppState
  private logger: Logger
  private errorHandler: ErrorHandler
  private serviceManager: ServiceManager
  private stateManager: StateManager
  private configManager: ConfigManager
  private performanceMonitor: PerformanceMonitor
  private initPromise?: Promise<void>

  private constructor() {
    super()
    
    // 初始化状态
    this.state = {
      isInitialized: false,
      isReady: false,
      isShuttingDown: false,
      isOnline: navigator.onLine,
      wsConnected: false,
      backendConnected: false,
      systemHealth: 'healthy',
      performance: {
        memoryUsage: 0,
        cpuUsage: 0,
        responseTime: 0
      }
    }

    // 初始化核心组件
    this.logger = new Logger('AppCore')
    this.errorHandler = new ErrorHandler(this.logger)
    this.configManager = new ConfigManager()
    this.serviceManager = new ServiceManager(this.logger, this.errorHandler)
    this.stateManager = new StateManager(this.logger)
    this.performanceMonitor = new PerformanceMonitor(this.logger)

    this.setupEventHandlers()
    this.logger.info('AppCore 实例已创建')
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): AppCore {
    if (!AppCore.instance) {
      AppCore.instance = new AppCore()
    }
    return AppCore.instance
  }

  /**
   * 初始化应用
   */
  public async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.performInitialization()
    return this.initPromise
  }

  private async performInitialization(): Promise<void> {
    try {
      this.logger.info('开始初始化应用核心')
      
      // 1. 初始化配置管理器
      await this.configManager.initialize()
      this.logger.info('配置管理器初始化完成')

      // 2. 初始化性能监控
      this.performanceMonitor.start()
      this.logger.info('性能监控启动完成')

      // 3. 初始化状态管理器
      await this.stateManager.initialize()
      this.logger.info('状态管理器初始化完成')

      // 4. 初始化服务管理器
      await this.serviceManager.initialize()
      this.logger.info('服务管理器初始化完成')

      // 5. 设置错误处理
      this.setupGlobalErrorHandling()
      this.logger.info('全局错误处理设置完成')

      // 6. 更新状态
      this.updateState(draft => {
        draft.isInitialized = true
        draft.isReady = true
      })

      this.emit('initialized')
      this.emit('ready')
      this.logger.info('应用核心初始化完成')

    } catch (error) {
      this.logger.error('应用核心初始化失败', error)
      this.errorHandler.handleCriticalError(error, 'AppCore.initialize')
      throw error
    }
  }

  /**
   * 关闭应用
   */
  public async shutdown(): Promise<void> {
    try {
      this.logger.info('开始关闭应用')
      
      this.updateState(draft => {
        draft.isShuttingDown = true
      })

      // 1. 停止性能监控
      this.performanceMonitor.stop()

      // 2. 关闭服务管理器
      await this.serviceManager.shutdown()

      // 3. 关闭状态管理器
      await this.stateManager.shutdown()

      // 4. 清理事件监听器
      this.removeAllListeners()

      this.emit('shutdown')
      this.logger.info('应用关闭完成')

    } catch (error) {
      this.logger.error('应用关闭失败', error)
      this.errorHandler.handleError(error, 'AppCore.shutdown')
    }
  }

  /**
   * 获取当前状态
   */
  public getState(): Readonly<AppState> {
    return { ...this.state }
  }

  /**
   * 更新状态
   */
  private updateState(updater: (draft: AppState) => void): void {
    const newState = produce(this.state, updater)
    const oldState = this.state
    this.state = newState

    // 发送状态变化事件
    this.emit('stateChanged', newState, oldState)
    
    // 记录重要状态变化
    if (oldState.systemHealth !== newState.systemHealth) {
      this.logger.info(`系统健康状态变化: ${oldState.systemHealth} -> ${newState.systemHealth}`)
    }
  }

  /**
   * 获取服务管理器
   */
  public getServiceManager(): ServiceManager {
    return this.serviceManager
  }

  /**
   * 获取状态管理器
   */
  public getStateManager(): StateManager {
    return this.stateManager
  }

  /**
   * 获取配置管理器
   */
  public getConfigManager(): ConfigManager {
    return this.configManager
  }

  /**
   * 获取错误处理器
   */
  public getErrorHandler(): ErrorHandler {
    return this.errorHandler
  }

  /**
   * 获取日志器
   */
  public getLogger(): Logger {
    return this.logger
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.updateState(draft => {
        draft.isOnline = true
      })
      this.logger.info('网络连接已恢复')
    })

    window.addEventListener('offline', () => {
      this.updateState(draft => {
        draft.isOnline = false
      })
      this.logger.warn('网络连接已断开')
    })

    // 监听页面卸载
    window.addEventListener('beforeunload', () => {
      this.shutdown()
    })
  }

  /**
   * 设置全局错误处理
   */
  private setupGlobalErrorHandling(): void {
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.errorHandler.handleUnhandledRejection(event.reason)
      event.preventDefault()
    })

    // 捕获全局错误
    window.addEventListener('error', (event) => {
      this.errorHandler.handleGlobalError(event.error, event.filename, event.lineno, event.colno)
    })
  }

  /**
   * 健康检查
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const checks = [
        this.serviceManager.healthCheck(),
        this.stateManager.healthCheck(),
        this.configManager.healthCheck()
      ]

      const results = await Promise.all(checks)
      const isHealthy = results.every(result => result)

      this.updateState(draft => {
        draft.systemHealth = isHealthy ? 'healthy' : 'warning'
      })

      return isHealthy
    } catch (error) {
      this.updateState(draft => {
        draft.systemHealth = 'error'
        draft.lastError = error instanceof Error ? error.message : String(error)
      })
      return false
    }
  }

  /**
   * 获取系统信息
   */
  public getSystemInfo(): object {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing,
      state: this.state
    }
  }
}

// 导出单例实例
export const appCore = AppCore.getInstance()
export default appCore
