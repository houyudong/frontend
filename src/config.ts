/**
 * 应用配置
 * 这个文件包含应用的各种配置信息
 */

interface BackendConfig {
  baseUrl: string;
  apiPrefix: string;
  wsProtocol: string;
  timeout: number;
}

interface McuModel {
  id: string;
  name: string;
}

interface AppConstants {
  MCU_MODELS: McuModel[];
  BAUD_RATES: number[];
  DEFAULTS: {
    MCU_MODEL: string;
    BAUD_RATE: number;
  };
}

// 后端服务配置
export const backendConfig: BackendConfig = {
  // 基础URL - 根据环境变量设置不同的值
  baseUrl: import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    : window.location.origin,

  // API路径前缀
  apiPrefix: '/api',

  // WebSocket协议
  wsProtocol: window.location.protocol === 'https:' ? 'wss:' : 'ws:',

  // 超时设置（毫秒）
  timeout: 30000,
};

/**
 * 获取API基础URL
 * @returns {string} - API基础URL
 */
export const getApiUrl = (): string => {
  return `${backendConfig.baseUrl}${backendConfig.apiPrefix}`;
};

/**
 * 获取WebSocket基础URL
 * @returns {string} - WebSocket基础URL
 */
export const getWsUrl = (): string => {
  const host = new URL(backendConfig.baseUrl).host;
  return `${backendConfig.wsProtocol}//${host}`;
};

/**
 * 应用常量
 */
export const APP_CONSTANTS: AppConstants = {
  // MCU型号
  MCU_MODELS: [
    { id: 'STM32H743ZI', name: 'STM32H743ZI' },
    { id: 'STM32H750XB', name: 'STM32H750XB' },
    { id: 'STM32H753XI', name: 'STM32H753XI' }
  ],

  // 波特率选项
  BAUD_RATES: [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600],

  // 默认值
  DEFAULTS: {
    MCU_MODEL: 'STM32H743ZI',
    BAUD_RATE: 115200
  }
};

export default {
  getApiUrl,
  getWsUrl,
  backendConfig,
  APP_CONSTANTS
}; 