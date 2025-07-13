import React, { useEffect, useState } from 'react'
import FileTree from './FileTree'
import Icon from '../UI/Icon'
import useProjectStore from '../../stores/projectStore'

const Sidebar: React.FC = () => {
  const { currentProject, loadProject, isLoading } = useProjectStore()
  const [isProjectHovered, setIsProjectHovered] = useState(false)

  useEffect(() => {
    // 加载项目信息
    loadProject()
  }, [loadProject])

  // 格式化项目详细信息用于tooltip
  const getProjectTooltip = () => {
    if (isLoading) return '正在加载项目信息...'
    if (!currentProject) return '项目信息不可用'

    const details = [
      `📋 项目名称: ${currentProject.name}`,
      currentProject.description && `📝 描述: ${currentProject.description}`,
      currentProject.chipModel && `🔧 芯片型号: ${currentProject.chipModel}`,
      currentProject.programmingLanguage && `💻 编程语言: ${currentProject.programmingLanguage}`,
      currentProject.platform && `🎯 平台: ${currentProject.platform}`,
      currentProject.createdAt && `📅 创建时间: ${new Date(currentProject.createdAt).toLocaleString('zh-CN')}`,
      currentProject.updatedAt && `🔄 更新时间: ${new Date(currentProject.updatedAt).toLocaleString('zh-CN')}`
    ].filter(Boolean).join('\n')

    return details || '项目详细信息'
  }

  // 获取项目图标
  const getProjectIcon = () => {
    if (isLoading) return 'loader'
    if (!currentProject) return 'folder'

    // 根据平台或芯片型号选择图标
    const platform = currentProject.platform?.toLowerCase() || ''
    const chipModel = currentProject.chipModel?.toLowerCase() || ''

    if (platform.includes('stm32') || chipModel.includes('stm32')) {
      return 'chip' // STM32项目使用芯片图标
    } else if (platform.includes('arduino') || chipModel.includes('arduino')) {
      return 'zap' // Arduino项目使用闪电图标
    } else if (platform.includes('esp') || chipModel.includes('esp')) {
      return 'wifi' // ESP项目使用WiFi图标
    } else if (currentProject.programmingLanguage?.toLowerCase() === 'c') {
      return 'file-code' // C语言项目使用代码图标
    }

    return 'folder-open' // 默认项目图标
  }

  return (
    <div
      className="bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden min-w-[200px]"
      id="sidebar-panel"
    >
      {/* 项目标题栏 */}
      <div
        className="bg-blue-600 text-white px-3 py-2 text-sm font-bold flex-shrink-0"
        onMouseEnter={() => setIsProjectHovered(true)}
        onMouseLeave={() => setIsProjectHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div
            className="project-title flex items-center gap-2 cursor-pointer flex-1 min-w-0"
            id="project-title"
            title={getProjectTooltip()}
          >
            <Icon
              name={getProjectIcon()}
              size={14}
              className="text-white flex-shrink-0"
            />
            <span id="current-project-name" className="truncate">
              {isLoading ? '加载中...' : (currentProject?.name || 'STM32项目')}
            </span>
          </div>

          {/* 全局操作工具栏 - 只在hover时显示 */}
          {isProjectHovered && (
            <div className="flex items-center gap-0.5 opacity-90 hover:opacity-100">
              <button
                onClick={() => {
                  // 触发文件树的新建文件功能
                  document.dispatchEvent(new CustomEvent('create-file', { detail: { path: '' } }))
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-blue-500 hover:bg-opacity-30 rounded transition-all duration-150"
                title="新建文件"
              >
                <Icon name="file-plus" size={14} className="text-white" />
              </button>
              <button
                onClick={() => {
                  // 触发文件树的新建文件夹功能
                  document.dispatchEvent(new CustomEvent('create-folder', { detail: { path: '' } }))
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-blue-500 hover:bg-opacity-30 rounded transition-all duration-150"
                title="新建文件夹"
              >
                <Icon name="folder-plus" size={14} className="text-white" />
              </button>
              <button
                onClick={() => {
                  // 触发文件树的刷新功能
                  document.dispatchEvent(new CustomEvent('refresh-files'))
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-blue-500 hover:bg-opacity-30 rounded transition-all duration-150"
                title="刷新"
              >
                <Icon name="refresh" size={14} className="text-white" />
              </button>
              <button
                onClick={() => {
                  // 触发文件树的折叠所有功能
                  document.dispatchEvent(new CustomEvent('collapse-all'))
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-blue-500 hover:bg-opacity-30 rounded transition-all duration-150"
                title="折叠所有"
              >
                <Icon name="chevrons-up" size={14} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 文件树 */}
      <div className="flex-1 overflow-y-auto">
        <FileTree />
      </div>
    </div>
  )
}

export default Sidebar
