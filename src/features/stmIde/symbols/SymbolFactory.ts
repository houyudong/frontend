/**
 * 符号工厂类 - 遵循 DRY 原则的符号创建工具
 * 提供统一的符号创建方法，避免重复代码
 */

import { CompletionItem, SignatureInfo, SymbolKind, InsertTextRule } from './types'

export class SymbolFactory {
  /**
   * 创建函数符号
   */
  static createFunction(config: {
    name: string
    returnType?: string
    parameters?: string
    documentation?: string
    detail?: string
    sortText?: string
    library?: string
  }): CompletionItem {
    const { name, returnType, parameters, documentation, detail, library } = config

    return {
      label: name,
      kind: SymbolKind.Function,
      insertText: parameters ? `${name}(${this.generateParameterSnippet(parameters)})` : `${name}()`,
      insertTextRules: InsertTextRule.InsertAsSnippet,
      documentation: this.formatDocumentation(documentation, returnType, parameters),
      detail: detail || (library ? `📚 ${library}` : '🔧 Function'),
      sortText: config.sortText || `1${name}`,
      commitCharacters: ['(']
    }
  }

  /**
   * 创建变量符号
   */
  static createVariable(config: {
    name: string
    type?: string
    documentation?: string
    detail?: string
    sortText?: string
    isConstant?: boolean
  }): CompletionItem {
    const { name, type, documentation, detail, isConstant } = config

    return {
      label: name,
      kind: isConstant ? SymbolKind.Constant : SymbolKind.Variable,
      insertText: name,
      documentation: this.formatDocumentation(documentation, type),
      detail: detail || (isConstant ? '🔢 Constant' : '📝 Variable'),
      sortText: config.sortText || `2${name}`
    }
  }

  /**
   * 创建关键字符号
   */
  static createKeyword(config: {
    name: string
    documentation?: string
    detail?: string
    sortText?: string
  }): CompletionItem {
    const { name, documentation, detail } = config

    return {
      label: name,
      kind: SymbolKind.Keyword,
      insertText: name,
      documentation,
      detail: detail || '🔤 Keyword',
      sortText: config.sortText || `0${name}`
    }
  }

  /**
   * 🔧 根源修复：创建优先级更高的代码片段符号
   */
  static createSnippet(config: {
    name: string
    snippet: string
    documentation?: string
    detail?: string
    sortText?: string
  }): CompletionItem {
    const { name, snippet, documentation, detail } = config

    // 🔧 简化优先级设置
    const getSnippetPriority = (snippetName: string): string => {
      const highPrioritySnippets = ['if', 'for', 'while', 'switch']
      if (highPrioritySnippets.includes(snippetName)) {
        return `0${snippetName}` // 最高优先级
      }
      return `1${snippetName}` // 普通优先级
    }

    return {
      label: name,
      kind: SymbolKind.Snippet,
      insertText: snippet,
      insertTextRules: InsertTextRule.InsertAsSnippet,
      documentation,
      detail: detail || '🔧 智能代码片段',
      sortText: config.sortText || getSnippetPriority(name)
    }
  }

  /**
   * 创建函数签名
   */
  static createSignature(config: {
    label: string
    documentation?: string
    parameters: Array<{
      name: string
      documentation?: string
    }>
  }): SignatureInfo {
    const { label, documentation, parameters } = config

    return {
      label,
      documentation,
      parameters: parameters.map(param => ({
        label: param.name,
        documentation: param.documentation
      }))
    }
  }

  /**
   * 批量创建函数符号
   */
  static createFunctions(functions: Array<{
    name: string
    returnType?: string
    parameters?: string
    documentation?: string
    library?: string
  }>, baseDetail?: string): CompletionItem[] {
    return functions.map((func, index) =>
      this.createFunction({
        ...func,
        detail: baseDetail || (func.library ? `📚 ${func.library}` : undefined),
        sortText: `1${String(index).padStart(3, '0')}`
      })
    )
  }

  /**
   * 批量创建常量符号
   */
  static createConstants(constants: Array<{
    name: string
    documentation?: string
    value?: string
  }>, baseDetail?: string): CompletionItem[] {
    return constants.map((constant, index) =>
      this.createVariable({
        name: constant.name,
        documentation: constant.documentation,
        detail: baseDetail,
        sortText: `2${String(index).padStart(3, '0')}`,
        isConstant: true
      })
    )
  }

  /**
   * 生成参数片段
   */
  private static generateParameterSnippet(params: string): string {
    if (!params || params.trim() === 'void') return ''

    const paramList = params.split(',').map((param, index) => {
      const trimmed = param.trim()
      const paramName = trimmed.split(/\s+/).pop() || `param${index + 1}`
      return `\${${index + 1}:${paramName}}`
    })

    return paramList.join(', ')
  }

