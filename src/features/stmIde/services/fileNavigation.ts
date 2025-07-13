/**
 * 文件导航服务 - 统一管理文件跳转和高亮样式
 *
 * 奥卡姆原则简化：
 * 1. 定义跳转：跳转 + 选中态（无额外高亮）
 * 2. 调试跳转：跳转 + 持续高亮，随单步移动
 */

import * as monaco from 'monaco-editor'

export interface NavigationOptions {
  line: number
  column?: number
  highlight?: boolean
  highlightType?: 'definition' | 'debug'
}

class FileNavigationService {
  // 移除重复的调试高亮管理，由 useBreakpoints Hook 统一处理

  /**
   * 跳转到指定位置
   */
  public jumpToLocation(editor: monaco.editor.IStandaloneCodeEditor, options: NavigationOptions): void {
    const { line, column = 1, highlight = false, highlightType = 'definition' } = options

    console.log('🎯 文件导航跳转:', { line, column, highlight, highlightType })

    // 1. 跳转到指定位置
    this.performJump(editor, line, column)

    // 2. 调试高亮由 useBreakpoints Hook 统一管理，避免重复高亮
    console.log('🔧 调试高亮由 useBreakpoints Hook 统一管理')
  }

  /**
   * 执行跳转操作
   */
  private performJump(editor: monaco.editor.IStandaloneCodeEditor, line: number, column: number): void {
    try {
      // 设置光标位置
      editor.setPosition({ lineNumber: line, column })

      // 滚动到可视区域
      editor.revealLineInCenter(line, monaco.editor.ScrollType.Smooth)

      // 聚焦编辑器
      editor.focus()

      console.log('✅ 跳转成功:', { line, column })
    } catch (error) {
      console.error('❌ 跳转失败:', error)
    }
  }

  // 🔧 奥卡姆原则：调试高亮由 useBreakpoints Hook 统一管理，避免重复逻辑
}

// 导出单例实例
const fileNavigationService = new FileNavigationService()
export default fileNavigationService
