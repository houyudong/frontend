import React, { useState, useEffect } from 'react'
import Button from '../UI/Button'
import Icon from '../UI/Icon'
import Dialog from '../UI/Dialog'
import SettingsPanel from './SettingsPanel'
import HelpPanel from './HelpPanel'
import deviceService from '../../services/device'
import wsService from '../../services/websocket'
import compileService from '../../services/compile'
import debugSession from '../../services/debugSession'
import runService from '../../services/run'
import useFileStore from '../../stores/fileStore'

const DebugToolbar: React.FC = () => {
  // 合并设备状态
  const [deviceState, setDeviceState] = useState({
    connected: false,
    connecting: false,
    stLinkId: '',
    chipId: '',
    lastError: null as string | null,
    showDisconnectedAnimation: false
  })

  // 合并系统状态
  const [systemState, setSystemState] = useState({
    wsConnected: false,
    debugging: false,
    compiling: false,
    running: false,
    lastCompileSuccess: true
  })

  // 调试状态
  const [debugState, setDebugState] = useState({
    isDebugging: false,
    isStarting: false,
    isStopping: false,
    debugState: 'disconnected' as 'disconnected' | 'running' | 'paused'
  })

  // 运行状态
  const [runState, setRunState] = useState({
    isRunning: false,
    isStarting: false,
    isStopping: false
  })

  // Dialog状态
  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success'
  })

  // 面板状态
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // 文件状态
  const {
    activeFile,
    saveFile,
    saveAllFiles,
    hasUnsavedChanges,
    getFileByPath
  } = useFileStore()

  useEffect(() => {
    // 初始化 WebSocket 连接
    const initializeConnection = async () => {
      try {
        await wsService.connect()
        setSystemState(prev => ({ ...prev, wsConnected: true }))
        console.log('🔌 WebSocket 连接已建立')
      } catch (error) {
        console.error('❌ WebSocket 连接失败:', error)
        setSystemState(prev => ({ ...prev, wsConnected: false }))
      }
    }

    initializeConnection()

    // 监听设备事件
    const handleDeviceConnected = (device: any) => {
      setDeviceState({
        connected: true,
        connecting: false,
        stLinkId: device?.id || device?.serial_number || '',
        chipId: device?.chip_id || '',
        lastError: null,
        showDisconnectedAnimation: false
      })
      console.log('✅ 设备已连接:', device)
    }

    const handleDeviceDisconnected = () => {
      setDeviceState({
        connected: false,
        connecting: false,
        stLinkId: '',
        chipId: '',
        lastError: null,
        showDisconnectedAnimation: true
      })
      console.log('🔌 设备已断开')
    }

    // 监听调试会话状态变化
    const handleDebugSessionStateChanged = (state: any) => {
      console.log('🔧 调试会话状态变化:', state)
      setDebugState({
        isDebugging: state.isDebugging,
        isStarting: state.isStarting,
        isStopping: state.isStopping,
        debugState: state.debugState || 'disconnected'
      })
      setSystemState(prev => ({ ...prev, debugging: state.isDebugging }))
    }

    // 监听运行服务状态变化
    const handleRunServiceStateChanged = (state: any) => {
      console.log('🔄 运行服务状态变化:', state)
      setRunState({
        isRunning: state.isRunning,
        isStarting: state.isStarting,
        isStopping: state.isStopping
      })
      setSystemState(prev => ({ ...prev, running: state.isRunning }))
      console.log('🔄 更新运行状态:', { isRunning: state.isRunning, isStarting: state.isStarting })
    }

    const handleDeviceError = (error: string) => {
      setDeviceState(prev => ({
        ...prev,
        connecting: false,
        connected: false,
        lastError: error,
        showDisconnectedAnimation: true
      }))
      console.error('❌ 设备错误:', error)
    }

    // 监听 WebSocket 连接状态
    const handleWebSocketConnected = () => {
      setSystemState(prev => ({ ...prev, wsConnected: true }))
      console.log('✅ WebSocket 已连接')
    }

    const handleWebSocketDisconnected = () => {
      setSystemState(prev => ({ ...prev, wsConnected: false }))
      console.log('❌ WebSocket 已断开')
    }

    // 监听调试状态变化
    const handleDebugStateChanged = (event: CustomEvent) => {
      const { isDebugging: debugging } = event.detail || {}
      setSystemState(prev => ({ ...prev, debugging: debugging || false }))
    }

    // 监听编译状态变化
    const handleCompileStateChanged = (event: CustomEvent) => {
      const { isCompiling: compiling, lastCompileSuccess: success } = event.detail || {}
      setSystemState(prev => ({
        ...prev,
        compiling: compiling || false,
        lastCompileSuccess: success !== undefined ? success : prev.lastCompileSuccess
      }))
    }

    deviceService.on('deviceConnected', handleDeviceConnected)
    deviceService.on('deviceDisconnected', handleDeviceDisconnected)
    deviceService.on('error', handleDeviceError)

    wsService.on('connected', handleWebSocketConnected)
    wsService.on('disconnected', handleWebSocketDisconnected)

    // 监听服务状态变化
    debugSession.on('stateChanged', handleDebugSessionStateChanged)
    runService.on('stateChanged', handleRunServiceStateChanged)

    // 监听全局事件
    document.addEventListener('debug-state-changed', handleDebugStateChanged as EventListener)
    document.addEventListener('compile-state-changed', handleCompileStateChanged as EventListener)

    // 清理函数
    return () => {
      deviceService.off('deviceConnected', handleDeviceConnected)
      deviceService.off('deviceDisconnected', handleDeviceDisconnected)
      deviceService.off('error', handleDeviceError)

      wsService.off('connected', handleWebSocketConnected)
      wsService.off('disconnected', handleWebSocketDisconnected)

      debugSession.off('stateChanged', handleDebugSessionStateChanged)
      runService.off('stateChanged', handleRunServiceStateChanged)

      document.removeEventListener('debug-state-changed', handleDebugStateChanged as EventListener)
      document.removeEventListener('compile-state-changed', handleCompileStateChanged as EventListener)
    }
  }, [])

  const handleCompile = async () => {
    try {
      console.log('🔨 开始编译项目')

      const result = await compileService.compileProject()

      if (result.success) {
        console.log('✅ 编译成功')
      } else {
        console.log('❌ 编译失败:', result.message)
        // 错误信息已在控制台显示，不需要弹出框
      }
    } catch (error) {
      console.error('❌ 编译失败:', error)
      // 错误信息已在控制台显示，不需要弹出框
    }
  }

  const handleClean = async () => {
    try {
      console.log('🧹 开始清理项目')

      const result = await compileService.cleanProject()

      if (result.success) {
        console.log('✅ 清理成功')
      } else {
        console.log('❌ 清理失败:', result.message)
        // 错误信息已在控制台显示，不需要弹出框
      }
    } catch (error) {
      console.error('❌ 清理失败:', error)
      // 错误信息已在控制台显示，不需要弹出框
    }
  }

  const handleSave = async () => {
    if (!activeFile) {
      console.warn('没有活动文件可保存')
      return
    }

    try {
      await saveFile(activeFile)
      console.log('✅ 文件保存成功')
    } catch (error) {
      console.error('❌ 文件保存失败:', error)
      setDialog({
        visible: true,
        title: '保存失败',
        message: '文件保存失败: ' + (error instanceof Error ? error.message : '未知错误'),
        type: 'error'
      })
    }
  }

  const handleSaveAll = async () => {
    if (!hasUnsavedChanges()) {
      console.log('没有需要保存的文件')
      return
    }

    try {
      const result = await saveAllFiles()
      if (result.failed > 0) {
        setDialog({
          visible: true,
          title: '保存完成',
          message: `保存完成: 成功 ${result.saved} 个，失败 ${result.failed} 个`,
          type: 'warning'
        })
      } else {
        console.log(`✅ 所有文件保存成功 (${result.saved} 个文件)`)
      }
    } catch (error) {
      console.error('❌ 保存所有文件失败:', error)
      setDialog({
        visible: true,
        title: '保存失败',
        message: '保存失败: ' + (error instanceof Error ? error.message : '未知错误'),
        type: 'error'
      })
    }
  }

  // 运行程序处理 - 修复后的标准IDE行为
  const handleRun = async () => {
    try {
      // 🔧 标准IDE行为：运行按钮始终执行"烧录并运行"操作
      // 不管当前状态如何，运行按钮都应该重新烧录和运行程序
      console.log('🚀 运行程序：编译 → 烧录 → 自动运行')
      const result = await runService.runProgram()

      if (!result.success) {
        console.error('❌ 运行失败:', result.message)
      }
    } catch (error) {
      console.error('❌ 运行操作失败:', error)
    }
  }

  // 🔥 新增：单独的停止程序处理（如果需要的话）
  const handleStopProgram = async () => {
    try {
      console.log('⏹️ 停止程序运行')
      const result = await runService.stopProgram()

      if (!result.success) {
        console.error('❌ 停止失败:', result.message)
      }
    } catch (error) {
      console.error('❌ 停止操作失败:', error)
    }
  }

  // 调试处理
  const handleDebug = async () => {
    try {
      if (debugState.isDebugging) {
        console.log('⏹️ 停止调试')
        const result = await debugSession.stopDebug()

        if (!result.success) {
          console.error('❌ 停止调试失败:', result.message)
        }
      } else {
        console.log('🐛 开始调试')
        const result = await debugSession.startDebug()

        if (!result.success) {
          console.error('❌ 调试启动失败:', result.message)
        }
      }
    } catch (error) {
      console.error('❌ 调试操作失败:', error)
    }
  }

  // 调试控制函数
  const handleContinue = async () => {
    try {
      await debugSession.continue()
    } catch (error) {
      console.error('❌ 继续执行失败:', error)
    }
  }

  const handlePause = async () => {
    try {
      await debugSession.pause()
    } catch (error) {
      console.error('❌ 暂停执行失败:', error)
    }
  }

  const handleStepOver = async () => {
    try {
      await debugSession.stepOver()
    } catch (error) {
      console.error('❌ 单步执行失败:', error)
    }
  }

  const handleStepInto = async () => {
    try {
      await debugSession.stepInto()
    } catch (error) {
      console.error('❌ 步入函数失败:', error)
    }
  }

  const handleStepOut = async () => {
    try {
      await debugSession.stepOut()
    } catch (error) {
      console.error('❌ 步出函数失败:', error)
    }
  }

  const handleDeviceToggle = async () => {
    if (deviceState.connecting) return

    setDeviceState(prev => ({ ...prev, connecting: true }))

    try {
      if (deviceState.connected) {
        // 🔧 修复：设备已连接时，重新扫描以刷新状态
        // 设备断开应该通过USB拔出或WebSocket断开自动处理
        console.log('🔄 设备已连接，重新扫描以刷新状态')
        await deviceService.scanDevices()
      } else {
        // 扫描并连接设备
        console.log('🔍 扫描并连接设备')
        await deviceService.scanDevices()
      }
    } catch (error) {
      console.error('❌ 设备操作失败:', error)
      setDeviceState(prev => ({ ...prev, connecting: false }))
    }
  }

  const getDeviceStatus = () => {
    if (deviceState.connecting) {
      return {
        icon: 'refresh',
        text: '连接中',
        className: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 animate-device-connecting',
        tooltip: '正在连接设备...'
      }
    }
    if (deviceState.connected) {
      return {
        icon: 'link',
        text: '已连接',
        className: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100 transition-all duration-300',
        tooltip: `ST-Link ID: ${deviceState.stLinkId || 'N/A'}${deviceState.chipId ? `\n芯片ID: ${deviceState.chipId}` : ''}\n点击刷新设备状态`
      }
    }
    if (deviceState.lastError) {
      return {
        icon: 'unlink',
        text: '错误',
        className: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100 animate-device-error',
        tooltip: `设备错误: ${deviceState.lastError}`
      }
    }
    return {
      icon: 'unlink',
      text: '未连接',
      className: `bg-red-50 border-red-200 text-red-600 hover:bg-red-100 ${
        deviceState.showDisconnectedAnimation ? 'animate-device-disconnected' : ''
      }`,
      tooltip: '点击连接设备'
    }
  }

  const deviceStatus = getDeviceStatus()

  // 按钮状态计算（基于原始工程逻辑）
  // 调试启动中或调试过程中禁用编译和运行
  const canCompile = systemState.wsConnected && !systemState.compiling && !systemState.debugging && !systemState.running && !debugState.isDebugging && !debugState.isStarting
  const canDebug = systemState.wsConnected && deviceState.connected && !systemState.compiling && !systemState.running && !debugState.isStarting
  const canRun = systemState.wsConnected && deviceState.connected && !systemState.compiling && !systemState.debugging && !runState.isStarting && !debugState.isDebugging && !debugState.isStarting

  // 保存状态
  const currentFile = activeFile ? getFileByPath(activeFile) : null
  const canSave = !!currentFile?.modified
  const canSaveAll = hasUnsavedChanges()

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between h-10 flex-shrink-0">
      <div className="flex gap-1 mr-3">
        <Button
          id="btn-save"
          title="保存当前文件 (Ctrl+S)"
          size="sm"
          icon="save"
          disabled={!canSave}
          onClick={handleSave}
        >
          保存
        </Button>
        <Button
          id="btn-save-all"
          title="保存所有文件 (Ctrl+Shift+S)"
          size="sm"
          icon="save-all"
          disabled={!canSaveAll}
          onClick={handleSaveAll}
        >
          全部保存
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <Button
          id="btn-compile"
          title="编译项目 (Ctrl+B)"
          size="sm"
          icon="hammer"
          disabled={!canCompile}
          onClick={handleCompile}
        >
          {systemState.compiling ? '编译中...' : '编译'}
        </Button>
        <Button
          id="btn-clean"
          title="清理项目"
          size="sm"
          icon="refresh"
          disabled={!canCompile}
          onClick={handleClean}
        >
          清理
        </Button>
        <Button
          id="btn-run"
          title="运行程序 (编译 → 烧录 → 自动运行)"
          size="sm"
          icon={runState.isStarting ? "refresh" : "flash"}
          disabled={!canRun}
          onClick={handleRun}
        >
          {runState.isStarting ? '烧录中...' : '运行'}
        </Button>
        <Button
          id="btn-start-debug"
          title={debugState.isDebugging ? "停止调试" : "启动调试"}
          size="sm"
          icon={debugState.isDebugging ? "square" : "bug"}
          disabled={!canDebug && !debugState.isDebugging}
          onClick={handleDebug}
          className={debugState.isDebugging ? "bg-red-600 hover:bg-red-700 text-white" : ""}
        >
          {debugState.isStarting ? '启动中...' : debugState.isDebugging ? '停止' : '调试'}
        </Button>
      </div>

      <div className="flex gap-1 mr-3">
        <Button
          id="btn-continue"
          title={debugState.debugState === 'running' ? "程序运行中..." : "继续执行 (F5)"}
          size="sm"
          icon={debugState.debugState === 'running' ? "loader" : "play"}
          disabled={!debugState.isDebugging || debugState.debugState === 'running'}
          onClick={handleContinue}
          className={debugState.debugState === 'running' ? "animate-pulse" : ""}
        >
          {debugState.debugState === 'running' ? '运行中' : '继续'}
        </Button>
        <Button
          id="btn-pause"
          title="暂停执行 (F6)"
          size="sm"
          icon="pause"
          disabled={!debugState.isDebugging || debugState.debugState !== 'running'}
          onClick={handlePause}
        >
          暂停
        </Button>
        <Button
          id="btn-step-over"
          title="单步执行 (F10)"
          size="sm"
          icon="step-over"
          disabled={!debugState.isDebugging || debugState.debugState !== 'paused'}
          onClick={handleStepOver}
        >
          单步
        </Button>
        <Button
          id="btn-step-into"
          title="步入函数 (F11)"
          size="sm"
          icon="step-into"
          disabled={!debugState.isDebugging || debugState.debugState !== 'paused'}
          onClick={handleStepInto}
        >
          步入
        </Button>
        <Button
          id="btn-step-out"
          title="步出函数 (Shift+F11)"
          size="sm"
          icon="step-out"
          disabled={!debugState.isDebugging || debugState.debugState !== 'paused'}
          onClick={handleStepOut}
        >
          步出
        </Button>
      </div>

      <div className="flex gap-1 mr-3">
        <button
          id="device-status"
          title={deviceStatus.tooltip}
          onClick={handleDeviceToggle}
          disabled={deviceState.connecting}
          className={`flex items-center gap-1 text-xs px-2 py-1 border rounded transition-colors ${deviceStatus.className}`}
        >
          <Icon name={deviceStatus.icon} size={14} />
          <span id="device-status-text">{deviceStatus.text}</span>
        </button>
      </div>

      <div className="flex gap-1">
        <Button
          id="btn-settings"
          title="系统设置"
          size="sm"
          icon="settings"
          onClick={() => setShowSettings(true)}
        >
          设置
        </Button>
        <Button
          id="btn-help"
          title="使用帮助"
          size="sm"
          icon="info"
          onClick={() => setShowHelp(true)}
        >
          帮助
        </Button>
      </div>

      {/* 消息对话框 */}
      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText="确定"
        showCancel={false}
        onConfirm={() => setDialog(prev => ({ ...prev, visible: false }))}
        onCancel={() => setDialog(prev => ({ ...prev, visible: false }))}
      />

      {/* 设置面板 */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}

      {/* 帮助面板 */}
      {showHelp && (
        <HelpPanel onClose={() => setShowHelp(false)} />
      )}
    </div>
  )
}

export default DebugToolbar