  /**
   * 格式化文档
   */
  private static formatDocumentation(
    documentation?: string,
    type?: string,
    parameters?: string
  ): string {
    let doc = documentation || ''

    if (type) {
      doc += doc ? `\n\nType: ${type}` : `Type: ${type}`
    }

    if (parameters) {
      doc += doc ? `\n\nParameters: ${parameters}` : `Parameters: ${parameters}`
    }

    return doc
  }


}



/**
 * 🔧 根源修复：统一的符号模板类
 */
export class SymbolTemplates {
  // 🔧 引用正确的代码片段定义
  static readonly COMMON_SNIPPETS = [
    {
      name: 'if',
      snippet: 'if (${1:condition}) {\n\t${2:// TODO: 实现条件为真时的逻辑}\n}',
      documentation: '条件判断语句 - 当条件为真时执行代码块'
    },
    {
      name: 'for',
      snippet: 'for (${1|uint8_t,uint16_t,uint32_t,int|} ${2:i} = 0; ${2:i} < ${3:count}; ${2:i}++) {\n\t${4:// TODO: 循环体逻辑}\n}',
      documentation: '标准for循环 - 适用于已知次数的循环'
    },
    {
      name: 'while',
      snippet: 'while (${1:condition}) {\n\t${2:// TODO: 循环体逻辑}\n}',
      documentation: '条件循环 - 当条件为真时重复执行'
    },
    {
      name: 'switch',
      snippet: 'switch (${1:variable}) {\n\tcase ${2:value1}:\n\t\t${3:// TODO: 处理情况1}\n\t\tbreak;\n\tcase ${4:value2}:\n\t\t${5:// TODO: 处理情况2}\n\t\tbreak;\n\tdefault:\n\t\t${6:// TODO: 默认处理}\n\t\tbreak;\n}',
      documentation: '多分支选择语句 - 根据变量值执行不同代码'
    }
  ]

  // C 语言类型（增强版）
  static readonly C_TYPES = [
    { name: 'int', documentation: '32-bit signed integer' },
    { name: 'char', documentation: '8-bit character' },
    { name: 'float', documentation: '32-bit floating point' },
    { name: 'double', documentation: '64-bit floating point' },
    { name: 'void', documentation: 'No type' },
    { name: 'short', documentation: '16-bit signed integer' },
    { name: 'long', documentation: '64-bit signed integer' },
    { name: 'unsigned', documentation: 'Unsigned modifier' },
    { name: 'signed', documentation: 'Signed modifier' },
    { name: 'const', documentation: 'Constant modifier' },
    { name: 'volatile', documentation: 'Volatile modifier' },
    { name: 'static', documentation: 'Static storage class' },
    { name: 'extern', documentation: 'External linkage' },
    { name: 'register', documentation: 'Register storage class' },
    { name: 'auto', documentation: 'Automatic storage class' },
    // STM32 特定类型
    { name: 'uint8_t', documentation: '8-bit unsigned integer (STM32)' },
    { name: 'uint16_t', documentation: '16-bit unsigned integer (STM32)' },
    { name: 'uint32_t', documentation: '32-bit unsigned integer (STM32)' },
    { name: 'int8_t', documentation: '8-bit signed integer (STM32)' },
    { name: 'int16_t', documentation: '16-bit signed integer (STM32)' },
    { name: 'int32_t', documentation: '32-bit signed integer (STM32)' },
    { name: 'HAL_StatusTypeDef', documentation: 'HAL function return status' }
  ]

  // C 语言关键字（增强版）
  static readonly C_KEYWORDS = [
    { name: 'if', documentation: 'Conditional statement' },
    { name: 'else', documentation: 'Alternative branch' },
    { name: 'for', documentation: 'Loop statement' },
    { name: 'while', documentation: 'Loop statement' },
    { name: 'do', documentation: 'Do-while loop' },
    { name: 'switch', documentation: 'Multi-way branch' },
    { name: 'case', documentation: 'Switch case' },
    { name: 'default', documentation: 'Default case' },
    { name: 'break', documentation: 'Break statement' },
    { name: 'continue', documentation: 'Continue statement' },
    { name: 'return', documentation: 'Return statement' },
    { name: 'goto', documentation: 'Jump statement' },
    { name: 'sizeof', documentation: 'Size operator' },
    { name: 'typedef', documentation: 'Type definition' },
    { name: 'struct', documentation: 'Structure definition' },
    { name: 'union', documentation: 'Union definition' },
    { name: 'enum', documentation: 'Enumeration definition' }
  ]
}
