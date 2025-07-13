import { create } from 'zustand'
import apiService from '../config/apiService'
import configService from '../config/configManager'
import { debounce, DEBOUNCE_DELAYS } from '../utils/performance'
import errorHandler, { ErrorType } from '../services/errorHandler'

interface OpenFile {
  path: string
  name: string
  content: string
  originalContent: string  // 新增：原始内容，用于对比
  modified: boolean
  language: string
  lastSaveTime?: Date     // 新增：最后保存时间
}

interface FileStore {
  openFiles: OpenFile[]
  activeFile: string | null

  // 文件操作
  openFile: (filePath: string) => Promise<void>
  closeFile: (filePath: string) => void
  saveFile: (filePath: string) => Promise<void>
  saveAllFiles: () => Promise<{ saved: number; failed: number }>
  updateFileContent: (filePath: string, content: string) => void
  setActiveFile: (filePath: string) => void

  // 会话管理
  restoreSession: () => Promise<void>
  saveSession: () => Promise<void>

  // 工具函数
  getFileByPath: (filePath: string) => OpenFile | undefined
  isFileOpen: (filePath: string) => boolean
  hasUnsavedChanges: () => boolean
}

// 创建防抖的保存函数
const debouncedSave = debounce(async (filePath: string, content: string) => {
  const store = useFileStore.getState()
  const file = store.getFileByPath(filePath)
  if (file && file.content === content) {
    // 内容仍然匹配，执行保存
    await store.saveFile(filePath)
  }
}, DEBOUNCE_DELAYS.SAVE)

