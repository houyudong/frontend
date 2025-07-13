/**
 * 快捷键管理器
 * 统一管理应用的快捷键
 */

export interface ShortcutHandler {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: (event: KeyboardEvent) => void
  description: string
}

class ShortcutManager {
  private shortcuts: Map<string, ShortcutHandler> = new Map()
  private isListening = false

  /**
   * 注册快捷键
   */
  register(shortcut: ShortcutHandler): void {
    const key = this.getShortcutKey(shortcut)
    this.shortcuts.set(key, shortcut)
    
    if (!this.isListening) {
      this.startListening()
    }
  }

  /**
   * 注销快捷键
   */
  unregister(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean): void {
    const shortcutKey = this.getShortcutKeyFromParams(key, ctrl, shift, alt)
    this.shortcuts.delete(shortcutKey)
  }

  /**
   * 清除所有快捷键
   */
  clear(): void {
    this.shortcuts.clear()
  }

  /**
   * 开始监听键盘事件
   */
  private startListening(): void {
    if (this.isListening) return

    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.isListening = true
    console.log('🎹 快捷键管理器已启动')
  }

  /**
   * 停止监听键盘事件
   */
  stopListening(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    this.isListening = false
    console.log('🎹 快捷键管理器已停止')
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // 忽略在输入框中的按键
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    const key = this.getShortcutKeyFromEvent(event)
    const shortcut = this.shortcuts.get(key)

    if (shortcut) {
      event.preventDefault()
      event.stopPropagation()
      
      try {
        shortcut.handler(event)
        console.log(`🎹 执行快捷键: ${this.getShortcutDescription(shortcut)}`)
      } catch (error) {
        console.error('快捷键处理失败:', error)
      }
    }
  }

  /**
   * 从事件生成快捷键标识
   */
  private getShortcutKeyFromEvent(event: KeyboardEvent): string {
    return this.getShortcutKeyFromParams(
      event.key.toLowerCase(),
      event.ctrlKey || event.metaKey,
      event.shiftKey,
      event.altKey
    )
  }

  /**
   * 从参数生成快捷键标识
   */
  private getShortcutKeyFromParams(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean): string {
    const parts: string[] = []
    if (ctrl) parts.push('ctrl')
    if (shift) parts.push('shift')
    if (alt) parts.push('alt')
    parts.push(key.toLowerCase())
    return parts.join('+')
  }

  /**
   * 从快捷键对象生成标识
   */
  private getShortcutKey(shortcut: ShortcutHandler): string {
    return this.getShortcutKeyFromParams(
      shortcut.key,
      shortcut.ctrl,
      shortcut.shift,
      shortcut.alt
    )
  }

  /**
   * 获取快捷键描述
   */
  private getShortcutDescription(shortcut: ShortcutHandler): string {
    const parts: string[] = []
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    parts.push(shortcut.key.toUpperCase())
    return parts.join('+')
  }

  /**
   * 获取所有已注册的快捷键
   */
  getRegisteredShortcuts(): ShortcutHandler[] {
    return Array.from(this.shortcuts.values())
  }
}

// 创建全局实例
const shortcutManager = new ShortcutManager()

export default shortcutManager

/**
 * 常用快捷键常量
 */
export const SHORTCUTS = {
  SAVE: { key: 's', ctrl: true, description: '保存当前文件' },
  SAVE_ALL: { key: 's', ctrl: true, shift: true, description: '保存所有文件' },
  COMPILE: { key: 'b', ctrl: true, description: '编译项目' },
  RUN: { key: 'f5', description: '运行程序' },
  DEBUG: { key: 'f5', ctrl: true, description: '开始调试' },
  STEP_OVER: { key: 'f10', description: '单步执行' },
  STEP_INTO: { key: 'f11', description: '步入函数' },
  STEP_OUT: { key: 'f11', shift: true, description: '步出函数' },
  CONTINUE: { key: 'f5', description: '继续执行' },
  STOP: { key: 'f5', shift: true, description: '停止调试' }
} as const
