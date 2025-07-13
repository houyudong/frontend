import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'

// 启用Immer的Map/Set支持
enableMapSet()

/**
 * 断点接口 - 统一格式（遵循DRY原则）
 */
export interface Breakpoint {
  id: string           // 统一格式："file:line"
  filePath: string     // 文件路径（保持兼容性）
  lineNumber: number   // 行号（保持兼容性）
  enabled: boolean     // 是否启用
  verified: boolean    // 是否验证成功
  condition?: string   // 条件表达式
  hitCount: number     // 命中次数
  message?: string     // 错误信息或状态信息
}

/**
 * 调试状态接口 - 纯状态管理（遵循奥卡姆原则）
 */
export interface DebugState {
  // 调试会话状态
  isDebugging: boolean
  isConnected: boolean
  isPaused: boolean
  debugState: 'disconnected' | 'connecting' | 'connected' | 'running' | 'paused'
  sessionId: string | null

  // 当前执行位置
  currentFile?: string
  currentLine?: number
  currentPC?: string

  // 断点存储（纯状态）
  breakpoints: Map<string, Breakpoint[]>  // 文件路径 -> 断点列表
  allBreakpoints: Breakpoint[]            // 所有断点的平铺列表

  // 调试控制状态
  canContinue: boolean
  canStepOver: boolean
  canStepInto: boolean
  canStepOut: boolean
  canRestart: boolean
  canStop: boolean
  isStarting: boolean
  isStopping: boolean
}

/**
 * 调试操作接口 - 纯状态操作（遵循职责分离原则）
 */
export interface DebugActions {
  // 调试事件处理
  handleDebugStarted: (sessionId: string) => void
  handleDebugStopped: () => void
  handleProgramPaused: (filePath?: string, lineNumber?: number) => void
  handleProgramRunning: () => void

  // 断点状态管理（纯状态操作）
  setBreakpoint: (breakpoint: Breakpoint) => void
  removeBreakpoint: (filePath: string, lineNumber: number) => void
  updateBreakpoint: (id: string, updates: Partial<Breakpoint>) => void
  clearAllBreakpoints: () => void
  getFileBreakpoints: (filePath: string) => Breakpoint[]

  // 状态更新
  setDebugState: (state: DebugState['debugState']) => void
  setCurrentLocation: (filePath?: string, lineNumber?: number, pc?: string) => void
  updateControlStates: (states: Partial<Pick<DebugState, 'canContinue' | 'canStepOver' | 'canStepInto' | 'canStepOut' | 'canRestart' | 'canStop'>>) => void

  // 兼容性方法（保持现有代码工作）
  addBreakpoint: (filePath: string, lineNumber: number, condition?: string) => void
  enableBreakpoint: (id: string, enabled: boolean) => void
  updateBreakpointVerification: (id: string, verified: boolean, message?: string) => void
  setDebuggingState: (isDebugging: boolean) => void
  setConnectionState: (isConnected: boolean) => void
  setPausedState: (isPaused: boolean) => void
  setControlStates: (states: Partial<Pick<DebugState, 'canContinue' | 'canStepOver' | 'canStepInto' | 'canStepOut' | 'canRestart' | 'canStop'>>) => void

  // 调试控制（委托给服务层）
  startDebugging: () => Promise<boolean>
  stopDebugging: () => Promise<boolean>
  continueDebugging: () => Promise<boolean>
  stepOver: () => Promise<boolean>
  stepInto: () => Promise<boolean>
  stepOut: () => Promise<boolean>
  restart: () => Promise<boolean>
}

/**
 * 调试状态存储 - 基于cortex-debug和debug工程的架构
 */
