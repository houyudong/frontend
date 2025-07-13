import { useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { symbolCore } from '../symbols/SymbolCore'

/**
 * 补全提供者 Hook - 从 MonacoEditor.tsx 中提取的补全逻辑
 * 遵循 DRY 原则，避免在 TSX 中写 TS 逻辑
 */
export const useCompletionProvider = (
  editor: monaco.editor.IStandaloneCodeEditor | null,
  language: string
) => {
  useEffect(() => {
    if (!editor) return

    let disposables: monaco.IDisposable[] = []

    // 初始化符号系统
    const initializeSymbols = async () => {
      try {
        symbolCore.setLanguage(language as any)
        await symbolCore.reload()
        console.log('✅ 符号系统初始化完成')

        // 注册高级补全提供者
        const completionDisposable = registerAdvancedCompletion()
        disposables.push(completionDisposable)

      } catch (error) {
        console.error('❌ 符号系统初始化失败，使用降级补全:', error)

        // 降级到基础补全
        const fallbackDisposable = registerFallbackCompletion()
        disposables.push(fallbackDisposable)
      }
    }

    // 🔧 根源修复：高级补全提供者（优化 for、if 等关键字触发）
    const registerAdvancedCompletion = (): monaco.IDisposable => {
      return monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: async (model, position) => {
          try {
            const word = model.getWordUntilPosition(position)
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            }

            // 分析用户代码
            const fullCode = model.getValue()
            analyzeAndAddUserSymbols(fullCode)

            // 🔧 关键修复：优化查询逻辑，确保 for、if 等关键字优先显示
            const query = word.word || ''
            const maxResults = query.length === 0 ? 30 : 50 // 增加结果数量
            const completions = symbolCore.filterSymbols(query, maxResults)

            // 🔧 简化：使用 sortText 进行排序，不需要额外处理
            const sortedCompletions = completions

            // 转换为 Monaco 格式
            const suggestions = sortedCompletions.map(item => ({
              label: item.label,
              kind: item.kind,
              insertText: item.insertText,
              insertTextRules: item.insertTextRules,
              documentation: item.documentation,
              detail: item.detail,
              sortText: item.sortText,
              range: range,
              commitCharacters: getCommitCharacters(item.kind)
            }))

            // 🔧 调试：验证代码片段配置
            const snippetSuggestions = suggestions.filter(s => s.kind === 15) // Snippet kind
            if (snippetSuggestions.length > 0) {
              console.log('🔧 代码片段建议:', snippetSuggestions.slice(0, 3).map(s => ({
                label: s.label,
                insertText: s.insertText?.substring(0, 50) + '...',
                insertTextRules: s.insertTextRules,
                sortText: s.sortText
              })))
            }

            return { suggestions }
          } catch (error) {
            console.error('高级补全失败:', error)
            return { suggestions: [] }
          }
        },
        triggerCharacters: getTriggerCharacters(language)
      })
    }

    // 降级补全提供者（基础 C 语言补全）
    const registerFallbackCompletion = (): monaco.IDisposable => {
      return monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          }

          // 基础 C 语言补全库
          const basicSuggestions = [
            // 常用函数
            { label: 'printf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'printf("${1:format}", ${2:args})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'scanf', kind: monaco.languages.CompletionItemKind.Function, insertText: 'scanf("${1:format}", ${2:args})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'malloc', kind: monaco.languages.CompletionItemKind.Function, insertText: 'malloc(${1:size})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'free', kind: monaco.languages.CompletionItemKind.Function, insertText: 'free(${1:ptr})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },

            // STM32 HAL 函数
            { label: 'HAL_GPIO_WritePin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'HAL_GPIO_WritePin(${1:GPIOx}, ${2:GPIO_Pin}, ${3:PinState})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'HAL_GPIO_ReadPin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'HAL_GPIO_ReadPin(${1:GPIOx}, ${2:GPIO_Pin})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'HAL_GPIO_TogglePin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'HAL_GPIO_TogglePin(${1:GPIOx}, ${2:GPIO_Pin})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'HAL_Delay', kind: monaco.languages.CompletionItemKind.Function, insertText: 'HAL_Delay(${1:Delay})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },

            // 关键字
            { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (${1:int i = 0}; ${2:i < n}; ${3:i++}) {\n\t${4:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },

            // 数据类型
            { label: 'int', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'int', range },
            { label: 'char', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'char', range },
            { label: 'void', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'void', range },

            // 常量
            { label: 'NULL', kind: monaco.languages.CompletionItemKind.Constant, insertText: 'NULL', range },
            { label: 'GPIO_PIN_SET', kind: monaco.languages.CompletionItemKind.Constant, insertText: 'GPIO_PIN_SET', range },
            { label: 'GPIO_PIN_RESET', kind: monaco.languages.CompletionItemKind.Constant, insertText: 'GPIO_PIN_RESET', range }
          ]

          // 过滤建议
          const filteredSuggestions = word.word.length === 0
            ? basicSuggestions.slice(0, 20)
            : basicSuggestions.filter(s =>
                s.label.toLowerCase().includes(word.word.toLowerCase())
              )

          return { suggestions: filteredSuggestions }
        },
        triggerCharacters: getTriggerCharacters(language)
      })
    }

    // 🔧 根源修复：完善触发字符，确保所有关键代码片段都能触发
    const getTriggerCharacters = (lang: string): string[] => {
      switch (lang) {
        case 'c':
        case 'cpp':
          return [
            '.', '->', '_', ' ', '(',
            // 🔧 基础控制结构触发字符
            'i', 'f', 'w', 's', 'd', // if, for, while, switch, do
            // 🔧 函数和结构定义触发字符
            'e', 'm', 'c', 'v', 't', // enum, main, callback, void, typedef
            // 🔧 其他常用触发字符
            'r', 'b', 'g', 'p', 'n', // return, break, goto, printf, new
            // HAL 库触发
            'H', 'G', 'N',
            // 数字和特殊字符
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
          ]
        default:
          return ['.', ' ', '_', 'i', 'f', 'w', 's', 'd']
      }
    }

    // 获取提交字符
    const getCommitCharacters = (kind: number): string[] => {
      if (kind === 2) { // Function
        return ['(']
      }
      if (kind === 3 || kind === 6) { // Field or Variable
        return ['.', ' ', ';']
      }
      return [' ', ';']
    }

    // 分析用户代码并添加符号
    const analyzeAndAddUserSymbols = (code: string): void => {
      const userSymbols: any[] = []
      const lines = code.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith('//') || line.startsWith('/*')) continue

        // 提取函数定义
        const functionMatch = line.match(/^\s*(?:static\s+|inline\s+|extern\s+)?(\w+(?:\s*\*)*)\s+(\w+)\s*\(([^)]*)\)\s*[{;]?/)
        if (functionMatch && !isKeyword(functionMatch[2])) {
          const [, returnType, functionName, params] = functionMatch

          userSymbols.push({
            label: functionName,
            kind: 2, // Function
            insertText: `${functionName}(${generateParameterSnippet(params)})`,
            insertTextRules: 4,
            documentation: `User-defined function\nReturn type: ${returnType.trim()}\nParameters: ${params || 'void'}`,
            detail: `📝 User Function (Line ${i + 1})`,
            sortText: `9${functionName}`
          })
        }
      }

      symbolCore.addUserSymbols(userSymbols)
    }

    // 生成参数片段
    const generateParameterSnippet = (params: string): string => {
      if (!params || params.trim() === 'void') return ''

      const paramList = params.split(',').map((param, index) => {
        const trimmed = param.trim()
        const paramName = trimmed.split(/\s+/).pop() || `param${index + 1}`
        return `\${${index + 1}:${paramName}}`
      })

      return paramList.join(', ')
    }

    // 检查是否为关键字
    const isKeyword = (word: string): boolean => {
      const keywords = [
        'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed',
        'const', 'static', 'extern', 'volatile', 'register', 'auto',
        'struct', 'union', 'enum', 'typedef',
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
        'break', 'continue', 'return', 'goto', 'sizeof'
      ]
      return keywords.includes(word)
    }

    // 初始化
    initializeSymbols()

    return () => {
      disposables.forEach(disposable => disposable.dispose())
    }
  }, [editor, language])
}
