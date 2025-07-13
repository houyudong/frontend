/**
 * 控制台服务 - 管理控制台信息输出
 * 基于backend编译错误处理和debug工程的成功实现
 */

export interface CompileError {
  type: 'error' | 'warning' | 'make' | 'linker' | 'other'
  file?: string
  relativePath?: string
  line?: number
  column?: number
  message: string
  fullLine: string
  clickable?: boolean
}

export interface ConsoleMessage {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'debug'
  message: string
  timestamp: Date
  source?: string
  file?: string
  line?: number
  column?: number
  clickable?: boolean
  fullLine?: string
}

type ConsoleEventHandler = (message: ConsoleMessage) => void

class ConsoleService {
  private messages: ConsoleMessage[] = []
  private eventHandlers: { [key: string]: ConsoleEventHandler[] } = {}
  private maxMessages: number = 1000

  constructor() {
    console.log('📺 控制台服务初始化')
  }

  /**
   * 添加消息到控制台
   */
  addMessage(
    type: ConsoleMessage['type'],
    message: string,
    source?: string,
    file?: string,
    line?: number,
    column?: number,
    clickable?: boolean,
    fullLine?: string
  ): void {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      type,
      message,
      timestamp: new Date(),
      source,
      file,
      line,
      column,
      clickable,
      fullLine
    }

    this.messages.push(newMessage)

