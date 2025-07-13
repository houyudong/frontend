/**
 * 调试会话管理器 - 重构版本，遵循单一职责原则
 * 专注于会话生命周期管理，调试控制委托给 DebugController
 */

import { EventEmitter } from 'eventemitter3'
import { produce } from 'immer'
import wsService from './websocket'
import consoleService from './console'
import compileService from './compile'
import deviceService from './device'
import debugSnapshotService from './debugSnapshot'
import fileDownloadService from './fileDownload'
import { useDebugStore } from '../stores/debugStore'
import { DebugController } from './debugController'
import configManager from '../config/configManager'

// 调试会话状态接口
interface DebugSessionState {
  isDebugging: boolean
  isStarting: boolean
  isStopping: boolean
  deviceId: string
  sessionId: string
  currentPC: string
  currentFile: string
  currentLine: number
  debugState: 'disconnected' | 'running' | 'paused'
}

// 调试结果接口
interface DebugResult {
  success: boolean
  message: string
  error?: string
}

/**
 * 调试会话管理器 - 精简版本，专注于会话管理
 */
class DebugSession extends EventEmitter {
  private state: DebugSessionState = {
    isDebugging: false,
    isStarting: false,
    isStopping: false,
    deviceId: '',
    sessionId: '',
    currentPC: '',
    currentFile: '',
    currentLine: 0,
    debugState: 'disconnected'
  }

  private controller: DebugController

  constructor() {
    super()

    // 初始化调试控制器
    this.controller = new DebugController({
      sessionId: '',
      isDebugging: false,
      debugState: 'disconnected',
      currentFile: '',
      currentLine: 0,
      currentPC: ''
    })

    this.setupWebSocketHandlers()
  }

  // ===== 状态管理 =====

  private updateState(updater: (draft: DebugSessionState) => void): void {
    this.state = produce(this.state, updater)

    // 同步状态到控制器
    this.controller.updateState(draft => {
      draft.sessionId = this.state.sessionId
      draft.isDebugging = this.state.isDebugging
      draft.debugState = this.state.debugState
      draft.currentFile = this.state.currentFile
      draft.currentLine = this.state.currentLine
      draft.currentPC = this.state.currentPC
    })

    console.log('🔧 debugSession.ts 状态更新:', {
      isDebugging: this.state.isDebugging,
      debugState: this.state.debugState,
      sessionId: this.state.sessionId,
      isStarting: this.state.isStarting,
      isStopping: this.state.isStopping
    })

    this.emit('stateChanged', this.state)
  }

  getState(): DebugSessionState {
    return { ...this.state }
  }

  // ===== WebSocket事件处理 =====

  private setupWebSocketHandlers(): void {
    const handlers = {
      // 🔧 优化：标准DAP事件优先，简化事件链条
      'stopped': this.handleStoppedEvent.bind(this),
      'continued': this.handleContinuedEvent.bind(this),

      // 必要的自定义事件
      'debug.started': this.handleDebugStarted.bind(this),
      'debug.stopped': this.handleDebugStopped.bind(this),
      'debug.error': this.handleDebugError.bind(this),
      'debug.snapshot': this.handleDebugSnapshot.bind(this),

      // 🔧 简化：移除向后兼容，只保留标准DAP事件
    }

    console.log('🔧 注册WebSocket事件处理器:', Object.keys(handlers))

    Object.entries(handlers).forEach(([event, handler]) => {
      wsService.on(event, handler)
    })

    // 处理debug.start的直接响应
    wsService.on('debug.start', (payload: any) => {
      if (payload && !payload.error) {
        this.handleDebugStarted(payload)
      }
    })

    // 兼容性处理
    wsService.on('message', (payload: any) => {
      if (payload.status === 'started' && payload.session_id) {
        this.handleDebugStarted(payload)
      }
    })
  }

  // ===== 调试会话生命周期 =====

