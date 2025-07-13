import React, { useState, useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // 等待动画完成
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'success': return '#28a745'
      case 'error': return '#dc3545'
      case 'warning': return '#ffc107'
      case 'info': return '#17a2b8'
    }
  }

  return (
    <div
      className={`toast ${visible ? 'show' : 'hide'}`}
      style={{
        position: 'relative', // 改为相对定位，由容器控制位置
        background: '#ffffff',
        border: `1px solid ${getColor()}`,
        borderLeft: `4px solid ${getColor()}`,
        borderRadius: '4px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '300px',
        maxWidth: '500px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        marginBottom: '8px'
      }}
    >
      <span style={{ fontSize: '16px' }}>{getIcon()}</span>
      <span style={{
        flex: 1,
        fontSize: '13px',
        color: '#333333',
        lineHeight: '1.4'
      }}>
        {message}
      </span>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onClose, 300)
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#666666',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          lineHeight: '1'
        }}
      >
        ×
      </button>
    </div>
  )
}

export default Toast
