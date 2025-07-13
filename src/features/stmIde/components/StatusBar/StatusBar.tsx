import React from 'react'
import Icon from '../UI/Icon'
import { useDebugStore } from '../../stores/debugStore'

const StatusBar: React.FC = () => {
  const { isDebugging } = useDebugStore()

  // 根据调试状态选择背景色 - VSCode风格
  const backgroundClass = isDebugging
    ? 'bg-orange-600 text-white' // 调试时橙色
    : 'bg-blue-600 text-white'   // 正常时蓝色

  return (
    <div className={`${backgroundClass} px-3 py-1 flex items-center justify-between h-6 flex-shrink-0 text-xs relative z-10 transition-colors duration-300`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1" id="git-branch">
          <Icon name="git-branch" size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1" id="sync-status">
          <Icon name="refresh" size={12} />
          <span>0↓ 0↑</span>
        </div>
        <div className="flex items-center gap-1" id="problems-count">
          <Icon name="error" size={12} />
          <span>0</span>
        </div>
      </div>

      <div className="flex-1 text-center">
        <div id="status-message">
          {isDebugging ? '🐛 调试模式' : '准备就绪'}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div id="cursor-position">行: 1, 列: 1</div>
        <div id="encoding">UTF-8</div>
        <div id="line-ending">LF</div>
        <div id="language-mode">C</div>
        <div className="flex items-center gap-1" id="device-info" title="设备信息">
          <Icon name="chip" size={12} />
          <span>STM32F1</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
