import React, { useState, useEffect, useRef } from 'react'
import Icon from '../UI/Icon'
import ConfirmDialog from '../UI/ConfirmDialog'
import useFileStore from '../../stores/fileStore'
import { useFileTree, FileItem } from '../../hooks/useFileTree'
import { useFileOperations } from '../../hooks/useFileOperations'

interface ContextMenu {
  visible: boolean
  x: number
  y: number
  targetPath: string
  targetType: 'file' | 'directory'
}

/**
 * 重构后的文件树组件 - 使用hooks分离逻辑
 */
const FileTree: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    visible: false,
    x: 0,
    y: 0,
    targetPath: '',
    targetType: 'file'
  })

  const contextMenuRef = useRef<HTMLDivElement>(null)
  const { openFile } = useFileStore()

  // 确认对话框状态
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

  // 使用文件树数据管理hook
  const {
    files,
    loading,
    error,
    toggleFolder,
    refreshFileTree,
    updateFileTreeLocally
  } = useFileTree()

  // 使用文件操作hook
  const {
    editingItem,
    setEditingItem,
    handleEditSubmit,
    handleEditCancel,
    startRename,
    startCreateFile,
    startCreateFolder,
    deleteItem
  } = useFileOperations()

  // 专业确认对话框函数
  const showConfirmDialog = (title: string, message: string, type: 'danger' | 'warning' | 'info' = 'warning'): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        visible: true,
        title,
        message,
        type,
        onConfirm: () => {
          setConfirmDialog(prev => ({ ...prev, visible: false }))
          resolve(true)
        }
      })
    })
  }

  // 点击外部关闭右键菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(prev => ({ ...prev, visible: false }))
      }
    }

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [contextMenu.visible])

  // 处理文件点击
  const handleFileClick = async (item: FileItem) => {
    if (item.is_directory) {
      await toggleFolder(item.path)
    } else {
      try {
        await openFile(item.path)
      } catch (err) {
        console.error('❌ 打开文件失败:', err)
      }
    }
  }

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault()
    e.stopPropagation()

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetPath: item.path,
      targetType: item.is_directory ? 'directory' : 'file'
    })
  }

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }))
  }

  // 右键菜单处理函数
  const handleNewFile = () => {
    startCreateFile(contextMenu.targetPath)
    closeContextMenu()
  }

  const handleNewFolder = () => {
    startCreateFolder(contextMenu.targetPath)
    closeContextMenu()
  }

  const handleRename = () => {
    startRename(contextMenu.targetPath)
    closeContextMenu()
  }

  const handleDelete = async () => {
    await deleteItem(
      contextMenu.targetPath,
      contextMenu.targetType === 'directory',
      updateFileTreeLocally, // 删除成功后本地更新文件树
      showConfirmDialog // 传入专业确认对话框函数
    )
    closeContextMenu()
  }

  // 编辑提交处理 - 使用本地更新，无需刷新整个树
  const onEditSubmit = async () => {
    await handleEditSubmit(updateFileTreeLocally) // 操作成功后本地更新文件树
  }

  // 渲染内联编辑组件
  const renderInlineEdit = (level: number) => {
    if (!editingItem) return null

    return (
      <div
        className="flex items-center py-1 px-2"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {editingItem.type === 'create-folder' && (
          <Icon
            name="chevron-right"
            size={8}
            className="mr-1 text-gray-500"
          />
        )}
        <Icon
          name={editingItem.type === 'create-folder' ? 'folder' : 'file'}
          size={8}
          className="mr-2 text-gray-600"
        />
        <input
          type="text"
          value={editingItem.name}
          onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEditSubmit()
            } else if (e.key === 'Escape') {
              handleEditCancel()
            }
          }}
          onBlur={onEditSubmit}
          className="text-xs bg-white border border-blue-500 rounded px-1 py-0 outline-none flex-1"
          autoFocus
          placeholder={
            editingItem.type === 'create-file'
              ? '文件名'
              : editingItem.type === 'create-folder'
              ? '文件夹名'
              : '新名称'
          }
        />
      </div>
    )
  }

  // 渲染文件项
  const renderFileItem = (item: FileItem, level = 0): React.ReactNode => {
    // 如果当前项正在重命名，显示编辑框
    const isEditing = editingItem && editingItem.type === 'rename' && editingItem.path === item.path

    return (
      <div key={item.path}>
        {isEditing ? (
          renderInlineEdit(level)
        ) : (
          <div
            className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer select-none"
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => handleFileClick(item)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            {item.is_directory && (
              <Icon
                name={item.expanded ? 'chevron-down' : 'chevron-right'}
                size={8}
                className="mr-1 text-gray-500"
              />
            )}
            <Icon
              name={item.is_directory ? (item.expanded ? 'folder-open' : 'folder') : 'file'}
              size={8}
              className="mr-2 text-gray-600"
            />
            <span className="text-xs text-gray-800 truncate">{item.name}</span>
            {item.loading && (
              <Icon name="loading" size={8} className="ml-auto text-gray-400 animate-spin" />
            )}
          </div>
        )}

        {item.is_directory && item.expanded && (
          <div>
            {/* 如果正在此文件夹下创建新项，显示编辑框 */}
            {editingItem &&
             (editingItem.type === 'create-file' || editingItem.type === 'create-folder') &&
             editingItem.parentPath === item.path && (
              renderInlineEdit(level + 1)
            )}

            {/* 渲染子项 */}
            {item.children && item.children.map(child => renderFileItem(child, level + 1))}
          </div>
        )}

        {/* 如果是根级别且正在创建新项 */}
        {level === 0 && editingItem &&
         (editingItem.type === 'create-file' || editingItem.type === 'create-folder') &&
         (!editingItem.parentPath || editingItem.parentPath === '') && (
          renderInlineEdit(0)
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-sm mb-2">加载失败</div>
        <div className="text-gray-500 text-xs mb-4">{error}</div>
        <button
          onClick={refreshFileTree}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        {files.length === 0 ? (
          <div className="text-gray-500 text-xs p-4">没有找到文件</div>
        ) : (
          files.map(file => renderFileItem(file))
        )}
      </div>

      {/* 右键菜单 */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="bg-white border border-gray-200 rounded shadow-lg py-1 min-w-40 fixed z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.targetType === 'directory' ? (
            // 文件夹右键菜单
            <>
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2"
                onClick={handleNewFile}
              >
                <Icon name="file-plus" size={10} />
                新建文件
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2"
                onClick={handleNewFolder}
              >
                <Icon name="folder-plus" size={10} />
                新建文件夹
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2"
                onClick={handleRename}
              >
                <Icon name="edit" size={10} />
                重命名
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2 text-red-600"
                onClick={handleDelete}
              >
                <Icon name="trash" size={10} />
                删除
              </button>
            </>
          ) : (
            // 文件右键菜单
            <>
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2"
                onClick={handleRename}
              >
                <Icon name="edit" size={8} />
                重命名
              </button>
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2 text-red-600"
                onClick={handleDelete}
              >
                <Icon name="trash" size={8} />
                删除
              </button>
            </>
          )}
        </div>
      )}

      {/* 专业确认对话框 */}
      <ConfirmDialog
        visible={confirmDialog.visible}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="确认"
        cancelText="取消"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, visible: false }))}
      />
    </div>
  )
}

export default FileTree
