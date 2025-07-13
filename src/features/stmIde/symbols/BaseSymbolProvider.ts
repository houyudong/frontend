/**
 * 基础符号提供者抽象类
 * 定义符号提供者的通用接口和行为，遵循 DRY 原则
 */

import { CompletionItem, SignatureInfo, LanguageConfig, SymbolCategory, LanguageSymbolProvider } from './types'
import { SymbolFactory } from './SymbolFactory'

export abstract class BaseSymbolProvider implements LanguageSymbolProvider {
  protected symbolCategories: Map<string, SymbolCategory> = new Map()
  protected signatures: Map<string, SignatureInfo[]> = new Map()
  protected languageConfig: LanguageConfig

  constructor(languageConfig: LanguageConfig) {
    this.languageConfig = languageConfig
    this.initializeSymbols()
  }

  /**
   * 抽象方法：初始化符号
   */
  protected abstract initializeSymbols(): void

  /**
   * 获取所有符号分类
   */
  getSymbolCategories(): SymbolCategory[] {
    return Array.from(this.symbolCategories.values())
  }

  /**
   * 获取所有签名
   */
  getSignatures(): Map<string, SignatureInfo[]> {
    return this.signatures
  }

  /**
   * 获取语言配置
   */
  getLanguageConfig(): LanguageConfig {
    return this.languageConfig
  }

  /**
   * 获取所有符号
   */
  getAllSymbols(): CompletionItem[] {
    const allSymbols: CompletionItem[] = []
    for (const category of this.symbolCategories.values()) {
      allSymbols.push(...category.symbols)
    }
    return allSymbols
  }

  /**
   * 根据查询过滤符号
   */
  filterSymbols(query: string, maxResults: number = 20): CompletionItem[] {
    const allSymbols = this.getAllSymbols()

    if (!query) return allSymbols.slice(0, maxResults)

    const lowerQuery = query.toLowerCase()
    return allSymbols
      .filter(symbol => symbol.label.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        const aLabel = a.label.toLowerCase()
        const bLabel = b.label.toLowerCase()

        // 优先级排序：完全匹配 > 开头匹配 > 包含匹配
        if (aLabel === lowerQuery) return -1
        if (bLabel === lowerQuery) return 1
        if (aLabel.startsWith(lowerQuery) && !bLabel.startsWith(lowerQuery)) return -1
        if (bLabel.startsWith(lowerQuery) && !aLabel.startsWith(lowerQuery)) return 1

        return a.sortText?.localeCompare(b.sortText || '') || 0
      })
      .slice(0, maxResults)
  }

  /**
   * 获取函数签名
   */
  getSignatureHelp(functionName: string): SignatureInfo[] {
    return this.signatures.get(functionName) || []
  }

  /**
   * 添加符号分类
   */
  protected addSymbolCategory(name: string, symbols: CompletionItem[], signatures?: Map<string, SignatureInfo[]>): void {
    this.symbolCategories.set(name, { name, symbols, signatures })

    // 合并签名到全局签名映射
    if (signatures) {
      for (const [key, value] of signatures) {
        this.signatures.set(key, value)
      }
    }
  }

  /**
   * 添加单个签名
   */
  protected addSignature(functionName: string, signature: SignatureInfo): void {
    const existing = this.signatures.get(functionName) || []
    existing.push(signature)
    this.signatures.set(functionName, existing)
  }

  /**
   * 批量添加签名
   */
  protected addSignatures(signatures: Map<string, SignatureInfo[]>): void {
    for (const [key, value] of signatures) {
      this.signatures.set(key, value)
    }
  }

  /**
   * 创建标准库函数符号 - 通用方法
   */
  protected createStandardLibrarySymbols(functions: Array<{
    name: string
    returnType?: string
    parameters?: string
    documentation?: string
    library: string
  }>): CompletionItem[] {
    return SymbolFactory.createFunctions(functions, '📚 Standard Library')
  }

  /**
   * 创建关键字符号 - 通用方法
   */
  protected createKeywordSymbols(keywords: Array<{
    name: string
    documentation?: string
  }>): CompletionItem[] {
    return keywords.map(keyword =>
      SymbolFactory.createKeyword({
        name: keyword.name,
        documentation: keyword.documentation,
        detail: '🔤 Keyword'
      })
    )
  }

  /**
   * 🔧 根源修复：创建优先级正确的代码片段符号
   */
  protected createSnippetSymbols(snippets: Array<{
    name: string
    snippet: string
    documentation?: string
  }>): CompletionItem[] {
    return snippets.map((snippet) =>
      SymbolFactory.createSnippet({
        name: snippet.name,
        snippet: snippet.snippet,
        documentation: snippet.documentation,
        detail: '🔧 智能代码片段'
        // 🔧 不传递 sortText，让 SymbolFactory.createSnippet 自动处理优先级
      })
    )
  }

  /**
   * 创建常量符号 - 通用方法
   */
  protected createConstantSymbols(constants: Array<{
    name: string
    documentation?: string
    value?: string
  }>, detail?: string): CompletionItem[] {
    return constants.map(constant =>
      SymbolFactory.createVariable({
        name: constant.name,
        documentation: constant.documentation,
        detail: detail || '🔢 Constant',
        isConstant: true
      })
    )
  }

  /**
   * 获取统计信息
   */
  getStats(): { totalSymbols: number; categories: string[]; signatures: number } {
    return {
      totalSymbols: this.getAllSymbols().length,
      categories: Array.from(this.symbolCategories.keys()),
      signatures: this.signatures.size
    }
  }
}

/**
 * 语言配置工厂 - 避免重复配置
 */
export class LanguageConfigFactory {
  /**
   * 创建 C 语言配置
   */
  static createCConfig(): LanguageConfig {
    return {
      id: 'c',
      extensions: ['.c', '.h'],
      aliases: ['C', 'c'],
      mimetypes: ['text/x-csrc', 'text/x-chdr'],
      triggerCharacters: ['.', '->', '#', 'f', 'i', 'w', 's'],
      completionTriggerCharacters: ['.', '->', '#', ' ', 'f', 'i', 'w', 's'],
      signatureHelpTriggerCharacters: ['(', ',']
    }
  }

  /**
   * 创建 C++ 语言配置
   */
  static createCppConfig(): LanguageConfig {
    return {
      id: 'cpp',
      extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
      aliases: ['C++', 'Cpp', 'cpp'],
      mimetypes: ['text/x-c++src', 'text/x-c++hdr'],
      triggerCharacters: ['.', '->', '::', '#'],
      completionTriggerCharacters: ['.', '->', '::', '#', ' '],
      signatureHelpTriggerCharacters: ['(', ',', '<']
    }
  }

  /**
   * 创建 Python 语言配置
   */
  static createPythonConfig(): LanguageConfig {
    return {
      id: 'python',
      extensions: ['.py', '.pyw'],
      aliases: ['Python', 'py'],
      mimetypes: ['text/x-python'],
      triggerCharacters: ['.', ' '],
      completionTriggerCharacters: ['.', ' ', '('],
      signatureHelpTriggerCharacters: ['(', ',']
    }
  }
}
