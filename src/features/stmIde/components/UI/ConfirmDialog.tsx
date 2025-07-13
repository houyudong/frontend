import React from 'react'

interface ConfirmDialogProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'info',
  onConfirm,
  onCancel
}) => {
  if (!visible) return null

  const getIcon = () => {
    switch (type) {
      case 'danger': return '🗑️'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
    }
  }

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger': return '#dc3545'
      case 'warning': return '#ffc107'
      case 'info': return '#0078d7'
    }
  }

  return (
    <div 
      className="dialog-overlay"
      onClick={onCancel}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="dialog-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          minWidth: '400px',
          maxWidth: '500px',
          animation: 'slideIn 0.2s ease-out'
        }}
      >
        {/* 标题栏 */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          background: '#f8f9fa',
          borderRadius: '6px 6px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>{getIcon()}</span>
          <h3 style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: '#333333'
          }}>
            {title}
          </h3>
        </div>

        {/* 内容区 */}
        <div style={{
          padding: '20px',
          color: '#333333',
          lineHeight: '1.5',
          fontSize: '13px'
        }}>
          {message}
        </div>

        {/* 按钮区 */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          background: '#f8f9fa',
          borderRadius: '0 0 6px 6px'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '6px 16px',
              border: '1px solid #e0e0e0',
              background: '#ffffff',
              color: '#333333',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'inherit',
              minWidth: '64px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '6px 16px',
              border: `1px solid ${getConfirmButtonColor()}`,
              background: getConfirmButtonColor(),
              color: '#ffffff',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'inherit',
              minWidth: '64px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              const color = getConfirmButtonColor()
              const darkerColor = type === 'danger' ? '#c82333' : 
                                 type === 'warning' ? '#e0a800' : '#106ebe'
              e.currentTarget.style.backgroundColor = darkerColor
              e.currentTarget.style.borderColor = darkerColor
            }}
            onMouseLeave={(e) => {
              const color = getConfirmButtonColor()
              e.currentTarget.style.backgroundColor = color
              e.currentTarget.style.borderColor = color
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
