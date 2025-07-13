import { useEffect } from 'react'
import * as monaco from 'monaco-editor'
import definitionService from '../services/definition'
import fileNavigationService from '../services/fileNavigation'

/**
 * 定义跳转Hook - 从MonacoEditor中提取出来
 */
export const useDefinitionProvider = (
  editor: monaco.editor.IStandaloneCodeEditor | null,
  filePath?: string
) => {
  // 🔧 正确重构：实现自定义定义跳转流程
  // 流程：后端API → 文件打开 → Monaco搜索 → 选中
  const setupDefinitionProvider = () => {
    if (!editor || !filePath) return

    // 🔧 恢复：注册定义提供器 - 恢复原有功能
    const disposable = monaco.languages.registerDefinitionProvider(['c', 'cpp', 'h'], {
      provideDefinition: async (model, position) => {
        try {
          const word = model.getWordAtPosition(position)
          if (!word) return []

          console.log('🔍 定义查找:', word.word, '在文件:', filePath)

          const result = await definitionService.findDefinition(word.word, filePath)

          if (result.found && result.definition) {
            console.log('✅ 找到定义，开始自定义跳转流程:', result.definition)

            // 🔧 关键：使用自定义跳转流程，不返回Monaco标准格式
            // 这样Monaco不会自动跳转，我们可以控制整个流程
            setTimeout(() => {
              definitionService.navigateToDefinition(result.definition!)
            }, 100)

            return [] // 返回空数组，阻止Monaco的默认跳转
          }

          console.log('❌ 未找到定义:', result.message)
          return []
        } catch (error) {
          console.error('🔍 定义查找失败:', error)
          return []
        }
      }
    })

    // 🔧 配置定义跳转相关选项，不干扰补全配置
    if (editor) {
      editor.updateOptions({
        // 🔧 修复：禁用默认的定义跳转，使用自定义逻辑
        links: false, // 禁用默认链接行为
        definitionLinkOpensInPeek: false,
        gotoLocation: {
          multiple: 'goto',
          multipleDefinitions: 'goto',
          multipleTypeDefinitions: 'goto',
          multipleDeclarations: 'goto',
          multipleImplementations: 'goto',
          multipleReferences: 'goto'
        }
      })
      console.log('🔧 Monaco Editor 定义跳转配置完成')
    }

    return disposable
  }

  // 监听编辑器跳转事件
  useEffect(() => {
    const handleJumpToLine = (event: CustomEvent) => {
      const { line, column, highlight, retryCount = 0, isDebugLocation } = event.detail
      console.log('📍 收到跳转事件:', { line, column, highlight, retryCount, isDebugLocation })

      if (!editor) {
        console.log(`📍 编辑器未准备好，发送失败事件 (重试: ${retryCount})`)
        document.dispatchEvent(new CustomEvent('editor-navigation-failed', {
          detail: { retryCount, reason: 'editor_not_ready' }
        }))
        return
      }

      // 确保行号在有效范围内
      const model = editor.getModel()
      if (!model) {
        console.log(`📍 编辑器模型未准备好，发送失败事件 (重试: ${retryCount})`)
        document.dispatchEvent(new CustomEvent('editor-navigation-failed', {
          detail: { retryCount, reason: 'model_not_ready' }
        }))
        return
      }

      const lineCount = model.getLineCount()
      const targetLine = Math.min(Math.max(1, line), lineCount)
      const targetColumn = Math.max(1, column || 1)

      console.log('📍 计算的跳转位置:', {
        targetLine,
        targetColumn,
        lineCount,
        originalLine: line,
        originalColumn: column
      })

      // 🔧 重构：使用统一的文件导航服务
      const highlightType = isDebugLocation ? 'debug' : 'definition'

      fileNavigationService.jumpToLocation(editor, {
        line: targetLine,
        column: targetColumn,
        highlight,
        highlightType
      })

      // 🔧 修复：如果是调试位置跳转，发送调试位置变更事件
      if (isDebugLocation && filePath) {
        console.log('🔴 设置调试位置高亮:', { filePath, targetLine })

        // 发送调试位置变更事件，让useBreakpoints处理高亮
        const debugLocationEvent = new CustomEvent('debug-location-changed', {
          detail: {
            file: filePath,
            line: targetLine
          }
        })
        document.dispatchEvent(debugLocationEvent)
      }

      console.log('✅ 跳转完成:', { targetLine, targetColumn, retryCount, highlightType })

      // 🔧 发送跳转成功事件（停止重试）
      if (retryCount > 0) {
        console.log(`🎯 经过 ${retryCount} 次重试后跳转成功`)
      }
    }

    document.addEventListener('editor-jump-to-line', handleJumpToLine as EventListener)

    return () => {
      document.removeEventListener('editor-jump-to-line', handleJumpToLine as EventListener)
    }
  }, [editor])

  // 监听符号搜索事件 - 使用Monaco编辑器的搜索功能
  useEffect(() => {
    const handleSearchSymbol = (event: CustomEvent) => {
      const { symbol, highlight, retryCount = 0 } = event.detail
      console.log('🔍 收到符号搜索事件:', { symbol, highlight, retryCount })

      if (!editor) {
        console.log('🔍 编辑器未准备好，发送失败事件')
        document.dispatchEvent(new CustomEvent('editor-navigation-failed', {
          detail: { retryCount, reason: 'editor_not_ready' }
        }))
        return
      }

      const model = editor.getModel()
      if (!model) {
        console.log('🔍 编辑器模型未准备好，发送失败事件')
        document.dispatchEvent(new CustomEvent('editor-navigation-failed', {
          detail: { retryCount, reason: 'model_not_ready' }
        }))
        return
      }

      try {
        // 🔥 使用Monaco编辑器的查找功能
        const matches = model.findMatches(
          symbol,
          true,  // searchOnlyEditableRange
          false, // isRegex
          true,  // matchCase
          null,  // wordSeparators
          false, // captureMatches
          1000   // limitResultCount
        )

        console.log('🔍 找到匹配项:', matches.length)

        if (matches.length > 0) {
          // 选择第一个匹配项
          const firstMatch = matches[0]
          const targetLine = firstMatch.range.startLineNumber
          const targetColumn = firstMatch.range.startColumn

          console.log('🔍 跳转到第一个匹配:', { targetLine, targetColumn })

          // 🔧 修复：先跳转到位置，再设置选中状态
          editor.setPosition({
            lineNumber: targetLine,
            column: targetColumn
          })

          // 滚动到目标位置
          editor.revealLineInCenter(targetLine)

          // 🔧 关键修复：设置选择范围到符号，确保符号被选中
          setTimeout(() => {
            editor.setSelection(firstMatch.range)
            editor.focus() // 确保编辑器获得焦点
            console.log('✅ 符号选中完成:', firstMatch.range)
          }, 100) // 短暂延迟确保位置设置完成

          console.log('✅ 符号搜索和跳转完成')
        } else {
          console.log('❌ 未找到符号:', symbol)
          // 发送未找到符号的事件
          document.dispatchEvent(new CustomEvent('editor-navigation-failed', {
            detail: { retryCount, reason: 'symbol_not_found', symbol }
          }))
        }

      } catch (error) {
        console.error('🔍 符号搜索失败:', error)
      }
    }

    document.addEventListener('editor-search-symbol', handleSearchSymbol as EventListener)

    return () => {
      document.removeEventListener('editor-search-symbol', handleSearchSymbol as EventListener)
    }
  }, [editor])

  // 初始化定义提供器
  useEffect(() => {
    let disposable: monaco.IDisposable | undefined

    if (editor && filePath) {
      disposable = setupDefinitionProvider()
    }

    return () => {
      if (disposable) {
        disposable.dispose()
      }
    }
  }, [editor, filePath])

  return {
    setupDefinitionProvider
  }
}
