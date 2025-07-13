/**
 * Monaco Editor 集成层
 * 基于最佳实践的 Monaco Editor 符号系统集成
 */

import { symbolCore } from './SymbolCore'
import {
  CompletionItem,
  SignatureInfo,
  LanguageType,
  MonacoCompletionItem,
  MonacoSignatureHelp,
  MonacoSignatureInformation,
  MonacoParameterInformation
} from './types'

export class MonacoIntegration {
  private disposables: any[] = []
  private currentLanguage: LanguageType = 'c'

  constructor(language: LanguageType = 'c') {
    this.currentLanguage = language
    symbolCore.setLanguage(language)
  }

  /**
   * 初始化 Monaco Editor 集成
   */
  async initialize(monaco: any): Promise<void> {
    try {
      console.log('🚀 初始化 Monaco Editor 符号集成...')

      // 等待符号系统准备就绪
      await this.waitForSymbolCore()

      // 注册语言支持
      this.registerLanguageSupport(monaco, 'c')
      this.registerLanguageSupport(monaco, 'cpp')

      console.log('✅ Monaco Editor 符号集成初始化完成')
      console.log('📊 符号统计:', symbolCore.getStats())

    } catch (error) {
      console.error('❌ Monaco Editor 符号集成初始化失败:', error)
    }
  }

  /**
   * 注册语言支持
   */
  private registerLanguageSupport(monaco: any, languageId: string): void {
    // 注册补全提供者
    const completionDisposable = monaco.languages.registerCompletionItemProvider(languageId, {
      triggerCharacters: this.getTriggerCharacters(languageId as LanguageType),

      provideCompletionItems: async (model: any, position: any, context: any, token: any) => {
        return this.provideCompletionItems(model, position, context, token)
      },

      resolveCompletionItem: (item: any, token: any) => {
        return item
      }
    })

    // 注册签名帮助提供者
    const signatureDisposable = monaco.languages.registerSignatureHelpProvider(languageId, {
      signatureHelpTriggerCharacters: ['(', ','],
      signatureHelpRetriggerCharacters: [','],

      provideSignatureHelp: (model: any, position: any, token: any, context: any) => {
        return this.provideSignatureHelp(model, position, token, context)
      }
    })

    // 注册悬停提供者
    const hoverDisposable = monaco.languages.registerHoverProvider(languageId, {
      provideHover: (model: any, position: any) => {
        return this.provideHover(model, position, monaco)
      }
    })

    this.disposables.push(completionDisposable, signatureDisposable, hoverDisposable)
    console.log(`✅ ${languageId.toUpperCase()} 语言支持已注册`)
  }

  /**
   * 提供补全项 - 修复函数内部补全问题
   */
  private async provideCompletionItems(model: any, position: any, context: any, token: any) {
    try {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const fullCode = model.getValue()

      // 分析用户代码并添加到符号系统
      this.analyzeAndAddUserSymbols(fullCode)

      // 获取补全建议 - 即使没有输入也显示建议
      const query = word.word || ''
      const maxResults = query.length === 0 ? 30 : 20 // 无输入时显示更多建议
      const completions = symbolCore.filterSymbols(query, maxResults)

      // 如果没有找到符号，返回空数组但不报错
      if (completions.length === 0) {
        console.log('未找到匹配的符号，查询:', query)
        return { suggestions: [] }
      }

      return {
        suggestions: this.convertToMonacoCompletions(completions, range),
        incomplete: completions.length >= maxResults
      }
    } catch (error) {
      console.error('补全提供失败:', error)
      return { suggestions: [] }
    }
  }

  /**
   * 提供签名帮助
   */
  private provideSignatureHelp(model: any, position: any, token: any, context: any): MonacoSignatureHelp | null {
    try {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })

      const functionCall = this.findCurrentFunctionCall(textUntilPosition)
      if (!functionCall) {
        return null
      }

      const signatures = symbolCore.getSignatureHelp(functionCall.functionName)
      if (signatures.length === 0) {
        return null
      }

