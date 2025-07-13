/**
 * 设备管理服务 - 管理 ST-Link 设备连接和状态
 * 基于 stmclient/test/debug/js/device-manager.js 的架构
 */

import wsService from './websocket'
import configManager from '../config/configManager'

// ===== 常量定义 =====

// 设备扫描和连接相关常量
const DEVICE_CONSTANTS = {
  SCAN_TIMEOUT: 5000,
  CONNECT_TIMEOUT: 10000,
  CHIP_ID_REQUEST_DELAY: 200,
  DEBUG_END_SCAN_DELAY: 1000,
  CHIP_ID_PATTERN: /^[0-9A-Fa-f]{24}$/,
  STORAGE_KEY_CHIP_FAMILY: 'stmide_chip_family'
} as const

// 注意：USB热插拔事件的调试器识别已移至STMClient服务端处理
// 前端只需要信任服务端发送的usb.device_added/removed事件

export interface Device {
  id: string
  serial_number: string
  product_name: string
  vendor_id: string
  product_id: string
  status: 'connected' | 'disconnected' | 'debugging' | 'error'
  chip_id?: string
  chip_family?: string
  link_type?: string        // 新增：调试器类型
  transport_mode?: string
  last_connected?: string
  error_message?: string
}

export interface DeviceState {
  devices: Device[]
  connectedDevice: Device | null
  isScanning: boolean
  chipId: string | null
  // 注意：移除未使用的字段 isConnecting, lastError, stLinkId
}

type DeviceEventHandler = (device: Device | null) => void
type DeviceListHandler = (devices: Device[]) => void
type ErrorHandler = (error: string) => void

class DeviceService {
  private state: DeviceState = {
    devices: [],
    connectedDevice: null,
    isScanning: false,
    chipId: null
  }

  private eventHandlers = {
    deviceConnected: [] as DeviceEventHandler[],
    deviceDisconnected: [] as DeviceEventHandler[],
    deviceListUpdated: [] as DeviceListHandler[],
    error: [] as ErrorHandler[]
  }

  constructor() {
    this.initializeWebSocketHandlers()
  }

  /**
   * 初始化 WebSocket 消息处理器
   */
  private initializeWebSocketHandlers(): void {
    // 设备列表响应
    wsService.on('device.list', (payload) => {
      this.handleDeviceList(payload)
    })

    // 注意：device.connect事件处理已移除
    // 设备连接现在通过device.list自动处理

    // 设备断开响应
    wsService.on('device.disconnect', (payload) => {
      this.handleDeviceDisconnect(payload)
    })

    // 设备信息响应（已删除，统一使用device.get_id）

    // 设备ID响应
    wsService.on('device.get_id', (payload) => {
      this.handleDeviceGetId(payload)
    })

    // ping响应
    wsService.on('pong', (payload) => {
      console.log('🏓 收到pong响应:', payload)
    })

    // 设备错误
    wsService.on('device.error', (payload) => {
      this.handleDeviceError(payload)
    })

    // 通用错误处理
    wsService.on('error', (payload) => {
      this.handleDeviceError(payload)
    })

    // USB 热插拔事件 - 信任服务端的调试器识别
    wsService.on('usb.device_added', (payload) => {
      console.log('🔌 USB 调试器设备插入:', payload)

      // � 修复：服务端已经识别为调试器设备，前端直接处理
      // 🔴 调试状态检查：如果正在调试，跳过设备扫描
      if (!this.isDebugging()) {
        console.log('🔧 检测到调试器设备插入，重新扫描设备')
        this.scanDevices() // 重新扫描设备
      } else {
        console.log('🔴 调试进行中，跳过调试器设备插入后的扫描')
      }
    })

    wsService.on('usb.device_removed', (payload) => {
      console.log('🔌 USB 调试器设备拔出:', payload)

      // � 修复：服务端已经识别为调试器设备，前端直接处理
      console.log('🔧 检测到调试器设备拔出，断开当前设备')
      this.handleDeviceRemoved(payload)
    })

    // WebSocket 连接事件
    wsService.on('connected', () => {
      console.log('🔌 WebSocket 已连接')
      // 检查是否正在调试，如果是则不扫描设备
      if (!this.isDebugging()) {
        console.log('开始扫描设备')
        this.scanDevices()
      } else {
        console.log('调试进行中，跳过设备扫描')
      }
    })

    // WebSocket 断开事件
    wsService.on('disconnected', () => {
      this.handleWebSocketDisconnected()
    })
  }

