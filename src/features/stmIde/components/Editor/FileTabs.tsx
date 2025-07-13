import React, { useState } from 'react'
import useFileStore from '../../stores/fileStore'
import ConfirmDialog from '../UI/ConfirmDialog'

const FileTabs: React.FC = () => {
  const {
    openFiles,
    activeFile,
    setActiveFile,
    closeFile,
    saveFile
  } = useFileStore()

  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean
    title: string
    message: string
    type: 'danger' | 'warning' | 'info'
    onConfirm: () => void
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {}
  })

  const handleTabClick = (filePath: string) => {
    setActiveFile(filePath)
  }

  const handleTabClose = (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation()

    const file = openFiles.find(f => f.path === filePath)
    if (file?.modified) {
      setConfirmDialog({
        visible: true,
        title: '保存文件',
        message: `文件 "${file.name}" 有未保存的更改。是否保存？`,
        type: 'warning',
        onConfirm: () => {
          saveFile(filePath).then(() => {
            closeFile(filePath)
            setConfirmDialog(prev => ({ ...prev, visible: false }))
          }).catch(error => {
            console.error('保存文件失败:', error)
            // 保存失败时显示错误，但不阻止关闭
            closeFile(filePath)
            setConfirmDialog(prev => ({ ...prev, visible: false }))
          })
        }
      })
      return
    }

    closeFile(filePath)
  }

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'c': return '🔵'
      case 'h': return '🟣'
      case 'cpp': case 'cxx': case 'cc': return '🔵'
      case 'hpp': case 'hxx': return '🟣'
      case 'js': case 'jsx': return '🟡'
      case 'ts': case 'tsx': return '🔷'
      case 'py': return '🐍'
      case 'java': return '☕'
      case 'json': return '📋'
      case 'xml': return '📄'
      case 'html': return '🌐'
      case 'css': return '🎨'
      case 'md': return '📝'
      case 'txt': return '📄'
      default: return '📄'
    }
  }

  if (openFiles.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 flex items-center px-2 min-h-9 overflow-x-auto">
      <div className="flex items-center">
        {openFiles.map(file => (
          <div
            key={file.path}
            className={`border border-gray-200 border-b-0 rounded-t px-3 py-2 mr-1 cursor-pointer flex items-center gap-2 text-xs transition-colors min-w-24 max-w-36 ${
              activeFile === file.path
                ? 'bg-white border-blue-600 text-blue-700 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
            onClick={() => handleTabClick(file.path)}
            title={file.path}
          >
            <span className="flex-shrink-0">{getFileIcon(file.name)}</span>
            <span className="truncate flex-1">{file.name}</span>
            {file.modified && <span className="text-orange-500 flex-shrink-0">●</span>}
            <button
              className="flex-shrink-0 w-4 h-4 rounded hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700"
              onClick={(e) => handleTabClose(e, file.path)}
              title="关闭"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 确认对话框 */}
      <ConfirmDialog
        visible={confirmDialog.visible}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="保存"
        cancelText="不保存"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => {
          // 不保存直接关闭
          const filePath = openFiles.find(f => f.modified)?.path
          if (filePath) {
            closeFile(filePath)
          }
          setConfirmDialog(prev => ({ ...prev, visible: false }))
        }}
      />
    </div>
  )
}

export default FileTabs
