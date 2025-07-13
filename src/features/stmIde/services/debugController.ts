/**
 * 调试控制器 - 负责调试命令执行和事件处理
 * 从 debugSession.ts 拆分出来，遵循单一职责原则
 */

import wsService from './websocket'
import consoleService from './console'
import { useDebugStore } from '../stores/debugStore'
import { useBreakpointStore } from '../stores/breakpointStore'
import debugSnapshotService from './debugSnapshot'

// 定义调试结果接口
interface DebugResult {
  success: boolean
  message: string
  error?: string
}

export interface DebugControllerState {
  sessionId: string
  isDebugging: boolean
  debugState: 'disconnected' | 'running' | 'paused'
  currentFile: string
  currentLine: number
  currentPC: string
}

/**
 * 调试控制器类 - 处理调试命令和事件
 */
export class DebugController {
  private state: DebugControllerState

  // 防频繁点击状态管理
  private operationStates = {
    stepping: false,
    continuing: false,
    pausing: false,
    stepInto: false,
    stepOut: false
  }

  constructor(initialState: DebugControllerState) {
    this.state = initialState
  }

  // ===== 状态管理 =====

  updateState(updater: (draft: DebugControllerState) => void): void {
    const newState = { ...this.state }
    updater(newState)
    this.state = newState
  }

  getState(): DebugControllerState {
    return { ...this.state }
  }

  // 更新调试控制按钮状态
  private updateDebugControlStates(enabled: boolean): void {
    const debugStore = useDebugStore.getState()
    debugStore.setControlStates({
      canContinue: enabled && this.state.debugState === 'paused',
      canStepOver: enabled && this.state.debugState === 'paused',
      canStepInto: enabled && this.state.debugState === 'paused',
      canStepOut: enabled && this.state.debugState === 'paused'
    })
  }

  // ===== 调试控制命令 =====

  async continue(): Promise<DebugResult> {
    const result = await this.sendDebugCommand('debug.continue', '▶️', '继续执行')

    if (result.success) {
      this.updateState(draft => {
        draft.debugState = 'running'
      })

      const debugStore = useDebugStore.getState()
      debugStore.setPausedState(false)
      debugStore.setControlStates({
        canContinue: false,
        canStepOver: false,
        canStepInto: false,
        canStepOut: false
      })
    }

    return result
  }

  async pause(): Promise<DebugResult> {
    return this.sendDebugCommand('debug.pause', '⏸️', '暂停执行')
  }

  async stepOver(): Promise<DebugResult> {
    // 防频繁点击检查
    if (this.operationStates.stepping) {
      return { success: false, message: '单步操作正在进行中，请等待...' }
    }

    console.log('🔧 stepOver方法被调用', {
      isDebugging: this.state.isDebugging,
      sessionId: this.state.sessionId,
      debugState: this.state.debugState,
      currentFile: this.state.currentFile,
      currentLine: this.state.currentLine
    })

    if (!this.state.isDebugging || !this.state.sessionId) {
      console.log('🔧 单步执行被拒绝：没有调试会话')
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      // 设置操作状态，禁用按钮
      this.operationStates.stepping = true
      this.updateDebugControlStates(false)

      console.log('🔧 发送单步命令:', {
        session_id: this.state.sessionId,
        type: 'step_over'
      })

      wsService.send('debug.step', {
        session_id: this.state.sessionId,
        type: 'step_over'
      })

      return { success: true, message: '单步执行命令已发送' }
    } catch (error) {
      // 出错时恢复按钮状态
      this.operationStates.stepping = false
      this.updateDebugControlStates(true)

      const errorMessage = error instanceof Error ? error.message : '单步执行失败'
      consoleService.debugger.error(`❌ 单步执行失败: ${errorMessage}`)
      return { success: false, message: errorMessage }
    }
  }

  async stepInto(): Promise<DebugResult> {
    // 防频繁点击检查
    if (this.operationStates.stepInto) {
      return { success: false, message: '步入操作正在进行中，请等待...' }
    }

    if (!this.state.isDebugging || !this.state.sessionId) {
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      // 设置操作状态，禁用按钮
      this.operationStates.stepInto = true
      this.updateDebugControlStates(false)

      wsService.send('debug.step', {
        session_id: this.state.sessionId,
        type: 'step_into'
      })
      return { success: true, message: '步入函数命令已发送' }
    } catch (error) {
      // 出错时恢复按钮状态
      this.operationStates.stepInto = false
      this.updateDebugControlStates(true)

      const errorMessage = error instanceof Error ? error.message : '步入函数失败'
      consoleService.debugger.error(`❌ 步入函数失败: ${errorMessage}`)
      return { success: false, message: errorMessage }
    }
  }

