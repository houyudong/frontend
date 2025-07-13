import React, { useState, useEffect, useRef } from 'react'

interface InlineEditableItemProps {
  type: 'file' | 'folder'
  defaultValue?: string
  level?: number
  isEditing: boolean
  onConfirm: (value: string) => void
  onCancel: () => void
}

const InlineEditableItem: React.FC<InlineEditableItemProps> = ({
  type,
  defaultValue = '',
  level = 0,
  isEditing,
  onConfirm,
  onCancel
}) => {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        if (defaultValue && type === 'file') {
          // 重命名文件时选中文件名（不包括扩展名）
          const dotIndex = defaultValue.lastIndexOf('.')
          if (dotIndex > 0) {
            inputRef.current?.setSelectionRange(0, dotIndex)
          } else {
            inputRef.current?.select()
          }
        } else {
          inputRef.current?.select()
        }
      }, 50)
    }
  }, [isEditing, defaultValue, type])

  const handleSubmit = () => {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      onConfirm(trimmedValue)
    } else {
      onCancel()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  const handleBlur = () => {
    // 延迟一点，避免点击其他地方时立即触发
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        handleSubmit()
      }
    }, 100)
  }

  const getIcon = () => {
    if (type === 'folder') {
      return '📁'
    }
    return '📄'
  }

  return (
    <div
      className="file-tree-item inline-editing"
      style={{
        paddingLeft: `${level * 15 + 5}px`,
        backgroundColor: '#ffffff',
        border: '1px solid #0078d7',
        borderRadius: '2px',
        margin: '1px 0'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span style={{ marginRight: '5px', fontSize: '14px' }}>
        {getIcon()}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="inline-input-field"
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          flex: 1,
          fontSize: '13px',
          fontFamily: 'inherit',
          color: '#333333',
          padding: '1px 2px',
          width: '100%'
        }}
        placeholder={type === 'file' ? '文件名' : '文件夹名'}
      />
    </div>
  )
}

export default InlineEditableItem
