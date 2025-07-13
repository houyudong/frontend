import React from 'react'
import Console from './Console'
import { useDebugStore } from '../../stores/debugStore'

/**
 * 底部面板组件 - 简洁版本
 * 使用Zustand状态管理，专注于Console功能
 */
const BottomPanel: React.FC = () => {
  const { isDebugging } = useDebugStore()

  return (
    <div className="bg-white border-t border-gray-200 flex flex-col overflow-hidden h-full min-h-[150px] max-h-full" id="bottom-panel">
      <Console isDebugging={isDebugging} />
    </div>
  )
}

export default BottomPanel
