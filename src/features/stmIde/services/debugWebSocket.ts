/**
 * 调试WebSocket处理器 - 基于debug工程的WebSocket消息处理
 */
import { useDebugStore } from '../stores/debugStore'
import breakpointService from './breakpoint'

class DebugWebSocket {
  private wsClient: any = null
  private initialized = false
  private retryCount = 0
  private maxRetries = 10 // 最多重试10次

  constructor() {
    // 延迟初始化，等待其他服务加载完成
    setTimeout(() => this.init(), 2000)

    // 监听WebSocket连接事件，确保连接后重新初始化
    if (typeof window !== 'undefined') {
      window.addEventListener('websocket-connected', () => {
        console.log('🔧 WebSocket连接事件，重新初始化debugWebSocket')
        this.forceInit()
      })
    }

    // 添加调试信息
    console.log('🔧 debugWebSocket 构造函数执行')
  }

  /**
   * 初始化调试服务
   */
  init() {
    // 防止重复初始化
    if (this.initialized) {
      return
    }

    // 检查重试次数
    if (this.retryCount >= this.maxRetries) {
      console.warn('⚠️ debugWebSocket初始化失败：超过最大重试次数')
      return
    }

    // 尝试获取WebSocket客户端
    this.wsClient = (window as any).wsClient

    if (this.wsClient) {
      // 检查WebSocket是否已连接
      if (this.wsClient.connected || this.wsClient.isConnected) {
        this.registerMessageHandlers()
        this.initialized = true
        console.log('🔧 调试WebSocket服务初始化完成')
      } else {
        this.retryCount++
        console.log(`⚠️ WebSocket未连接，第${this.retryCount}次重试...`)
        setTimeout(() => this.init(), 2000)
      }
    } else {
      this.retryCount++
      console.log(`⚠️ WebSocket客户端未就绪，第${this.retryCount}次重试...`)
      setTimeout(() => this.init(), 2000)
    }
  }

  /**
   * 手动初始化（当WebSocket连接建立后调用）
   */
  forceInit() {
    this.retryCount = 0
    this.initialized = false
    this.init()
  }

  /**
   * 获取调试状态存储
   */
  private getDebugStore() {
    return useDebugStore.getState()
  }

  /**
   * 注册WebSocket消息处理器 - 基于debug工程
   */
  registerMessageHandlers() {
    if (!this.wsClient) return

    // 调试会话启动
    this.wsClient.on('debug.started', (payload: any) => {
      console.log('🚀 调试会话启动:', payload)
      this.getDebugStore().handleDebugStarted(payload.session_id)

      // 同步现有断点到调试会话
      breakpointService.syncBreakpointsOnDebugStart()
    })

    // 🔥 关键：监听断点命中事件
    this.wsClient.on('debug.breakpoint-hit', (payload: any) => {
      this.handleBreakpointHit(payload)
    })

    // 断点命中事件（使用断点服务处理）
    this.wsClient.on('debug.breakpoint_hit', (payload: any) => {
      if (payload.breakpoint) {
        breakpointService.handleBreakpointHit(payload.breakpoint)
      }
    })

    // 🔥 关键：监听调试事件（通用事件处理）
    this.wsClient.on('debug.event', (payload: any) => {
      if (payload.event_type === 'debug.breakpoint-hit') {
        this.handleBreakpointHit(payload)
      }
    })

    // 调试会话停止
    this.wsClient.on('debug.stop', (payload: any) => {
      this.getDebugStore().handleDebugStopped()
    })

    // 🔧 重构：移除重复处理，由debugSession统一处理debug.stopped事件
    // debug.stopped事件现在由debugSession.ts统一处理，避免重复调用

    // 程序运行 - 基于 DAP 标准
    this.wsClient.on('debug.program_running', (payload: any) => {
      console.log('▶️ 程序开始运行事件:', payload)
      // 🔧 修复：只更新运行状态，不禁用按钮（由debugSession.ts统一处理）
      this.getDebugStore().setPausedState(false)
    })

    // 兼容性：保留旧的事件名
    this.wsClient.on('debug.running', (payload: any) => {
      console.log('▶️ 程序运行事件（兼容）:', payload)
      this.getDebugStore().setPausedState(false)
    })

    // 断点设置响应
    this.wsClient.on('debug.breakpoint.set', (payload: any) => {
      if (payload.error) {
        console.error('❌ 设置断点失败:', payload.error)

        // 更新断点为未验证状态
        if (payload.breakpoint) {
          const { file, line } = payload.breakpoint
          const id = `${file}:${line}`
          breakpointService.handleBreakpointVerification(id, false, payload.error)
        }
      } else {
        // 更新断点验证状态
        if (payload.breakpoint) {
          const { file, line, id, verified = true } = payload.breakpoint
          const breakpointId = id || `${file}:${line}`
          breakpointService.handleBreakpointVerification(breakpointId, verified, '设置成功')
        }
      }
    })

    // 🔥 添加更多断点相关事件监听
    this.wsClient.on('breakpoint-hit', (payload: any) => {
      this.handleBreakpointHit(payload)
    })

    this.wsClient.on('debug.breakpoint-hit', (payload: any) => {
      this.handleBreakpointHit(payload)
    })

    // 监听调试状态变化
    this.wsClient.on('debug.state', (payload: any) => {
      if (payload.state === 'stopped' && payload.reason === 'breakpoint-hit') {
        this.handleBreakpointHit(payload)
      }
    })

    // 断点删除响应
    this.wsClient.on('debug.breakpoint.delete', (payload: any) => {
      if (payload.error) {
        console.error('❌ 删除断点失败:', payload.error)
      }
    })

    // 断点删除响应（新协议）
    this.wsClient.on('debug.breakpoint.remove', (payload: any) => {
      if (payload.error) {
        console.error('❌ 删除断点失败:', payload.error)
      }
    })

    // 调试快照（变量、调用栈等）
    this.wsClient.on('debug.snapshot', (payload: any) => {

      // 更新当前位置
      if (payload.location) {
        const parts = payload.location.split(':')
        if (parts.length >= 2) {
          const filePath = parts[0]
          const lineNumber = parseInt(parts[1])
          this.getDebugStore().setCurrentLocation(filePath, lineNumber)

          // 跳转到当前执行位置
          this.navigateToLocation(filePath, lineNumber)
        }
      }

      // 注意：变量处理由现有的debugSession服务和debugSnapshotService处理
    })


  }

