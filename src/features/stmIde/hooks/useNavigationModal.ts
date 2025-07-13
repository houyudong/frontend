import { useState, useEffect } from 'react'
import navigationModalService, { type ModalConfig } from '../services/navigationModal'

/**
 * 导航模态框Hook
 * 用于在React组件中使用导航模态框
 */
export const useNavigationModal = () => {
  const [currentModal, setCurrentModal] = useState<ModalConfig | null>(null)

  useEffect(() => {
    // 订阅模态框状态变化
    const unsubscribe = navigationModalService.subscribe((modal) => {
      setCurrentModal(modal)
    })

    // 获取初始状态
    setCurrentModal(navigationModalService.getCurrentModal())

    // 清理订阅
    return unsubscribe
  }, [])

  return {
    currentModal,
    isVisible: currentModal !== null,
    showLoading: navigationModalService.showLoading.bind(navigationModalService),
    showSuccess: navigationModalService.showSuccess.bind(navigationModalService),
    showError: navigationModalService.showError.bind(navigationModalService),
    showWarning: navigationModalService.showWarning.bind(navigationModalService),
    hideModal: navigationModalService.hideModal.bind(navigationModalService),
    updateModal: navigationModalService.updateModal.bind(navigationModalService)
  }
}

export default useNavigationModal
