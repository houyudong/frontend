import React from 'react'
import Icon from '../UI/Icon'
import Dialog from '../UI/Dialog'
import { ConsoleMessage } from '../../services/console'
import useFileStore from '../../stores/fileStore'

// 移除未使用的接口定义

interface ProblemsPanelProps {
  messages: ConsoleMessage[]
}

const ProblemsPanel: React.FC<ProblemsPanelProps> = ({ messages }) => {
  const { openFile } = useFileStore()
  const [collapsedFiles, setCollapsedFiles] = React.useState<Set<string>>(new Set())
  const [errorDetailDialog, setErrorDetailDialog] = React.useState<{
    visible: boolean
    title: string
    message: string
    fullLine?: string
  }>({
    visible: false,
    title: '',
    message: '',
    fullLine: ''
  })

  // 切换文件折叠状态
  const toggleFileCollapse = (file: string) => {
    setCollapsedFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(file)) {
        newSet.delete(file)
      } else {
        newSet.add(file)
      }
      return newSet
    })
  }

  // 过滤出错误和警告消息
  const problems = messages.filter(m => m.type === 'error' || m.type === 'warning')

  // 简化错误消息 - 移除冗余信息
  const simplifyErrorMessage = (message: string): string => {
    // 移除重复的图标
    message = message.replace(/^[❌⚠️🔧🔗📁]\s*/, '')

    // 简化Make错误
    if (message.includes('mingw32-make:')) {
      return '构建失败'
    }

    // 简化常见错误
    if (message.includes('undeclared (first use in this function)')) {
      const varMatch = message.match(/'([^']+)' undeclared/)
      if (varMatch) {
        return `变量 '${varMatch[1]}' 未声明`
      }
    }

    return message
  }

  // 格式化错误信息 - 简化版本
  const formatErrorMessage = (message: ConsoleMessage) => {
    const simplifiedMessage = simplifyErrorMessage(message.message)
    const location = message.file && message.line
      ? `${message.file}:${message.line}${message.column ? `:${message.column}` : ''}`
      : null

    return {
      ...message,
      message: simplifiedMessage,
      location,
      clickable: !!(message.file && message.line)
    }
  }

  // 处理文件点击 - 修复跳转功能
  const handleFileClick = async (file?: string, line?: number) => {
    if (!file || !line) return

    console.log('🔗 点击问题，跳转到:', { file, line })

    try {
      // 打开文件
      await openFile(file)

      // 等待文件加载完成后跳转到指定行
      setTimeout(() => {
        const event = new CustomEvent('editor-jump-to-line', {
          detail: {
            line: line,
            column: 1,
            highlight: true // 添加高亮标识
          }
        })
        document.dispatchEvent(event)
        console.log('📍 已发送跳转事件:', { file, line })
      }, 500) // 增加延迟确保文件完全加载
    } catch (err) {
      console.error('❌ 打开文件失败:', err)
    }
  }

  // 处理显示错误详情
  const handleShowErrorDetails = (problem: ConsoleMessage) => {
    const errorType = problem.type === 'error' ? '错误' : '警告'
    const title = `${errorType}详情`

    // 构建详细信息
    let detailMessage = problem.message

    // 如果有完整的错误行，显示更多信息
    if (problem.fullLine && problem.fullLine !== problem.message) {
      detailMessage = problem.fullLine
    }

    // 添加来源信息
    if (problem.source) {
      detailMessage = `[${problem.source}] ${detailMessage}`
    }

    setErrorDetailDialog({
      visible: true,
      title,
      message: detailMessage,
      fullLine: problem.fullLine
    })
  }

  // 根据错误类型获取解决建议
  const getErrorSuggestions = (message: string): string[] => {
    const msg = message.toLowerCase()

    if (msg.includes('elf') || msg.includes('解析') || msg.includes('格式')) {
      return [
        '• 确保项目编译成功生成了ELF文件',
        '• 检查编译器配置是否正确',
        '• 尝试清理项目后重新编译',
        '• 确认使用的是ARM交叉编译器'
      ]
    }

    if (msg.includes('下载') || msg.includes('网络') || msg.includes('连接')) {
      return [
        '• 检查网络连接是否正常',
        '• 确认后端服务是否运行',
        '• 检查文件路径配置是否正确',
        '• 尝试重新启动服务'
      ]
    }

    if (msg.includes('make') || msg.includes('构建') || msg.includes('编译')) {
      return [
        '• 检查编译环境和工具链配置',
        '• 确认项目依赖是否完整',
        '• 查看完整的编译输出信息',
        '• 尝试清理项目后重新编译'
      ]
    }

    // 默认建议
    return [
      '• 检查相关配置是否正确',
      '• 查看输出栏获取更多详细信息',
      '• 尝试重新执行操作',
      '• 如问题持续，请检查系统环境'
    ]
  }

  // 按文件分组问题 - 优先显示有文件信息的错误
  const groupedProblems = problems.reduce((groups, problem) => {
    const file = problem.file || '其他错误'
    if (!groups[file]) {
      groups[file] = []
    }
    groups[file].push(problem)
    return groups
  }, {} as Record<string, typeof problems>)

  // 排序：有文件信息的错误优先，其他错误放在最后
  const sortedGroups = Object.entries(groupedProblems).sort(([fileA, problemsA], [fileB, problemsB]) => {
    // 其他错误总是放在最后
    if (fileA === '其他错误' && fileB !== '其他错误') return 1
    if (fileA !== '其他错误' && fileB === '其他错误') return -1

    // 按错误数量排序（错误多的文件优先）
    const errorsA = problemsA.filter(p => p.type === 'error').length
    const errorsB = problemsB.filter(p => p.type === 'error').length
    if (errorsA !== errorsB) return errorsB - errorsA

    // 按文件名排序
    return fileA.localeCompare(fileB)
  })

  return (
    <div className="h-full bg-white flex flex-col text-xs">
      {/* 问题内容 - 统一浅色主题 */}
      <div className="flex-1 overflow-auto">
        {problems.length === 0 ? (
          <div className="p-3 text-gray-500 text-xs flex items-center gap-2">
            <Icon name="check" size={12} className="text-green-600" />
            <span>未在工作区检测到问题</span>
          </div>
        ) : (
          <div>
            {/* 按文件分组显示 - VSCode风格但保持浅色主题 */}
            {sortedGroups.map(([file, fileProblems]) => (
              <div key={file} className="mb-0.5">
                {/* 文件分组头 - 显示错误和警告统计 */}
                <div
                  className="flex items-center gap-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    console.log('🔄 切换文件折叠状态:', file)
                    toggleFileCollapse(file)
                  }}
                >
                  <Icon
                    name={collapsedFiles.has(file) ? 'chevron-right' : 'chevron-down'}
                    size={8}
                    className="text-gray-500"
                  />
                  <Icon
                    name={file === '其他错误' ? 'alert-circle' : 'file'}
                    size={8}
                    className={file === '其他错误' ? 'text-orange-600' : 'text-blue-600'}
                  />
                  <span className="font-medium">{file}</span>
                  {file === '其他错误' && (
                    <span className="text-xs text-gray-500 italic">点击查看详细信息</span>
                  )}

                  {/* 错误和警告统计 */}
                  <div className="flex items-center gap-1">
                    {fileProblems.filter(p => p.type === 'error').length > 0 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {fileProblems.filter(p => p.type === 'error').length}
                      </span>
                    )}
                    {fileProblems.filter(p => p.type === 'warning').length > 0 && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                        {fileProblems.filter(p => p.type === 'warning').length}
                      </span>
                    )}
                  </div>
                </div>

                {/* 错误列表 - 区分错误和警告，支持折叠 */}
                {!collapsedFiles.has(file) && fileProblems
                  .sort((a, b) => {
                    // 错误优先于警告
                    if (a.type === 'error' && b.type === 'warning') return -1
                    if (a.type === 'warning' && b.type === 'error') return 1
                    // 同类型按行号排序
                    if (a.line && b.line) return a.line - b.line
                    return 0
                  })
                  .map(problem => {
                  const formatted = formatErrorMessage(problem)
                  const isError = problem.type === 'error'
                  const isWarning = problem.type === 'warning'
                  const hasFile = !!problem.file

                  return (
                    <div
                      key={problem.id}
                      className={`flex items-center gap-2 px-3 py-0.5 hover:bg-gray-50 cursor-pointer border-l-2 border-transparent ${
                        isError ? 'hover:border-red-400' : 'hover:border-yellow-400'
                      } ${!hasFile ? 'bg-orange-50' : ''}`}
                      onClick={() => {
                        if (formatted.clickable && problem.file && problem.line) {
                          // 有具体文件位置的错误，跳转到代码
                          handleFileClick(problem.file, problem.line)
                        } else {
                          // 没有文件位置的错误，显示详细错误信息
                          handleShowErrorDetails(problem)
                        }
                      }}
                      title={hasFile ? '点击跳转到代码位置' : '点击查看详细错误信息'}
                    >
                      {/* 错误/警告图标 - 清晰区分 */}
                      <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center text-white text-[7px] font-bold ${
                        isError ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {isError ? '✕' : isWarning ? '⚠' : '?'}
                      </div>

                      {/* 错误消息 - 根据类型调整颜色 */}
                      <span className={`flex-1 text-xs ${
                        isError ? 'text-gray-900' : isWarning ? 'text-gray-800' : 'text-gray-700'
                      }`}>
                        {formatted.message}
                      </span>

                      {/* 位置信息 - VSCode风格 */}
                      {formatted.location && hasFile && (
                        <span className="text-gray-500 text-[10px] font-mono">
                          [行 {problem.line}, 列 {problem.column || 1}]
                        </span>
                      )}
                      {!hasFile && (
                        <span className="text-orange-600 text-[10px] italic">
                          点击查看详情
                        </span>
                      )}
                      {hasFile && (
                        <span className="text-blue-600 text-[10px] italic">
                          点击跳转
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 错误详情对话框 */}
      <Dialog
        visible={errorDetailDialog.visible}
        onCancel={() => setErrorDetailDialog(prev => ({ ...prev, visible: false }))}
        onConfirm={() => setErrorDetailDialog(prev => ({ ...prev, visible: false }))}
        title={errorDetailDialog.title}
        type="error"
        confirmText="确定"
        showCancel={false}
        width="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="text-sm font-medium text-gray-700 mb-2">错误信息：</h4>
            <p className="text-xs font-mono text-gray-900 whitespace-pre-wrap">
              {errorDetailDialog.message}
            </p>
          </div>

          {errorDetailDialog.fullLine && errorDetailDialog.fullLine !== errorDetailDialog.message && (
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <h4 className="text-sm font-medium text-red-700 mb-2">完整错误信息：</h4>
              <p className="text-xs font-mono text-red-900 whitespace-pre-wrap">
                {errorDetailDialog.fullLine}
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <h4 className="text-sm font-medium text-blue-700 mb-2">解决建议：</h4>
            <ul className="text-xs text-blue-900 space-y-1">
              {getErrorSuggestions(errorDetailDialog.message).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ProblemsPanel
