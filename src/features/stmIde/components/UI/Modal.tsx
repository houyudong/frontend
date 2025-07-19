/**
 * 简洁的模态框组件 - 遵循奥卡姆原则
 * 专注于用户操作确认，避免过度设计
 */

import React, { useEffect } from 'react'
import Icon from './Icon'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: 'info' | 'warning' | 'error' | 'confirm'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = '确定',
  cancelText = '取消',
  showCancel = true
}) => {
  // ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // 防止背景滚动
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // 图标映射
  const iconMap = {
    info: 'info-circle',
    warning: 'alert-triangle',
    error: 'x-circle',
    confirm: 'help-circle'
  }

  // 颜色映射
  const colorMap = {
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    confirm: 'text-gray-500'
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Icon 
              name={iconMap[type]} 
              size={20} 
              className={colorMap[type]}
            />
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="关闭"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* 按钮 */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 ${
              type === 'error' 
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                : type === 'warning'
                ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
            }`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal

// 便捷的Hook
export const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [modalProps, setModalProps] = React.useState<Partial<ModalProps>>({})

  const showModal = (props: Omit<ModalProps, 'isOpen' | 'onClose'>) => {
    setModalProps(props)
    setIsOpen(true)
  }

  const hideModal = () => {
    setIsOpen(false)
  }

  const ModalComponent = () => (
    <Modal
      {...modalProps as ModalProps}
      isOpen={isOpen}
      onClose={hideModal}
    />
  )

  return {
    showModal,
    hideModal,
    ModalComponent,
    isOpen
  }
}

// 便捷的确认对话框
export const useConfirmDialog = () => {
  const { showModal, ModalComponent } = useModal()

  const confirm = (
    message: string,
    title: string = '确认操作'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'confirm',
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: () => resolve(true),
        onClose: () => resolve(false)
      })
    })
  }

  return {
    confirm,
    ModalComponent
  }
}

// 便捷的删除确认对话框
export const useDeleteConfirm = () => {
  const { showModal, ModalComponent } = useModal()

  const confirmDelete = (
    itemName: string,
    itemType: string = '项目'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      showModal({
        title: `删除${itemType}`,
        message: `确定要删除 "${itemName}" 吗？此操作无法撤销。`,
        type: 'error',
        confirmText: '删除',
        cancelText: '取消',
        onConfirm: () => resolve(true),
        onClose: () => resolve(false)
      })
    })
  }

  return {
    confirmDelete,
    ModalComponent
  }
}
