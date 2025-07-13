import React, { useState, useEffect, useRef } from 'react'

interface FileOperationDialogProps {
  visible: boolean
  type: 'createFile' | 'createFolder' | 'rename' | 'delete'
  title: string
  defaultValue?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

const FileOperationDialog: React.FC<FileOperationDialogProps> = ({
  visible,
  type,
  title,
  defaultValue = '',
  onConfirm,
  onCancel
}) => {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        if (type === 'rename' && defaultValue) {
          // 重命名时选中文件名（不包括扩展名）
          const dotIndex = defaultValue.lastIndexOf('.')
          if (dotIndex > 0) {
            inputRef.current?.setSelectionRange(0, dotIndex)
          } else {
            inputRef.current?.select()
          }
        }
      }, 100)
    }
  }, [visible, type, defaultValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedValue = value.trim()
    if (trimmedValue) {
      onConfirm(trimmedValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  const getPlaceholder = () => {
    switch (type) {
      case 'createFile': return '输入文件名 (例如: main.c)'
      case 'createFolder': return '输入文件夹名'
      case 'rename': return '输入新名称'
      default: return '输入名称'
    }
  }

  const getFileTemplate = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'c':
        return '// C源文件\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n'
      case 'h':
        const headerGuard = fileName.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/\.H$/, '_H')
        return `// C头文件\n#ifndef ${headerGuard}\n#define ${headerGuard}\n\n// 声明\n\n#endif // ${headerGuard}\n`
      case 'cpp':
        return '// C++源文件\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n'
      case 'js':
        return '// JavaScript文件\nconsole.log("Hello, World!");\n'
      case 'md':
        return `# ${fileName.replace(/\.[^/.]+$/, "")}\n\n这是一个Markdown文档。\n`
      case 'json':
        return '{\n  "name": "' + fileName.replace(/\.[^/.]+$/, "") + '",\n  "version": "1.0.0"\n}\n'
      default:
        return ''
    }
  }

  if (!visible) return null

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="dialog-content">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className="dialog-input"
              autoComplete="off"
            />
          </div>
          
          {type === 'createFile' && value.trim() && (
            <div className="file-preview">
              <div className="preview-label">文件模板预览:</div>
              <div className="preview-content">
                {getFileTemplate(value.trim()) ? '将创建带有模板内容的文件' : '将创建空文件'}
              </div>
            </div>
          )}
        </form>
        
        <div className="dialog-footer">
          <button
            type="button"
            className="dialog-button secondary"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="button"
            className="dialog-button primary"
            onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
            disabled={!value.trim()}
          >
            {type === 'delete' ? '删除' : '确定'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileOperationDialog
