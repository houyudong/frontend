/**
 * 符号工厂类 - 遵循 DRY 原则的符号创建工具
 * 提供统一的符号创建方法，避免重复代码
 */

import { CompletionItem, SignatureInfo, ParameterInfo, SymbolKind, InsertTextRule } from './types'

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
    const { name, returnType, parameters, documentation, detail, sortText, library } = config

    return {
      label: name,
      kind: SymbolKind.Function,
      insertText: parameters ? `${name}(${this.generateParameterSnippet(parameters)})` : `${name}()`,
      insertTextRules: InsertTextRule.InsertAsSnippet,
      documentation: this.formatDocumentation(documentation, returnType, parameters),
      detail: detail || (library ? `📚 ${library}` : '🔧 Function'),
      sortText: sortText || `1${name}`,
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
    const { name, type, documentation, detail, sortText, isConstant } = config

    return {
      label: name,
      kind: isConstant ? SymbolKind.Constant : SymbolKind.Variable,
      insertText: name,
      documentation: this.formatDocumentation(documentation, type),
      detail: detail || (isConstant ? '🔢 Constant' : '📝 Variable'),
      sortText: sortText || `2${name}`
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
    const { name, documentation, detail, sortText } = config

    return {
      label: name,
      kind: SymbolKind.Keyword,
      insertText: name,
      documentation,
      detail: detail || '🔤 Keyword',
      sortText: sortText || `0${name}`
    }
  }

  /**
   * 创建代码片段符号
   */
  static createSnippet(config: {
    name: string
    snippet: string
    documentation?: string
    detail?: string
    sortText?: string
  }): CompletionItem {
    const { name, snippet, documentation, detail, sortText } = config

    return {
      label: name,
      kind: SymbolKind.Snippet,
      insertText: snippet,
      insertTextRules: InsertTextRule.InsertAsSnippet,
      documentation,
      detail: detail || '📝 Snippet',
      sortText: sortText || `3${name}`
    }
  }

  /**
   * 创建类/结构体符号
   */
  static createClass(config: {
    name: string
    documentation?: string
    detail?: string
    sortText?: string
    isStruct?: boolean
  }): CompletionItem {
    const { name, documentation, detail, sortText, isStruct } = config

    return {
      label: name,
      kind: isStruct ? SymbolKind.Struct : SymbolKind.Class,
      insertText: name,
      documentation,
      detail: detail || (isStruct ? '🏗️ Struct' : '🏛️ Class'),
      sortText: sortText || `4${name}`
    }
  }

  /**
   * 创建宏符号
   */
  static createMacro(config: {
    name: string
    parameters?: string
    value?: string
    documentation?: string
    detail?: string
    sortText?: string
  }): CompletionItem {
    const { name, parameters, value, documentation, detail, sortText } = config

    return {
      label: name,
      kind: SymbolKind.Constant,
      insertText: parameters ? `${name}(${this.generateParameterSnippet(parameters)})` : name,
      insertTextRules: parameters ? InsertTextRule.InsertAsSnippet : InsertTextRule.None,
      documentation: this.formatMacroDocumentation(documentation, parameters, value),
      detail: detail || '🔧 Macro',
      sortText: sortText || `5${name}`
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
        detail: baseDetail || func.library ? `📚 ${func.library}` : undefined,
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

  /**
   * 格式化宏文档
   */
  private static formatMacroDocumentation(
    documentation?: string,
    parameters?: string,
    value?: string
  ): string {
    let doc = documentation || ''

    if (parameters) {
      doc += doc ? `\n\nParameters: ${parameters}` : `Parameters: ${parameters}`
    }

    if (value) {
      doc += doc ? `\n\nValue: ${value}` : `Value: ${value}`
    }

    return doc
  }
}

/**
 * 常用符号模板
 */
export class SymbolTemplates {
  /**
   * C 语言数据类型
   */
  static readonly C_TYPES = [
    { name: 'int', documentation: 'Integer type (typically 32-bit)' },
    { name: 'char', documentation: 'Character type (8-bit)' },
    { name: 'float', documentation: 'Single precision floating point (32-bit)' },
    { name: 'double', documentation: 'Double precision floating point (64-bit)' },
    { name: 'void', documentation: 'Void type (no value)' },
    { name: 'long', documentation: 'Long integer type' },
    { name: 'short', documentation: 'Short integer type (16-bit)' },
    { name: 'unsigned', documentation: 'Unsigned type modifier' },
    { name: 'signed', documentation: 'Signed type modifier' }
  ]

  /**
   * C 语言关键字
   */
  static readonly C_KEYWORDS = [
    { name: 'if', documentation: 'Conditional statement' },
    { name: 'else', documentation: 'Alternative branch' },
    { name: 'for', documentation: 'For loop' },
    { name: 'while', documentation: 'While loop' },
    { name: 'do', documentation: 'Do-while loop' },
    { name: 'switch', documentation: 'Switch statement' },
    { name: 'case', documentation: 'Switch case' },
    { name: 'default', documentation: 'Default case' },
    { name: 'break', documentation: 'Break statement' },
    { name: 'continue', documentation: 'Continue statement' },
    { name: 'return', documentation: 'Return statement' },
    { name: 'struct', documentation: 'Structure declaration' },
    { name: 'union', documentation: 'Union declaration' },
    { name: 'enum', documentation: 'Enumeration declaration' },
    { name: 'typedef', documentation: 'Type definition' },
    { name: 'static', documentation: 'Static storage class' },
    { name: 'extern', documentation: 'External storage class' },
    { name: 'const', documentation: 'Constant qualifier' },
    { name: 'volatile', documentation: 'Volatile qualifier' },
    { name: 'sizeof', documentation: 'Size operator' }
  ]

  /**
   * 🔧 根源重构：增强的代码片段（保持原有功能，增加新功能）
   */
  static readonly COMMON_SNIPPETS = [
    // 🔧 最高优先级：基础控制结构（保持原有TODO风格）
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
    },
    {
      name: 'do',
      snippet: 'do {\n\t${1:// TODO: 循环体逻辑}\n} while (${2:condition});',
      documentation: 'do-while循环 - 至少执行一次的循环'
    },

    // 🔧 扩展控制结构
    {
      name: 'ifelse',
      snippet: 'if (${1:condition}) {\n\t${2:// TODO: 条件为真}\n} else {\n\t${3:// TODO: 条件为假}\n}',
      documentation: '完整的条件判断语句 - 包含else分支'
    },

    // 🔧 保持原有的函数定义
    {
      name: 'function',
      snippet: '${1|void,uint8_t,uint16_t,uint32_t,int,HAL_StatusTypeDef|} ${2:function_name}(${3:parameters}) {\n\t${4:// TODO: 函数实现}\n\treturn ${5:value};\n}',
      documentation: 'C函数定义 - 包含返回类型、参数和函数体'
    },
    {
      name: 'main',
      snippet: 'int main(void) {\n\t${1:// TODO: 主函数逻辑}\n\treturn 0;\n}',
      documentation: 'C程序主函数'
    }
  ]
}