  /**
   * 扫描设备（完全模仿测试页面的成功实现）
   */
  async scanDevices(): Promise<boolean> {
    // 🔴 调试状态检查：如果正在调试，跳过设备扫描
    if (this.isDebugging()) {
      console.log('🔴 调试模式下跳过设备扫描 - 设备已被调试会话占用')
      return false
    }

    if (this.state.isScanning) {
      console.log('⚠️ 设备扫描已在进行中')
      return false
    }

    this.state.isScanning = true

    console.log('🔍 开始扫描 ST-Link 设备')

    try {
      // 直接发送设备列表请求（模仿测试页面的成功做法）
      const success = wsService.send('device.list', {})
      if (!success) {
        throw new Error('发送设备扫描请求失败')
      }

      console.log('📤 设备列表请求已发送')
      return true
    } catch (error) {
      console.error('❌ 扫描设备失败:', error)
      this.state.isScanning = false
      this.emit('error', String(error))
      return false
    }
  }

  // 注意：connectDevice、disconnectDevice、getDeviceInfo方法已移除
  // 遵循奥卡姆原则：设备连接由scanDevices自动处理，无需手动连接/断开

  /**
   * 处理设备列表响应（完全模仿原始工程逻辑）
   */
  private handleDeviceList(payload: any): void {
    this.state.isScanning = false
    console.log('📱 处理设备列表响应:', payload)

    // 检查是否有错误
    if (payload.error) {
      console.error('❌ 获取设备列表失败:', payload.error)
      this.emit('error', payload.error)
      return
    }

    // 如果正在调试，不处理设备列表（设备被占用是正常的）
    if (this.isDebugging()) {
      console.log('🔧 调试进行中，设备被占用是正常现象，保持当前设备状态')
      return
    }

    // 处理设备列表
    if (payload.devices && payload.devices.length > 0) {
      const devices: Device[] = payload.devices
      this.state.devices = devices
      const firstDevice = devices[0]

      console.log(`📱 发现 ${devices.length} 个设备:`, devices)
      console.log('✅ 自动连接第一个设备:', firstDevice)

      // 自动连接第一个设备（完全模仿原始工程的逻辑）
      this.state.connectedDevice = firstDevice
      this.state.chipId = firstDevice.chip_id || null

      this.emit('deviceListUpdated', devices)
      this.emit('deviceConnected', firstDevice)

      // 如果设备有芯片ID，显示芯片ID信息
      if (firstDevice.chip_id) {
        console.log(`🔧 芯片ID: ${firstDevice.chip_id}`)
      } else {
        // 如果没有芯片ID，主动请求获取
        console.log('🔍 设备没有芯片ID，主动请求获取...')
        setTimeout(() => {
          this.requestDeviceId()
        }, DEVICE_CONSTANTS.CHIP_ID_REQUEST_DELAY)
      }
    } else {
      console.log('❌ 未检测到设备')
      this.state.devices = []
      this.state.connectedDevice = null
      this.state.chipId = null
      this.emit('deviceListUpdated', [])
      this.emit('deviceDisconnected', null)
    }
  }

  /**
   * 处理设备连接响应
   */
  // 注意：handleDeviceConnect方法已移除
  // 设备连接现在通过scanDevices自动处理

  /**
   * 处理设备断开响应
   */
  private handleDeviceDisconnect(payload: any): void {
    console.log('🔌 设备已断开连接:', payload)
    this.resetDeviceState()
    this.emit('deviceDisconnected', null)
  }

  // handleDeviceInfo 已删除，统一使用handleDeviceGetId

