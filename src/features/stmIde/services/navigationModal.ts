/**
 * 导航模态框管理服务
 * 统一管理调试、文件下载跳转等场景的模态框显示
 */

export interface ModalConfig {
  title: string
  message: string
  type: 'loading' | 'success' | 'error' | 'warning'
  autoCloseDelay?: number
  onClose?: () => void
}

class NavigationModalService {
  private currentModal: ModalConfig | null = null
  private listeners: Array<(modal: ModalConfig | null) => void> = []

  /**
   * 显示加载模态框
   */
  public showLoading(title: string, message: string, autoCloseDelay = 5000): void {
    this.showModal({
      title,
      message,
      type: 'loading',
      autoCloseDelay
    })
  }

  /**
   * 显示成功模态框
   */
  public showSuccess(title: string, message: string, autoCloseDelay = 3000): void {
    this.showModal({
      title,
      message,
      type: 'success',
      autoCloseDelay
    })
  }

  /**
   * 显示错误模态框
   */
  public showError(title: string, message: string, autoCloseDelay = 5000): void {
    this.showModal({
      title,
      message,
      type: 'error',
      autoCloseDelay
    })
  }

  /**
   * 显示警告模态框
   */
  public showWarning(title: string, message: string, autoCloseDelay = 4000): void {
    this.showModal({
      title,
      message,
      type: 'warning',
      autoCloseDelay
    })
  }

  /**
   * 显示文件下载跳转模态框
   */
  public showFileDownload(fileName: string): void {
    this.showLoading(
      '正在下载文件',
      `正在下载 ${fileName}，请稍候...`,
      8000
    )
  }

  // 🔧 DRY原则：移除不再使用的特定场景方法
  // 定义跳转已改为静默执行，调试跳转也是静默的
  // 保持服务简洁，只提供基础的showLoading/showSuccess/showError/showWarning方法

  /**
   * 显示通用模态框
   */
  public showModal(config: ModalConfig): void {
    // 🔧 DRY原则：如果已有模态框，先隐藏再显示新的
    if (this.currentModal) {
      console.log('🔔 替换当前模态框:', this.currentModal.title, '->', config.title)
    }

    this.currentModal = {
      ...config,
      onClose: () => {
        this.hideModal()
        config.onClose?.()
      }
    }
    this.notifyListeners()
    console.log('🔔 显示导航模态框:', config.title)
  }

  /**
   * 隐藏模态框
   */
  public hideModal(): void {
    if (this.currentModal) {
      console.log('🔔 隐藏导航模态框')
      this.currentModal = null
      this.notifyListeners()
    }
  }

  /**
   * 获取当前模态框
   */
  public getCurrentModal(): ModalConfig | null {
    return this.currentModal
  }

  /**
   * 订阅模态框状态变化
   */
  public subscribe(listener: (modal: ModalConfig | null) => void): () => void {
    this.listeners.push(listener)

    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentModal)
      } catch (error) {
        console.error('模态框监听器错误:', error)
      }
    })
  }

  /**
   * 检查是否有模态框正在显示
   */
  public isModalVisible(): boolean {
    return this.currentModal !== null
  }

  /**
   * 更新当前模态框内容
   */
  public updateModal(updates: Partial<ModalConfig>): void {
    if (this.currentModal) {
      this.currentModal = {
        ...this.currentModal,
        ...updates
      }
      this.notifyListeners()
      console.log('🔔 更新导航模态框:', updates)
    }
  }
}

// 导出单例实例
const navigationModalService = new NavigationModalService()
export default navigationModalService
