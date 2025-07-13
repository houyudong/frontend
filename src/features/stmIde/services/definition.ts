import apiService from '../config/apiService'
import configService from '../config/configManager'

// 符号定义接口
interface SymbolDefinition {
  symbol: string
  filePath: string
  line: number
  column: number
  type: 'function' | 'variable' | 'macro' | 'type'
  context?: string
}

// 定义搜索结果
interface DefinitionSearchResult {
  found: boolean
  definition?: SymbolDefinition
  message?: string
}

/**
 * 函数定义跳转服务 - 简化版本，专注文件查找 + Monaco搜索
 */
class DefinitionService {
  private searchInProgress = new Set<string>()
  private lastSearchTime = new Map<string, number>()
  private readonly MIN_SEARCH_INTERVAL = 2000 // 🔧 增加到2秒，避免频繁请求
  private pendingRequests = new Map<string, AbortController>() // 🔧 新增：请求控制器
  private debounceTimers = new Map<string, number>() // 🔧 新增：防抖定时器

  /**
   * 查找符号定义 - 强化防抖版本，只处理最后一次请求
   */
  async findDefinition(symbol: string, _currentFile?: string): Promise<DefinitionSearchResult> {
    // 过滤无意义的符号
    if (this.shouldSkipSymbol(symbol)) {
      return { found: false, message: '无效符号' }
    }

    console.log('🔍 查找符号所在文件:', symbol)

    // 🔧 强化防抖：取消之前的定时器和请求
    const existingTimer = this.debounceTimers.get(symbol)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.debounceTimers.delete(symbol)
    }

    const existingRequest = this.pendingRequests.get(symbol)
    if (existingRequest) {
      existingRequest.abort()
      this.pendingRequests.delete(symbol)
      console.log('🚫 取消之前的请求:', symbol)
    }

    // 🔧 防抖：延迟执行，只处理最后一次请求
    return new Promise((resolve) => {
      const timer = setTimeout(async () => {
        this.debounceTimers.delete(symbol)

        try {
          // 频率限制检查
          const now = Date.now()
          const lastSearch = this.lastSearchTime.get(symbol) || 0

          if (now - lastSearch < this.MIN_SEARCH_INTERVAL) {
            resolve({ found: false, message: '搜索频率限制' })
            return
          }

          // 防止重复搜索
          if (this.searchInProgress.has(symbol)) {
            resolve({ found: false, message: '搜索中...' })
            return
          }

          // 更新搜索状态
          this.searchInProgress.add(symbol)
          this.lastSearchTime.set(symbol, now)

          try {
            // 🔥 调用后端API获取文件路径
            const result = await this.searchWithBackendAPI(symbol)

            if (result) {
              console.log('✅ 找到符号所在文件:', result.filePath)
              resolve({ found: true, definition: result })
            } else {
              console.log('❌ 未找到符号:', symbol)
              resolve({ found: false, message: '未找到定义' })
            }

          } finally {
            // 清理搜索状态
            this.searchInProgress.delete(symbol)
            this.pendingRequests.delete(symbol)
          }

        } catch (error) {
          console.error('🔍 搜索失败:', error)
          this.searchInProgress.delete(symbol)
          this.pendingRequests.delete(symbol)
          resolve({ found: false, message: '搜索失败' })
        }
      }, 500) // 500ms防抖延迟

      this.debounceTimers.set(symbol, timer)
    })
  }





  /**
   * 使用后端API搜索符号所在文件 - 简化版本，只获取文件路径，支持取消
   */
  private async searchWithBackendAPI(symbol: string): Promise<SymbolDefinition | null> {
    try {
      console.log('🔍 查找符号所在文件:', symbol)

      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      // 调用后端符号搜索API
      const result = await apiService.searchSymbol(userId, projectId, symbol)

      if (!result?.success || !result.data) {
        console.log('❌ 未找到符号所在文件')
        return null
      }

      // 处理不同的响应格式，只关心文件路径
      let filePath = ''
      if (result.data.definitions && result.data.definitions.length > 0) {
        const def = result.data.definitions[0]
        filePath = def.file_path || def.filePath || def.file
      } else if (Array.isArray(result.data) && result.data.length > 0) {
        const def = result.data[0]
        filePath = def.file_path || def.filePath || def.file
      } else if (result.data.file_path || result.data.filePath) {
        filePath = result.data.file_path || result.data.filePath
      }

      if (!filePath) {
        console.log('❌ 响应中没有文件路径')
        return null
      }

      console.log('✅ 找到符号所在文件:', filePath)

      // 返回简化的定义对象，让Monaco编辑器来定位具体位置
      return {
        symbol,
        filePath,
        line: 1, // 默认第一行，让Monaco搜索具体位置
        column: 1,
        type: 'function', // 默认类型
        context: undefined
      }

    } catch (error) {
      console.error('🔍 搜索文件失败:', error)
      return null
    }
  }



  /**
   * 检查是否应该跳过符号
   */
  private shouldSkipSymbol(symbol: string): boolean {
    if (!symbol || symbol.length < 2) {
      return true
    }

    // 跳过关键字
    const keywords = [
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'return', 'void', 'int', 'char', 'float', 'double', 'long', 'short',
      'unsigned', 'signed', 'const', 'static', 'extern', 'typedef', 'struct',
      'union', 'enum', 'sizeof', 'include', 'define', 'ifdef', 'ifndef', 'endif'
    ]

    if (keywords.includes(symbol.toLowerCase())) {
      return true
    }

    // 跳过数字
    if (/^\d+$/.test(symbol)) {
      return true
    }

    // 跳过单个字符
    if (symbol.length === 1) {
      return true
    }

    return false
  }

  /**
   * 🔧 正确实现：自定义定义跳转流程
   * 流程：后端API → 文件打开 → Monaco搜索 → 选中
   */
  async navigateToDefinition(definition: SymbolDefinition): Promise<void> {
    try {
      console.log('🧭 开始自定义跳转流程:', {
        symbol: definition.symbol,
        targetFile: definition.filePath,
        line: definition.line,
        column: definition.column
      })

      // 验证文件路径
      if (!definition.filePath) {
        console.error('❌ 文件路径为空')
        return
      }

      // 🔧 第一步：发送文件打开事件
      const openFileEvent = new CustomEvent('open-file-request', {
        detail: {
          filePath: definition.filePath,
          // 🔧 关键：传递符号信息，让文件打开后进行搜索和选中
          searchSymbol: definition.symbol,
          highlight: true,
          // 如果后端提供了精确位置，也传递过去
          line: definition.line,
          column: definition.column
        }
      })

      console.log('🧭 发送文件打开事件:', openFileEvent.detail)
      document.dispatchEvent(openFileEvent)

    } catch (error) {
      console.error('🧭 自定义跳转流程失败:', error)
    }
  }

  /**
   * 清除搜索状态
   */
  clearSearchState(): void {
    this.searchInProgress.clear()
    this.lastSearchTime.clear()
    console.log('🔍 搜索状态已清除')
  }

  // 🔧 DRY原则：移除不再使用的消息方法，Monaco会处理所有UI反馈
}

// 创建全局实例
const definitionService = new DefinitionService()

export default definitionService
