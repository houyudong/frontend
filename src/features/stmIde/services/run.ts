import { EventEmitter } from 'eventemitter3'
import wsService from './websocket'
import consoleService from './console'
import compileService from './compile'
import deviceService from './device'
import fileDownloadService from './fileDownload'
import configManager from '../config/configManager'

// 精简接口定义
interface RunState {
  isRunning: boolean
  isStarting: boolean
  deviceId: string
  startTimeout: number | null
}

interface RunResult {
  success: boolean
  message: string
  error?: string
}

/**
 * 运行服务 - 编译、烧录和运行程序
 */
class RunService extends EventEmitter {
  private state: RunState = {
    isRunning: false,
    isStarting: false,
    deviceId: '',
    startTimeout: null
  }

  private readonly OPERATION_TIMEOUT = 30000

  constructor() {
    super()
    this.setupWebSocketHandlers()
  }

  private setupWebSocketHandlers(): void {
    // 清除已有的处理器，防止重复注册
    wsService.off('flash.started')
    wsService.off('flash.start')
    wsService.off('flash.completed')
    wsService.off('flash.complete')
    wsService.off('flash.error')
    wsService.off('flash.failed')
    wsService.off('run.state')
    wsService.off('run.status')

    wsService.on('flash.started', this.handleFlashStarted.bind(this))
    wsService.on('flash.start', (payload: any) => {
      if (payload.success === false || payload.error) {
        this.handleFlashError(payload)
      } else if (payload.status === 'success' || payload.message?.includes('完成')) {
        this.handleFlashCompleted(payload)
      } else {
        this.handleFlashStarted(payload)
      }
    })
    wsService.on('flash.completed', this.handleFlashCompleted.bind(this))
    wsService.on('flash.complete', this.handleFlashCompleted.bind(this))
    wsService.on('flash.error', this.handleFlashError.bind(this))
    wsService.on('flash.failed', this.handleFlashError.bind(this))
    wsService.on('run.state', this.handleRunStateChanged.bind(this))
    wsService.on('run.status', this.handleRunStateChanged.bind(this))
  }

