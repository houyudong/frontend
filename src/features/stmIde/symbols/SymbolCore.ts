/**
 * 符号系统核心管理器
 * 统一管理所有语言的符号提供者，基于最佳实践的高质量实现
 */

import { CompletionItem, SignatureInfo, LanguageType, SymbolSearchRequest, SymbolSearchResponse } from './types'
import { CSymbolProvider } from './CSymbolProvider'
import { STM32HALProvider } from './STM32HALProvider'
import { BaseSymbolProvider } from './BaseSymbolProvider'

export class SymbolCore {
  private static instance: SymbolCore
  private providers = new Map<LanguageType, BaseSymbolProvider>()
  private halProvider: STM32HALProvider
  private currentLanguage: LanguageType = 'c'
  private userSymbols: CompletionItem[] = []
  private isInitialized = false

  private constructor() {
    this.halProvider = STM32HALProvider.getInstance()
    this.initializeProviders()
  }

  static getInstance(): SymbolCore {
    if (!SymbolCore.instance) {
      SymbolCore.instance = new SymbolCore()
    }
    return SymbolCore.instance
  }

  /**
   * 初始化符号提供者
   */
  private async initializeProviders(): Promise<void> {
    try {
      // 初始化 C 语言提供者
      this.providers.set('c', new CSymbolProvider())
      
      // TODO: 添加其他语言提供者
      // this.providers.set('cpp', new CppSymbolProvider())
      // this.providers.set('python', new PythonSymbolProvider())

      this.isInitialized = true
      console.log('✅ 符号系统初始化完成')
    } catch (error) {
      console.error('❌ 符号系统初始化失败:', error)
    }
  }

  /**
   * 设置当前语言
   */
  setLanguage(language: LanguageType): void {
    this.currentLanguage = language
    console.log(`🔄 语言已切换到: ${language}`)
  }

  /**
   * 获取当前语言
   */
  getCurrentLanguage(): LanguageType {
    return this.currentLanguage
  }

  /**
   * 获取补全建议
   */
  async getCompletions(request: SymbolSearchRequest): Promise<SymbolSearchResponse> {
    const { query, maxResults = 20 } = request
    
    try {
      // 获取当前语言的符号
      const languageSymbols = this.getLanguageSymbols(query, maxResults)
      
      // 获取 STM32 HAL 符号（如果是 C/C++）
      const halSymbols = this.getHALSymbols(query, maxResults)
      
      // 合并用户符号
      const userMatches = this.filterUserSymbols(query, maxResults)
      
      // 合并所有符号并去重
      const allSymbols = this.mergeAndDeduplicateSymbols([
        ...languageSymbols,
        ...halSymbols,
        ...userMatches
      ])

      return {
        symbols: allSymbols.slice(0, maxResults),
        isIncomplete: allSymbols.length > maxResults
      }
    } catch (error) {
      console.error('获取补全建议失败:', error)
      return { symbols: [] }
    }
  }

  /**
   * 同步版本的补全方法（保持兼容性）
   */
  filterSymbols(query: string, maxResults: number = 20): CompletionItem[] {
    const languageSymbols = this.getLanguageSymbols(query, maxResults)
    const halSymbols = this.getHALSymbols(query, maxResults)
    const userMatches = this.filterUserSymbols(query, maxResults)
    
    const allSymbols = this.mergeAndDeduplicateSymbols([
      ...languageSymbols,
      ...halSymbols,
      ...userMatches
    ])

    return allSymbols.slice(0, maxResults)
  }

  /**
   * 获取函数签名帮助
   */
  getSignatureHelp(functionName: string): SignatureInfo[] {
    // 首先从当前语言提供者获取
    const provider = this.providers.get(this.currentLanguage)
    if (provider) {
      const signatures = provider.getSignatureHelp(functionName)
      if (signatures.length > 0) {
        return signatures
      }
    }

    // 然后从 HAL 提供者获取
    const halSignatures = this.halProvider.getAllSignatures().get(functionName)
    if (halSignatures) {
      return halSignatures
    }

    return []
  }

