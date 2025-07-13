import { useEffect } from 'react'
import Toolbar from './components/Toolbar/Toolbar'
import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/MainContent/MainContent'
import StatusBar from './components/StatusBar/StatusBar'
import Modals from './components/Modals/Modals'
import SplitPane from './components/Layout/SplitPane'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import NotificationContainer from './components/UI/NotificationContainer'
import AIAssistant from '../aiAssist/components/AIAssistant'

// 导入服务
import wsService from './services/websocket'
import compileService from './services/compile'
// import debugSession from './services/debugSession'
// import './services/debugService' // 🔥 暂时禁用新的调试服务，避免消息处理冲突

// 导入工具
import shortcutManager, { SHORTCUTS } from './utils/shortcuts'
import useFileStore from './stores/fileStore'

// 导入样式
import './styles/index.css'

interface AppProps {
  hideTitle?: boolean;
}

function App({ hideTitle = false }: AppProps) {
  useEffect(() => {
    // 初始化应用
    const initializeApp = async () => {
      try {
        console.log('🚀 STM32 AI调试工具开始初始化')

        // 初始化 WebSocket 连接
        await wsService.connect()
        console.log('✅ WebSocket 连接已建立')

        // 初始化快捷键
        initializeShortcuts()
        console.log('✅ 快捷键已初始化')

        // 恢复会话
        await restoreUserSession()
        console.log('✅ 会话已恢复')

        console.log('🚀 STM32 AI调试工具初始化完成')
      } catch (error) {
        console.error('❌ 应用初始化失败:', error)
      }
    }

    // 初始化快捷键
    const initializeShortcuts = () => {

      // 保存当前文件 (Ctrl+S)
      shortcutManager.register({
        ...SHORTCUTS.SAVE,
        handler: async () => {
          const currentActiveFile = useFileStore.getState().activeFile
          if (currentActiveFile) {
            try {
              await useFileStore.getState().saveFile(currentActiveFile)
              console.log('✅ 快捷键保存成功')
            } catch (error) {
              console.error('❌ 快捷键保存失败:', error)
            }
          }
        }
      })

      // 保存所有文件 (Ctrl+Shift+S)
      shortcutManager.register({
        ...SHORTCUTS.SAVE_ALL,
        handler: async () => {
          if (useFileStore.getState().hasUnsavedChanges()) {
            try {
              await useFileStore.getState().saveAllFiles()
              console.log('✅ 快捷键保存所有文件成功')
            } catch (error) {
              console.error('❌ 快捷键保存所有文件失败:', error)
            }
          }
        }
      })

      // 编译项目 (Ctrl+B) - 调试时禁用
      shortcutManager.register({
        ...SHORTCUTS.COMPILE,
        handler: async () => {
          // 检查是否正在调试
          const debugState = debugSession.getState()
          if (debugState.isDebugging) {
            console.log('⚠️ 调试过程中无法编译')
            return
          }

          try {
            await compileService.compileProject('current')
            console.log('✅ 快捷键编译成功')
          } catch (error) {
            console.error('❌ 快捷键编译失败:', error)
          }
        }
      })

      // 运行程序 (F5) - 调试时禁用
      shortcutManager.register({
        ...SHORTCUTS.RUN,
        handler: async () => {
          // 检查是否正在调试
          const debugState = debugSession.getState()
          if (debugState.isDebugging) {
            console.log('⚠️ 调试过程中无法运行程序')
            return
          }

          // TODO: 添加运行程序的逻辑
          console.log('🚀 快捷键运行程序')
        }
      })
    }

    // 恢复用户会话
    const restoreUserSession = async () => {
      try {
        await useFileStore.getState().restoreSession()
      } catch (error) {
        console.error('❌ 会话恢复失败:', error)
      }
    }

    // 页面卸载时保存会话
    const handleBeforeUnload = () => {
      try {
        useFileStore.getState().saveSession()
      } catch (error) {
        console.error('❌ 会话保存失败:', error)
      }
    }

    // 添加页面卸载监听
    window.addEventListener('beforeunload', handleBeforeUnload)

    // 延迟初始化，确保DOM已渲染
    setTimeout(initializeApp, 100)

    // 清理函数
    return () => {
      shortcutManager.clear()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* 顶部标题栏 */}
        <Toolbar hideTitle={hideTitle} />

        {/* 主容器 - 使用两栏布局 */}
        <div className="flex-1 flex overflow-hidden min-h-0" id="main-split">
          <SplitPane
            direction="horizontal"
            sizes={[20, 80]}
            minSize={[10, 40]}
            leftId="sidebar-panel"
            rightId="main-content"
          >
            {/* 侧边栏 */}
            <Sidebar />

            {/* 主内容区 */}
            <MainContent />
          </SplitPane>
        </div>

        {/* VSCode风格的底部状态栏 - 固定在底部 */}
        <StatusBar />

        {/* 所有模态对话框 */}
        <Modals />

        {/* 通知容器 */}
        <NotificationContainer />

        {/* 浮动AI助手 */}
        <AIAssistant />
      </div>
    </ErrorBoundary>
  )
}

export default App
