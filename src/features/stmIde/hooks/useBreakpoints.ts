import { useCallback, useEffect, useRef } from 'react'
import { useDebugStore } from '../stores/debugStore'
import breakpointService from '../services/breakpoint'

/**
 * 简化的断点管理Hook - 清理版本
 */
export function useBreakpoints(
  editor: any,
  filePath?: string
) {
  const { isDebugging, currentFile, currentLine } = useDebugStore()

  // 装饰集合引用
  const decorationsCollectionRef = useRef<any>(null)
  const currentLineDecorationsCollectionRef = useRef<any>(null)
  const hoverDecorationsCollectionRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  // 获取当前文件的断点
  const fileBreakpoints = breakpointService.getFileBreakpoints(filePath || '')

  /**
   * 更新断点装饰
   */
  const updateBreakpointDecorations = useCallback(() => {
    if (!editor || !filePath) return

    const decorations: any[] = []

    // 为每个断点创建装饰
    fileBreakpoints.forEach(breakpoint => {
      let glyphClassName = 'breakpoint-glyph'
      let hoverMessage = `断点 - 行 ${breakpoint.lineNumber}`

      // 简化断点状态逻辑 - 遵循奥卡姆原则
      const isCurrentBreakpoint = isDebugging && currentFile === filePath && currentLine === breakpoint.lineNumber

      if (isCurrentBreakpoint) {
        // 当前命中的断点 - 红色圆点带黄色边框
        glyphClassName = 'breakpoint-glyph-hit'
        hoverMessage = `断点命中 - 行 ${breakpoint.lineNumber}`
      } else {
        // 默认断点 - 红色圆点
        glyphClassName = 'breakpoint-glyph'
        hoverMessage = `断点 - 行 ${breakpoint.lineNumber}`
      }

      decorations.push({
        range: new (window as any).monaco.Range(breakpoint.lineNumber, 1, breakpoint.lineNumber, 1),
        options: {
          isWholeLine: false,
          glyphMarginClassName: glyphClassName,
          glyphMarginHoverMessage: { value: hoverMessage },
          stickiness: (window as any).monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        }
      })
    })

    // 更新断点装饰
    if (!decorationsCollectionRef.current) {
      decorationsCollectionRef.current = editor.createDecorationsCollection()
    }
    decorationsCollectionRef.current.set(decorations)


  }, [editor, filePath, fileBreakpoints, isDebugging, currentFile, currentLine])

  /**
   * 更新悬停装饰 - VSCode风格
   */
  const updateHoverDecoration = useCallback((lineNumber: number | null) => {
    if (!editor || !filePath) return

    const hasBreakpoint = fileBreakpoints.some(bp => bp.lineNumber === lineNumber)

    if (lineNumber && !hasBreakpoint) {
      // 显示悬停断点提示
      const hoverDecorations = [{
        range: new (window as any).monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: false,
          glyphMarginClassName: 'breakpoint-hover',
          glyphMarginHoverMessage: { value: '单击以添加断点' }
        }
      }]

      if (!hoverDecorationsCollectionRef.current) {
        hoverDecorationsCollectionRef.current = editor.createDecorationsCollection()
      }
      hoverDecorationsCollectionRef.current.set(hoverDecorations)
    } else {
      // 清除悬停装饰
      if (hoverDecorationsCollectionRef.current) {
        hoverDecorationsCollectionRef.current.clear()
      }
    }
  }, [editor, filePath, fileBreakpoints])

  /**
   * 🔧 优雅解决：基于 cortex-debug 模式的装饰器管理
   */
  const setCurrentLineHighlight = useCallback((lineNumber?: number) => {
    if (!editor || !filePath) return

    // 清除之前的高亮
    if (currentLineDecorationsCollectionRef.current) {
      currentLineDecorationsCollectionRef.current.clear()
    }

    // 🔧 优雅条件：调试状态下且有行号就高亮（基于 debugStore 状态）
    if (isDebugging && lineNumber) {
      if (!currentLineDecorationsCollectionRef.current) {
        currentLineDecorationsCollectionRef.current = editor.createDecorationsCollection()
      }

      // 检查当前行是否有断点
      const hasBreakpoint = fileBreakpoints.some(bp => bp.lineNumber === lineNumber)

      const currentLineDecorations = [{
        range: new (window as any).monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'current-line-highlight',
          glyphMarginClassName: hasBreakpoint ? undefined : 'current-line-glyph',
          stickiness: (window as any).monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        }
      }]

      currentLineDecorationsCollectionRef.current.set(currentLineDecorations)
      editor.revealLineInCenter(lineNumber)
    }
  }, [editor, filePath, isDebugging, fileBreakpoints])

  /**
   * 处理断点切换
   */
  const handleBreakpointToggle = useCallback(async (lineNumber: number) => {
    if (!filePath) return
    try {
      await breakpointService.toggleBreakpoint(filePath, lineNumber)
    } catch (error) {
      console.error('断点切换失败:', error)
    }
  }, [filePath])

  /**
   * 设置事件监听器
   */
  useEffect(() => {
    if (!editor || !filePath || isInitializedRef.current) return

    // 鼠标点击事件 - 断点切换
    const mouseDownDisposable = editor.onMouseDown((e: any) => {
      if (e.target.type === (window as any).monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position?.lineNumber
        if (lineNumber) {
          handleBreakpointToggle(lineNumber)
        }
      }
    })

    // VSCode风格悬停效果
    const mouseHoverDisposable = editor.onMouseMove((e: any) => {
      if (e.target.type === (window as any).monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position?.lineNumber
        updateHoverDecoration(lineNumber || null)
      } else {
        updateHoverDecoration(null)
      }
    })

    const mouseLeaveDisposable = editor.onMouseLeave(() => {
      updateHoverDecoration(null)
    })

    // 🔧 优雅解决：基于 debugStore 状态的高亮处理
    const handleDebugLocationChanged = (event: CustomEvent) => {
      const { file, line } = event.detail
      if (file === filePath && line) {
        setCurrentLineHighlight(line) // 依赖 debugStore 的 isDebugging 状态
      }
    }

    document.addEventListener('debug-location-changed', handleDebugLocationChanged as EventListener)

    // 标记为已初始化
    isInitializedRef.current = true

    // 初始化断点装饰
    updateBreakpointDecorations()

    // 清理函数
    return () => {
      mouseDownDisposable.dispose()
      mouseHoverDisposable.dispose()
      mouseLeaveDisposable.dispose()
      document.removeEventListener('debug-location-changed', handleDebugLocationChanged as EventListener)

      // 清理装饰集合
      if (decorationsCollectionRef.current) {
        decorationsCollectionRef.current.clear()
        decorationsCollectionRef.current = null
      }
      if (currentLineDecorationsCollectionRef.current) {
        currentLineDecorationsCollectionRef.current.clear()
        currentLineDecorationsCollectionRef.current = null
      }
      if (hoverDecorationsCollectionRef.current) {
        hoverDecorationsCollectionRef.current.clear()
        hoverDecorationsCollectionRef.current = null
      }

      isInitializedRef.current = false
    }
  }, [editor, filePath, handleBreakpointToggle, updateBreakpointDecorations, updateHoverDecoration])

  /**
   * 监听断点状态变化
   */
  useEffect(() => {
    if (isInitializedRef.current) {
      updateBreakpointDecorations()
    }
  }, [updateBreakpointDecorations])

  /**
   * 监听调试状态变化，更新当前行装饰
   */
  useEffect(() => {
    if (isInitializedRef.current) {
      updateBreakpointDecorations()
      setCurrentLineHighlight(currentLine)
    }
  }, [isDebugging, currentFile, currentLine, updateBreakpointDecorations, setCurrentLineHighlight])

  return {
    breakpoints: fileBreakpoints,
    toggleBreakpoint: handleBreakpointToggle,
    updateDecorations: updateBreakpointDecorations
  }
}

export default useBreakpoints
