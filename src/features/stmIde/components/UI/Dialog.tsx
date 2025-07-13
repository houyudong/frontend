import React from 'react'
import Icon from './Icon'

interface DialogProps {
  visible: boolean
  title: string
  message?: string
  type?: 'info' | 'warning' | 'error' | 'success'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  children?: React.ReactNode
  width?: string
  showCancel?: boolean
}

const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  type = 'info',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  children,
  width = 'max-w-md',
  showCancel = true
}) => {
  if (!visible) return null

  const getTypeIcon = () => {
    switch (type) {
      case 'success': return { name: 'check', color: 'text-green-600' }
      case 'warning': return { name: 'alert-triangle', color: 'text-yellow-600' }
      case 'error': return { name: 'alert-circle', color: 'text-red-600' }
      default: return { name: 'info', color: 'text-blue-600' }
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'error': return 'border-red-200 bg-red-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'success': return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
      case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
      case 'error': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  }

  const typeIcon = getTypeIcon()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      {/* 对话框容器 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-lg shadow-xl ${width} w-full transform transition-all`}>
          {/* 标题栏 */}
          <div className={`px-6 py-4 border-b border-gray-200 ${getTypeColor()}`}>
            <div className="flex items-center gap-3">
              <Icon
                name={typeIcon.name}
                size={20}
                className={typeIcon.color}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="px-6 py-4">
            {message && (
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {message}
              </p>
            )}
            {children}
          </div>

          {/* 按钮区域 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getConfirmButtonColor()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog
