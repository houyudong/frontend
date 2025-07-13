/**
 * 调试快照管理服务
 * 负责处理调试快照数据和变量监视，基于debug工程的debugger-snap.js实现
 */

import { EventEmitter } from 'eventemitter3'
import { produce } from 'immer'
import consoleService from './console'

// 变量信息接口
export interface VariableInfo {
  name: string
  type: string
  value: string
  scope: 'global' | 'local'
  address?: string
  size?: number
  hasChanged?: boolean
  displayName?: string
}

// 寄存器信息接口
export interface RegisterInfo {
  name: string
  value: string
  description?: string
}

// 调用栈帧接口
export interface CallStackFrame {
  function: string
  file?: string
  line?: number
  address: string
  level: number
}

// 调试位置信息接口
export interface DebugLocation {
  file: string
  line: number
  address?: string
}

// 调试快照数据接口
export interface DebugSnapshot {
  pc?: string
  file?: string
  line?: number
  variables?: VariableInfo[]
  registers?: Record<string, string>
  callstack?: CallStackFrame[]
  timestamp: number
}

// 调试快照状态
interface DebugSnapshotState {
  currentSnapshot: DebugSnapshot | null
  variables: Map<string, VariableInfo>
  registers: Map<string, RegisterInfo>
  callstack: CallStackFrame[]
  currentLocation: DebugLocation | null
  isActive: boolean
  lastSnapshotTime: number
  lastSnapshotPC: string
}

class DebugSnapshotService extends EventEmitter {
  private state: DebugSnapshotState = {
    currentSnapshot: null,
    variables: new Map(),
    registers: new Map(),
    callstack: [],
    currentLocation: null,
    isActive: false,
    lastSnapshotTime: 0,
    lastSnapshotPC: ''
  }

  private config = {
    debounceTime: 100, // 防抖时间
    maxVariables: 1000 // 最大变量数量
  }

  constructor() {
    super()
    console.log('📸 调试快照服务初始化')
  }

  /**
   * 启动快照服务
   */
  start(): void {
    this.state = produce(this.state, draft => {
      draft.isActive = true
    })

    // 🔧 简化输出：移除快照服务启动的详细日志
    // consoleService.debugger.info('📸 调试快照服务已启动')
    this.emit('started')
  }

  /**
   * 停止快照服务
   */
  stop(): void {
    this.state = produce(this.state, draft => {
      draft.isActive = false
      draft.currentSnapshot = null
      draft.variables.clear()
      draft.registers.clear()
      draft.callstack = []
      draft.currentLocation = null
      draft.lastSnapshotTime = 0
      draft.lastSnapshotPC = ''
    })

    consoleService.debugger.info('📸 调试快照服务已停止')
    this.emit('stopped')
  }

  /**
   * 处理调试快照 - 核心方法
   */
  processSnapshot(payload: any): void {
    if (!this.state.isActive) {
      console.warn('📸 快照服务未激活，忽略快照数据')
      return
    }

    console.log('📸 处理调试快照:', payload)

    // 防抖处理
    if (!this.shouldProcessSnapshot(payload)) {
      console.log('📸 忽略重复快照')
      return
    }

    // 使用 Immer 更新状态
    this.state = produce(this.state, draft => {
      // 更新快照数据
      draft.currentSnapshot = {
        ...payload,
        timestamp: Date.now()
      }

      // 更新时间戳
      draft.lastSnapshotTime = Date.now()
      draft.lastSnapshotPC = payload.pc || ''
    })

    // 处理各种数据
    this.processLocationInfo(payload)

    if (payload.variables) {
      this.processVariables(payload.variables)
    }

    if (payload.registers) {
      this.processRegisters(payload.registers)
    }

    if (payload.callstack) {
      this.processCallstack(payload.callstack)
    }

    // 触发快照更新事件
    this.emit('snapshotUpdated', {
      snapshot: this.state.currentSnapshot,
      location: this.state.currentLocation
    })
  }

  /**
   * 判断是否应该处理快照
   */
  private shouldProcessSnapshot(payload: any): boolean {
    const currentTime = Date.now()
    const currentPC = payload.pc || ''

    // 检查时间间隔和PC值
    if (currentTime - this.state.lastSnapshotTime < this.config.debounceTime &&
        currentPC === this.state.lastSnapshotPC && currentPC !== '') {
      return false
    }

    return true
  }

  /**
   * 处理位置信息
   */
  private processLocationInfo(payload: any): void {
    if (payload.file && payload.line) {
      // 处理文件路径
      let filePath = payload.file
      if (typeof payload.file === 'object' && payload.file.path) {
        filePath = payload.file.path
      }

      this.state = produce(this.state, draft => {
        draft.currentLocation = {
          file: filePath,
          line: payload.line,
          address: payload.pc
        }
      })

      console.log('📍 调试位置:', {
        file: filePath,
        line: payload.line
      })

      // 触发位置变更事件
      this.emit('locationChanged', {
        file: filePath,
        line: payload.line,
        address: payload.pc
      })
    }
  }

