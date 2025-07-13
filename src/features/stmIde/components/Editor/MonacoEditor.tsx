import React, { useEffect, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'

import { useDefinitionProvider } from '../../hooks/useDefinitionProvider'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { useCompletionProvider } from '../../hooks/useCompletionProvider'

interface MonacoEditorProps {
  value: string
  language: string
  onChange?: (value: string) => void
  onSave?: () => void
  readOnly?: boolean
  filePath?: string // 添加文件路径，用于断点管理
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  onSave,
  readOnly = false,
  filePath
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const isSettingValueRef = useRef(false)
  const changeListenerRef = useRef<monaco.IDisposable | null>(null)

  // 断点Hook状态
  const [editorReady, setEditorReady] = useState(false)

  // 只有在编辑器准备好后才调用 hooks
  useBreakpoints(editorReady ? monacoRef.current : null, filePath)
  useDefinitionProvider(editorReady ? monacoRef.current : null, filePath)
  useCompletionProvider(editorReady ? monacoRef.current : null, language)

  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      // 配置Monaco Editor的Web Worker（避免警告）
      if (typeof window !== 'undefined' && !(window as any).MonacoEnvironment) {
        (window as any).MonacoEnvironment = {
          getWorker: function (_moduleId: string, _label: string) {
            // 在开发环境中，我们简单地返回一个空的Worker来避免警告
            // 在生产环境中，应该配置正确的Worker路径
            return new Worker(
              URL.createObjectURL(
                new Blob(['self.onmessage = function() {}'], { type: 'application/javascript' })
              )
            )
          }
        }
      }

      // 创建 Monaco Editor 实例
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: value,
        language: language,
        theme: 'vs-light',
        readOnly: readOnly,
        automaticLayout: true,
        fontSize: 13,
        fontFamily: 'Consolas, "Courier New", monospace',
        lineNumbers: 'on',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        glyphMargin: true, // 启用字形边距，用于显示断点
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'mouseover',
        // 自动补全配置 - 由 useCompletionProvider hook 处理
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        acceptSuggestionOnCommitCharacter: true,
        tabCompletion: 'on',
        // 定义跳转功能
        links: true,
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

      // 验证编辑器配置
      console.log('✅ Monaco Editor 创建完成，语言:', monacoRef.current.getModel()?.getLanguageId())


      // 确保Monaco暴露到全局
      if (typeof window !== 'undefined') {
        (window as any).monaco = monaco
      }

      // 监听内容变化
      if (changeListenerRef.current) {
        changeListenerRef.current.dispose()
      }
      changeListenerRef.current = monacoRef.current.onDidChangeModelContent(() => {
        if (onChange && monacoRef.current && !isSettingValueRef.current) {
          onChange(monacoRef.current.getValue())
        }
      })

      // 添加保存快捷键
      monacoRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        if (onSave) {
          onSave()
        }
      })

      // 添加手动触发补全的快捷键 (Ctrl+Space)
      monacoRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
        monacoRef.current?.trigger('keyboard', 'editor.action.triggerSuggest', {})
        console.log('🔧 手动触发补全')
      })

      // 🔧 修复 Ctrl 键问题 - 覆盖默认的定义跳转行为
      monacoRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F12, () => {
        // 自定义的定义跳转逻辑，而不是默认行为
        console.log('自定义定义跳转')
        return true // 阻止默认行为
      })

      // 禁用 Ctrl+Click 的默认定义跳转
      monacoRef.current.onMouseDown((e) => {
        if (e.event.ctrlKey || e.event.metaKey) {
          // 阻止 Ctrl+Click 的默认定义跳转行为
          e.event.preventDefault()
          e.event.stopPropagation()
        }
      })

      // 添加自定义的 Ctrl+Click 处理
      monacoRef.current.onMouseUp((e) => {
        if ((e.event.ctrlKey || e.event.metaKey) && e.target.position) {
          // 自定义的点击处理逻辑
          const position = e.target.position
          const model = monacoRef.current?.getModel()
          if (model) {
            const word = model.getWordAtPosition(position)
            if (word) {
              console.log(`Ctrl+Click on: ${word.word} at line ${position.lineNumber}`)
              // 这里可以添加自定义的跳转逻辑
            }
          }
        }
      })

      // 设置编辑器就绪状态
      setEditorReady(true)


    }

    return () => {
      if (changeListenerRef.current) {
        changeListenerRef.current.dispose()
        changeListenerRef.current = null
      }
      if (monacoRef.current) {
        monacoRef.current.dispose()
        monacoRef.current = null
      }
      setEditorReady(false)
    }
  }, [])

  // 🔧 定义跳转功能已移至上方，与断点Hook一起管理

  // 更新onChange事件绑定
  useEffect(() => {
    if (monacoRef.current && onChange) {
      if (changeListenerRef.current) {
        changeListenerRef.current.dispose()
      }
      changeListenerRef.current = monacoRef.current.onDidChangeModelContent(() => {
        if (onChange && monacoRef.current && !isSettingValueRef.current) {
          onChange(monacoRef.current.getValue())
        }
      })
    }
  }, [onChange])

  // 更新编辑器内容
  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      isSettingValueRef.current = true
      monacoRef.current.setValue(value)
      isSettingValueRef.current = false
    }
  }, [value])

  // 更新语言
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])

  // Monaco Editor 样式 - 使用标准 CSS
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* 断点样式 - 简化版，遵循奥卡姆原则 */
      .breakpoint-glyph {
        background: #e51400 !important;
        border-radius: 50% !important;
        margin-left: 4px !important;
        width: 12px !important;
        height: 12px !important;
        border: 2px solid #ffffff !important;
        cursor: pointer !important;
      }

      .breakpoint-glyph-hit {
        background: #e51400 !important;
        border-radius: 50% !important;
        margin-left: 4px !important;
        width: 12px !important;
        height: 12px !important;
        border: 3px solid #fbbf24 !important;
        cursor: pointer !important;
        animation: breakpoint-pulse 2s infinite !important;
      }

      .breakpoint-hover {
        background: rgba(229, 20, 0, 0.3) !important;
        border-radius: 50% !important;
        margin-left: 4px !important;
        width: 12px !important;
        height: 12px !important;
        border: 2px solid rgba(255, 255, 255, 0.7) !important;
        cursor: pointer !important;
      }

      /* 当前执行行样式 - 修复调试时的高亮显示 */
      .monaco-editor .current-line-highlight {
        background: rgba(255, 235, 59, 0.25) !important;
        border-left: 4px solid #ff9800 !important;
        position: relative !important;
        z-index: 5 !important;
        box-sizing: border-box !important;
      }

      /* 确保整行高亮效果 */
      .monaco-editor .view-overlays .current-line-highlight,
      .monaco-editor .view-lines .current-line-highlight {
        background: rgba(255, 235, 59, 0.2) !important;
        border-left: 4px solid #ff9800 !important;
        margin-left: 0 !important;
        padding-left: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      /* 修复行号区域的高亮 */
      .monaco-editor .margin-view-overlays .current-line-highlight {
        background: rgba(255, 152, 0, 0.1) !important;
        border-left: 4px solid #ff9800 !important;
      }

      /* 调试时的行号高亮 */
      .monaco-editor .margin .line-numbers .current-line-highlight {
        background: rgba(255, 152, 0, 0.15) !important;
        color: #ff9800 !important;
        font-weight: bold !important;
      }

      /* 确保调试高亮不被其他样式覆盖 */
      .monaco-editor .view-line.current-line-highlight {
        background: rgba(255, 235, 59, 0.15) !important;
      }

      /* 调试时的代码文本高亮 */
      .monaco-editor .view-line.current-line-highlight .mtk1,
      .monaco-editor .view-line.current-line-highlight .mtk2,
      .monaco-editor .view-line.current-line-highlight .mtk3,
      .monaco-editor .view-line.current-line-highlight .mtk4,
      .monaco-editor .view-line.current-line-highlight .mtk5 {
        background: transparent !important;
      }

      .current-line-glyph {
        width: 0 !important;
        height: 0 !important;
        border-left: 12px solid #10b981 !important;
        border-top: 9px solid transparent !important;
        border-bottom: 9px solid transparent !important;
        margin-left: 4px !important;
        margin-top: 0px !important;
        position: relative !important;
        z-index: 20 !important;
        filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.5)) !important;
      }

      /* 当前行三角形的悬停效果 */
      .current-line-glyph:hover {
        border-left-color: #059669 !important;
        filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.8)) !important;
      }

      /* 定义跳转高亮 */
      .definition-highlight {
        background: rgba(0, 122, 204, 0.12) !important;
        border-left: 1px solid rgba(0, 122, 204, 0.4) !important;
        animation: definition-fade 3s ease-out !important;
      }

      /* 动画 */
      @keyframes breakpoint-pulse {
        0% { box-shadow: 0 0 6px rgba(251, 191, 36, 0.8) !important; }
        50% { box-shadow: 0 0 10px rgba(251, 191, 36, 1.0) !important; }
        100% { box-shadow: 0 0 6px rgba(251, 191, 36, 0.8) !important; }
      }

      @keyframes definition-fade {
        0% { opacity: 1; background: rgba(0, 122, 204, 0.25) !important; }
        100% { opacity: 0.5; background: rgba(0, 122, 204, 0.12) !important; }
      }

      /* 字形边距悬停效果 */
      .monaco-editor .margin-view-overlays .line-numbers {
        transition: background-color 0.2s ease !important;
      }

      .monaco-editor .margin-view-overlays .line-numbers:hover {
        background-color: rgba(229, 20, 0, 0.03) !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <div ref={editorRef} className="w-full h-full" />
}

export default MonacoEditor