  /**
   * 添加用户定义的符号
   */
  addUserSymbols(symbols: CompletionItem[]): void {
    this.userSymbols = symbols
  }

  /**
   * 获取所有符号
   */
  getAllSymbols(): CompletionItem[] {
    const allSymbols: CompletionItem[] = []
    
    // 添加当前语言符号
    const provider = this.providers.get(this.currentLanguage)
    if (provider) {
      allSymbols.push(...provider.getAllSymbols())
    }
    
    // 添加 HAL 符号
    if (this.currentLanguage === 'c' || this.currentLanguage === 'cpp') {
      allSymbols.push(...this.halProvider.getAllSymbols())
    }
    
    // 添加用户符号
    allSymbols.push(...this.userSymbols)
    
    return allSymbols
  }

  /**
   * 获取语言符号
   */
  private getLanguageSymbols(query: string, maxResults: number): CompletionItem[] {
    const provider = this.providers.get(this.currentLanguage)
    if (!provider) return []
    
    return provider.filterSymbols(query, maxResults)
  }

  /**
   * 获取 HAL 符号
   */
  private getHALSymbols(query: string, maxResults: number): CompletionItem[] {
    if (this.currentLanguage !== 'c' && this.currentLanguage !== 'cpp') {
      return []
    }
    
    const allHALSymbols = this.halProvider.getAllSymbols()
    
    if (!query) return allHALSymbols.slice(0, maxResults)
    
    const lowerQuery = query.toLowerCase()
    return allHALSymbols
      .filter(symbol => symbol.label.toLowerCase().includes(lowerQuery))
      .slice(0, maxResults)
  }

  /**
   * 过滤用户符号
   */
  private filterUserSymbols(query: string, maxResults: number): CompletionItem[] {
    if (!query) return this.userSymbols.slice(0, maxResults)
    
    const lowerQuery = query.toLowerCase()
    return this.userSymbols
      .filter(symbol => symbol.label.toLowerCase().includes(lowerQuery))
      .slice(0, maxResults)
  }

  /**
   * 合并并去重符号
   */
  private mergeAndDeduplicateSymbols(symbolArrays: CompletionItem[]): CompletionItem[] {
    const seen = new Set<string>()
    const result: CompletionItem[] = []
    
    for (const symbol of symbolArrays) {
      if (!seen.has(symbol.label)) {
        seen.add(symbol.label)
        result.push(symbol)
      }
    }
    
    // 按优先级排序
    return result.sort((a, b) => {
      const aSortText = a.sortText || a.label
      const bSortText = b.sortText || b.label
      return aSortText.localeCompare(bSortText)
    })
  }

  /**
   * 获取统计信息
   */
  getStats(): { 
    totalSymbols: number
    languageSymbols: number
    halSymbols: number
    userSymbols: number
    currentLanguage: LanguageType
    providers: string[]
  } {
    const provider = this.providers.get(this.currentLanguage)
    const languageSymbols = provider ? provider.getAllSymbols().length : 0
    const halSymbols = this.halProvider.getAllSymbols().length
    
    return {
      totalSymbols: languageSymbols + halSymbols + this.userSymbols.length,
      languageSymbols,
      halSymbols,
      userSymbols: this.userSymbols.length,
      currentLanguage: this.currentLanguage,
      providers: Array.from(this.providers.keys())
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.userSymbols = []
    console.log('🧹 符号缓存已清除')
  }

  /**
   * 重新加载符号库
   */
  async reload(): Promise<void> {
    this.clearCache()
    await this.initializeProviders()
    console.log('🔄 符号库已重新加载')
  }

  /**
   * 检查是否已初始化
   */
  isReady(): boolean {
    return this.isInitialized
  }
}

// 导出单例实例
export const symbolCore = SymbolCore.getInstance()

// 导出类型
export * from './types'
