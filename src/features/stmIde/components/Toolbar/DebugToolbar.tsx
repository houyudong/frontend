import React, { useState, useEffect } from 'react'
import { useDebugStore } from '../../stores/debugStore'
import runService from '../../services/run'
import debugSession from '../../services/debugSession'
import deviceService from '../../services/device'
import Icon from '../Icon'

/**
 * 调试工具栏 - 主界面的调试控制按钮
 * 集成运行和调试功能
 */
const DebugToolbar: React.FC = () => {
  const [runState, setRunState] = useState(runService.getState())
  const [debugState, setDebugState] = useState(debugSession.getState())
  const [deviceState, setDeviceState] = useState(deviceService.getState())

  const {
    isDebugging,
    isPaused,
    canContinue,
    canStepOver,
    canStepInto,
    canStepOut,
    canStop
  } = useDebugStore()

  // 调试日志：监控调试状态变化
  useEffect(() => {
    console.log('🔧 DebugToolbar 状态变化:', {
      isDebugging,
      isPaused,
      canContinue,
      canStepOver,
      canStepInto,
      canStepOut,
      canStop,
      debugState,
      sessionId: debugState.sessionId
    })
  }, [isDebugging, isPaused, canContinue, canStepOver, canStepInto, canStepOut, canStop, debugState])

  // 监听服务状态变化
  useEffect(() => {
    const handleRunStateChange = (state: any) => setRunState(state)
    const handleDebugStateChange = (state: any) => setDebugState(state)
    const handleDeviceStateChange = (state: any) => setDeviceState(state)

    runService.on('stateChanged', handleRunStateChange)
    debugSession.on('stateChanged', handleDebugStateChange)
    deviceService.on('stateChanged', handleDeviceStateChange)

    return () => {
      runService.off('stateChanged', handleRunStateChange)
      debugSession.off('stateChanged', handleDebugStateChange)
      deviceService.off('stateChanged', handleDeviceStateChange)
    }
  }, [])

  // 运行程序
  const handleRun = async () => {
    try {
      await runService.runProgram()
    } catch (error) {
      console.error('运行程序失败:', error)
    }
  }

  // 启动调试
  const handleStartDebug = async () => {
    try {
      // 🔴 通知设备服务：调试开始，停止设备扫描
      deviceService.setDebuggingState(true)

      await debugSession.startDebug()
    } catch (error) {
      console.error('启动调试失败:', error)
      // 如果调试启动失败，恢复设备扫描
      deviceService.setDebuggingState(false)
    }
  }

  // 停止调试
  const handleStopDebug = async () => {
    try {
      await debugSession.stopDebug()

      // 🔴 通知设备服务：调试结束，恢复设备扫描
      deviceService.setDebuggingState(false)
    } catch (error) {
      console.error('停止调试失败:', error)
      // 即使停止失败，也要恢复设备扫描
      deviceService.setDebuggingState(false)
    }
  }

  // 继续执行
  const handleContinue = async () => {
    try {
      await debugSession.continue()
    } catch (error) {
      console.error('继续执行失败:', error)
    }
  }

  // 暂停执行
  const handlePause = async () => {
    try {
      await debugSession.pause()
    } catch (error) {
      console.error('暂停执行失败:', error)
    }
  }

  // 单步跳过
  const handleStepOver = async () => {
    console.log('🔧 单步跳过按钮被点击', {
      canStepOver,
      isDebugging,
      isPaused,
      debugState,
      sessionId: debugSession.getState().sessionId
    })
    try {
      const result = await debugSession.stepOver()
      console.log('🔧 单步跳过结果:', result)
    } catch (error) {
      console.error('单步跳过失败:', error)
    }
  }

  // 单步进入
  const handleStepInto = async () => {
    try {
      await debugSession.stepInto()
    } catch (error) {
      console.error('单步进入失败:', error)
    }
  }

  // 单步跳出
  const handleStepOut = async () => {
    try {
      await debugSession.stepOut()
    } catch (error) {
      console.error('单步跳出失败:', error)
    }
  }

  // 检查是否有可用设备
  const hasDevice = deviceState.connectedDevice !== null

  // 检查是否正在运行或调试
  const isRunning = runState.isRunning || runState.isStarting
  const isDebuggingActive = debugState.isDebugging || debugState.isStarting

  // 检查是否有任何异步操作正在进行
  const isAnyOperationActive = isRunning || isDebuggingActive || runState.isStopping || debugState.isStopping

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
      {/* 运行按钮 */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleRun}
          disabled={!hasDevice || isAnyOperationActive}
          className={`
            flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium
            transition-colors duration-200
            ${!hasDevice || isAnyOperationActive
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
            }
          `}
          title="运行程序 (Ctrl+F5)"
        >
          <Icon
            name={runState.isStarting ? "loader" : "play"}
            size={16}
            className={runState.isStarting ? "animate-spin" : ""}
          />
          <span className="hidden sm:inline">
            {runState.isStarting ? '运行中...' : runState.isRunning ? '运行中' : '运行'}
          </span>
        </button>

        {/* 调试按钮 */}
        <button
          onClick={isDebuggingActive ? handleStopDebug : handleStartDebug}
          disabled={!hasDevice || (isAnyOperationActive && !isDebuggingActive)}
          className={`
            flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium
            transition-colors duration-200
            ${!hasDevice || (isAnyOperationActive && !isDebuggingActive)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isDebuggingActive
                ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            }
          `}
          title={isDebuggingActive ? "停止调试 (Shift+F5)" : "启动调试 (F5)"}
        >
          <Icon
            name={debugState.isStarting ? "loader" : isDebuggingActive ? "square" : "bug"}
            size={16}
            className={debugState.isStarting ? "animate-spin" : ""}
          />
          <span className="hidden sm:inline">
            {debugState.isStarting ? '启动中...' : isDebuggingActive ? '停止调试' : '调试'}
          </span>
        </button>
      </div>

      {/* 调试控制按钮 - 仅在调试时显示 */}
      {isDebugging && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-2" />

          <div className="flex items-center gap-1">
            {/* 🔧 简化：只保留继续按钮，移除暂停功能（奥卡姆原则） */}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`
                flex items-center justify-center w-7 h-7 rounded
                transition-colors duration-200
                ${!canContinue
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }
              `}
              title="继续执行 (F5)"
            >
              <Icon name="play" size={14} />
            </button>

            {/* 单步跳过 */}
            <button
              onClick={handleStepOver}
              disabled={!canStepOver}
              className={`
                flex items-center justify-center w-7 h-7 rounded
                transition-colors duration-200
                ${!canStepOver
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }
              `}
              title="单步跳过 (F10)"
            >
              <Icon name="step-forward" size={14} />
            </button>

            {/* 单步进入 */}
            <button
              onClick={handleStepInto}
              disabled={!canStepInto}
              className={`
                flex items-center justify-center w-7 h-7 rounded
                transition-colors duration-200
                ${!canStepInto
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }
              `}
              title="单步进入 (F11)"
            >
              <Icon name="corner-down-right" size={14} />
            </button>

            {/* 单步跳出 */}
            <button
              onClick={handleStepOut}
              disabled={!canStepOut}
              className={`
                flex items-center justify-center w-7 h-7 rounded
                transition-colors duration-200
                ${!canStepOut
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }
              `}
              title="单步跳出 (Shift+F11)"
            >
              <Icon name="corner-up-left" size={14} />
            </button>
          </div>
        </>
      )}

      {/* 状态指示区域 */}
      <div className="flex items-center gap-3 ml-auto text-sm">
        {/* 设备状态 */}
        <div
          className="flex items-center gap-1.5 cursor-pointer"
          title={
            isDebuggingActive
              ? '🔴 调试模式 - 设备已锁定'
              : hasDevice
                ? `设备已连接: ${deviceState.connectedDevice?.id || 'Unknown'}`
                : '设备未连接'
          }
        >
          <div className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${isDebuggingActive
              ? 'bg-orange-500 animate-pulse'
              : hasDevice
                ? 'bg-green-500'
                : 'bg-red-500 animate-device-disconnected'
            }
          `} />
          <span className="text-gray-600 hidden md:inline">
            {isDebuggingActive ? '🔴 调试锁定' : hasDevice ? '已连接' : '未连接'}
          </span>
        </div>

        {/* 运行状态 */}
        {runState.isRunning && (
          <div className="flex items-center gap-1.5" title="程序运行中">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 hidden lg:inline">运行中</span>
          </div>
        )}

        {/* 调试状态 */}
        {isDebugging && (
          <div
            className="flex items-center gap-1.5"
            title={isPaused ? '调试已暂停' : '调试运行中'}
          >
            <div className={`
              w-2 h-2 rounded-full
              ${isPaused ? 'bg-orange-500' : 'bg-blue-500 animate-pulse'}
            `} />
            <span className={`hidden lg:inline ${isPaused ? 'text-orange-600' : 'text-blue-600'}`}>
              {isPaused ? '已暂停' : '调试中'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DebugToolbar
