/**
 * 应用配置管理 - 简化版本
 * 统一管理所有配置，保留必要的测试配置
 */

// 基础配置
export const config = {
  // 应用信息
  app: {
    name: 'STM32 AI调试工具',
    version: '1.0.0'
  },

  // STMClient 服务配置
  stmClient: {
    host: 'localhost',
    port: 8080,
    protocol: 'http',
    wsProtocol: 'ws'
  },

  // Backend 服务配置
  backend: {
    host: 'localhost',
    port: 5000,
    protocol: 'http',
    apiPrefix: '/api'
  },

  // 开发模式配置 (不再硬编码用户ID)
  development: {
    bypassAuth: true,
    testMode: true,
    defaultHeaders: {
      'X-Bypass-Auth': 'true',
      'Authorization': 'Bearer dev-token',
      'X-Device-ID': 'stmide-client-001',
      'Content-Type': 'application/json'
    }
  },

  // 超时配置
  timeout: {
    websocket: 10000,
    api: 30000
  },

  // 重连配置
  reconnect: {
    maxAttempts: 5,
    interval: 3000
  }
}

// URL 生成函数
export const getSTMClientWSUrl = (): string => {
  const { host, port, wsProtocol } = config.stmClient
  return `${wsProtocol}://${host}:${port}/ws`
}

export const getSTMClientHttpUrl = (): string => {
  const { host, port, protocol } = config.stmClient
  return `${protocol}://${host}:${port}`
}

export const getBackendApiUrl = (): string => {
  const { host, port, protocol, apiPrefix } = config.backend
  return `${protocol}://${host}:${port}${apiPrefix}`
}

export const getBackendBaseUrl = (): string => {
  const { host, port, protocol } = config.backend
  return `${protocol}://${host}:${port}`
}

// 导出常用配置
export const { app, stmClient, backend, development, timeout, reconnect } = config

export default config
