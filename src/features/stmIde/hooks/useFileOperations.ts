import { useState } from 'react'
import apiService from '../config/apiService'
import configService from '../config/configManager'
import useNotificationStore from '../stores/notificationStore'
import useFileStore from '../stores/fileStore'

/**
 * 文件操作Hook - 从FileTree中提取出来
 */
export const useFileOperations = () => {
  const { error: showError } = useNotificationStore()
  const { closeFile, isFileOpen } = useFileStore()

  // 内联编辑状态
  const [editingItem, setEditingItem] = useState<{
    path: string
    name: string
    type: 'rename' | 'create-file' | 'create-folder'
    parentPath?: string
  } | null>(null)

  // 处理内联编辑提交 - 优化版本，支持本地状态更新
  const handleEditSubmit = async (onLocalUpdate?: (operation: 'create-file' | 'create-folder' | 'rename', oldPath?: string, newPath?: string) => void) => {
    if (!editingItem || !editingItem.name.trim()) {
      showError('请输入名称')
      return
    }

    try {
      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      if (editingItem.type === 'create-file') {
        const fullPath = editingItem.parentPath
          ? `${editingItem.parentPath}/${editingItem.name}`
          : editingItem.name
        const pathParts = fullPath.split('/')
        const fileName = pathParts.pop() || ''
        const parentPath = pathParts.join('/')

        await apiService.createFile(userId, projectId, parentPath, fileName, '')

        // 本地状态更新
        if (onLocalUpdate) {
          onLocalUpdate('create-file', undefined, fullPath)
        }

        console.log('✅ 文件创建成功:', fullPath)
      } else if (editingItem.type === 'create-folder') {
        const fullPath = editingItem.parentPath
          ? `${editingItem.parentPath}/${editingItem.name}`
          : editingItem.name
        const pathParts = fullPath.split('/')
        const folderName = pathParts.pop() || ''
        const parentPath = pathParts.join('/')

        await apiService.createFolder(userId, projectId, parentPath, folderName)

        // 本地状态更新
        if (onLocalUpdate) {
          onLocalUpdate('create-folder', undefined, fullPath)
        }

        console.log('✅ 文件夹创建成功:', fullPath)
      } else if (editingItem.type === 'rename') {
        const oldPath = editingItem.path
        const pathParts = oldPath.split('/')
        pathParts[pathParts.length - 1] = editingItem.name
        const newPath = pathParts.join('/')

        await apiService.renameFile(userId, projectId, oldPath, editingItem.name)

        // 本地状态更新
        if (onLocalUpdate) {
          onLocalUpdate('rename', oldPath, newPath)
        }

        console.log('✅ 重命名成功:', oldPath, '->', newPath)
      }

      setEditingItem(null)
    } catch (err) {
      console.error('❌ 操作失败:', err)
      showError('操作失败: ' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  // 取消内联编辑
  const handleEditCancel = () => {
    setEditingItem(null)
  }

  // 开始重命名
  const startRename = (path: string) => {
    const fileName = path.split('/').pop() || ''
    setEditingItem({
      path,
      name: fileName,
      type: 'rename'
    })
  }

  // 开始新建文件
  const startCreateFile = (parentPath: string = '') => {
    setEditingItem({
      path: 'new-file',
      name: '',
      type: 'create-file',
      parentPath
    })
  }

  // 开始新建文件夹
  const startCreateFolder = (parentPath: string = '') => {
    setEditingItem({
      path: 'new-folder',
      name: '',
      type: 'create-folder',
      parentPath
    })
  }

  // 删除文件/文件夹 - 只有删除操作需要确认框
  const deleteItem = async (
    path: string,
    isDirectory: boolean,
    onLocalUpdate?: (operation: 'delete', oldPath: string) => void,
    showConfirm?: (title: string, message: string, type: 'danger' | 'warning' | 'info') => Promise<boolean>
  ) => {
    const itemName = path.split('/').pop() || path

    // 如果是文件夹，检查是否为空
    if (isDirectory) {
      try {
        // 获取用户ID和项目ID
        const userId = await configService.getUserId()
        const projectId = await configService.getProjectId()

        const folderContents = await apiService.getFiles(userId, projectId, path)
        if (folderContents && folderContents.data && folderContents.data.length > 0) {
          showError('只能删除空文件夹，请先删除文件夹内的所有内容')
          return
        }
      } catch (err) {
        console.error('❌ 检查文件夹内容失败:', err)
        showError('无法检查文件夹内容')
        return
      }
    }

    const confirmTitle = isDirectory ? '删除文件夹' : '删除文件'
    const confirmMessage = isDirectory
      ? `确定要删除空文件夹 "${itemName}" 吗？此操作无法撤销。`
      : `确定要删除文件 "${itemName}" 吗？此操作无法撤销。`

    // 使用专业确认对话框
    if (showConfirm) {
      const confirmed = await showConfirm(confirmTitle, confirmMessage, 'danger')
      if (!confirmed) {
        return
      }
    } else {
      // 降级到系统confirm（临时）
      if (!confirm(confirmMessage)) {
        return
      }
    }

    try {
      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      await apiService.deleteFile(userId, projectId, path)

      // 如果删除的文件在编辑器中打开，先关闭它
      if (isFileOpen(path)) {
        closeFile(path)
        console.log('🗂️ 已关闭被删除的文件:', path)
      }

      // 如果删除的是文件夹，关闭该文件夹下的所有打开文件
      if (isDirectory) {
        const { openFiles } = useFileStore.getState()
        const filesToClose = openFiles.filter(file => file.path.startsWith(path + '/'))
        filesToClose.forEach(file => {
          closeFile(file.path)
          console.log('🗂️ 已关闭文件夹下的文件:', file.path)
        })
      }

      // 本地状态更新
      if (onLocalUpdate) {
        onLocalUpdate('delete', path)
      }

      console.log('✅ 删除成功:', path)
    } catch (err) {
      console.error('❌ 删除失败:', err)
      showError('删除失败: ' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  return {
    editingItem,
    setEditingItem,
    handleEditSubmit,
    handleEditCancel,
    startRename,
    startCreateFile,
    startCreateFolder,
    deleteItem
  }
}