export const useDebugStore = create<DebugState & DebugActions>()(
  immer((set, get) => ({
    // 初始状态
    isDebugging: false,
    isConnected: false,
    isPaused: false,
    debugState: 'disconnected',
    sessionId: null,
    breakpoints: new Map(),
    allBreakpoints: [],
    canContinue: false,
    canStepOver: false,
    canStepInto: false,
    canStepOut: false,
    canRestart: false,
    canStop: false,
    isStarting: false,
    isStopping: false,

    // 断点状态管理（纯状态操作）
    setBreakpoint: (breakpoint: Breakpoint) => {
      set((draft) => {
        const fileBreakpoints = draft.breakpoints.get(breakpoint.filePath) || []

        // 检查是否已存在
        const existingIndex = fileBreakpoints.findIndex(bp => bp.id === breakpoint.id)
        if (existingIndex !== -1) {
          // 更新现有断点
          fileBreakpoints[existingIndex] = breakpoint
        } else {
          // 添加新断点
          fileBreakpoints.push(breakpoint)
          fileBreakpoints.sort((a, b) => a.lineNumber - b.lineNumber)
        }

        draft.breakpoints.set(breakpoint.filePath, fileBreakpoints)

        // 更新全局列表
        const globalIndex = draft.allBreakpoints.findIndex(bp => bp.id === breakpoint.id)
        if (globalIndex !== -1) {
          draft.allBreakpoints[globalIndex] = breakpoint
        } else {
          draft.allBreakpoints.push(breakpoint)
        }
      })
    },

    // 兼容性方法（保持现有代码工作）
    addBreakpoint: (filePath: string, lineNumber: number, condition?: string) => {
      const id = `${filePath}:${lineNumber}`
      const breakpoint: Breakpoint = {
        id,
        filePath,
        lineNumber,
        enabled: true,
        condition,
        hitCount: 0,
        verified: false // 默认未验证，等待后端确认
      }
      get().setBreakpoint(breakpoint)

      // 触发事件（保持兼容性）
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('breakpoint-added', {
          detail: { file: filePath, line: lineNumber, breakpoint }
        }))
      }, 0)
    },

    removeBreakpoint: (filePath: string, lineNumber: number) => {
      set((draft) => {
        const id = `${filePath}:${lineNumber}`

        // 从文件断点列表中删除
        for (const [file, breakpoints] of draft.breakpoints.entries()) {
          if (file === filePath) {
            const index = breakpoints.findIndex(bp => bp.lineNumber === lineNumber)
            if (index !== -1) {
              breakpoints.splice(index, 1)
              if (breakpoints.length === 0) {
                draft.breakpoints.delete(file)
              }
              break
            }
          }
        }

        // 从全局断点列表中删除
        const globalIndex = draft.allBreakpoints.findIndex(bp => bp.id === id)
        if (globalIndex !== -1) {
          draft.allBreakpoints.splice(globalIndex, 1)
        }
      })

      // 触发事件（保持兼容性）
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('breakpoint-removed', {
          detail: { file: filePath, line: lineNumber }
        }))
      }, 0)
    },

    updateBreakpoint: (id: string, updates: Partial<Breakpoint>) => {
      set((draft) => {
        // 更新文件断点列表
        for (const breakpoints of draft.breakpoints.values()) {
          const breakpoint = breakpoints.find(bp => bp.id === id)
          if (breakpoint) {
            Object.assign(breakpoint, updates)
            break
          }
        }

        // 更新全局断点列表
        const globalBreakpoint = draft.allBreakpoints.find(bp => bp.id === id)
        if (globalBreakpoint) {
          Object.assign(globalBreakpoint, updates)
        }
      })
    },

    enableBreakpoint: (id: string, enabled: boolean) => {
      set((draft) => {
        // 更新文件断点列表
        for (const [, breakpoints] of draft.breakpoints.entries()) {
          const breakpoint = breakpoints.find(bp => bp.id === id)
          if (breakpoint) {
            breakpoint.enabled = enabled
            break
          }
        }

        // 更新全局断点列表
        const globalBreakpoint = draft.allBreakpoints.find(bp => bp.id === id)
        if (globalBreakpoint) {
          globalBreakpoint.enabled = enabled
        }
      })
    },

    clearAllBreakpoints: () => {
      set((draft) => {
        draft.breakpoints.clear()
        draft.allBreakpoints = []
        console.log('🔴 清除所有断点')
      })
      // 🔧 新增：清除本地存储的断点
      try {
        localStorage.removeItem('stmide_breakpoints')
        console.log('💾 本地存储的断点已清除')
      } catch (error) {
        console.warn('⚠️ 清除本地存储断点失败:', error)
      }
    },

    // 🔧 新增：断点持久化功能
    saveBreakpointsToStorage: () => {
      try {
        const { allBreakpoints } = get()
        const breakpointsData = allBreakpoints.map(bp => ({
          id: bp.id,
          filePath: bp.filePath,
          lineNumber: bp.lineNumber,
          enabled: bp.enabled,
          condition: bp.condition
        }))
        localStorage.setItem('stmide_breakpoints', JSON.stringify(breakpointsData))
        console.log('💾 断点已保存到本地存储:', breakpointsData.length)
      } catch (error) {
        console.warn('⚠️ 保存断点到本地存储失败:', error)
      }
    },

    loadBreakpointsFromStorage: () => {
      try {
        const stored = localStorage.getItem('stmide_breakpoints')
        if (!stored) return

        const breakpointsData = JSON.parse(stored)
        if (!Array.isArray(breakpointsData)) return

        set((draft) => {
          draft.breakpoints.clear()
          draft.allBreakpoints = []

          breakpointsData.forEach((bpData: any) => {
            if (bpData.id && bpData.filePath && typeof bpData.lineNumber === 'number') {
              const breakpoint: Breakpoint = {
                id: bpData.id,
                filePath: bpData.filePath,
                lineNumber: bpData.lineNumber,
                enabled: bpData.enabled ?? true,
                verified: false, // 重新加载时需要重新验证
                condition: bpData.condition,
                hitCount: 0,
                message: '等待验证...'
              }

              // 添加到文件断点列表
              const fileBreakpoints = draft.breakpoints.get(bpData.filePath) || []
              fileBreakpoints.push(breakpoint)
              draft.breakpoints.set(bpData.filePath, fileBreakpoints)

              // 添加到全局断点列表
              draft.allBreakpoints.push(breakpoint)
            }
          })
        })

        console.log('📂 从本地存储加载断点:', breakpointsData.length)
      } catch (error) {
        console.warn('⚠️ 从本地存储加载断点失败:', error)
      }
    },

    getFileBreakpoints: (filePath: string) => {
      return get().breakpoints.get(filePath) || []
    },

    // 状态更新方法
    setDebugState: (state: DebugState['debugState']) => {
      set((draft) => {
        draft.debugState = state
      })
    },

    setCurrentLocation: (filePath?: string, lineNumber?: number, pc?: string) => {
      set((draft) => {
        // 🔧 优雅解决：使用 immer 的状态持久化机制
        // 只有在有新位置信息时才更新，否则保持当前状态
        if (filePath !== undefined) draft.currentFile = filePath
        if (lineNumber !== undefined) draft.currentLine = lineNumber
        if (pc !== undefined) draft.currentPC = pc
      })
    },

    updateControlStates: (states: Partial<Pick<DebugState, 'canContinue' | 'canStepOver' | 'canStepInto' | 'canStepOut' | 'canRestart' | 'canStop'>>) => {
      set((draft) => {
        Object.assign(draft, states)
      })
    },

    // 🔥 新增：调试会话启动成功处理 - 基于debug工程
    handleDebugStarted: (sessionId: string) => {
      set((draft) => {
        draft.isDebugging = true
        draft.isConnected = true
        draft.debugState = 'paused' // 🔥 修复：调试启动后默认为暂停状态
        draft.sessionId = sessionId
        draft.isStarting = false
        draft.isPaused = true // 🔥 修复：设置为暂停状态
        draft.canStop = true
        draft.canContinue = true // 🔥 修复：允许继续执行
        draft.canStepOver = true // 🔥 修复：允许单步执行
        draft.canStepInto = true
        draft.canStepOut = true

        // 🔥 修复：调试启动时断点保持已验证状态（实心）
        // 只有后端明确返回失败时才设为未验证
        console.log('🔴 调试启动，断点保持已验证状态')
      })
      console.log('✅ 调试会话启动成功，程序已暂停:', sessionId)
    },

    // 🔥 新增：调试会话停止处理 - 基于debug工程
    handleDebugStopped: () => {
      set((draft) => {
        draft.isDebugging = false
        draft.isPaused = false
        draft.isConnected = false
        draft.debugState = 'disconnected'
        draft.sessionId = null
        draft.currentFile = undefined
        draft.currentLine = undefined
        draft.canContinue = false
        draft.canStepOver = false
        draft.canStepInto = false
        draft.canStepOut = false
        draft.canRestart = false
        draft.canStop = false
        draft.isStarting = false
        draft.isStopping = false

        // 将所有断点标记为已验证（实心显示）
        for (const breakpoints of draft.breakpoints.values()) {
          breakpoints.forEach(bp => {
            bp.verified = true
          })
        }
        draft.allBreakpoints.forEach(bp => {
          bp.verified = true
        })
      })
      console.log('🛑 调试会话已停止')
    },

    // 🔥 新增：程序暂停处理 - 基于debug工程
    handleProgramPaused: (filePath?: string, lineNumber?: number) => {
      set((draft) => {
        draft.isPaused = true
        draft.debugState = 'paused'
        draft.currentFile = filePath
        draft.currentLine = lineNumber
        draft.canContinue = true
        draft.canStepOver = true
        draft.canStepInto = true
        draft.canStepOut = true
      })
      console.log('⏸️ 程序已暂停:', { filePath, lineNumber })
    },

    // 🔥 新增：程序运行处理 - 基于debug工程
    handleProgramRunning: () => {
      set((draft) => {
        draft.isPaused = false
        draft.debugState = 'running'
        draft.canContinue = false
        draft.canStepOver = false
        draft.canStepInto = false
        draft.canStepOut = false
      })
      console.log('▶️ 程序正在运行')
    },

    // 调试控制（委托给服务层）
    startDebugging: async () => {
      console.log('🚀 启动调试')
      set((draft) => { draft.isStarting = true })
      try {
        const { default: debugSession } = await import('../services/debugSession')
        const result = await debugSession.startDebug()
        if (!result.success) {
          set((draft) => { draft.isStarting = false })
        }
        return result.success
      } catch (error) {
        set((draft) => { draft.isStarting = false })
        console.error('启动调试失败:', error)
        return false
      }
    },

    stopDebugging: async () => {
      console.log('🛑 停止调试')
      set((draft) => { draft.isStopping = true })
      try {
        const { default: debugSession } = await import('../services/debugSession')
        const result = await debugSession.stopDebug()
        if (!result.success) {
          set((draft) => { draft.isStopping = false })
        }
        return result.success
      } catch (error) {
        set((draft) => { draft.isStopping = false })
        console.error('停止调试失败:', error)
        return false
      }
    },

    restart: async () => {
      console.log('🔄 重启调试')
      try {
        // 先停止，再启动
        const stopResult = await get().stopDebugging()
        if (stopResult) {
          // 等待一下确保停止完成
          await new Promise(resolve => setTimeout(resolve, 1000))
          return await get().startDebugging()
        }
        return false
      } catch (error) {
        console.error('重启调试失败:', error)
        return false
      }
    },

    continueDebugging: async () => {
      console.log('▶️ 继续调试')
      const { default: debugSession } = await import('../services/debugSession')
      const result = await debugSession.continue()
      return result.success
    },

    stepOver: async () => {
      console.log('👣 单步跳过')
      const { default: debugSession } = await import('../services/debugSession')
      const result = await debugSession.stepOver()
      return result.success
    },

    stepInto: async () => {
      console.log('👣 单步进入')
      const { default: debugSession } = await import('../services/debugSession')
      const result = await debugSession.stepInto()
      return result.success
    },

    stepOut: async () => {
      console.log('👣 单步跳出')
      const { default: debugSession } = await import('../services/debugSession')
      const result = await debugSession.stepOut()
      return result.success
    },

    // 兼容性方法（保持现有代码工作）
    setDebuggingState: (isDebugging: boolean) => {
      set((draft) => {
        draft.isDebugging = isDebugging
      })
    },

    setConnectionState: (isConnected: boolean) => {
      set((draft) => {
        draft.isConnected = isConnected
      })
    },

    setPausedState: (isPaused: boolean) => {
      set((draft) => {
        draft.isPaused = isPaused
      })
    },

    setControlStates: (states: Partial<Pick<DebugState, 'canContinue' | 'canStepOver' | 'canStepInto' | 'canStepOut' | 'canRestart' | 'canStop'>>) => {
      set((draft) => {
        Object.assign(draft, states)
      })
    },

    updateBreakpointVerification: (id: string, verified: boolean, message?: string) => {
      get().updateBreakpoint(id, { verified, message })
    }
  }))
)

export default useDebugStore
