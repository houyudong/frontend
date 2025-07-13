import React, { useState, useEffect, useRef } from 'react'
import Icon from '../UI/Icon'
import consoleService, { ConsoleMessage } from '../../services/console'
import ProblemsPanel from './ProblemsPanel'
import VariablesPanel from '../Debug/VariablesPanel'
import useFileStore from '../../stores/fileStore'

type TabType = 'output' | 'problems' | 'variables'

interface ConsoleProps {
  isDebugging?: boolean
}

const Console: React.FC<ConsoleProps> = ({ isDebugging = false }) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('output')
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { openFile } = useFileStore()

  useEffect(() => {
    setMessages(consoleService.getMessages())

    const handleNewMessage = (message: ConsoleMessage) => {
      setMessages(prev => [...prev, message])
    }

    const handleMessagesCleared = () => {
      // 重新获取最新的消息列表（可能只是部分清除）
      setMessages(consoleService.getMessages())
      console.log('🧹 Console组件：消息已更新')
    }

    consoleService.on('messageAdded', handleNewMessage)
    consoleService.on('messagesCleared', handleMessagesCleared)

    return () => {
      consoleService.off('messageAdded', handleNewMessage)
      consoleService.off('messagesCleared', handleMessagesCleared)
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 计算问题数量
  const errorCount = messages.filter(m => m.type === 'error').length
  const warningCount = messages.filter(m => m.type === 'warning').length
  const problemCount = errorCount + warningCount

  // 智能标签栏：根据调试状态决定显示哪些标签
  const getAvailableTabs = (): TabType[] => {
    const tabs: TabType[] = ['output', 'problems'] // 输出和问题栏始终显示
    if (isDebugging) tabs.push('variables')
    return tabs
  }

  const availableTabs = getAvailableTabs()

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      console.log('🔄 标签页不可用，切换到:', availableTabs[0] || 'output')
      setActiveTab(availableTabs[0] || 'output')
    }
  }, [availableTabs, activeTab])

  // 调试：监控activeTab变化
  useEffect(() => {
    console.log('📋 当前活动标签页:', activeTab)
  }, [activeTab])

  // 🔧 新增：监听切换到变量面板的事件
  useEffect(() => {
    const handleSwitchToVariables = () => {
      if (isDebugging && availableTabs.includes('variables')) {
        console.log('🔧 调试启动，自动切换到变量面板')
        setActiveTab('variables')
      }
    }

    document.addEventListener('switch-to-variables-panel', handleSwitchToVariables)
    return () => {
      document.removeEventListener('switch-to-variables-panel', handleSwitchToVariables)
    }
  }, [isDebugging, availableTabs])

  // 调试结束时的标签页管理（仅在调试结束时自动切换）
  useEffect(() => {
    // 只在调试结束时，如果当前在变量标签页，才切换回输出标签页
    if (!isDebugging && activeTab === 'variables') {
      console.log('🔄 调试结束，切换回输出标签页')
      setActiveTab('output')
    }
    // 移除调试启动时的自动切换，让用户完全控制标签页
  }, [isDebugging, activeTab])

  // 移除自动切换逻辑，让用户手动控制标签页
  // useEffect(() => {
  //   if (problemCount > 0 && activeTab === 'output') {
  //     const hasNewErrors = messages.slice(-5).some(m => m.type === 'error')
  //     if (hasNewErrors) setActiveTab('problems')
  //   }
  // }, [messages, problemCount, activeTab])

  // 过滤消息
  const getFilteredMessages = () => {
    if (activeTab === 'problems') {
      return messages.filter(m => m.type === 'error' || m.type === 'warning')
    }
    if (filter === 'all') return messages
    return messages.filter(m => m.type === filter)
  }

  const filteredMessages = getFilteredMessages()

  // 清除控制台
  const clearConsole = () => {
    consoleService.clear()
    setMessages([])
  }

  // 处理消息点击 - 跳转到文件位置
  const handleMessageClick = async (message: ConsoleMessage) => {
    if (!message.file || !message.line) return

    console.log('🔗 点击消息，跳转到:', { file: message.file, line: message.line })

    try {
      // 打开文件
      await openFile(message.file)

      // 等待文件加载完成后跳转到指定行
      setTimeout(() => {
        const event = new CustomEvent('editor-jump-to-line', {
          detail: {
            line: message.line,
            column: message.column || 1,
            highlight: true
          }
        })
        document.dispatchEvent(event)
        console.log('📍 已发送跳转事件:', { file: message.file, line: message.line })
      }, 500)
    } catch (err) {
      console.error('❌ 打开文件失败:', err)
    }
  }

  // 获取消息图标
  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'error'
      case 'warning': return 'warning'
      case 'success': return 'check'
      case 'info': return 'info'
      case 'debug': return 'bug'
      default: return 'info'
    }
  }

  // 获取消息颜色
  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      case 'success': return 'text-green-600'
      case 'info': return 'text-blue-600'
      case 'debug': return 'text-gray-600'
      default: return 'text-gray-800'
    }
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* 紧凑的标签栏 */}
      <div className="h-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-2 flex-shrink-0">
        <div className="flex items-center">
          <div className="flex">
            {availableTabs.map(tab => (
              <button
                key={tab}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('🔄 切换标签页:', tab)
                  setActiveTab(tab)
                }}
                className={`px-2 py-0.5 text-xs border-r border-gray-200 h-6 flex items-center gap-1 transition-colors ${
                  activeTab === tab
                    ? 'bg-white border-t-2 border-blue-600 border-b-0 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab === 'output' && (
                  <>
                    <Icon name="terminal" size={8} />
                    <span className="text-xs">输出</span>
                  </>
                )}
                {tab === 'problems' && (
                  <>
                    <Icon name="warning" size={8} />
                    <span className="text-xs">问题</span>
                    {problemCount > 0 && (
                      <span className="bg-red-500 text-white px-1 rounded text-[9px] min-w-[12px] text-center leading-none">
                        {problemCount}
                      </span>
                    )}
                  </>
                )}
                {tab === 'variables' && (
                  <>
                    <Icon name="eye" size={8} />
                    <span className="text-xs">变量</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 紧凑的控制台控件 */}
        <div className="flex items-center gap-1">
          {activeTab === 'output' && (
            <>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white min-w-[60px] h-5"
                title="消息分类过滤"
              >
                <option value="all">全部</option>
                <option value="info">信息</option>
                <option value="warning">警告</option>
                <option value="error">错误</option>
              </select>
              <button
                onClick={clearConsole}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                title="清空输出"
              >
                <Icon name="trash" size={12} />
              </button>
            </>
          )}

          {activeTab === 'problems' && (
            <button
              onClick={clearConsole}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
              title="清空"
            >
              <Icon name="trash" size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'output' && (
          <div className="h-full overflow-auto font-mono text-xs p-1 bg-gray-50" style={{lineHeight: '1.4'}}>
            {filteredMessages.length === 0 ? (
              <div className="p-2">
                <div className="text-gray-500 text-xs">没有输出</div>
              </div>
            ) : (
              filteredMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex items-center gap-1 hover:bg-gray-100 px-1 rounded cursor-pointer ${
                    message.clickable ? 'hover:bg-blue-50' : ''
                  }`}
                  onClick={() => message.clickable && handleMessageClick(message)}
                  style={{marginBottom: '2px'}}
                >
                  <span className="text-gray-400 text-xs flex-shrink-0">
                    [{message.timestamp.toLocaleTimeString().slice(0, 8)}]
                  </span>
                  <Icon
                    name={getMessageIcon(message.type)}
                    size={10}
                    className={`flex-shrink-0 ${getMessageColor(message.type)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`${getMessageColor(message.type)} text-xs`}>
                      {message.source && (
                        <span className="text-gray-600 text-xs">[{message.source}] </span>
                      )}
                      {message.message}
                    </span>
                    {message.file && message.line && (
                      <span className="text-gray-500 text-xs ml-1">
                        {message.file}:{message.line}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeTab === 'problems' && (
          <ProblemsPanel
            messages={messages}
          />
        )}

        {activeTab === 'variables' && (
          <VariablesPanel />
        )}
      </div>
    </div>
  )
}

export default Console