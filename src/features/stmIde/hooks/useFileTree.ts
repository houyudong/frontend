import { useState, useEffect } from 'react'
import apiService from '../config/apiService'
import configService from '../config/configManager'

export interface FileItem {
  name: string
  path: string
  type?: 'file' | 'directory'
  is_directory: boolean
  children?: FileItem[]
  expanded?: boolean
  loading?: boolean
  size?: number
  modified_time?: string
}

/**
 * 文件树数据管理Hook
 */
export const useFileTree = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 文件过滤规则
  const shouldHideFile = (name: string, path: string): boolean => {
    // 过滤build目录
    if (name === 'build' || path === 'build' || path.startsWith('build/')) {
      return true
    }

    // 过滤.ld文件
    if (name.endsWith('.ld')) {
      return true
    }

    // 过滤其他不需要的文件
    const hidePatterns = [
      '.git', '.DS_Store', 'Thumbs.db',
      'Makefile', 'makefile', 'GNUmakefile',
      '.mk', '.make'
    ]

    return hidePatterns.some(pattern => {
      if (pattern.startsWith('.') && pattern.length > 1) {
        // 扩展名或隐藏文件匹配
        return name.endsWith(pattern) || name.startsWith(pattern) || name === pattern
      } else {
        // 精确匹配
        return path === pattern || name === pattern
      }
    })
  }

  // 转换API数据为FileItem
  const convertToFileItems = (data: any): FileItem[] => {
    let fileArray: any[] = []

    if (Array.isArray(data)) {
      fileArray = data
    } else if (data.files && Array.isArray(data.files)) {
      fileArray = data.files
    } else if (data.count && data.files && Array.isArray(data.files)) {
      fileArray = data.files
    }

    console.log('📁 转换文件数组:', fileArray)

    // 过滤文件
    const filteredFiles = fileArray.filter(file => !shouldHideFile(file.name, file.path))
    console.log('📁 过滤后的文件:', filteredFiles)

    const fileItems: FileItem[] = filteredFiles.map(file => ({
      name: file.name,
      path: file.path,
      type: file.is_directory ? 'directory' : 'file',
      is_directory: file.is_directory,
      children: [],
      expanded: false,
      loading: false
    }))

    fileItems.sort((a, b) => {
      if (a.is_directory && !b.is_directory) return -1
      if (!a.is_directory && b.is_directory) return 1
      return a.name.localeCompare(b.name)
    })

    return fileItems
  }

  // 加载根目录文件
  const loadRootFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      const response = await apiService.getFiles(userId, projectId)
      console.log('📁 API响应:', response)

      if (response?.success && response?.data) {
        const fileItems = convertToFileItems(response.data)
        setFiles(fileItems)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      console.error('❌ 加载根目录失败:', err)
      setError(err instanceof Error ? err.message : '加载文件失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载子目录文件
  const loadDirectoryFiles = async (dirPath: string): Promise<FileItem[]> => {
    try {
      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      const response = await apiService.getFiles(userId, projectId, dirPath)
      console.log('📁 加载子目录:', dirPath, response)

      if (response?.success && response?.data) {
        return convertToFileItems(response.data)
      }
      return []
    } catch (err) {
      console.error('❌ 加载子目录失败:', dirPath, err)
      return []
    }
  }

  // 工具函数：更新文件树中的特定项
  const updateFileInTree = (
    items: FileItem[],
    targetPath: string,
    updater: (item: FileItem) => FileItem
  ): FileItem[] => {
    return items.map(item => {
      if (item.path === targetPath) {
        return updater(item)
      }
      if (item.children) {
        return { ...item, children: updateFileInTree(item.children, targetPath, updater) }
      }
      return item
    })
  }

  // 工具函数：在文件树中查找文件
  const findFileInTree = (items: FileItem[], targetPath: string): FileItem | null => {
    for (const item of items) {
      if (item.path === targetPath) return item
      if (item.children) {
        const found = findFileInTree(item.children, targetPath)
        if (found) return found
      }
    }
    return null
  }

  // 切换文件夹展开/收起
  const toggleFolder = async (path: string) => {
    const targetFile = findFileInTree(files, path)
    if (!targetFile || !targetFile.is_directory) return

    if (targetFile.expanded) {
      setFiles(prev => updateFileInTree(prev, path, item => ({ ...item, expanded: false })))
    } else {
      if (targetFile.children && targetFile.children.length > 0) {
        setFiles(prev => updateFileInTree(prev, path, item => ({ ...item, expanded: true })))
      } else {
        setFiles(prev => updateFileInTree(prev, path, item => ({ ...item, loading: true, expanded: true })))
        const children = await loadDirectoryFiles(path)
        setFiles(prev => updateFileInTree(prev, path, item => ({
          ...item,
          children,
          loading: false,
          expanded: true
        })))
      }
    }
  }

  // 刷新文件树 - 修复新建文件夹后不刷新的问题
  const refreshFileTree = async () => {
    console.log('🔄 刷新文件树')
    await loadRootFiles()
  }

  // 本地更新文件树 - 避免完整刷新，提升用户体验
  const updateFileTreeLocally = (operation: 'create-file' | 'create-folder' | 'rename' | 'delete', oldPath?: string, newPath?: string) => {
    console.log('🔄 本地更新文件树:', operation, oldPath, newPath)

    setFiles(prev => {
      const newFiles = [...prev]

      if (operation === 'create-file' && newPath) {
        // 创建文件
        const pathParts = newPath.split('/')
        const fileName = pathParts.pop() || ''
        const parentPath = pathParts.join('/')

        const newFile: FileItem = {
          name: fileName,
          path: newPath,
          is_directory: false,
          size: 0,
          modified_time: new Date().toISOString()
        }

        if (parentPath) {
          // 添加到父文件夹
          const parentFile = findFileInTree(newFiles, parentPath)
          if (parentFile && parentFile.children) {
            parentFile.children.push(newFile)
            parentFile.children.sort((a, b) => {
              if (a.is_directory !== b.is_directory) {
                return a.is_directory ? -1 : 1
              }
              return a.name.localeCompare(b.name)
            })
          }
        } else {
          // 添加到根目录
          newFiles.push(newFile)
          newFiles.sort((a, b) => {
            if (a.is_directory !== b.is_directory) {
              return a.is_directory ? -1 : 1
            }
            return a.name.localeCompare(b.name)
          })
        }
      } else if (operation === 'create-folder' && newPath) {
        // 创建文件夹
        const pathParts = newPath.split('/')
        const folderName = pathParts.pop() || ''
        const parentPath = pathParts.join('/')

        const newFolder: FileItem = {
          name: folderName,
          path: newPath,
          is_directory: true,
          size: 0,
          modified_time: new Date().toISOString(),
          children: [],
          expanded: false
        }

        if (parentPath) {
          // 添加到父文件夹
          const parentFile = findFileInTree(newFiles, parentPath)
          if (parentFile && parentFile.children) {
            parentFile.children.push(newFolder)
            parentFile.children.sort((a, b) => {
              if (a.is_directory !== b.is_directory) {
                return a.is_directory ? -1 : 1
              }
              return a.name.localeCompare(b.name)
            })
          }
        } else {
          // 添加到根目录
          newFiles.push(newFolder)
          newFiles.sort((a, b) => {
            if (a.is_directory !== b.is_directory) {
              return a.is_directory ? -1 : 1
            }
            return a.name.localeCompare(b.name)
          })
        }
      } else if (operation === 'rename' && oldPath && newPath) {
        // 重命名
        const targetFile = findFileInTree(newFiles, oldPath)
        if (targetFile) {
          const newName = newPath.split('/').pop() || ''
          targetFile.name = newName
          targetFile.path = newPath
        }
      } else if (operation === 'delete' && oldPath) {
        // 删除
        const pathParts = oldPath.split('/')
        const fileName = pathParts.pop() || ''
        const parentPath = pathParts.join('/')

        if (parentPath) {
          // 从父文件夹删除
          const parentFile = findFileInTree(newFiles, parentPath)
          if (parentFile && parentFile.children) {
            parentFile.children = parentFile.children.filter(child => child.name !== fileName)
          }
        } else {
          // 从根目录删除
          return newFiles.filter(file => file.name !== fileName)
        }
      }

      return newFiles
    })
  }

  // 初始化加载
  useEffect(() => {
    loadRootFiles()
  }, [])

  return {
    files,
    loading,
    error,
    setFiles,
    loadRootFiles,
    loadDirectoryFiles,
    updateFileInTree,
    findFileInTree,
    toggleFolder,
    refreshFileTree,
    updateFileTreeLocally
  }
}
