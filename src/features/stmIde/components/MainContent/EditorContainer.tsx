import React, { useState, useEffect } from 'react'
import MonacoEditor from '../Editor/MonacoEditor'
import FileTabs from '../Editor/FileTabs'
import useFileStore from '../../stores/fileStore'
import Dialog from '../UI/Dialog'

const EditorContainer: React.FC = () => {
  const {
    activeFile,
    updateFileContent,
    saveFile,
    getFileByPath,
    openFile
  } = useFileStore()

  const [errorDialog, setErrorDialog] = useState({
    visible: false,
    title: '',
    message: ''
  })

  const handleFileContentChange = (content: string) => {
    if (activeFile) {
      updateFileContent(activeFile, content)
    }
  }

  const handleSaveFile = async () => {
    if (activeFile) {
      try {
        await saveFile(activeFile)
        console.log('✅ 文件保存成功:', activeFile)
      } catch (error) {
        console.error('❌ 文件保存失败:', error)
        setErrorDialog({
          visible: true,
          title: '保存失败',
          message: '文件保存失败: ' + (error instanceof Error ? error.message : '未知错误')
        })
      }
    }
  }

  // 监听定义跳转的文件打开请求
  useEffect(() => {
    const handleOpenFileRequest = async (event: CustomEvent) => {
      const { filePath, searchSymbol, line, column, highlight, isDebugLocation, source } = event.detail
      console.log('📂 收到文件打开请求:', { filePath, searchSymbol, line, column, source, isDebugLocation })

      if (!filePath) {
        console.error('❌ 文件路径为空')
        return
      }

      try {
        console.log('📂 开始打开文件:', filePath)
        await openFile(filePath)
        console.log('✅ 文件打开成功:', filePath)

        // 文件打开后的处理 - 修复：增加重试机制确保编辑器准备就绪
        const attemptNavigation = (retryCount = 0) => {
          const maxRetries = 5
          const retryDelay = 300

          if (searchSymbol) {
            // 🔥 新逻辑：使用Monaco编辑器搜索符号
            const searchEvent = new CustomEvent('editor-search-symbol', {
              detail: {
                symbol: searchSymbol,
                highlight: highlight !== false,
                retryCount: retryCount
              }
            })
            console.log('🔍 发送符号搜索事件:', { symbol: searchSymbol, retryCount })
            document.dispatchEvent(searchEvent)
          } else if (line) {
            // 传统逻辑：跳转到指定行号
            const targetLine = Math.max(1, line)
            const targetColumn = Math.max(1, column || 1)

            const jumpEvent = new CustomEvent('editor-jump-to-line', {
              detail: {
                line: targetLine,
                column: targetColumn,
                highlight: highlight !== false,
                retryCount: retryCount,
                isDebugLocation: isDebugLocation // 传递调试位置标记
              }
            })
            console.log('🧭 发送行号跳转事件:', { line: targetLine, column: targetColumn, retryCount })
            document.dispatchEvent(jumpEvent)
          }

          // 监听导航失败事件，进行重试
          const handleNavigationFailed = (event: CustomEvent) => {
            if (event.detail.retryCount === retryCount && retryCount < maxRetries) {
              console.log(`🔄 导航失败，${retryDelay}ms后重试 (${retryCount + 1}/${maxRetries})`)
              setTimeout(() => attemptNavigation(retryCount + 1), retryDelay)
            }
            document.removeEventListener('editor-navigation-failed', handleNavigationFailed as EventListener)
          }

          document.addEventListener('editor-navigation-failed', handleNavigationFailed as EventListener)
        }

        // 初始延迟后开始尝试导航
        setTimeout(() => attemptNavigation(), 800)

      } catch (error) {
        console.error('❌ 打开文件失败:', error)
      }
    }

    console.log('📂 EditorContainer: 注册文件打开事件监听器')
    document.addEventListener('open-file-request', handleOpenFileRequest as any)

    return () => {
      console.log('📂 EditorContainer: 移除文件打开事件监听器')
      document.removeEventListener('open-file-request', handleOpenFileRequest as any)
    }
  }, [openFile])

  const currentFile = activeFile ? getFileByPath(activeFile) : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full bg-white min-h-0" id="editor-container">
      {/* 文件标签页 */}
      <FileTabs />

      {/* 编辑器 */}
      <div className="editor-wrapper" id="editor-wrapper" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {currentFile ? (
          <MonacoEditor
            value={currentFile.content}
            language={currentFile.language}
            onChange={handleFileContentChange}
            onSave={handleSaveFile}
            filePath={activeFile || undefined} // 传递文件路径以支持断点功能
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white text-gray-700" id="editor-placeholder">
            <div className="text-center">
              <h3 className="mb-3 text-gray-700 font-medium text-lg">
                欢迎使用STM32 AI调试工具
              </h3>
              <p className="text-gray-500 text-sm">
                从左侧文件浏览器选择文件开始编辑
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 错误对话框 */}
      <Dialog
        visible={errorDialog.visible}
        title={errorDialog.title}
        message={errorDialog.message}
        type="error"
        confirmText="确定"
        showCancel={false}
        onConfirm={() => setErrorDialog(prev => ({ ...prev, visible: false }))}
        onCancel={() => setErrorDialog(prev => ({ ...prev, visible: false }))}
      />
    </div>
  )
}

export default EditorContainer