  async runProgram(): Promise<RunResult> {
    if (this.state.isRunning || this.state.isStarting) {
      return {
        success: false,
        message: '程序已在运行中'
      }
    }

    try {
      this.state.isStarting = true
      this.emit('stateChanged', this.state)

      consoleService.debugger.info('🚀 开始运行流程...')

      const compileSuccess = await this.ensureCompiled()
      if (!compileSuccess) {
        throw new Error('编译失败，无法运行程序')
      }

      const hexUrl = await this.getHexFileUrl()
      if (!hexUrl) {
        throw new Error('未找到HEX文件，请先编译项目')
      }

      const deviceId = this.getDeviceId()
      if (!deviceId) {
        throw new Error('未检测到设备，请先连接设备')
      }
      const flashConfig = await configManager.getFlashConfig(true)
      const payload = {
        device_id: deviceId,
        firmware_url: hexUrl,
        ...flashConfig
      }

      consoleService.debugger.info('📤 发送运行请求')
      this.state.deviceId = deviceId
      this.state.startTimeout = setTimeout(() => {
        if (this.state.isStarting) {
          this.state.isStarting = false
          this.state.startTimeout = null
          this.emit('stateChanged', this.state)

          consoleService.debugger.error('❌ 运行超时：30秒内未收到响应')
          consoleService.addMessage(
            'error',
            '运行超时，请检查设备连接和STMClient服务状态',
            '运行',
            undefined,
            undefined,
            undefined,
            false,
            'Operation timeout after 30 seconds'
          )
        }
      }, this.OPERATION_TIMEOUT)

      wsService.send('flash.start', payload)

      return {
        success: true,
        message: '烧录请求已发送'
      }

    } catch (error) {
      this.state.isStarting = false
      this.emit('stateChanged', this.state)

      const errorMessage = error instanceof Error ? error.message : '运行失败'
      consoleService.debugger.error(`❌ 运行失败: ${errorMessage}`)
      consoleService.addMessage(
        'error',
        errorMessage,
        '运行',
        undefined,
        undefined,
        undefined,
        false,
        String(error)
      )

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      }
    }
  }

  /**
   * 停止程序运行（简化版）
   */
  async stopProgram(): Promise<RunResult> {
    if (!this.state.isRunning) {
      return { success: false, message: '当前没有运行的程序' }
    }

    this.state.isRunning = false
    this.emit('stateChanged', this.state)

    consoleService.debugger.info('⏹️ 程序已停止')

    return { success: true, message: '程序已停止' }
  }

  /**
   * 仅烧录程序（不运行）
   */
  async flashProgram(): Promise<RunResult> {
    try {
      consoleService.debugger.info('📥 开始烧录程序...')

      // 1. 确保编译完成
      const compileSuccess = await this.ensureCompiled()
      if (!compileSuccess) {
        throw new Error('编译失败，无法烧录程序')
      }

      // 2. 获取HEX文件URL
      const hexUrl = await this.getHexFileUrl()
      if (!hexUrl) {
        throw new Error('未找到HEX文件，请先编译项目')
      }

      // 3. 获取设备ID
      const deviceId = this.getDeviceId()
      if (!deviceId) {
        throw new Error('未检测到设备，请先连接设备')
      }

      // 4. 发送烧录请求（使用统一配置，仅烧录）
      const flashConfig = await configManager.getFlashConfig(false)
      const payload = {
        device_id: deviceId,
        firmware_url: hexUrl,
        ...flashConfig
      }

      consoleService.debugger.info('📤 发送烧录请求（仅烧录）')
      wsService.send('flash.start', payload)

      return {
        success: true,
        message: '烧录请求已发送'
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '烧录失败'

      // 显示错误到控制台
      consoleService.debugger.error(`❌ 烧录失败: ${errorMessage}`)

      // 添加错误到问题面板
      consoleService.addMessage(
        'error',
        errorMessage,
        '烧录',
        undefined,
        undefined,
        undefined,
        false,
        String(error)
      )

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      }
    }
  }

  /**
   * 确保编译完成
   */
  private async ensureCompiled(): Promise<boolean> {
    const compileStatus = compileService.getStatus()

    if (compileStatus.lastCompileSuccess) {
      consoleService.debugger.info('✅ 编译状态检查通过')
      return true
    }

    consoleService.debugger.info('📦 自动编译中...')

    try {
      const result = await compileService.compileProject()
      return result.success
    } catch (error) {
      consoleService.debugger.error('❌ 自动编译失败')
      return false
    }
  }

  /**
   * 获取HEX文件URL
   */
  private async getHexFileUrl(): Promise<string> {
    try {
      return await fileDownloadService.getHexFileUrl()
    } catch (error) {
      console.error('获取HEX文件URL失败:', error)
      return ''
    }
  }

  /**
   * 获取设备ID
   */
  private getDeviceId(): string {
    const connectedDevice = deviceService.getConnectedDevice()
    if (!connectedDevice) {
      console.warn('未找到当前连接的设备')
      return ''
    }

    // 优先使用芯片ID，如果没有则使用设备ID
    const deviceId = connectedDevice.chip_id || connectedDevice.id
    if (!deviceId) {
      console.warn('设备ID信息不完整')
      return ''
    }

    return deviceId
  }

  /**
   * 处理烧录开始（简化版）
   */
  private handleFlashStarted(payload: any): void {
    if (this.state.startTimeout) {
      clearTimeout(this.state.startTimeout)
      this.state.startTimeout = null
    }

    if (payload.device_id) {
      consoleService.debugger.info('📥 开始烧录程序...')
      consoleService.debugger.info(`目标设备: ${payload.device_id}`)
    }
    this.emit('flashStarted', payload)
  }

  // 删除烧录进度处理，使用模态等待框代替

  /**
   * 处理烧录完成 - 修复后的标准IDE行为
   */
  private handleFlashCompleted(payload: any): void {
    console.log('🔄 处理烧录完成事件:', payload)

    // 清除超时
    if (this.state.startTimeout) {
      clearTimeout(this.state.startTimeout)
      this.state.startTimeout = null
    }

    // 重置启动状态
    this.state.isStarting = false

    consoleService.debugger.success('✅ 程序烧录完成')

    // 🔧 标准IDE行为：运行完成后，运行按钮保持"运行"状态
    // 程序在设备上自动运行，但前端不进入"运行中"状态
    // 这样用户可以随时重新点击运行按钮进行新的烧录
    this.state.isRunning = false

    // 根据payload判断是否有自动运行标记
    const shouldAutoRun = payload.auto_run !== false
    if (shouldAutoRun) {
      consoleService.debugger.success('🚀 程序已烧录并自动运行')
    } else {
      consoleService.debugger.info('📥 程序已烧录，准备就绪')
    }

    // 发送状态变化事件
    console.log('🔄 发送状态变化事件:', this.state)
    this.emit('stateChanged', this.state)
    this.emit('flashCompleted', payload)

    if (shouldAutoRun) {
      this.emit('programStarted', payload)
    }
  }

  /**
   * 处理烧录错误（修复：不影响设备连接状态）
   */
  private handleFlashError(payload: any): void {
    // 清除超时
    if (this.state.startTimeout) {
      clearTimeout(this.state.startTimeout)
      this.state.startTimeout = null
    }

    // 只重置烧录状态，不影响设备连接状态
    this.state.isStarting = false
    this.state.isRunning = false

    const errorMessage = payload.message || payload.error || '烧录过程中发生错误'

    // 输出到控制台
    consoleService.debugger.error(`❌ 烧录失败: ${errorMessage}`)

    // 添加到问题面板
    consoleService.addMessage(
      'error',
      errorMessage,
      '烧录',
      undefined,
      undefined,
      undefined,
      false,
      payload.details || String(payload)
    )

    this.emit('stateChanged', this.state)
    this.emit('flashError', payload)
  }

  /**
   * 处理运行状态变化（简化版）
   *
   */
  private handleRunStateChanged(payload: any): void {
    if (payload.running !== undefined) {
      this.state.isRunning = payload.running
      consoleService.debugger.info(payload.running ? '🚀 程序正在运行' : '⏹️ 程序已停止')
      this.emit('stateChanged', this.state)
    }
  }

  /**
   * 获取当前运行状态
   */
  getState(): RunState {
    return { ...this.state }
  }
}

// 创建全局实例
const runService = new RunService()

export default runService
