/**
 * 性能优化工具集
 * 提供防抖、节流、内存监控等性能优化功能
 */

// 防抖延迟配置
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,        // 搜索输入防抖
  SAVE: 500,          // 文件保存防抖
  RESIZE: 100,        // 窗口大小调整防抖
  SCROLL: 50,         // 滚动事件防抖
  INPUT: 200,         // 一般输入防抖
  API_CALL: 1000,     // API调用防抖
  FILE_CHANGE: 300    // 文件变化防抖
} as const

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  let lastCallTime = 0

  return function debounced(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    const callNow = immediate && !timeoutId

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (callNow) {
      lastCallTime = now
      func.apply(this, args)
    } else {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        timeoutId = null
        if (!immediate) {
          func.apply(this, args)
        }
      }, delay)
    }
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0
  let timeoutId: NodeJS.Timeout | null = null

  return function throttled(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    if (timeSinceLastCall >= delay) {
      lastCallTime = now
      func.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        timeoutId = null
        func.apply(this, args)
      }, delay - timeSinceLastCall)
    }
  }
}

/**
 * 性能计时器
 */
export class PerformanceTimer {
  private timers: Map<string, number> = new Map()

  /**
   * 开始计时
   */
  start(name: string): void {
    this.timers.set(name, performance.now())
  }

  /**
   * 结束计时并返回耗时
   */
  end(name: string): number {
    const startTime = this.timers.get(name)
    if (startTime === undefined) {
      console.warn(`Timer "${name}" not found`)
      return 0
    }

    const endTime = performance.now()
    const duration = endTime - startTime
    this.timers.delete(name)
    return duration
  }

  /**
   * 结束计时并输出日志
   */
  endAndLog(name: string, prefix = '⏱️'): number {
    const duration = this.end(name)
    console.log(`${prefix} ${name}: ${duration.toFixed(2)}ms`)
    return duration
  }

  /**
   * 清除所有计时器
   */
  clear(): void {
    this.timers.clear()
  }
}

/**
 * 内存监控器
 */
export class MemoryMonitor {
  private listeners: Set<(memoryInfo: any) => void> = new Set()
  private intervalId: NodeJS.Timeout | null = null
  private isMonitoring = false

  /**
   * 添加监听器
   */
  addListener(listener: (memoryInfo: any) => void): void {
    this.listeners.add(listener)
  }

  /**
   * 移除监听器
   */
  removeListener(listener: (memoryInfo: any) => void): void {
    this.listeners.delete(listener)
  }

  /**
   * 开始监控
   */
  startMonitoring(interval = 5000): void {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.intervalId = setInterval(() => {
      const memoryInfo = this.getMemoryInfo()
      if (memoryInfo) {
        this.listeners.forEach(listener => {
          try {
            listener(memoryInfo)
          } catch (error) {
            console.error('Memory monitor listener error:', error)
          }
        })
      }
    }, interval)

    console.log('🔍 内存监控已启动')
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isMonitoring = false
    console.log('🔍 内存监控已停止')
  }

  /**
   * 获取内存信息
   */
  private getMemoryInfo(): any {
    if (typeof window === 'undefined') return null

    const memory = (performance as any).memory
    if (!memory) return null

    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: Math.round(usagePercentage * 100) / 100
    }
  }

  /**
   * 获取当前内存信息
   */
  getCurrentMemoryInfo(): any {
    return this.getMemoryInfo()
  }
}

/**
 * 批处理器 - 将多个操作合并为一次执行
 */
export class BatchProcessor<T> {
  private items: T[] = []
  private timeoutId: NodeJS.Timeout | null = null
  private processor: (items: T[]) => void
  private delay: number

  constructor(processor: (items: T[]) => void, delay = 100) {
    this.processor = processor
    this.delay = delay
  }

  /**
   * 添加项目到批处理队列
   */
  add(item: T): void {
    this.items.push(item)

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.flush()
    }, this.delay)
  }

  /**
   * 立即处理所有项目
   */
  flush(): void {
    if (this.items.length === 0) return

    const itemsToProcess = [...this.items]
    this.items = []

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    try {
      this.processor(itemsToProcess)
    } catch (error) {
      console.error('Batch processor error:', error)
    }
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.items = []
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}

// 创建全局实例
export const performanceTimer = new PerformanceTimer()
export const memoryMonitor = new MemoryMonitor()

/**
 * 异步操作包装器 - 添加性能监控
 */
export function withPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  func: T,
  name: string
): T {
  return (async (...args: Parameters<T>) => {
    performanceTimer.start(name)
    try {
      const result = await func(...args)
      performanceTimer.endAndLog(name)
      return result
    } catch (error) {
      performanceTimer.endAndLog(name, '❌')
      throw error
    }
  }) as T
}

/**
 * 同步操作包装器 - 添加性能监控
 */
export function withSyncPerformanceMonitoring<T extends (...args: any[]) => any>(
  func: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    performanceTimer.start(name)
    try {
      const result = func(...args)
      performanceTimer.endAndLog(name)
      return result
    } catch (error) {
      performanceTimer.endAndLog(name, '❌')
      throw error
    }
  }) as T
}
