/**
 * WebSocket 服务 - 完全基于测试页面的成功实现
 * 与 STMClient 完全兼容的 WebSocket 通信服务
 */

import { getSTMClientWSUrl, reconnect, timeout } from '../config'

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}

export interface WebSocketConfig {
  url?: string
  reconnectAttempts?: number
  reconnectInterval?: number
}

type MessageHandler = (payload: any) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private isConnected = false
  private isConnecting = false
  private messageHandlers = new Map<string, MessageHandler[]>()
  private messageQueue: WebSocketMessage[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts: number
  private reconnectInterval: number

  constructor(config: WebSocketConfig = {}) {
    this.url = config.url || getSTMClientWSUrl()
    this.maxReconnectAttempts = config.reconnectAttempts || reconnect.maxAttempts
    this.reconnectInterval = config.reconnectInterval || reconnect.interval
  }

  /**
   * 连接 WebSocket
   */
  async connect(): Promise<boolean> {
    if (this.isConnected || this.isConnecting) {
      console.log('WebSocket 已连接或正在连接中')
      return this.isConnected
    }

    this.isConnecting = true
    console.log(`🔌 连接 WebSocket: ${this.url}`)

    try {
      this.ws = new WebSocket(this.url)

      return new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('WebSocket 创建失败'))
          return
        }

        this.ws.onopen = () => {
          console.log('✅ WebSocket 连接成功')
          this.isConnected = true
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.processMessageQueue()
          this.emit('connected')

          // 🔥 通知debugService WebSocket已连接
          setTimeout(() => {
            const debugService = (window as any).debugService
            if (debugService && typeof debugService.forceInit === 'function') {
              debugService.forceInit()
            }
          }, 100)

          resolve(true)
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket 连接关闭:', event.code, event.reason)
          this.handleDisconnect()
        }

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket 错误:', error)
          this.isConnecting = false
          reject(error)
        }

        // 连接超时处理
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false
            reject(new Error('WebSocket 连接超时'))
          }
        }, timeout.websocket)
      })
    } catch (error) {
      this.isConnecting = false
      console.error('❌ WebSocket 连接失败:', error)
      throw error
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    console.log('🔌 断开 WebSocket 连接')

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }

    this.isConnected = false
    this.isConnecting = false
    this.emit('disconnected')
  }

  /**
   * 发送消息（完全模仿测试页面的成功实现）
   */
  send(type: string, payload: any = {}): boolean {
    // 🔴 调试模式下过滤设备扫描消息
    if (this.shouldFilterMessage(type)) {
      return false
    }

    const message: WebSocketMessage = {
      type: type,
      payload: payload,
      timestamp: new Date().toISOString()
    }

    // 如果未连接，加入队列
    if (!this.isConnected || !this.ws) {
      this.messageQueue.push(message)

      // 尝试重连
      if (!this.isConnecting) {
        this.reconnect()
      }
      return false
    }

    try {
      this.ws.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('❌ 发送消息失败:', error)
      this.messageQueue.push(message)
      return false
    }
  }

  /**
   * 检查是否应该过滤消息（调试模式下）
   */
  private shouldFilterMessage(type: string): boolean {
    // 检查是否正在调试
    const debugSession = (window as any).debugSession
    const isDebugging = debugSession?.getState()?.isDebugging || false

    if (!isDebugging) {
      return false // 非调试模式，不过滤任何消息
    }

    // 调试模式下需要过滤的消息类型
    const filteredMessageTypes = [
      'device.list',        // 设备扫描
      'device.scan',        // 设备扫描
      'device.connect',     // 设备连接（调试时设备已被占用）
      'device.disconnect',  // 设备断开
    ]

    return filteredMessageTypes.includes(type)
  }

  /**
   * 注册消息处理器
   */
  on(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler)
  }

  /**
   * 移除消息处理器
   */
  off(type: string, handler?: MessageHandler): void {
    if (!handler) {
      this.messageHandlers.delete(type)
      return
    }

    const handlers = this.messageHandlers.get(type)
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
  private emit(type: string, payload?: any): void {
    const handlers = this.messageHandlers.get(type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`❌ 消息处理器错误 [${type}]:`, error)
        }
      })
    }
  }

  /**
   * 处理接收到的消息 - 简化版本
   */
  private handleMessage(data: string): void {
    try {
      const parsed = JSON.parse(data)
      console.log('📥 收到原始消息:', parsed)

      // 🔧 修复：优先使用明确的type字段
      if (parsed.type && parsed.type !== '') {
        console.log(`📥 使用明确类型: ${parsed.type}`)
        const actualData = parsed.payload || parsed
        this.emit(parsed.type, actualData)
        return
      }

      // 🔧 简化：如果没有明确类型，使用payload作为数据进行推断
      const actualData = parsed.payload || parsed
      this.dispatchSimple(actualData)

    } catch (error) {
      console.error('❌ 解析消息失败:', error, data)
    }
  }

  /**
   * 简化的消息分发
   */
  private dispatchSimple(data: any): void {
    // 调试快照（最重要的消息）
    if (data.variables && data.file && data.line) {
      console.log('📸 调试快照')
      this.emit('debug.snapshot', data)
      return
    }

    // 调试停止
    if (data.status === 'stopped') {
      console.log('🛑 调试停止')
      this.emit('debug.stopped', data)
      return
    }

    // 调试启动
    if (data.status === 'started') {
      console.log('🚀 调试启动')
      this.emit('debug.started', data)
      return
    }

    // 设备列表
    if (data.devices && Array.isArray(data.devices)) {
      console.log('📱 设备列表')
      this.emit('device.list', data)
      return
    }

    console.log('📝 其他消息，忽略')
  }

  /**
   * 处理断开连接
   */
  private handleDisconnect(): void {
    this.isConnected = false
    this.isConnecting = false

    // 重置所有状态
    this.resetAllStates()
    this.emit('disconnected')

    // 自动重连
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnect()
    } else {
      console.error('❌ WebSocket 重连次数已达上限')

      // 🔧 简单提示：建议用户刷新页面恢复
      import('./navigationModal').then(({ default: navigationModalService }) => {
        navigationModalService.showWarning(
          'STMClient连接失败',
          'STMClient服务可能已退出，请刷新页面重试。如问题持续，请重启STMClient服务。',
          0 // 不自动关闭，让用户手动处理
        )
      })

      this.emit('reconnect_failed')
    }
  }

  /**
   * 重置所有状态（WebSocket断开时）
   */
  private resetAllStates(): void {
    // 重置设备状态
    document.dispatchEvent(new CustomEvent('websocket-disconnected'))

    // 重置调试状态
    const debugSession = (window as any).debugSession
    if (debugSession) {
      debugSession.handleWebSocketDisconnected()
    }
  }

  /**
   * 重连 - 使用指数退避策略
   */
  private async reconnect(): Promise<void> {
    if (this.isConnecting) return

    this.reconnectAttempts++

    // 🔧 修复：使用指数退避，避免频繁重连
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000) // 1s, 2s, 4s, 8s, 10s
    console.log(`🔄 WebSocket 重连尝试 ${this.reconnectAttempts}/${this.maxReconnectAttempts}，${delay}ms后重连`)

    setTimeout(async () => {
      try {
        await this.connect()
      } catch (error) {
        console.error('❌ WebSocket 重连失败:', error)
      }
    }, delay)
  }

  /**
   * 处理消息队列
   */
  private processMessageQueue(): void {
   if (this.messageQueue.length === 0) return

    console.log(`📤 处理消息队列，共 ${this.messageQueue.length} 条消息`)
    const queue = [...this.messageQueue]
    this.messageQueue = []

    queue.forEach(message => {
      this.send(message.type, message.payload)
    })

    // 🔧 奥卡姆原则：简化恢复机制，页面刷新即可恢复
  }



  /**
   * 获取连接状态
   */
  get connected(): boolean {
    return this.isConnected
  }

  /**
   * 获取连接中状态
   */
  get connecting(): boolean {
    return this.isConnecting
  }
}

// 创建全局实例
const wsService = new WebSocketService()

// 🔥 将WebSocket客户端暴露到window对象，供debugService使用
declare global {
  interface Window {
    wsClient: WebSocketService
  }
}

// 暴露到全局
;(window as any).wsClient = wsService

export default wsService