  /**
   * 处理变量信息
   */
  processVariables(variables: any): void {
    console.log('📊 处理变量信息:', variables)

    this.state = produce(this.state, draft => {
      // 保存旧值用于变化检测
      const oldVariables = new Map(draft.variables)

      // 清空现有变量
      draft.variables.clear()

      // 处理变量数据
      if (Array.isArray(variables)) {
        variables.forEach((variable, index) => {
          if (index < this.config.maxVariables) {
            const name = variable.name || `var_${index}`
            const oldVar = oldVariables.get(name)
            const hasChanged = oldVar && oldVar.value !== variable.value

            draft.variables.set(name, {
              name,
              type: variable.type || 'unknown',
              value: variable.value || '...',
              scope: variable.scope || 'local',
              address: variable.address,
              size: variable.size,
              hasChanged,
              displayName: variable.displayName || name
            })
          }
        })
      }
    })

    // 触发变量更新事件
    this.emit('variablesUpdated', {
      variables: Array.from(this.state.variables.entries())
    })
  }

  /**
   * 处理寄存器信息
   */
  private processRegisters(registers: any): void {
    console.log('📊 处理寄存器信息:', registers)

    this.state = produce(this.state, draft => {
      // 清空现有寄存器
      draft.registers.clear()

      // 处理寄存器数据
      if (typeof registers === 'object') {
        Object.entries(registers).forEach(([name, value]) => {
          draft.registers.set(name, {
            name,
            value: String(value),
            description: this.getRegisterDescription(name)
          })
        })
      }
    })

    // 触发寄存器更新事件
    this.emit('registersUpdated', {
      registers: Array.from(this.state.registers.entries())
    })
  }

  /**
   * 处理调用栈信息
   */
  processCallstack(callstack: any): void {
    console.log('📊 处理调用栈信息:', callstack)

    this.state = produce(this.state, draft => {
      draft.callstack = Array.isArray(callstack) ? callstack : []
    })

    // 触发调用栈更新事件
    this.emit('callstackUpdated', {
      callstack: this.state.callstack
    })
  }

  /**
   * 获取寄存器描述
   */
  private getRegisterDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'r0': '通用寄存器 R0',
      'r1': '通用寄存器 R1',
      'r2': '通用寄存器 R2',
      'r3': '通用寄存器 R3',
      'r4': '通用寄存器 R4',
      'r5': '通用寄存器 R5',
      'r6': '通用寄存器 R6',
      'r7': '通用寄存器 R7',
      'r8': '通用寄存器 R8',
      'r9': '通用寄存器 R9',
      'r10': '通用寄存器 R10',
      'r11': '通用寄存器 R11',
      'r12': '通用寄存器 R12',
      'sp': '堆栈指针',
      'lr': '链接寄存器',
      'pc': '程序计数器',
      'xpsr': '程序状态寄存器'
    }

    return descriptions[name.toLowerCase()] || '未知寄存器'
  }

  // Getter 方法
  getVariable(name: string): VariableInfo | undefined {
    return this.state.variables.get(name)
  }



  getRegister(name: string): RegisterInfo | undefined {
    return this.state.registers.get(name)
  }

  getAllRegisters(): RegisterInfo[] {
    return Array.from(this.state.registers.values())
  }

  getCallstack(): CallStackFrame[] {
    return this.state.callstack
  }

  getCurrentLocation(): DebugLocation | null {
    return this.state.currentLocation
  }

  getCurrentSnapshot(): DebugSnapshot | null {
    return this.state.currentSnapshot
  }

  isActive(): boolean {
    return this.state.isActive
  }

  /**
   * 获取所有变量 - 按优先级排序
   */
  getAllVariables(): VariableInfo[] {
    const variables = Array.from(this.state.variables.values())

    // 🔥 按优先级排序：变化的局部变量 → 变化的全局变量 → 其他局部变量 → 其他全局变量
    return variables.sort((a, b) => {
      const getPriority = (variable: VariableInfo) => {
        if (variable.scope === 'local' && variable.hasChanged) return 1 // 变化的局部变量最优先
        if (variable.scope === 'global' && variable.hasChanged) return 2 // 变化的全局变量
        if (variable.scope === 'local' && !variable.hasChanged) return 3 // 其他局部变量
        return 4 // 其他全局变量
      }

      const priorityA = getPriority(a)
      const priorityB = getPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // 同优先级按变量名排序
      return a.name.localeCompare(b.name)
    })
  }
}

// 创建全局实例
const debugSnapshotService = new DebugSnapshotService()

export default debugSnapshotService