  /**
   * 设置现有断点到后端 - 基于debug工程
   */
  setupExistingBreakpoints() {
    const state = useDebugStore.getState()
    const allBreakpoints = state.allBreakpoints.filter(bp => bp.enabled)



    allBreakpoints.forEach(breakpoint => {
      const location = `${breakpoint.filePath}:${breakpoint.lineNumber}`

      // 🔥 关键修复：使用正确的消息格式
      const success = this.wsClient.send('debug.breakpoint.set', {
        location: location,
        condition: breakpoint.condition || '',
        enabled: true
      })

      if (!success) {
        console.error('🔴 ❌ 发送现有断点失败:', location)
      }
    })
  }

  /**
   * 处理断点命中 - 基于debug工程实现
   */
  handleBreakpointHit(payload: any) {

    // 解析位置信息
    let filePath = payload.file || payload.File
    let lineNumber = payload.line || payload.Line

    // 如果有location字段，解析它
    if (payload.location && !filePath) {
      const parts = payload.location.split(':')
      if (parts.length >= 2) {
        filePath = parts[0]
        lineNumber = parseInt(parts[1])
      }
    }

    // 更新调试状态
    this.getDebugStore().handleProgramPaused(filePath, lineNumber)

    // 🔥 关键：跳转到断点位置
    if (filePath && lineNumber) {
      this.navigateToLocation(filePath, lineNumber)

      // 验证断点
      const breakpointId = `${filePath}:${lineNumber}`
      this.getDebugStore().updateBreakpointVerification(breakpointId, true)
    }
  }

  /**
   * 跳转到指定位置 - 基于debug工程
   */
  navigateToLocation(filePath: string, lineNumber: number) {

    // 发送文件打开和跳转事件
    const openFileEvent = new CustomEvent('open-file-request', {
      detail: {
        filePath: filePath,
        line: lineNumber,
        column: 1,
        highlight: true,
        isDebugLocation: true // 标记为调试位置
      }
    })

    document.dispatchEvent(openFileEvent)
  }

  /**
   * 设置断点
   */
  async setBreakpoint(filePath: string, lineNumber: number, condition?: string): Promise<{ success: boolean, message?: string }> {
    if (!this.wsClient || !this.getDebugStore().isDebugging) {
      return { success: false, message: '调试会话未启动' }
    }

    try {
      const location = `${filePath}:${lineNumber}`
      const success = this.wsClient.send('debug.breakpoint.set', {
        location: location,
        condition: condition || '',
        enabled: true
      })

      if (success) {
        return { success: true }
      } else {
        return { success: false, message: 'WebSocket发送失败' }
      }
    } catch (error) {
      console.error('🔴 设置断点异常:', error)
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  }

  /**
   * 删除断点
   */
  async removeBreakpoint(filePath: string, lineNumber: number): Promise<{ success: boolean, message?: string }> {
    if (!this.wsClient || !this.getDebugStore().isDebugging) {
      return { success: false, message: '调试会话未启动' }
    }

    try {
      // 查找断点编号
      const breakpointId = `${filePath}:${lineNumber}`
      // TODO: 需要从状态中获取断点编号

      const success = this.wsClient.send('debug.breakpoint.delete', {
        breakpoint_id: breakpointId
      })

      if (success) {
        return { success: true }
      } else {
        return { success: false, message: 'WebSocket发送失败' }
      }
    } catch (error) {
      console.error('🔴 删除断点异常:', error)
      return { success: false, message: error instanceof Error ? error.message : '未知错误' }
    }
  }

  /**
   * 发送调试命令
   */
  sendCommand(command: string, params?: any) {
    if (!this.wsClient || !this.getDebugStore().isDebugging) {
      console.warn('⚠️ 调试会话未启动，无法发送命令:', command)
      return false
    }

    const sessionId = this.getDebugStore().sessionId
    const payload = { session_id: sessionId, ...params }

    return this.wsClient.send(command, payload)
  }

  /**
   * 继续执行
   */
  continue() {
    return this.sendCommand('debug.continue')
  }

  /**
   * 暂停执行
   */
  pause() {
    return this.sendCommand('debug.pause')
  }

  /**
   * 单步跳过
   */
  stepOver() {
    return this.sendCommand('debug.step')
  }

  /**
   * 单步进入
   */
  stepInto() {
    return this.sendCommand('debug.step_into')
  }

  /**
   * 单步跳出
   */
  stepOut() {
    return this.sendCommand('debug.step_out')
  }

  /**
   * 调试状态检查方法
   */
  checkStatus() {
    const debugStore = this.getDebugStore()
    return {
      initialized: this.initialized,
      wsClient: !!this.wsClient,
      wsConnected: this.wsClient?.connected || this.wsClient?.isConnected,
      debugStore: debugStore
    }
  }
}

// 创建单例实例
const debugWebSocket = new DebugWebSocket()

// 🔥 将debugWebSocket暴露到window对象
declare global {
  interface Window {
    debugWebSocket: DebugWebSocket
  }
}

;(window as any).debugWebSocket = debugWebSocket



export default debugWebSocket