    // 限制消息数量
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages)
    }

    // 触发事件
    this.emit('messageAdded', newMessage)

    // 暂时禁用浏览器控制台输出，避免重复显示
    // this.outputToBrowserConsole(newMessage)
  }

  /**
   * 处理编译结果，解析错误和警告 - 参考backend的compile_output_processor.go
   */
  processCompileResult(result: any): void {
    if (!result) return

    if (result.success) {
      // 编译成功时只清除问题栏的错误和警告，不清除控制台输出
      this.clearProblems()

      // 显示成功摘要 - 参考backend的generateSuccessSummary
      let successMessage = '✅ 编译成功'
      if (result.warnings && result.warnings.length > 0) {
        successMessage += ` | ⚠️ ${result.warnings.length}个警告`
      }
      if (result.memoryUsage) {
        successMessage += ` | 📊 总大小: ${result.memoryUsage.total}字节`
      }
      if (result.generatedFiles && result.generatedFiles.length > 0) {
        successMessage += ` | 📁 生成${result.generatedFiles.length}个文件`
      }

      this.compile.success(successMessage)

      // 显示详细输出信息（如果有）
      if (result.output) {
        this.displayRawOutput(result.output)
      }

      // 显示详细内存使用信息
      if (result.memoryUsage) {
        const memory = result.memoryUsage
        this.compile.info(`内存使用详情: 代码段=${memory.text}B, 数据段=${memory.data}B, BSS段=${memory.bss}B`)
      }

      // 显示生成的文件列表
      if (result.generatedFiles && result.generatedFiles.length > 0) {
        this.compile.info('生成文件:')
        result.generatedFiles.forEach((file: string) => {
          this.compile.info(`  ✓ ${file}`)
        })
      }

      // 显示警告（如果有）- 只添加到问题栏，不重复显示到控制台
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning: CompileError) => {
          this.addCompileError(warning, 'warning')
        })
      }
    } else {
      // 编译失败时不清除控制台输出，只清除问题栏
      this.clearProblems()
      this.compile.error('❌ 编译失败')

      // 专业IDE模式：控制台显示原始输出
      if (result.output) {
        this.displayRawOutput(result.output)
      }

      // 问题面板解析结构化错误
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error: CompileError) => {
          this.addCompileError(error, 'error')
        })
      }

      // 问题面板解析警告
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning: CompileError) => {
          this.addCompileError(warning, 'warning')
        })
      }

      // 如果没有结构化数据，但有原始输出，已经通过displayRawOutput显示到控制台
      // 问题面板会从控制台消息中提取错误信息
    }
  }

  /**
   * 显示原始输出到控制台 - 专业IDE模式：显示原始输出，同时解析错误到问题面板
   */
  private displayRawOutput(output: string): void {
    if (!output) return

    // 按行分割，显示到控制台并解析错误
    const lines = output.split('\n')
    for (const line of lines) {
      if (line.trim()) {
        // 显示到控制台
        this.addMessage('info', line.trim(), '编译')

        // 同时解析错误信息到问题面板
        this.parseLineForProblems(line.trim())
      }
    }
  }

  /**
   * 判断是否为无意义的构建错误信息
   */
  private isUselessBuildError(line: string): boolean {
    const uselessPatterns = [
      'make: \\*\\*\\* \\[.*\\] Error',
      'make\\[\\d+\\]: \\*\\*\\* \\[.*\\] Error',
      'recipe for target .* failed',
      'Makefile:\\d+: recipe for target .* failed',
      'make: Leaving directory',
      'make: Entering directory',
      'make\\[\\d+\\]: Leaving directory',
      'make\\[\\d+\\]: Entering directory',
      'make: Nothing to be done for',
      'make: Target .* is up to date',
      '^\\s*$', // 空行
      '^\\s*\\*\\*\\*.*\\*\\*\\*\\s*$', // 星号分隔行
      '^\\s*=+\\s*$', // 等号分隔行
      '^\\s*-+\\s*$'  // 减号分隔行
    ]

    return uselessPatterns.some(pattern => new RegExp(pattern).test(line))
  }

  /**
   * 解析单行输出中的错误信息
   */
  private parseLineForProblems(line: string): void {
    // 跳过分类标题行和摘要行
    if (line.includes('代码错误:') || line.includes('构建错误:') || line.includes('警告信息:') ||
        line.includes('编译失败:') || line === '❌ 编译失败') {
      return
    }

    // 跳过无意义的构建错误信息
    if (this.isUselessBuildError(line)) {
      return
    }

    // 解析LINK格式错误: [LINK:Core/Src/main.c:99:9] 'ienn' undeclared
    const linkMatch = line.match(/\[LINK:([^:]+):(\d+):(\d+)\]\s*(.+)/)
    if (linkMatch) {
      const [, file, lineNum, column, message] = linkMatch
      this.addMessage(
        'error',
        message.trim(),
        '编译',
        file.trim(),
        parseInt(lineNum),
        parseInt(column),
        true,
        line
      )
      return
    }

    // 解析警告格式: ⚠️ Core/Src/main.c:99:5 - useless type name in empty declaration
    const warningMatch = line.match(/⚠️\s+([^:]+):(\d+):(\d+)\s+-\s+(.+)/)
    if (warningMatch) {
      const [, file, lineNum, column, message] = warningMatch
      this.addMessage(
        'warning',
        message.trim(),
        '编译',
        file.trim(),
        parseInt(lineNum),
        parseInt(column),
        true,
        line
      )
      return
    }

    // 解析📁格式错误: 📁 Core/Src/main.c:99:9 - 'ienn' undeclared
    const fileMatch = line.match(/📁\s+([^:]+):(\d+):(\d+)\s+-\s+(.+)/)
    if (fileMatch) {
      const [, file, lineNum, column, message] = fileMatch
      this.addMessage(
        'error',
        message.trim(),
        '编译',
        file.trim(),
        parseInt(lineNum),
        parseInt(column),
        true,
        line
      )
      return
    }

    // 跳过构建错误（如mingw32-make错误），这些不是代码错误
    if (line.includes('mingw32-make:') || line.includes('make:') || line.includes('Error 1')) {
      return
    }

    // 跳过没有文件信息的通用错误消息
    if (line.includes('编译失败') && !line.includes(':')) {
      return
    }
  }

  /**
   * 显示格式化的输出 - 完全按照debug工程格式，简洁专业
   */
  private displayFormattedOutput(output: string, _type: 'success' | 'error'): void {
    if (!output) return

    const lines = output.split('\n')
    let hasShownFailure = false

    for (const line of lines) {
      if (line.trim() === '') continue

      // 只显示关键信息，完全按照debug工程格式
      if (line === '❌ 编译失败') {
        if (!hasShownFailure) {
          this.addMessage('error', line, '编译')
          hasShownFailure = true
        }
        continue
      }

      // 显示摘要信息
      if (line.includes('编译失败:') && line.includes('个')) {
        this.addMessage('error', line, '编译')
        continue
      }

      // 显示具体错误 - 只显示有文件位置的错误，避免重复
      const errorMatch = line.match(/^\s*📁\s+(.+):(\d+):(\d+)\s+-\s+(.+)/)
      if (errorMatch) {
        const [, file, lineNum, column, message] = errorMatch

        // 只添加到问题面板，控制台已经显示了摘要
        this.addMessage(
          'error',
          message.trim(),
          '编译',
          file,
          parseInt(lineNum),
          parseInt(column),
          true,
          line
        )
        continue
      }

      // 显示警告 - 避免重复
      const warningMatch = line.match(/^\s*⚠️\s+(.+):(\d+):(\d+)\s+-\s+(.+)/)
      if (warningMatch) {
        const [, file, lineNum, column, message] = warningMatch

        // 只添加到问题面板，控制台已经显示了摘要
        this.addMessage(
          'warning',
          message.trim(),
          '编译',
          file,
          parseInt(lineNum),
          parseInt(column),
          true,
          line
        )
        continue
      }

      // 处理LINK格式 - 避免重复
      if (line.includes('[LINK:') && line.includes(']')) {
        const linkMatch = line.match(/\[LINK:([^:]+):(\d+):(\d+)\]\s*(.+)/)
        if (linkMatch) {
          const [, file, lineNum, column, message] = linkMatch

          // 只添加到问题面板
          this.addMessage(
            'error',
            message.trim(),
            '编译',
            file,
            parseInt(lineNum),
            parseInt(column),
            true,
            line
          )
          continue
        }
      }

      // 跳过其他所有信息 - 保持简洁
    }
  }

  /**
   * 处理结构化的错误信息 - 完全按照debug工程格式，简洁专业
   */
  private processStructuredErrors(errors: CompileError[], warnings: CompileError[]): void {
    // 分类统计错误
    const codeErrors = errors.filter(e => e.type === 'error' || !e.type)
    const makeErrors = errors.filter(e => e.type === 'make')
    const linkerErrors = errors.filter(e => e.type === 'linker')

    // 显示摘要
    const parts = []
    if (codeErrors.length > 0) parts.push(`❌ ${codeErrors.length}个代码错误`)
    if (makeErrors.length > 0) parts.push(`🔧 ${makeErrors.length}个构建错误`)
    if (linkerErrors.length > 0) parts.push(`🔗 ${linkerErrors.length}个链接错误`)
    if (warnings.length > 0) parts.push(`⚠️ ${warnings.length}个警告`)

    if (parts.length > 0) {
      this.compile.error(`编译失败: ${parts.join(', ')}`)
    }

    // 只添加到问题面板，避免在控制台重复显示
    codeErrors.forEach(error => {
      if (error.file && error.line) {
        this.addCompileError(error, 'error')
      }
    })

    warnings.forEach(warning => {
      if (warning.file && warning.line) {
        this.addCompileError(warning, 'warning')
      }
    })

    // 跳过构建错误和链接错误的详细显示 - 保持简洁
  }

  /**
   * 添加编译错误/警告到问题面板 - 去重处理
   */
  private addCompileError(error: CompileError, messageType: 'error' | 'warning'): void {
    // 检查是否已经存在相同的错误
    const existingMessage = this.messages.find(msg =>
      msg.file === (error.file || error.relativePath) &&
      msg.line === error.line &&
      msg.column === error.column &&
      msg.message === error.message
    )

    if (existingMessage) {
      return // 避免重复添加
    }

    this.addMessage(
      messageType,
      error.message, // 直接使用原始消息，不添加图标
      '编译',
      error.file || error.relativePath,
      error.line,
      error.column,
      error.clickable,
      error.fullLine
    )
  }





  /**
   * 输出到浏览器控制台
   */
  private outputToBrowserConsole(message: ConsoleMessage): void {
    const timestamp = message.timestamp.toLocaleTimeString()
    const prefix = `[${timestamp}] ${message.source ? `[${message.source}] ` : ''}`
    const fullMessage = `${prefix}${message.message}`

    switch (message.type) {
      case 'error':
        console.error(fullMessage)
        break
      case 'warning':
        console.warn(fullMessage)
        break
      case 'success':
        console.log(`✅ ${fullMessage}`)
        break
      case 'debug':
        console.debug(fullMessage)
        break
      default:
        console.log(fullMessage)
    }
  }

  /**
   * 基础便捷方法
   */
  info(message: string, source?: string): void {
    this.addMessage('info', message, source)
  }

  success(message: string, source?: string): void {
    this.addMessage('success', message, source)
  }

  warning(message: string, source?: string): void {
    this.addMessage('warning', message, source)
  }

  error(message: string, source?: string, file?: string, line?: number): void {
    this.addMessage('error', message, source, file, line)
  }

  debug(message: string, source?: string): void {
    this.addMessage('debug', message, source)
  }

  /**
   * 创建特定来源的日志器 - 工厂模式
   */
  createLogger(source: string) {
    return {
      info: (message: string, file?: string, line?: number) =>
        this.addMessage('info', message, source, file, line),
      success: (message: string, file?: string, line?: number) =>
        this.addMessage('success', message, source, file, line),
      warning: (message: string, file?: string, line?: number) =>
        this.addMessage('warning', message, source, file, line),
      error: (message: string, file?: string, line?: number) =>
        this.addMessage('error', message, source, file, line),
      debug: (message: string, file?: string, line?: number) =>
        this.addMessage('debug', message, source, file, line)
    }
  }

  // 预定义的日志器
  compile = this.createLogger('编译')
  debugger = this.createLogger('调试')
  device = this.createLogger('设备')
  file = this.createLogger('文件')
  download = this.createLogger('下载')
  runtime = this.createLogger('运行')
  flash = this.createLogger('烧录')

  /**
   * 处理调试错误
   */
  processDebugError(error: string, file?: string, line?: number): void {
    this.debugger.error(error, file, line)
  }

  /**
   * 处理运行时错误
   */
  processRuntimeError(error: string, file?: string, line?: number): void {
    this.runtime.error(error, file, line)
  }

  /**
   * 处理下载错误
   */
  processDownloadError(error: string, file?: string): void {
    this.download.error(error, file)
  }

  /**
   * 处理烧录错误
   */
  processFlashError(error: string): void {
    this.flash.error(error)
  }

  /**
   * 处理设备连接错误
   */
  processDeviceError(error: string): void {
    this.device.error(error)
  }

  /**
   * 获取所有消息
   */
  getMessages(): ConsoleMessage[] {
    return [...this.messages]
  }

  /**
   * 获取指定类型的消息
   */
  getMessagesByType(type: ConsoleMessage['type']): ConsoleMessage[] {
    return this.messages.filter(m => m.type === type)
  }

  /**
   * 获取指定来源的消息
   */
  getMessagesBySource(source: string): ConsoleMessage[] {
    return this.messages.filter(m => m.source === source)
  }

  /**
   * 清空消息
   */
  clear(): void {
    this.messages = []
    this.emit('messagesCleared')
  }

  /**
   * 按来源清空消息
   */
  clearBySource(source: string): void {
    this.messages = this.messages.filter(m => m.source !== source)
    this.emit('messagesCleared')
  }

  /**
   * 清除问题（错误和警告）- 编译成功时调用
   * 只清除错误和警告，保留信息和成功消息
   */
  clearProblems(): void {
    const beforeCount = this.messages.length
    const errorCount = this.messages.filter(m => m.type === 'error').length
    const warningCount = this.messages.filter(m => m.type === 'warning').length

    this.messages = this.messages.filter(m => m.type !== 'error' && m.type !== 'warning')
    const afterCount = this.messages.length

    if (beforeCount !== afterCount) {
      this.emit('messagesCleared')
      console.log(`🧹 问题面板已清除 (清除了 ${errorCount} 个错误, ${warningCount} 个警告)`)
    } else {
      console.log('🧹 问题面板无需清除 (没有错误或警告)')
    }
  }

  /**
   * 事件监听
   */
  on(event: 'messageAdded' | 'messagesCleared', handler: ConsoleEventHandler): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = []
    }
    this.eventHandlers[event].push(handler)
  }

  /**
   * 移除事件监听
   */
  off(event: string, handler: ConsoleEventHandler): void {
    if (this.eventHandlers[event]) {
      const index = this.eventHandlers[event].indexOf(handler)
      if (index > -1) {
        this.eventHandlers[event].splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data?: any): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`控制台事件处理器错误 [${event}]:`, error)
        }
      })
    }
  }

  /**
   * 获取统计信息
   */
  getStats(): { total: number, errors: number, warnings: number } {
    return {
      total: this.messages.length,
      errors: this.messages.filter(m => m.type === 'error').length,
      warnings: this.messages.filter(m => m.type === 'warning').length
    }
  }


}

// 创建全局实例
const consoleService = new ConsoleService()

export default consoleService