  async stepOut(): Promise<DebugResult> {
    // 防频繁点击检查
    if (this.operationStates.stepOut) {
      return { success: false, message: '步出操作正在进行中，请等待...' }
    }

    if (!this.state.isDebugging || !this.state.sessionId) {
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      // 设置操作状态，禁用按钮
      this.operationStates.stepOut = true
      this.updateDebugControlStates(false)

      wsService.send('debug.step', {
        session_id: this.state.sessionId,
        type: 'step_out'
      })
      return { success: true, message: '步出函数命令已发送' }
    } catch (error) {
      // 出错时恢复按钮状态
      this.operationStates.stepOut = false
      this.updateDebugControlStates(true)

      const errorMessage = error instanceof Error ? error.message : '步出函数失败'
      consoleService.debugger.error(`❌ 步出函数失败: ${errorMessage}`)
      return { success: false, message: errorMessage }
    }
  }

  // ===== 断点管理 =====

  async setBreakpoint(filePath: string, lineNumber: number): Promise<DebugResult> {
    if (!this.state.isDebugging || !this.state.sessionId) {
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      const location = `${filePath}:${lineNumber}`
      console.log('🔴 设置断点:', location)

      wsService.send('debug.breakpoint.set', {
        session_id: this.state.sessionId,
        location: location,
        enabled: true
      })

      return { success: true, message: '断点设置请求已发送' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '设置断点失败'
      consoleService.debugger.error(`❌ 设置断点失败: ${errorMessage}`)
      return { success: false, message: errorMessage }
    }
  }

  async removeBreakpoint(filePath: string, lineNumber: number): Promise<DebugResult> {
    if (!this.state.isDebugging || !this.state.sessionId) {
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      const location = `${filePath}:${lineNumber}`
      console.log('🔴 删除断点:', location)

      wsService.send('debug.breakpoint.delete', {
        session_id: this.state.sessionId,
        location: location
      })

      return { success: true, message: '断点删除请求已发送' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除断点失败'
      consoleService.debugger.error(`❌ 删除断点失败: ${errorMessage}`)
      return { success: false, message: errorMessage }
    }
  }

  // ===== 私有辅助方法 =====

  private async sendDebugCommand(command: string, icon: string, description: string): Promise<DebugResult> {
    if (!this.state.isDebugging) {
      return { success: false, message: '当前没有调试会话' }
    }

    try {
      // 🔧 健壮性优化：检查 WebSocket 连接状态
      if (!wsService.connected) {
        consoleService.debugger.error('❌ WebSocket 连接已断开')
        return { success: false, message: 'WebSocket 连接已断开，请重试' }
      }

      if (command === 'debug.step') {
        console.log('📤 发送单步执行命令:', {
          sessionId: this.state.sessionId,
          currentFile: this.state.currentFile,
          currentLine: this.state.currentLine
        })
      }

      wsService.send(command, { session_id: this.state.sessionId })
      return { success: true, message: `${description}命令已发送` }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${description}失败`
      consoleService.debugger.error(`❌ ${description}失败: ${errorMessage}`)

      // 🔧 健壮性优化：如果是连接问题，提示用户
      if (errorMessage.includes('连接') || errorMessage.includes('WebSocket') || errorMessage.includes('网络')) {
        consoleService.debugger.info('🔄 检测到连接问题，WebSocket 会自动重连')
      }

      return { success: false, message: errorMessage }
    }
  }



  // ===== 事件处理器 =====

  handleBreakpointHit(payload: any): void {
    // 🔧 简化输出：移除断点命中的详细日志
    // consoleService.debugger.info('🔴 断点命中')

    // 更新内部状态
    this.updateState(draft => {
      draft.debugState = 'paused'
      if (payload.file) draft.currentFile = this.normalizeFilePath(payload.file)
      if (payload.line) draft.currentLine = payload.line
      if (payload.pc) draft.currentPC = payload.pc
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

    // 更新位置和验证断点
    if (payload.file && payload.line) {
      this.updateDebugStoreLocation(payload.file, payload.line)
      this.forceEditorHighlightUpdate(payload.file, payload.line)
    }

    // 基于 DAP 标准：程序停止时更新断点状态为已验证（实心）
    this.updateBreakpointsForStoppedState()

    // 处理快照数据
    this.handleDebugSnapshot(payload)
  }

  handleLocationUpdate(payload: any): void {
    console.log('📍 位置更新:', payload)

    // 恢复操作状态（响应完成）- 基于 DAP 标准
    this.operationStates.stepping = false
    this.operationStates.stepInto = false
    this.operationStates.stepOut = false
    this.operationStates.continuing = false

    // 更新内部状态
    this.updateState(draft => {
      if (payload.pc) draft.currentPC = payload.pc
      if (payload.file) draft.currentFile = this.normalizeFilePath(payload.file)
      if (payload.line) draft.currentLine = payload.line
      draft.debugState = 'paused'
    })

    // 🔧 优雅解决：利用 immer 状态持久化，统一处理状态和高亮
    this.updateDebugStoreLocation(payload.file, payload.line)

    // 设置按钮状态并获取更新后的状态
    const debugStore = useDebugStore.getState()
    debugStore.setPausedState(true)
    debugStore.setControlStates({
      canContinue: true,
      canStepOver: true,
      canStepInto: true,
      canStepOut: true,
      canStop: true
    })

    // immer 保证了状态持久化，始终有有效的位置信息
    if (debugStore.currentFile && debugStore.currentLine) {
      this.forceEditorHighlightUpdate(debugStore.currentFile, debugStore.currentLine)
    }

    // 基于 DAP 标准：程序停止时更新断点状态为已验证（实心）
    this.updateBreakpointsForStoppedState()

    // 直接处理快照数据
    this.handleDebugSnapshot(payload)
  }

  handleProgramRunning(): void {
    console.log('▶️ 程序开始运行')

    // 清除所有操作状态
    this.operationStates.stepping = false
    this.operationStates.stepInto = false
    this.operationStates.stepOut = false
    this.operationStates.continuing = false

    this.updateState(draft => {
      draft.debugState = 'running'
    })

    // 基于 DAP 标准：程序运行时禁用所有控制按钮
    const debugStore = useDebugStore.getState()
    debugStore.setPausedState(false)
    debugStore.setControlStates({
      canContinue: false,    // 运行中不能继续
      canStepOver: false,    // 运行中不能单步
      canStepInto: false,    // 运行中不能步入
      canStepOut: false,     // 运行中不能步出
      canStop: true          // 运行中可以停止
    })

    // 基于 DAP 标准：更新断点状态为未验证（空心）
    this.updateBreakpointsForRunningState()
  }

  // 基于 DAP 标准：更新断点状态
  private updateBreakpointsForRunningState(): void {
    const breakpointStore = useBreakpointStore.getState()
    // 程序运行时，所有断点变为未验证状态（空心）
    breakpointStore.setAllVerified(false)
  }

  private updateBreakpointsForStoppedState(): void {
    const breakpointStore = useBreakpointStore.getState()
    // 程序停止时，所有断点变为已验证状态（实心）
    breakpointStore.setAllVerified(true)
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
  }

  private forceEditorHighlightUpdate(file: any, line: number): void {
    try {
      const normalizedPath = this.normalizeFilePath(file)

      if (typeof window !== 'undefined') {
        // 🔧 根源修复：直接发送高亮事件，移除复杂的事件转换链
        const debugLocationEvent = new CustomEvent('debug-location-changed', {
          detail: {
            file: normalizedPath,
            line: line
          }
        })
        document.dispatchEvent(debugLocationEvent)

        // 同时发送跳转事件确保滚动
        const jumpEvent = new CustomEvent('editor-jump-to-line', {
          detail: {
            line: line,
            column: 1,
            highlight: true,
            isDebugLocation: true
          }
        })
        document.dispatchEvent(jumpEvent)
      }
    } catch (error) {
      console.error('📍 强制更新编辑器高亮失败:', error)
    }
  }

  /**
   * 请求打开文件 - 复用definitionService的文件下载机制
   */
  requestFileOpen(filePath: string, lineNumber?: number): void {
    console.log('📍 发送调试文件打开请求:', { filePath, lineNumber })

    try {
      // 🔧 修复：确保参数格式正确匹配EditorContainer的期望
      const event = new CustomEvent('open-file-request', {
        detail: {
          filePath: filePath,  // 确保字段名正确
          line: lineNumber,
          source: 'debug',
          isDebugLocation: true,
          highlight: true
        }
      })

      console.log('📍 发送事件详情:', event.detail)
      document.dispatchEvent(event)  // 使用document而不是window

      // 🔧 调试：添加全局事件监听器测试
      const testListener = (e: Event) => {
        console.log('📍 全局监听器收到open-file-request事件:', (e as CustomEvent).detail)
        document.removeEventListener('open-file-request', testListener)
      }
      document.addEventListener('open-file-request', testListener)

      // 🔧 调试：验证事件是否被发送
      setTimeout(() => {
        console.log('📍 事件发送完成，检查是否有响应')
      }, 100)

    } catch (error) {
      console.error('📍 发送文件打开请求失败:', error)
    }
  }

  private handleDebugSnapshot(payload: any): void {
    console.log('📸 收到调试快照:', payload)

    if (debugSnapshotService.isActive()) {
      debugSnapshotService.processSnapshot(payload)
    } else {
      console.log('📸 快照服务未激活，尝试启动...')
      debugSnapshotService.start()
      debugSnapshotService.processSnapshot(payload)
    }
  }
}
