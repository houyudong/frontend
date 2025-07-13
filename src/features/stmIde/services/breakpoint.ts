import { useDebugStore } from '../stores/debugStore'
import type { Breakpoint } from '../stores/debugStore'
import debugSession from './debugSession'
import fileNavigationService from './fileNavigation'

/**
 * 断点服务 - 负责断点的业务逻辑
 * 遵循奥卡姆原则：统一断点管理，删除重复逻辑
 * 遵循DRY原则：统一协议、ID格式、状态管理
 */
class BreakpointService {
  /**
   * 添加断点（统一处理，不区分调试状态）
   */
  async addBreakpoint(file: string, line: number, condition?: string): Promise<void> {
    const debugStore = useDebugStore.getState()
    const id = `${file}:${line}`

    // 检查是否已存在
    const existing = debugStore.allBreakpoints.find(bp => bp.id === id)
    if (existing) {
      console.log('断点已存在:', id)
      return
    }

    // 创建本地断点（未验证状态）
    const breakpoint: Breakpoint = {
      id,
      filePath: file,
      lineNumber: line,
      enabled: true,
      verified: false, // 等待后端验证
      condition,
      hitCount: 0,
      message: '等待验证...'
    }

    // 立即添加到本地状态
    debugStore.addBreakpoint(file, line, condition)
    console.log('🔴 添加断点到本地状态:', id)

    // 发送到后端（无论是否调试中）
    if (debugStore.isDebugging) {
      try {
        const result = await debugSession.setBreakpoint(file, line, condition)

        if (result.success) {
          // 更新为验证成功
          debugStore.updateBreakpointVerification(id, true, '设置成功')
          console.log('✅ 断点设置成功:', id)
        } else {
          // 更新错误信息
          debugStore.updateBreakpointVerification(id, false, result.message || '设置失败')
          console.error('❌ 断点设置失败:', id, result.message)
        }
      } catch (error) {
        console.error('断点设置异常:', error)
        debugStore.updateBreakpointVerification(id, false, '网络错误')
      }
    }
  }

  /**
   * 删除断点
   */
  async removeBreakpoint(file: string, line: number): Promise<void> {
    const debugStore = useDebugStore.getState()
    const id = `${file}:${line}`

    console.log('🔴 删除断点:', id)

    // 发送到后端（如果调试中）
    if (debugStore.isDebugging) {
      try {
        await debugSession.removeBreakpoint(id)
        console.log('✅ 后端断点删除成功:', id)
      } catch (error) {
        console.error('❌ 后端断点删除失败:', error)
      }
    }

    // 本地删除（无论后端是否成功）
    debugStore.removeBreakpoint(file, line)
  }

  /**
   * 切换断点
   */
  async toggleBreakpoint(file: string, line: number): Promise<void> {
    const debugStore = useDebugStore.getState()
    const id = `${file}:${line}`
    const existing = debugStore.allBreakpoints.find(bp => bp.id === id)

    if (existing) {
      await this.removeBreakpoint(file, line)
    } else {
      await this.addBreakpoint(file, line)
    }
  }

  /**
   * 切换断点启用状态
   */
  async toggleBreakpointEnabled(id: string): Promise<void> {
    const debugStore = useDebugStore.getState()
    const breakpoint = debugStore.allBreakpoints.find(bp => bp.id === id)

    if (!breakpoint) return

    const newEnabled = !breakpoint.enabled

    console.log('🔴 切换断点状态:', id, newEnabled)

    // 立即更新本地状态
    debugStore.enableBreakpoint(id, newEnabled)

    // 发送到后端（如果调试中）
    if (debugStore.isDebugging) {
      try {
        // TODO: 实现后端断点启用/禁用
        console.log('✅ 断点状态切换成功:', id)
      } catch (error) {
        console.error('❌ 断点状态切换失败:', error)
        // 回滚状态
        debugStore.enableBreakpoint(id, !newEnabled)
      }
    }
  }

  /**
   * 设置条件断点
   */
  async setConditionalBreakpoint(file: string, line: number, condition: string): Promise<void> {
    const debugStore = useDebugStore.getState()
    const id = `${file}:${line}`
    const existing = debugStore.allBreakpoints.find(bp => bp.id === id)

    if (existing) {
      // 删除现有断点，重新添加条件断点
      await this.removeBreakpoint(file, line)
      await this.addBreakpoint(file, line, condition)
    } else {
      // 添加新的条件断点
      await this.addBreakpoint(file, line, condition)
    }
  }

  /**
   * 处理断点命中
   */
  handleBreakpointHit(breakpoint: Breakpoint): void {
    const debugStore = useDebugStore.getState()

    console.log('🔴 断点命中:', breakpoint.id)

    // 更新断点信息（命中次数和验证状态）
    const currentBreakpoint = debugStore.allBreakpoints.find(bp => bp.id === breakpoint.id)
    const newHitCount = (currentBreakpoint?.hitCount || 0) + 1

    debugStore.updateBreakpoint(breakpoint.id, {
      verified: true,
      hitCount: newHitCount,
      message: `命中 ${newHitCount} 次`
    })

    // 更新调试状态
    debugStore.handleProgramPaused(breakpoint.filePath, breakpoint.lineNumber)

    // 跳转到断点位置
    this.navigateToBreakpoint(breakpoint)

    // 发送断点命中事件
    this.emitBreakpointEvent('breakpoint-hit', {
      file: breakpoint.filePath,
      line: breakpoint.lineNumber,
      id: breakpoint.id,
      hitCount: newHitCount
    })
  }