  /**
   * 处理设备错误
   */
  private handleDeviceError(payload: any): void {
    const errorMessage = payload.error || payload.message || '未知设备错误'
    this.handleError(errorMessage, '设备错误')
  }

  /**
   * 处理设备移除（修复：USB拔出时直接断开当前设备）
   */
  private handleDeviceRemoved(payload: any): void {
    console.log('🔌 USB设备已拔出，断开当前连接的设备')

    // USB拔出时，直接断开当前连接的设备（不依赖device_id匹配）
    if (this.state.connectedDevice) {
      console.log('🔌 当前连接的设备已被移除:', this.state.connectedDevice)
      this.resetDeviceState()
      this.emit('deviceDisconnected', null)
    }

    // 清空设备列表（USB拔出意味着没有可用设备）
    this.state.devices = []
    this.emit('deviceListUpdated', this.state.devices)

    // 显示用户友好的消息
    if (payload.message) {
      console.log('📢 设备移除消息:', payload.message)
    }
  }

  /**
   * 处理WebSocket断开（重置设备状态）
   */
  private handleWebSocketDisconnected(): void {
    console.log('⚠️ WebSocket断开，重置设备状态')

    this.resetDeviceState()
    this.state.devices = []
    this.state.isScanning = false

    this.emit('deviceDisconnected', null)
    this.emit('deviceListUpdated', this.state.devices)
  }

  /**
   * 检查是否正在调试
   */
  private isDebugging(): boolean {
    const debugSession = (window as any).debugSession
    return debugSession?.getState()?.isDebugging || false
  }

  /**
   * 设置调试状态（由调试服务调用）
   */
  setDebuggingState(isDebugging: boolean): void {
    console.log(`🔴 设置调试状态: ${isDebugging ? '开始调试' : '结束调试'}`)

    if (isDebugging) {
      // 开始调试时停止设备扫描
      console.log('🔴 调试开始 - 停止设备扫描，设备已被调试会话占用')
      this.state.isScanning = false
    } else {
      // 结束调试时恢复设备扫描
      console.log('🔴 调试结束 - 恢复设备扫描')
      setTimeout(() => {
        if (!this.isDebugging()) {
          console.log('🔍 调试结束后重新扫描设备')
          this.scanDevices()
        }
      }, DEVICE_CONSTANTS.DEBUG_END_SCAN_DELAY) // 延迟确保调试会话完全结束
    }
  }

  // 注意：isDebuggerDevice方法已移除
  // USB热插拔事件的调试器识别现在由STMClient服务端处理
  // 前端只需要信任服务端发送的usb.device_added/removed事件

  /**
   * 事件监听器
   */
  on(event: 'deviceConnected' | 'deviceDisconnected', handler: DeviceEventHandler): void
  on(event: 'deviceListUpdated', handler: DeviceListHandler): void
  on(event: 'error', handler: ErrorHandler): void
  on(event: string, handler: any): void {
    if (this.eventHandlers[event as keyof typeof this.eventHandlers]) {
      this.eventHandlers[event as keyof typeof this.eventHandlers].push(handler)
    }
  }

