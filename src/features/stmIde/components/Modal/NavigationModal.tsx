import React, { useEffect, useState } from 'react'

interface NavigationModalProps {
  isOpen: boolean
  title: string
  message: string
  type: 'loading' | 'success' | 'error' | 'warning'
  autoCloseDelay?: number // 自动关闭延迟（毫秒）
  onClose?: () => void
}

/**
 * 专业导航模态框
 * 用于调试、文件下载跳转等场景
 * 支持自动消失和超时处理
 */
const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  title,
  message,
  type,
  autoCloseDelay = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setProgress(100)

      // 进度条动画
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoCloseDelay / 100))
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 100)

      // 自动关闭
      const autoCloseTimer = setTimeout(() => {
        handleClose()
      }, autoCloseDelay)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(autoCloseTimer)
      }
    } else {
      setIsVisible(false)
    }
  }, [isOpen, autoCloseDelay])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'loading':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          progressColor: 'bg-blue-500',
          icon: (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )
        }
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          progressColor: 'bg-green-500',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        }
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          progressColor: 'bg-red-500',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          progressColor: 'bg-yellow-500',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
          progressColor: 'bg-gray-500',
          icon: null
        }
    }
  }

  const styles = getTypeStyles()

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 模态框内容 */}
      <div className={`
        relative max-w-md w-full mx-4 rounded-lg shadow-xl border-2 overflow-hidden
        ${styles.bgColor} ${styles.borderColor}
        transform transition-all duration-300 ease-out
        ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* 进度条 */}
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
          <div
            className={`h-full transition-all duration-100 ease-linear ${styles.progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* 图标 */}
            <div className={`flex-shrink-0 ${styles.iconColor}`}>
              {styles.icon}
            </div>

            {/* 文本内容 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>

            {/* 🔧 奥卡姆原则：调试启动时不显示关闭按钮，避免用户误操作 */}
            {type !== 'loading' && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationModal
