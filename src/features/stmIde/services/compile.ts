/**
 * 编译服务 - 重构版本
 * 基于backend API和debug工程的成功实现
 */

import consoleService from './console'
import configService from '../config/configManager'

// 简单的事件发射器实现
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }
}

export interface CompileResult {
  success: boolean
  message: string
  output?: string
  errors?: string[]
  warnings?: string[]
  duration?: number
  timestamp?: string
  status?: 'idle' | 'building' | 'success' | 'failed' | 'cancelled'
}

export interface CompileError {
  file: string
  line: number
  column: number
  message: string
  type: 'error' | 'warning'
}

export interface CompileWarning {
  file: string
  line: number
  column: number
  message: string
}

export interface CompileStatus {
  isCompiling: boolean
  progress: number
  lastResult: CompileResult | null
  lastCompileSuccess: boolean
  lastCompileTime: Date | null
}

class CompileService extends SimpleEventEmitter {
  private status: CompileStatus = {
    isCompiling: false,
    progress: 0,
    lastResult: null,
    lastCompileSuccess: false,
    lastCompileTime: null
  }

  constructor() {
    super()
    console.log('🔨 编译服务初始化 v3.0 - 使用动态配置')
  }

  /**
   * 获取编译状态
   */
  getStatus(): CompileStatus {
    return { ...this.status }
  }

  /**
   * 编译项目 - 重构版本，基于backend API
   */
  async compileProject(projectId?: string): Promise<CompileResult> {
    // 获取项目ID，优先使用参数，然后从配置服务获取
    let targetProjectId = projectId
    if (!targetProjectId) {
      try {
        targetProjectId = await configService.getProjectId()
      } catch (error) {
        throw new Error('无法获取项目ID，请确保已选择项目')
      }
    }

    if (this.status.isCompiling) {
      throw new Error('编译正在进行中')
    }

    console.log('🔨 开始编译项目:', targetProjectId)
    consoleService.compile.success('✅ 编译请求已发送，等待完成...')
    this.setCompiling(true)

    try {
      // 发送编译请求到backend
      const compileResponse = await this.sendCompileRequest(targetProjectId)

      if (!compileResponse.success) {
        throw new Error(compileResponse.message || '编译请求失败')
      }

      consoleService.compile.info('编译请求已发送，等待编译完成...')

      // 轮询编译状态直到完成
      const result = await this.pollCompileStatus(targetProjectId)

      this.status.lastResult = result
      this.status.lastCompileSuccess = result.success
      this.status.lastCompileTime = new Date()
      this.setCompiling(false)

      // 处理编译结果并输出到控制台
      consoleService.processCompileResult(result)

      if (result.success) {
        console.log('✅ 编译成功')
        this.emit('compileSuccess', result)
      } else {
        console.log('❌ 编译失败')
        this.emit('compileError', result)
      }

      this.emit('compileCompleted', result)
      return result

    } catch (error) {
      console.error('❌ 编译过程出错:', error)

      const errorMessage = error instanceof Error ? error.message : '编译失败'
      consoleService.compile.error(errorMessage)

      const errorResult: CompileResult = {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        status: 'failed'
      }

      this.status.lastResult = errorResult
      this.status.lastCompileSuccess = false
      this.status.lastCompileTime = new Date()
      this.setCompiling(false)

      this.emit('compileError', errorResult)
      this.emit('compileCompleted', errorResult)

      throw error
    }
  }

  /**
   * 发送编译请求到backend
   */
  private async sendCompileRequest(projectId: string): Promise<any> {
    const compileConfig = await configService.getCompileConfig()

    console.log('📤 发送编译请求:', compileConfig.endpoint)

    return fetch(compileConfig.endpoint, {
      method: 'POST',
      headers: {
        ...compileConfig.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project_id: projectId,
        build_type: 'debug',  // backend支持debug类型
        force: true
      })
    }).then(response => response.json())
  }

  /**
   * 轮询编译状态
   */
  private async pollCompileStatus(projectId: string, maxAttempts: number = 60): Promise<CompileResult> {
    const compileConfig = await configService.getCompileConfig()

    for (let attempts = 1; attempts <= maxAttempts; attempts++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒

        const statusResponse = await fetch(compileConfig.statusEndpoint, {
          method: 'GET',
          headers: compileConfig.headers
        }).then(response => response.json())
        console.log(`🔍 编译状态查询 (${attempts}s):`, statusResponse)

        const status = statusResponse.status || statusResponse.data?.status

        // 处理终止状态
        if (status === 'success') {
          return {
            success: true,
            message: '编译成功',
            output: statusResponse.output || statusResponse.data?.output,
            timestamp: new Date().toISOString(),
            status: 'success',
            duration: attempts
          }
        } else if (status === 'failed') {
          return {
            success: false,
            message: statusResponse.error || statusResponse.data?.error || '编译失败',
            output: statusResponse.output || statusResponse.data?.output,
            errors: statusResponse.errors || statusResponse.data?.errors,
            timestamp: new Date().toISOString(),
            status: 'failed',
            duration: attempts
          }
        } else if (status === 'cancelled') {
          return {
            success: false,
            message: '编译已取消',
            timestamp: new Date().toISOString(),
            status: 'cancelled',
            duration: attempts
          }
        }

        // 更新进度
        this.status.progress = Math.min((attempts / maxAttempts) * 100, 90)

        // 处理进行中状态
        if (status === 'building') {
          if (attempts % 5 === 0) {
            console.log(`🔨 编译进行中... (${attempts}s)`)
            consoleService.compile.info(`编译进行中... (${attempts}s)`)
          }
        } else if (status === 'idle') {
          if (attempts % 10 === 0) {
            console.log(`⏳ 等待编译开始... (${attempts}s)`)
            consoleService.compile.info(`等待编译开始... (${attempts}s)`)
          }
        }

      } catch (error) {
        console.error(`❌ 状态查询出错 (${attempts}s):`, error)
        if (attempts > 10) break // 连续出错则提前退出
      }
    }

    // 超时
    return {
      success: false,
      message: '编译超时',
      timestamp: new Date().toISOString(),
      status: 'failed',
      duration: maxAttempts
    }
  }

  /**
   * 设置编译状态
   */
  private setCompiling(isCompiling: boolean): void {
    this.status.isCompiling = isCompiling
    console.log('🔨 编译状态变化:', isCompiling)

    // 发送状态变化事件
    this.emit('compileStateChanged', {
      isCompiling: this.status.isCompiling,
      lastCompileSuccess: this.status.lastCompileSuccess,
      lastCompileTime: this.status.lastCompileTime
    })
  }

  /**
   * 清理项目
   */
  async cleanProject(projectId?: string): Promise<CompileResult> {
    // 获取项目ID
    let targetProjectId = projectId
    if (!targetProjectId) {
      try {
        targetProjectId = await configService.getProjectId()
      } catch (error) {
        throw new Error('无法获取项目ID，请确保已选择项目')
      }
    }

    console.log('🧹 清理项目:', targetProjectId)
    consoleService.compile.info(`开始清理项目: ${targetProjectId}`)

    try {
      const cleanEndpoint = await configService.getApiEndpoint('{baseUrl}/users/{userId}/projects/{projectId}/clean')
      const headers = await configService.getAuthHeaders()

      const result = await fetch(cleanEndpoint, {
        method: 'POST',
        headers: headers
      }).then(response => response.json())

      const cleanResult: CompileResult = {
        success: result.success || false,
        message: result.message || '清理完成',
        timestamp: new Date().toISOString()
      }

      console.log('✅ 清理完成')
      if (cleanResult.success) {
        consoleService.compile.success('项目清理完成')
      } else {
        consoleService.compile.error(cleanResult.message)
      }

      this.emit('cleanCompleted', cleanResult)

      return cleanResult
    } catch (error) {
      console.error('❌ 清理失败:', error)

      const errorMessage = error instanceof Error ? error.message : '清理失败'
      consoleService.compile.error(errorMessage)

      const errorResult: CompileResult = {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString()
      }

      this.emit('cleanError', errorResult)
      throw error
    }
  }

  /**
   * 停止编译
   */
  async stopCompile(): Promise<void> {
    if (!this.status.isCompiling) {
      return
    }

    console.log('⏹️ 停止编译')

    // TODO: 实现停止编译的逻辑
    this.status.isCompiling = false
    this.status.progress = 0

    this.emit('compileStopped')
  }

  /**
   * 检查是否需要重新编译
   */
  needsRecompile(): boolean {
    // 简单的重编译检查逻辑
    return !this.status.lastCompileSuccess ||
           !this.status.lastCompileTime ||
           (Date.now() - this.status.lastCompileTime.getTime()) > 5 * 60 * 1000 // 5分钟
  }

  /**
   * 获取编译状态信息
   */
  getCompileStatusInfo(): any {
    return {
      isCompiling: this.status.isCompiling,
      lastCompileSuccess: this.status.lastCompileSuccess,
      lastCompileTime: this.status.lastCompileTime,
      hasCompiledFirmware: this.status.lastCompileSuccess
    }
  }

  /**
   * 获取最后的编译结果
   */
  getLastResult(): CompileResult | null {
    return this.status.lastResult || null
  }

  /**
   * 检查是否正在编译
   */
  isCurrentlyCompiling(): boolean {
    return this.status.isCompiling
  }
}

// 创建全局实例
const compileService = new CompileService()

export default compileService