const useFileStore = create<FileStore>((set, get) => ({
  openFiles: [],
  activeFile: null,

  openFile: async (filePath: string) => {
    const { openFiles, isFileOpen } = get()

    // 如果文件已经打开，直接激活
    if (isFileOpen(filePath)) {
      set({ activeFile: filePath })
      return
    }

    try {
      console.log('📖 打开文件:', filePath)

      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()
      console.log('📖 用户信息:', { userId, projectId })

      console.log('📖 调用API获取文件内容...')
      const response = await apiService.getFileContent(userId, projectId, filePath)
      console.log('📥 API 响应:', response)

      if (response && response.success) {
        const fileName = filePath.split('/').pop() || filePath
        const language = getLanguageFromFileName(fileName)

        // 处理不同的响应格式
        const content = response.data?.content || response.content || ''

        const newFile: OpenFile = {
          path: filePath,
          name: fileName,
          content: content,
          originalContent: content,  // 保存原始内容
          modified: false,           // 初始状态为未修改
          language,
          lastSaveTime: new Date()
        }

        set({
          openFiles: [...openFiles, newFile],
          activeFile: filePath
        })

        console.log('✅ 文件打开成功:', filePath)
      } else {
        console.error('❌ 文件内容获取失败:', response)
        throw new Error('文件内容获取失败')
      }
    } catch (error) {
      console.error('❌ 打开文件失败:', error)
      // 创建一个空文件作为后备
      const fileName = filePath.split('/').pop() || filePath
      const language = getLanguageFromFileName(fileName)

      const errorContent = `// 无法加载文件内容: ${filePath}\n// 错误: ${error instanceof Error ? error.message : '未知错误'}`

      const newFile: OpenFile = {
        path: filePath,
        name: fileName,
        content: errorContent,
        originalContent: errorContent,  // 错误内容也作为原始内容
        modified: false,
        language,
        lastSaveTime: new Date()
      }

      set({
        openFiles: [...openFiles, newFile],
        activeFile: filePath
      })
    }
  },

  closeFile: (filePath: string) => {
    const { openFiles, activeFile } = get()
    const updatedFiles = openFiles.filter(file => file.path !== filePath)

    let newActiveFile = activeFile
    if (activeFile === filePath) {
      // 如果关闭的是当前活动文件，选择下一个文件
      newActiveFile = updatedFiles.length > 0 ? updatedFiles[updatedFiles.length - 1].path : null
    }

    set({
      openFiles: updatedFiles,
      activeFile: newActiveFile
    })

    console.log('🗂️ 文件已关闭:', filePath)
  },

  saveFile: async (filePath: string) => {
    const { openFiles } = get()
    const file = openFiles.find(f => f.path === filePath)

    if (!file) {
      console.error('❌ 找不到要保存的文件:', filePath)
      return
    }

    // 检查文件是否有修改，如果没有修改则不调用API
    if (!file.modified) {
      console.log('📝 文件无修改，跳过保存:', filePath)
      return
    }

    // 检查内容是否与原始内容相同
    if (file.content === file.originalContent) {
      console.log('📝 文件内容未变化，跳过保存:', filePath)

      // 更新修改状态为false，但不调用API
      set({
        openFiles: openFiles.map(f =>
          f.path === filePath
            ? { ...f, modified: false }
            : f
        )
      })
      return
    }

    try {
      console.log('💾 保存文件:', filePath)

      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      await apiService.saveFileContent(userId, projectId, filePath, file.content)

      // 更新文件状态为已保存，并更新原始内容
      set({
        openFiles: openFiles.map(f =>
          f.path === filePath
            ? {
                ...f,
                modified: false,
                originalContent: f.content,  // 更新原始内容为当前内容
                lastSaveTime: new Date()     // 更新保存时间
              }
            : f
        )
      })

      console.log('✅ 文件保存成功:', filePath)
    } catch (error) {
      console.error('❌ 文件保存失败:', error)
      throw error
    }
  },

  saveAllFiles: async () => {
    const { openFiles } = get()

    // 过滤出真正需要保存的文件（修改且内容与原始内容不同）
    const filesToSave = openFiles.filter(file =>
      file.modified && file.content !== file.originalContent
    )

    if (filesToSave.length === 0) {
      console.log('📝 没有需要保存的文件')

      // 重置所有标记为修改但内容未变的文件状态
      const filesToReset = openFiles.filter(file =>
        file.modified && file.content === file.originalContent
      )

      if (filesToReset.length > 0) {
        set({
          openFiles: openFiles.map(f =>
            filesToReset.some(rf => rf.path === f.path)
              ? { ...f, modified: false }
              : f
          )
        })
        console.log(`📝 重置了 ${filesToReset.length} 个文件的修改状态`)
      }

      return { saved: 0, failed: 0 }
    }

    let saved = 0
    let failed = 0
    const errors: string[] = []

    console.log(`💾 开始保存 ${filesToSave.length} 个修改的文件`)

    // 获取用户ID和项目ID（在循环外获取一次）
    const userId = await configService.getUserId()
    const projectId = await configService.getProjectId()

    for (const file of filesToSave) {
      try {
        await apiService.saveFileContent(userId, projectId, file.path, file.content)
        saved++
        console.log(`✅ 文件保存成功: ${file.path}`)
      } catch (error) {
        failed++
        const errorMsg = error instanceof Error ? error.message : '未知错误'
        errors.push(`${file.path}: ${errorMsg}`)
        console.error(`❌ 文件保存失败: ${file.path}`, error)
      }
    }

    // 更新所有成功保存的文件状态
    if (saved > 0) {
      set({
        openFiles: openFiles.map(f => {
          if (f.modified && !errors.some(err => err.startsWith(f.path))) {
            return {
              ...f,
              modified: false,
              originalContent: f.content,
              lastSaveTime: new Date()
            }
          }
          return f
        })
      })
    }

    console.log(`💾 保存完成: 成功 ${saved} 个，失败 ${failed} 个`)

    if (failed > 0) {
      console.error('保存失败的文件:', errors)
    }

    return { saved, failed }
  },

  updateFileContent: (filePath: string, content: string) => {
    const { openFiles } = get()

    set({
      openFiles: openFiles.map(file => {
        if (file.path === filePath) {
          // 只有当内容与原始内容不同时才标记为已修改
          const isModified = content !== file.originalContent
          return {
            ...file,
            content,
            modified: isModified
          }
        }
        return file
      })
    })
  },

  setActiveFile: (filePath: string) => {
    set({ activeFile: filePath })
  },

  getFileByPath: (filePath: string) => {
    return get().openFiles.find(file => file.path === filePath)
  },

  isFileOpen: (filePath: string) => {
    return get().openFiles.some(file => file.path === filePath)
  },

  hasUnsavedChanges: () => {
    return get().openFiles.some(file => file.modified)
  },

  // 恢复会话 - 简化版
  restoreSession: async () => {
    try {
      const projectStore = (await import('./projectStore')).default
      const sessionData = await projectStore.getState().loadSessionData() as any

      if (!sessionData?.openFiles?.length) {
        console.log('📝 没有会话数据需要恢复')
        return
      }

      console.log(`🔄 恢复 ${sessionData.openFiles.length} 个文件`)

      // 批量恢复文件
      const restoredFiles: OpenFile[] = []
      let activeFilePath: string | null = null

      // 获取用户ID和项目ID
      const userId = await configService.getUserId()
      const projectId = await configService.getProjectId()

      await Promise.allSettled(
        sessionData.openFiles.map(async (sessionFile: {path: string, active: boolean}) => {
          try {
            const response = await apiService.getFileContent(userId, projectId, sessionFile.path)
            if (response?.success) {
              const fileName = sessionFile.path.split('/').pop() || sessionFile.path
              const content = response.data?.content || response.content || ''

              restoredFiles.push({
                path: sessionFile.path,
                name: fileName,
                content,
                originalContent: content,
                modified: false,
                language: getLanguageFromFileName(fileName),
                lastSaveTime: new Date()
              })

              if (sessionFile.active) {
                activeFilePath = sessionFile.path
              }
            }
          } catch (error) {
            console.warn(`⚠️ 文件恢复失败: ${sessionFile.path}`)
          }
        })
      )

      set({
        openFiles: restoredFiles,
        activeFile: activeFilePath || restoredFiles[0]?.path || null
      })

      console.log(`✅ 会话恢复完成: ${restoredFiles.length} 个文件`)
    } catch (error) {
      console.error('❌ 会话恢复失败:', error)
    }
  },

  // 保存会话 - 简化版
  saveSession: async () => {
    try {
      const { openFiles, activeFile } = get()
      if (!openFiles.length) return

      const sessionData = {
        openFiles: openFiles.map(file => ({
          path: file.path,
          active: file.path === activeFile
        })),
        lastSaveTime: new Date().toISOString()
      }

      const projectStore = (await import('./projectStore')).default
      await projectStore.getState().saveSessionData(sessionData)
      console.log('✅ 会话保存成功')
    } catch (error) {
      console.error('❌ 会话保存失败:', error)
    }
  }
}))

// 根据文件名获取语言类型
function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'c': return 'c'
    case 'h': return 'c'
    case 'cpp': case 'cxx': case 'cc': return 'cpp'
    case 'hpp': case 'hxx': return 'cpp'
    case 'js': case 'jsx': return 'javascript'
    case 'ts': case 'tsx': return 'typescript'
    case 'py': return 'python'
    case 'java': return 'java'
    case 'json': return 'json'
    case 'xml': return 'xml'
    case 'html': return 'html'
    case 'css': return 'css'
    case 'md': return 'markdown'
    case 'yaml': case 'yml': return 'yaml'
    case 'txt': return 'plaintext'
    default: return 'plaintext'
  }
}

export default useFileStore