  /**
   * 移除事件监听器
   */
  off(event: string, handler: any): void {
    const handlers = this.eventHandlers[event as keyof typeof this.eventHandlers]
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers[event as keyof typeof this.eventHandlers]
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`❌ 设备事件处理器错误 [${event}]:`, error)
        }
      })
    }
  }

  /**
   * 获取当前状态
   */
  getState(): DeviceState {
    return { ...this.state }
  }

  /**
   * 获取连接的设备
   */
  getConnectedDevice(): Device | null {
    return this.state.connectedDevice
  }

  // 注意：调试器识别相关方法已移除
  // 现在由STMClient服务端负责识别调试器设备

  // ===== 私有辅助方法 =====

  /**
   * 重置设备连接状态 - 统一的状态重置逻辑
   */
  private resetDeviceState(): void {
    this.state.connectedDevice = null
    this.state.chipId = null
  }

  /**
   * 处理错误并更新状态 - 统一的错误处理逻辑
   */
  private handleError(error: any, context: string): void {
    const errorMessage = String(error)
    console.error(`❌ ${context}:`, errorMessage)
    this.emit('error', errorMessage)
  }

  // 注意：设备识别相关的辅助方法已移除
  // 现在由STMClient服务端负责设备识别和分类

  // 注意：isDeviceConnected方法已移除
  // 直接使用 deviceService.state.connectedDevice !== null 检查连接状态

  /**
   * 请求获取设备ID（支持动态芯片类型检测）
   */
  async requestDeviceId(chipFamily?: string): Promise<boolean> {
    console.log('📋 请求获取设备ID')

    try {
      // 获取设备配置
      const deviceConfig = await configManager.getDeviceConfig()

      // 动态获取芯片系列，支持用户选择或自动检测
      const detectedChipFamily = chipFamily || await this.detectChipFamily()

      // 发送基本信息：link_type和芯片系列
      const deviceInfo = {
        link_type: deviceConfig.linkType,
        chip_family: detectedChipFamily
      }

      console.log('📤 发送设备基本信息:', deviceInfo)
      const success = wsService.send('device.get_id', deviceInfo)
      if (!success) {
        throw new Error('发送获取设备ID请求失败')
      }
      return true
    } catch (error) {
      console.error('❌ 请求获取设备ID失败:', error)
      this.emit('error', String(error))
      return false
    }
  }

  /**
   * 检测芯片系列（基于项目配置或用户选择）
   */
  private async detectChipFamily(): Promise<string> {
    // 优先级1: 从当前连接的设备获取
    if (this.state.connectedDevice?.chip_family) {
      return this.state.connectedDevice.chip_family
    }

    // 优先级2: 从本地存储获取用户上次选择
    const savedChipFamily = localStorage.getItem(DEVICE_CONSTANTS.STORAGE_KEY_CHIP_FAMILY)
    if (savedChipFamily) {
      return savedChipFamily
    }

    // 优先级3: 从配置管理器获取默认值
    try {
      const deviceConfig = await configManager.getDeviceConfig()
      return deviceConfig.chipFamily
    } catch (error) {
      console.warn('⚠️ 获取设备配置失败，使用硬编码默认值:', error)
      return "stm32f1x" // 最后的兜底值
    }
  }

  /**
   * 设置芯片系列（用户手动选择）
   */
  setChipFamily(chipFamily: string): void {
    console.log('🔧 设置芯片系列:', chipFamily)

    // 保存到本地存储
    localStorage.setItem(DEVICE_CONSTANTS.STORAGE_KEY_CHIP_FAMILY, chipFamily)

    // 更新当前设备信息
    if (this.state.connectedDevice) {
      this.state.connectedDevice.chip_family = chipFamily
    }

    this.emit('chipFamilyChanged', chipFamily)
  }

  /**
   * 处理设备ID响应
   */
  private handleDeviceGetId(payload: any): void {
    console.log('🆔 处理设备ID响应:', payload)

    if (payload.error) {
      console.error('❌ 获取设备ID失败:', payload.error)
      this.emit('error', payload.error)
      return
    }

    if (payload.device_id) {
      const deviceId = payload.device_id.trim()

      // 验证芯片ID格式（STM32芯片ID应该是24位十六进制字符）
      if (DEVICE_CONSTANTS.CHIP_ID_PATTERN.test(deviceId)) {
        this.state.chipId = deviceId
        console.log('✅ 获取到有效的STM32芯片ID:', deviceId)

        // 更新连接的设备信息
        if (this.state.connectedDevice) {
          this.state.connectedDevice.chip_id = deviceId
          this.emit('deviceConnected', this.state.connectedDevice)
        }
      } else {
        console.warn('⚠️ 芯片ID格式无效:', deviceId, '(应为24位十六进制字符)')
        this.state.chipId = deviceId // 仍然保存，但记录警告
      }
    } else {
      console.warn('⚠️ 设备ID响应中没有device_id字段')
    }
  }
}

// 创建全局实例
const deviceService = new DeviceService()

export default deviceService
