import React, { useEffect, useRef, useState } from 'react'
import { useDefinitionProvider } from '../../hooks/useDefinitionProvider'
import { useBreakpoints } from '../../hooks/useBreakpoints'

// 🔧 导入专业的符号分析器
import { SymbolAnalyzer } from '../../utils/SymbolAnalyzer'

// 创建全局符号分析器实例
const symbolAnalyzer = new SymbolAnalyzer()

interface MonacoEditorProps {
  value: string
  language: string
  onChange?: (value: string) => void
  onSave?: () => void
  readOnly?: boolean
  filePath?: string
}

const MonacoEditorCDN: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  onSave,
  readOnly = false,
  filePath
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<any>(null)
  const [editorReady, setEditorReady] = useState(false)

  // 🔧 重新启用 hooks - 已修复配置问题
  useBreakpoints(monacoRef.current, editorReady ? 'ready' : 'loading')
  useDefinitionProvider(monacoRef.current, editorReady ? 'ready' : 'loading')

  useEffect(() => {
    if (!editorRef.current) return

    const initializeEditor = () => {
      if (!(window as any).monaco || monacoRef.current) return

      try {
        // 🔧 与测试页面完全一致的配置
        monacoRef.current = (window as any).monaco.editor.create(editorRef.current, {
          value: value || `#include <stdio.h>

int main() {
    // 在这里输入 "pri" 然后按 Ctrl+Space 测试自动补全
    pri
    return 0;
}`,
          language: 'c', // 🔧 固定使用 'c' 语言，与测试页面一致
          theme: 'vs-light',
          readOnly: readOnly,
          automaticLayout: true,
          fontSize: 14,
          // 🔧 根源修复：确保代码片段能够正确插入
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          tabCompletion: 'on',
          wordBasedSuggestions: false, // 关闭基于单词的建议，避免干扰
          // 🔧 关键修复：确保代码片段功能
          snippetSuggestions: 'top', // 代码片段显示在顶部
          quickSuggestionsDelay: 0, // 立即触发
          suggestSelection: 'first', // 默认选择第一个建议
          // 🔧 新增：支持代码片段插入
          suggest: {
            snippetsPreventQuickSuggestions: false, // 允许代码片段和快速建议共存
            showSnippets: true, // 显示代码片段
            insertMode: 'insert' // 插入模式而非替换模式
          }
        })

        console.log('✅ Monaco Editor 创建完成 (CDN版本)，语言:', monacoRef.current.getModel().getLanguageId())

        // 🔧 详细验证Monaco编辑器配置 (CDN版本)
        console.log('🔴 Monaco编辑器配置验证 (CDN版本):', {
          language: 'c',
          modelLanguage: monacoRef.current.getModel()?.getLanguageId(),
          quickSuggestions: monacoRef.current.getOption((window as any).monaco.editor.EditorOption.quickSuggestions),
          suggestOnTriggerCharacters: monacoRef.current.getOption((window as any).monaco.editor.EditorOption.suggestOnTriggerCharacters),
          wordBasedSuggestions: monacoRef.current.getOption((window as any).monaco.editor.EditorOption.wordBasedSuggestions),
          tabCompletion: monacoRef.current.getOption((window as any).monaco.editor.EditorOption.tabCompletion)
        })

        // 🔧 检查语言服务 (CDN版本)
        const monaco = (window as any).monaco
        console.log('🔴 Monaco语言服务检查 (CDN版本):', {
          languages: monaco.languages.getLanguages().map((l: any) => l.id),
          cLanguageExists: monaco.languages.getLanguages().find((l: any) => l.id === 'c') ? '✅' : '❌',
          totalLanguages: monaco.languages.getLanguages().length
        })

        // 🔧 优化：合并事件监听
        monacoRef.current.onDidChangeModelContent(() => onChange?.(monacoRef.current.getValue()))

        // 🔧 优化：简化快捷键绑定
        onSave && monacoRef.current.addCommand(2048 | 49, onSave) // Ctrl+S

        // 🔧 延迟设置为就绪，确保 hooks 配置完成后再测试自动补全
        setTimeout(() => {
          setEditorReady(true)
          console.log('✅ Monaco Editor 初始化完成，语言:', language)

          // 🔧 验证自动补全配置
          const currentOptions = monacoRef.current.getOptions()
          console.log('🔧 当前自动补全配置:', {
            quickSuggestions: currentOptions.get((window as any).monaco.editor.EditorOption.quickSuggestions),
            suggestOnTriggerCharacters: currentOptions.get((window as any).monaco.editor.EditorOption.suggestOnTriggerCharacters),
            wordBasedSuggestions: currentOptions.get((window as any).monaco.editor.EditorOption.wordBasedSuggestions)
          })
        }, 300) // 给 hooks 足够时间完成配置
      } catch (error) {
        console.error('Monaco Editor 初始化失败:', error)
      }
    }

    const loadMonaco = () => {
      // 🔧 本地优先：直接检查并初始化
      if ((window as any).monaco) {
        initializeEditor()
        return
      }

      // 🔧 检查是否已有本地脚本
      if (document.querySelector('script[src*="monaco-editor"]') || document.querySelector('script[src*="loader.js"]')) {
        const checkMonaco = () => (window as any).monaco ? initializeEditor() : setTimeout(checkMonaco, 50)
        checkMonaco()
        return
      }

      // 🔧 与 STMClient 完全一致的加载方式
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs/loader.js'
      script.onload = () => {
        // 与 STMClient 完全相同的配置
        ;(window as any).require.config({
          paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs' }
        })

        // 与 STMClient 完全相同的加载方式
        ;(window as any).require(['vs/editor/editor.main'], () => {
          console.log('✅ Monaco Editor 主模块加载完成')

          // 🔧 不注册自定义补全提供器，使用 Monaco 原生的 C 语言支持
          console.log('🔧 使用 Monaco Editor 原生 C 语言自动补全')

          initializeEditor()
        })
      }

      document.head.appendChild(script)
    }

    loadMonaco()

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose()
        monacoRef.current = null
      }
      setEditorReady(false)
    }
  }, [])

  // 更新编辑器内容
  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value)
    }
  }, [value])

  // 更新语言 - 与 STMClient 一致的方式
  useEffect(() => {
    if (monacoRef.current && (window as any).monaco && language) {
      const model = monacoRef.current.getModel()
      if (model) {
        const currentLanguage = model.getLanguageId()
        if (currentLanguage !== language) {
          console.log('🔧 更新语言模式:', currentLanguage, '->', language)
          ;(window as any).monaco.editor.setModelLanguage(model, language)
        }
      }
    }
  }, [language])

  // 🔧 调试：始终显示编辑器容器，不依赖 editorReady 状态
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={editorRef} style={{ height: '100%', width: '100%' }} />
      {!editorReady && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(248, 249, 250, 0.9)',
          color: '#6c757d',
          fontSize: '14px',
          zIndex: 1000
        }}>
          正在加载编辑器...
        </div>
      )}
    </div>
  )
}

export default MonacoEditorCDN