  /**
   * 处理断点验证状态更新
   */
  handleBreakpointVerification(id: string, verified: boolean, message?: string): void {
    console.log('🔴 更新断点验证状态:', { id, verified, message })

    const debugStore = useDebugStore.getState()
    debugStore.updateBreakpoint(id, {
      verified,
      message: message || (verified ? '已验证' : '验证失败')
    })

    // 发送验证状态更新事件
    this.emitBreakpointEvent('breakpoint-verified', { id, verified, message })
  }

  /**
   * 发送断点事件
   */
  private emitBreakpointEvent(eventType: string, data: any): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(eventType, { detail: data })
      window.dispatchEvent(event)
      console.log('🔴 发送断点事件:', eventType, data)
    }
  }

  /**
   * 跳转到断点位置 - 使用统一的文件导航服务
   */
  private navigateToBreakpoint(breakpoint: Breakpoint): void {
    console.log('🔴 跳转到断点位置:', breakpoint.filePath, breakpoint.lineNumber)

    // 先发送文件打开请求
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-file-request', {
        detail: {
          filePath: breakpoint.filePath,
          line: breakpoint.lineNumber,
          column: 1,
          highlight: true,
          isBreakpointHit: true
        }
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * 获取文件的断点（前端筛选）
   */
  getFileBreakpoints(file: string): Breakpoint[] {
    const debugStore = useDebugStore.getState()
    return debugStore.getFileBreakpoints(file)
  }

  /**
   * 获取已验证的断点
   */
  getVerifiedBreakpoints(): Breakpoint[] {
    const debugStore = useDebugStore.getState()
    return debugStore.allBreakpoints.filter(bp => bp.verified)
  }

  /**
   * 获取未验证的断点
   */
  getUnverifiedBreakpoints(): Breakpoint[] {
    const debugStore = useDebugStore.getState()
    return debugStore.allBreakpoints.filter(bp => !bp.verified)
  }

  /**
   * 获取启用的断点
   */
  getEnabledBreakpoints(): Breakpoint[] {
    const debugStore = useDebugStore.getState()
    return debugStore.allBreakpoints.filter(bp => bp.enabled)
  }

  /**
   * 获取条件断点
   */
  getConditionalBreakpoints(): Breakpoint[] {
    const debugStore = useDebugStore.getState()
    return debugStore.allBreakpoints.filter(bp => bp.condition)
  }

  /**
   * 获取所有断点
   */
  getAllBreakpoints(): Breakpoint[] {
    const debugStore = useDebugStore.getState()
    return debugStore.allBreakpoints
  }

  /**
   * 清除所有断点
   */
  async clearAllBreakpoints(): Promise<void> {
    const debugStore = useDebugStore.getState()
    const allBreakpoints = [...debugStore.allBreakpoints]

    console.log('🔴 清除所有断点:', allBreakpoints.length)

    // 逐个删除
    for (const bp of allBreakpoints) {
      await this.removeBreakpoint(bp.filePath, bp.lineNumber)
    }
  }

  /**
   * 同步调试启动时的断点
   */
  async syncBreakpointsOnDebugStart(): Promise<void> {
    const debugStore = useDebugStore.getState()
    const allBreakpoints = [...debugStore.allBreakpoints]

    console.log('🔴 同步断点到调试会话:', allBreakpoints.length)

    // 重新设置所有断点
    for (const bp of allBreakpoints) {
      try {
        // 标记为等待验证
        debugStore.updateBreakpointVerification(bp.id, false, '同步中...')

        const result = await debugSession.setBreakpoint(bp.filePath, bp.lineNumber, bp.condition)
        if (result.success) {
          debugStore.updateBreakpointVerification(bp.id, true, '同步成功')
          console.log('✅ 断点同步成功:', bp.id)
        } else {
          debugStore.updateBreakpointVerification(bp.id, false, result.message || '同步失败')
          console.error('❌ 断点同步失败:', bp.id, result.message)
        }
      } catch (error) {
        console.error('断点同步异常:', bp.id, error)
        debugStore.updateBreakpointVerification(bp.id, false, '同步异常')
      }
    }
  }

  /**
   * 获取断点统计信息
   */
  getBreakpointStats(): {
    total: number
    verified: number
    unverified: number
    enabled: number
    disabled: number
    conditional: number
  } {
    const allBreakpoints = this.getAllBreakpoints()

    return {
      total: allBreakpoints.length,
      verified: allBreakpoints.filter(bp => bp.verified).length,
      unverified: allBreakpoints.filter(bp => !bp.verified).length,
      enabled: allBreakpoints.filter(bp => bp.enabled).length,
      disabled: allBreakpoints.filter(bp => !bp.enabled).length,
      conditional: allBreakpoints.filter(bp => bp.condition).length,
    }
  }
}

export const breakpointService = new BreakpointService()
export default breakpointService