      return {
        signatures: this.convertToMonacoSignatures(signatures),
        activeSignature: 0,
        activeParameter: functionCall.parameterIndex
      }
    } catch (error) {
      console.error('签名帮助提供失败:', error)
      return null
    }
  }

  /**
   * 提供悬停信息
   */
  private provideHover(model: any, position: any, monaco: any) {
    try {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      const signatures = symbolCore.getSignatureHelp(word.word)
      if (signatures.length === 0) return null

      const signature = signatures[0]
      return {
        range: new monaco.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          { value: `**${signature.label}**` },
          { value: signature.documentation || '' }
        ]
      }
    } catch (error) {
      console.error('悬停提供失败:', error)
      return null
    }
  }

  /**
   * 获取触发字符 - 扩展触发字符确保在函数内部也能正常工作
   */
  private getTriggerCharacters(language: LanguageType): string[] {
    switch (language) {
      case 'c':
        // 扩展 C 语言触发字符，包括常用的函数和关键字首字母
        return ['.', '->', '#', ' ', '(', 'H', 'p', 'i', 'f', 'w', 's', 'm', 'c', 'v', 'd', 'N', 'G', '_']
      case 'cpp':
        return ['.', '->', '::', '#', ' ', '(', 's', 'v', 'c', 'i', 'f', 'w', '_']
      case 'python':
        return ['.', ' ', '(', 'i', 'd', 'p', 'r', 'f']
      default:
        return ['.', ' ', '(', '_']
    }
  }

  /**
   * 转换为 Monaco 补全项
   */
  private convertToMonacoCompletions(completions: CompletionItem[], range: any): MonacoCompletionItem[] {
    return completions.map(item => ({
      label: item.label,
      kind: item.kind,
      insertText: item.insertText,
      insertTextRules: item.insertTextRules,
      documentation: item.documentation ? { value: item.documentation } : undefined,
      detail: item.detail,
      sortText: item.sortText,
      range: range,
      commitCharacters: this.getCommitCharacters(item.kind),
      filterText: item.label
    }))
  }

  /**
   * 转换为 Monaco 签名
   */
  private convertToMonacoSignatures(signatures: SignatureInfo[]): MonacoSignatureInformation[] {
    return signatures.map(sig => ({
      label: sig.label,
      documentation: sig.documentation ? { value: sig.documentation } : undefined,
      parameters: sig.parameters.map(param => ({
        label: param.label,
        documentation: param.documentation ? { value: param.documentation } : undefined
      }))
    }))
  }

  /**
   * 获取提交字符
   */
  private getCommitCharacters(kind: number): string[] {
    if (kind === 2) { // Function
      return ['(']
    }
    if (kind === 3 || kind === 6) { // Field or Variable
      return ['.', ' ', ';']
    }
    return [' ', ';']
  }

  /**
   * 查找当前函数调用
   */
  private findCurrentFunctionCall(text: string): { functionName: string; parameterIndex: number } | null {
    let parenCount = 0
    let parameterIndex = 0
    let i = text.length - 1

    // 跳过空白字符
    while (i >= 0 && /\s/.test(text[i])) {
      i--
    }

    // 计算参数索引
    while (i >= 0) {
      const char = text[i]

      if (char === ')') {
        parenCount++
      } else if (char === '(') {
        parenCount--
        if (parenCount < 0) {
          break
        }
      } else if (char === ',' && parenCount === 0) {
        parameterIndex++
      }

      i--
    }

    if (parenCount >= 0) {
      return null
    }

    // 查找函数名
    while (i >= 0 && /\s/.test(text[i])) {
      i--
    }

    let functionEnd = i + 1
    while (i >= 0 && /[a-zA-Z0-9_]/.test(text[i])) {
      i--
    }

    const functionName = text.substring(i + 1, functionEnd)

    if (!functionName) {
      return null
    }

    return { functionName, parameterIndex }
  }

  /**
   * 分析用户代码并添加符号
   */
  private analyzeAndAddUserSymbols(code: string): void {
    // 简化的用户符号提取
    const userSymbols: CompletionItem[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line || line.startsWith('//') || line.startsWith('/*')) continue

      // 提取函数定义
      const functionMatch = line.match(/^\s*(?:static\s+|inline\s+|extern\s+)?(\w+(?:\s*\*)*)\s+(\w+)\s*\(([^)]*)\)\s*[{;]?/)
      if (functionMatch && !this.isKeyword(functionMatch[2])) {
        const [, returnType, functionName, params] = functionMatch

        userSymbols.push({
          label: functionName,
          kind: 2, // Function
          insertText: `${functionName}(${this.generateParameterSnippet(params)})`,
          insertTextRules: 4,
          documentation: `User-defined function\nReturn type: ${returnType.trim()}\nParameters: ${params || 'void'}`,
          detail: `📝 User Function (Line ${i + 1})`,
          sortText: `9${functionName}`
        })
      }
    }

    symbolCore.addUserSymbols(userSymbols)
  }

  /**
   * 生成参数片段
   */
  private generateParameterSnippet(params: string): string {
    if (!params || params.trim() === 'void') return ''

    const paramList = params.split(',').map((param, index) => {
      const trimmed = param.trim()
      const paramName = trimmed.split(/\s+/).pop() || `param${index + 1}`
      return `\${${index + 1}:${paramName}}`
    })

    return paramList.join(', ')
  }

  /**
   * 检查是否为关键字
   */
  private isKeyword(word: string): boolean {
    const keywords = [
      'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed',
      'const', 'static', 'extern', 'volatile', 'register', 'auto',
      'struct', 'union', 'enum', 'typedef',
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
      'break', 'continue', 'return', 'goto', 'sizeof'
    ]
    return keywords.includes(word)
  }

  /**
   * 等待符号核心准备就绪
   */
  private async waitForSymbolCore(): Promise<void> {
    let attempts = 0
    const maxAttempts = 50

    while (!symbolCore.isReady() && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    if (!symbolCore.isReady()) {
      throw new Error('符号核心初始化超时')
    }
  }

  /**
   * 设置语言
   */
  setLanguage(language: LanguageType): void {
    this.currentLanguage = language
    symbolCore.setLanguage(language)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return symbolCore.getStats()
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.disposables.forEach(disposable => {
      if (disposable && typeof disposable.dispose === 'function') {
        disposable.dispose()
      }
    })
    this.disposables = []
    console.log('🧹 Monaco 集成资源已清理')
  }
}

// 快速启动函数
export async function initializeMonacoSymbols(monaco: any, language: LanguageType = 'c'): Promise<MonacoIntegration> {
  const integration = new MonacoIntegration(language)
  await integration.initialize(monaco)
  return integration
}
