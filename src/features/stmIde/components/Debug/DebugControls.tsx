import React from 'react'
import Icon from '../UI/Icon'
import useDebugStore from '../../stores/debugStore'

/**
 * 调试控制面板 - 基于cortex-debug和VSCode的设计
 */
const DebugControls: React.FC = () => {
  const {
    isDebugging,
    isPaused,
    isConnected,
    canContinue,
    canStepOver,
    canStepInto,
    canStepOut,
    canRestart,
    canStop,
    lastError,
    startDebugging,
    stopDebugging,
    continueDebugging,
    stepOver,
    stepInto,
    stepOut,
    restart
  } = useDebugStore()

  const handleStart = async () => {
    try {
      await startDebugging()
    } catch (error) {
      console.error('启动调试失败:', error)
    }
  }

  const handleStop = async () => {
    try {
      await stopDebugging()
    } catch (error) {
      console.error('停止调试失败:', error)
    }
  }

  const handleContinue = async () => {
    try {
      await continueDebugging()
    } catch (error) {
      console.error('继续调试失败:', error)
    }
  }

  const handleStepOver = async () => {
    try {
      await stepOver()
    } catch (error) {
      console.error('单步跳过失败:', error)
    }
  }

  const handleStepInto = async () => {
    try {
      await stepInto()
    } catch (error) {
      console.error('单步进入失败:', error)
    }
  }

  const handleStepOut = async () => {
    try {
      await stepOut()
    } catch (error) {
      console.error('单步跳出失败:', error)
    }
  }

  const handleRestart = async () => {
    try {
      await restart()
    } catch (error) {
      console.error('重启调试失败:', error)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-50 border-b border-gray-200">
      {/* 调试状态指示器 */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="text-gray-700">
          {isDebugging 
            ? (isPaused ? '已暂停' : '正在运行') 
            : '未连接'
          }
        </span>
        {lastError && (
          <span className="text-red-600 text-xs ml-2">
            {lastError}
          </span>
        )}
      </div>

      {/* 调试控制按钮 */}
      <div className="flex items-center gap-1">
        {!isDebugging ? (
          // 启动调试按钮
          <button
            onClick={handleStart}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            title="开始调试 (F5)"
          >
            <Icon name="play" size={14} />
            <span>开始调试</span>
          </button>
        ) : (
          // 调试控制按钮组
          <>
            {/* 继续/暂停 */}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                canContinue
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="继续 (F5)"
            >
              <Icon name="play" size={14} />
            </button>

            {/* 单步跳过 */}
            <button
              onClick={handleStepOver}
              disabled={!canStepOver}
              className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                canStepOver
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="单步跳过 (F10)"
            >
              <Icon name="arrow-right" size={14} />
            </button>

            {/* 单步进入 */}
            <button
              onClick={handleStepInto}
              disabled={!canStepInto}
              className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                canStepInto
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="单步进入 (F11)"
            >
              <Icon name="arrow-down" size={14} />
            </button>

            {/* 单步跳出 */}
            <button
              onClick={handleStepOut}
              disabled={!canStepOut}
              className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                canStepOut
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="单步跳出 (Shift+F11)"
            >
              <Icon name="arrow-up" size={14} />
            </button>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* 重启 */}
            <button
              onClick={handleRestart}
              disabled={!canRestart}
              className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                canRestart
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="重启 (Ctrl+Shift+F5)"
            >
              <Icon name="refresh-cw" size={14} />
            </button>

            {/* 停止 */}
            <button
              onClick={handleStop}
              disabled={!canStop}
              className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
                canStop
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="停止调试 (Shift+F5)"
            >
              <Icon name="square" size={14} />
            </button>
          </>
        )}
      </div>

      {/* 快捷键提示 */}
      {isDebugging && (
        <div className="text-xs text-gray-500 mt-1">
          <div>F5: 继续 | F10: 单步跳过 | F11: 单步进入 | Shift+F11: 单步跳出</div>
        </div>
      )}
    </div>
  )
}

export default DebugControls