  async startDebug(): Promise<DebugResult> {
    if (this.state.isDebugging || this.state.isStarting) {
      return { success: false, message: '调试会话已在运行中' }
    }

    try {
      this.updateState(draft => { draft.isStarting = true })
      consoleService.debugger.info('🐛 开始智能调试流程...')

      // 显示调试启动模态框（无固定时间，等待实际响应）
      import('../services/navigationModal').then(({ default: navigationModalService }) => {
        navigationModalService.showLoading(
          '正在启动调试',
          '正在初始化调试环境，请稍候...',
          30000 // 最大30秒超时保护，但会在收到响应时立即关闭
        )
      })

      // 1. 确保编译完成
      const compileSuccess = await this.ensureCompiled()
      if (!compileSuccess) throw new Error('编译失败，无法启动调试')

      // 2. 检查设备连接并获取设备ID
      const deviceId = this.getDeviceId()
      if (!deviceId) throw new Error('未检测到设备，请先连接设备')

      // 3. 获取ELF文件URL
      const elfUrl = await fileDownloadService.getElfFileUrl()
      if (!elfUrl) throw new Error('ELF文件URL无效')

      // 4. 准备调试启动请求
      const payload = await this.prepareDebugPayload(deviceId, elfUrl)

      // 设置session_id为device_id
      this.updateState(draft => {
        draft.sessionId = deviceId
        draft.deviceId = deviceId
      })

      consoleService.debugger.info('📤 发送调试启动请求')
      // 🔧 简化输出：移除详细的设备和文件信息
      // consoleService.debugger.info(`设备ID: ${deviceId}`)
      // consoleService.debugger.info(`ELF文件: ${elfUrl}`)
      // consoleService.debugger.info(`断点数量: ${payload.breakpoints.length}`)
      // consoleService.debugger.info(`Session ID: ${deviceId}`)

      wsService.send('debug.start', payload)
      return { success: true, message: '调试启动请求已发送' }

    } catch (error) {
      this.updateState(draft => {
        draft.isStarting = false
        draft.sessionId = ''
      })
      const errorMessage = error instanceof Error ? error.message : '调试启动失败'
      consoleService.debugger.error(`❌ 调试启动失败: ${errorMessage}`)

      // 显示错误模态框
      import('../services/navigationModal').then(({ default: navigationModalService }) => {
        navigationModalService.showError(
          '调试启动失败',
          errorMessage
        )
      })

      return { success: false, message: errorMessage, error: errorMessage }
    }
  }

  async stopDebug(): Promise<DebugResult> {
    if (!this.state.isDebugging) {
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      this.updateState(draft => { draft.isStopping = true })
      consoleService.debugger.info('⏹️ 停止调试会话...')
      wsService.send('debug.stop', { session_id: this.state.sessionId })
      return { success: true, message: '调试停止请求已发送' }
    } catch (error) {
      this.updateState(draft => { draft.isStopping = false })
      const errorMessage = error instanceof Error ? error.message : '调试停止失败'
      consoleService.debugger.error(`❌ 调试停止失败: ${errorMessage}`)
      return { success: false, message: errorMessage, error: errorMessage }
    }
  }

  // ===== 调试控制命令（委托给DebugController）=====

  async continue(): Promise<DebugResult> {
    return this.controller.continue()
  }

  async pause(): Promise<DebugResult> {
    return this.controller.pause()
  }

  async stepOver(): Promise<DebugResult> {
    return this.controller.stepOver()
  }

  async stepInto(): Promise<DebugResult> {
    return this.controller.stepInto()
  }

  async stepOut(): Promise<DebugResult> {
    return this.controller.stepOut()
  }

  async setBreakpoint(file: string, line: number, condition?: string): Promise<DebugResult> {
    if (!this.state.isDebugging) {
      return { success: false, message: '调试会话未启动' }
    }

    try {
      const payload = {
        file,
        line,
        condition: condition || '',
        enabled: true
      }

      console.log('🔴 发送断点设置请求:', payload)
      wsService.send('debug.breakpoint.set', payload)

      return { success: true, message: '断点设置请求已发送' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '设置断点失败'
      return { success: false, message: errorMessage }
    }
  }

  async removeBreakpoint(id: string): Promise<DebugResult> {
    if (!this.state.isDebugging) {
      return { success: false, message: '调试会话未启动' }
    }

    try {
      const payload = { id }

      console.log('🔴 发送断点删除请求:', payload)
      wsService.send('debug.breakpoint.remove', payload)

      return { success: true, message: '断点删除请求已发送' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除断点失败'
      return { success: false, message: errorMessage }
    }
  }

  // ===== 辅助方法 =====

  private getDeviceId(): string {
    const connectedDevice = deviceService.getConnectedDevice()
    if (!connectedDevice) return ''
    return connectedDevice.chip_id || connectedDevice.id || ''
  }

  private async prepareDebugPayload(deviceId: string, elfUrl: string) {
    const debugStore = useDebugStore.getState()
    const allBreakpoints = debugStore.allBreakpoints
    const enabledBreakpoints = allBreakpoints.filter(bp => bp.enabled)

    console.log('🔴 准备断点数据:', {
      total: allBreakpoints.length,
      enabled: enabledBreakpoints.length,
      breakpoints: enabledBreakpoints.map(bp => ({
        file: bp.filePath,
        line: bp.lineNumber,
        location: `${bp.filePath}:${bp.lineNumber}`
      }))
    })

    // 使用configManager获取调试配置
    const debugConfig = await configManager.getDebugConfig()

    return {
      device_id: deviceId,
      link_type: debugConfig.link_type,
      chip_family: debugConfig.chip_family,
      firmware_url: elfUrl,
      breakpoints: enabledBreakpoints.map(bp => ({
        file: bp.filePath,
        line: bp.lineNumber,
        location: `${bp.filePath}:${bp.lineNumber}`,
        enabled: bp.enabled,
        condition: bp.condition || '',
        id: bp.id
      }))
    }
  }

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

  // ===== 事件处理器（委托给DebugController）=====

  private handleDebugStarted(payload: any): void {
    console.log('📥 调试启动响应:', payload)

    if (payload.error) {
      console.error('❌ 调试启动失败:', payload.error)
      this.updateState(draft => { draft.isStarting = false })
      deviceService.setDebuggingState(false)
      return
    }

    // 更新会话状态
    this.updateState(draft => {
      draft.isStarting = false
      draft.isDebugging = true
      draft.debugState = 'paused'

      if (payload.pc) draft.currentPC = payload.pc
      if (payload.file) draft.currentFile = this.normalizeFilePath(payload.file)
      if (payload.line) draft.currentLine = payload.line

      console.log('🔧 调试会话已启动', {
        sessionId: draft.sessionId,
        payload_keys: Object.keys(payload)
      })
    })

    // 设置调试状态
    const debugStore = useDebugStore.getState()
    debugStore.setDebuggingState(true)
    debugStore.setPausedState(true)
    debugStore.setControlStates({
      canContinue: true,
      canStepOver: true,
      canStepInto: true,
      canStepOut: true,
      canStop: true
    })

    deviceService.setDebuggingState(true)

    // 更新位置
    if (payload.file && payload.line) {
      this.updateDebugStoreLocation(payload.file, payload.line)
    }

    // 启动快照服务并处理快照
    debugSnapshotService.start()
    this.handleDebugSnapshot(payload)

    // 🔧 新增：调试启动时默认切换到变量窗口
    setTimeout(() => {
      const switchToVariablesEvent = new CustomEvent('switch-to-variables-panel')
      document.dispatchEvent(switchToVariablesEvent)
    }, 100)

    consoleService.debugger.success('✅ 调试会话启动成功')

    // 立即关闭调试启动模态框（响应式关闭）
    import('../services/navigationModal').then(({ default: navigationModalService }) => {
      navigationModalService.hideModal()
    })

    this.emit('debugStarted', payload)
  }

  private handleDebugStopped(payload: any): void {
    console.log('🛑 处理调试停止事件:', payload)

    // 🔧 简化：直接停止调试会话，不区分暂停和停止
    this.updateState(draft => {
      draft.isDebugging = false
      draft.isStopping = false
      draft.sessionId = ''
      draft.currentPC = ''
      draft.currentFile = ''
      draft.currentLine = 0
      draft.debugState = 'disconnected'
    })

    // 重置所有按钮状态
    const debugStore = useDebugStore.getState()
    debugStore.handleDebugStopped()
    deviceService.setDebuggingState(false)
    debugSnapshotService.stop()

    consoleService.debugger.info('⏹️ 调试会话已停止')
    this.emit('debugStopped', payload)
  }

  private handleBreakpointHit(payload: any): void {
    console.log('🔴 处理断点命中:', payload)

    // 🔧 修复：如果调试未启动，先启动调试状态
    if (!this.state.isDebugging) {
      console.log('🔧 断点命中时调试未启动，先设置调试状态')
      this.handleDebugStarted(payload)
    }

    // 更新会话状态
    this.updateState(draft => {
      draft.isDebugging = true
      draft.isStarting = false
      draft.debugState = 'paused'
      if (payload.file) draft.currentFile = this.normalizeFilePath(payload.file)
      if (payload.line) draft.currentLine = payload.line
      if (payload.pc) draft.currentPC = payload.pc
    })

    // 委托给控制器处理
    this.controller.handleBreakpointHit(payload)
    this.emit('breakpointHit', payload)
  }

  private handleLocationUpdate(payload: any): void {
    // 更新会话状态
    this.updateState(draft => {
      if (payload.pc) draft.currentPC = payload.pc
      if (payload.file) draft.currentFile = this.normalizeFilePath(payload.file)
      if (payload.line) draft.currentLine = payload.line
      draft.debugState = 'paused'
    })

    // 委托给控制器处理
    this.controller.handleLocationUpdate(payload)
    this.emit('locationChanged', payload)
  }

  private handleProgramRunning(): void {
    this.updateState(draft => {
      draft.debugState = 'running'
    })

    this.controller.handleProgramRunning()
    this.emit('programRunning')
  }

  private handleDebugError(payload: any): void {
    const errorMessage = payload.message || payload.error || '调试过程中发生错误'
    consoleService.debugger.error(`❌ 调试错误: ${errorMessage}`)

    if (this.state.isStarting) {
      this.updateState(draft => { draft.isStarting = false })
    }

    this.emit('debugError', payload)
  }

  private handleDebugSnapshot(payload: any): void {
    console.log('📸 收到调试快照:', payload)

    // 🔧 修复：如果收到快照但调试状态不正确，先修正状态
    if (!this.state.isDebugging && this.state.isStarting) {
      console.log('🔧 收到快照，修正调试状态为已启动')
      this.handleDebugStarted(payload)
    }

    // 🔧 修复：确保快照服务已启动
    if (!debugSnapshotService.isActive()) {
      console.log('🔧 启动快照服务')
      debugSnapshotService.start()
    }

    // 🔧 简化：处理文件打开
    if (payload.file && payload.line) {
      console.log('📍 快照包含位置信息:', {
        file: payload.file,
        line: payload.line,
        lineType: typeof payload.line
      })
      this.tryOpenFile(payload.file, payload.line)
    }

    debugSnapshotService.processSnapshot(payload)
  }

  // 🔧 新增：标准DAP事件处理方法
  private handleStoppedEvent(payload: any): void {
    console.log('🔧 处理标准DAP stopped事件:', payload)

    // 根据停止原因分发到具体处理方法
    switch (payload.reason) {
      case 'breakpoint':
        this.handleBreakpointHit(payload)
        break
      case 'step':
        this.handleLocationUpdate(payload)
        break
      case 'pause':
        this.handleLocationUpdate(payload)
        break
      default:
        this.handleLocationUpdate(payload)
    }
  }

  private handleContinuedEvent(payload: any): void {
    console.log('🔧 处理标准DAP continued事件:', payload)
    this.handleProgramRunning()
  }

  // ===== 辅助方法 =====

  private normalizeFilePath(file: any): string {
    if (typeof file === 'object' && file !== null) {
      return file.path || ''
    } else if (typeof file === 'string') {
      return file
    } else {
      return ''
    }
  }

  private updateDebugStoreLocation(file: string, line: number): void {
    const debugStore = useDebugStore.getState()
    const normalizedPath = this.normalizeFilePath(file)
    debugStore.setCurrentLocation(normalizedPath, line)
    console.log('📍 更新调试位置:', normalizedPath, line)
  }

  /**
   * 简化的文件打开 - 调试过程中静默执行，不显示模态框
   */
  private tryOpenFile(filePath: string, lineNumber: number): void {
    try {
      console.log('📂 调试过程中静默打开文件:', { filePath, lineNumber })

      // 直接调用fileStore的openFile方法，不显示模态框
      import('../stores/fileStore').then(({ default: useFileStore }) => {
        const fileStore = useFileStore.getState()
        fileStore.openFile(filePath).then(() => {
          console.log('✅ 调试文件打开成功:', filePath)

          // 🔧 重构：使用统一的文件导航服务，静默跳转
          setTimeout(() => {
            console.log('🎯 发送调试跳转事件:', {
              lineNumber,
              lineType: typeof lineNumber,
              isDebugLocation: true
            })
            const jumpEvent = new CustomEvent('editor-jump-to-line', {
              detail: {
                line: lineNumber,
                highlight: true,
                isDebugLocation: true
              }
            })
            document.dispatchEvent(jumpEvent)
          }, 500) // 减少延迟，提升调试体验

        }).catch(() => {
          console.warn('⚠️ 调试文件打开失败，可能是系统库文件:', filePath)
          // 调试过程中的文件打开失败不显示模态框，只在控制台记录
        })
      })

    } catch (error) {
      console.error('❌ 调试文件打开异常:', error)
      // 调试过程中的异常不显示模态框，只在控制台记录
    }
  }

  handleWebSocketDisconnected(): void {
    this.updateState(draft => {
      draft.isStarting = false
      draft.isStopping = false
      if (draft.isDebugging) {
        draft.isDebugging = false
        draft.debugState = 'disconnected'
        draft.sessionId = ''
      }
    })

    const debugStore = useDebugStore.getState()
    debugStore.setDebuggingState(false)
    debugStore.setPausedState(false)

    deviceService.setDebuggingState(false)
    debugSnapshotService.stop()

    consoleService.debugger.warning('🔌 WebSocket连接断开，调试会话已重置')
  }
}

// 导出单例实例
const debugSession = new DebugSession()
export default debugSession
