/**
 * 实验模块配置
 * 
 * 参考STMIde的配置管理方式
 * 统一管理实验相关的配置信息
 */

import { ExperimentConfig } from '../types/experimentTypes';

// 实验配置
export const experimentConfig: ExperimentConfig = {
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api' 
    : '/api',
  defaultUserId: 'user-1', // 开发环境默认用户ID
  enableOfflineMode: false,
  cacheTimeout: 5 * 60 * 1000, // 5分钟缓存
};

// API端点配置
export const API_ENDPOINTS = {
  // 实验模板相关
  TEMPLATES: '/experiments/templates',
  TEMPLATE_BY_ID: (id: string) => `/experiments/templates/${id}`,
  
  // 用户实验相关
  USER_EXPERIMENTS: (userId: string) => `/users/${userId}/experiments`,
  START_EXPERIMENT: (userId: string) => `/users/${userId}/experiments`,
  DELETE_EXPERIMENT: (userId: string, experimentId: number) => 
    `/users/${userId}/experiments/${experimentId}`,
  
  // 项目相关（实验项目管理）
  PROJECTS: (userId: string) => `/users/${userId}/projects`,
  PROJECT_BY_ID: (userId: string, projectId: string) => 
    `/users/${userId}/projects/${projectId}`,
} as const;

// 实验分类配置
export const EXPERIMENT_CATEGORIES = {
  basic: {
    name: '基础实验',
    description: 'GPIO、LED、按键等基础功能实验',
    color: 'green',
    icon: '🔧'
  },
  intermediate: {
    name: '中级实验', 
    description: '定时器、串口、LCD等中级功能实验',
    color: 'blue',
    icon: '⚙️'
  },
  advanced: {
    name: '高级实验',
    description: 'ADC、DAC等高级功能实验',
    color: 'purple',
    icon: '🔬'
  },
  project: {
    name: '综合项目',
    description: '智能系统等综合项目实验',
    color: 'orange',
    icon: '🚀'
  }
} as const;

// 难度级别配置（简化为三级）
export const DIFFICULTY_LEVELS = {
  1: { name: '初级', color: 'green', description: '适合初学者，基础GPIO和简单控制' },
  2: { name: '中级', color: 'blue', description: '需要一定基础，涉及定时器、通信、显示' },
  3: { name: '高级', color: 'orange', description: '需要较多经验，模拟信号和综合项目' }
} as const;

// 实验状态配置
export const EXPERIMENT_STATUS = {
  not_started: {
    name: '未开始',
    color: 'gray',
    icon: '⭕'
  },
  in_progress: {
    name: '进行中',
    color: 'blue',
    icon: '🔄'
  },
  completed: {
    name: '已完成',
    color: 'green',
    icon: '✅'
  },
  failed: {
    name: '失败',
    color: 'red',
    icon: '❌'
  }
} as const;

// 19个实验的详细配置
export const EXPERIMENTS_CONFIG = {
  // GPIO类实验 (4个) - 初级难度
  '2': {
    urlName: 'led',
    category: 'basic',
    difficulty: 1,
    prerequisites: ['C语言基础', '数字电路基础'],
    hardware: ['STM32F103开发板', 'LED灯', '220Ω电阻', '面包板'],
    estimatedTime: 45,
    keyPoints: ['GPIO配置', 'LED驱动', '基础控制']
  },
  '3': {
    urlName: 'ledblink',
    category: 'basic',
    difficulty: 1,
    prerequisites: ['GPIO基础', 'HAL库使用'],
    hardware: ['STM32F103开发板', 'LED灯', '220Ω电阻'],
    estimatedTime: 50,
    keyPoints: ['延时控制', '状态切换', '循环程序']
  },
  '4': {
    urlName: 'ledbanner',
    category: 'basic',
    difficulty: 1,
    prerequisites: ['GPIO基础', '数组操作'],
    hardware: ['STM32F103开发板', '多个LED灯', '220Ω电阻', '面包板'],
    estimatedTime: 55,
    keyPoints: ['多GPIO控制', '数组算法', '时序控制']
  },
  '5': {
    urlName: 'ledbreath',
    category: 'basic',
    difficulty: 2,
    prerequisites: ['PWM原理', '定时器基础'],
    hardware: ['STM32F103开发板', 'LED灯', '220Ω电阻', '示波器'],
    estimatedTime: 65,
    keyPoints: ['PWM生成', '占空比控制', '模拟输出']
  },

  // 输入处理类实验 (2个) - 初级难度
  '7': {
    urlName: 'keyscan',
    category: 'basic',
    difficulty: 1,
    prerequisites: ['GPIO输入', '上拉电阻'],
    hardware: ['STM32F103开发板', '按键开关', '10kΩ电阻'],
    estimatedTime: 50,
    keyPoints: ['输入检测', '软件消抖', '轮询扫描']
  },
  '6': {
    urlName: 'keyint',
    category: 'basic',
    difficulty: 1,
    prerequisites: ['中断概念', 'EXTI系统'],
    hardware: ['STM32F103开发板', '按键开关', '10kΩ电阻'],
    estimatedTime: 60,
    keyPoints: ['外部中断', '中断服务', '实时响应']
  },

  // 定时器类实验 (2个) - 中级难度
  '8': {
    urlName: 'timbase',
    category: 'intermediate',
    difficulty: 2,
    prerequisites: ['定时器原理', '中断系统'],
    hardware: ['STM32F103开发板', 'LED灯'],
    estimatedTime: 60,
    keyPoints: ['定时器配置', '精确定时', '中断处理']
  },
  '11': {
    urlName: 'timpwm',
    category: 'intermediate',
    difficulty: 2,
    prerequisites: ['定时器基础', 'PWM原理'],
    hardware: ['STM32F103开发板', 'LED灯', '示波器'],
    estimatedTime: 75,
    keyPoints: ['PWM模式', '频率控制', '占空比调节']
  },

  // 通信类实验 (2个) - 中级难度
  '9': {
    urlName: 'uart',
    category: 'intermediate',
    difficulty: 2,
    prerequisites: ['串口原理', '通信协议'],
    hardware: ['STM32F103开发板', 'USB转串口模块'],
    estimatedTime: 80,
    keyPoints: ['UART配置', '数据收发', '通信调试']
  },
  '10': {
    urlName: 'uart_transrecvint',
    category: 'intermediate',
    difficulty: 2,
    prerequisites: ['UART基础', '中断处理'],
    hardware: ['STM32F103开发板', 'USB转串口模块'],
    estimatedTime: 85,
    keyPoints: ['中断收发', '缓冲管理', '高效通信']
  },

  // 模拟信号类实验 (4个) - 高级难度
  '12': {
    urlName: 'adc',
    category: 'advanced',
    difficulty: 3,
    prerequisites: ['模拟电路', '采样理论'],
    hardware: ['STM32F103开发板', '电位器', '万用表'],
    estimatedTime: 90,
    keyPoints: ['ADC配置', '模拟采集', '数据转换']
  },
  '13': {
    urlName: 'adcmq2',
    category: 'advanced',
    difficulty: 3,
    prerequisites: ['ADC基础', '传感器原理'],
    hardware: ['STM32F103开发板', 'MQ2传感器', '面包板'],
    estimatedTime: 95,
    keyPoints: ['传感器接口', '信号调理', '数据处理']
  },
  '14': {
    urlName: 'dacvoltageout',
    category: 'advanced',
    difficulty: 3,
    prerequisites: ['DAC原理', '模拟输出'],
    hardware: ['STM32F103开发板', '万用表', '示波器'],
    estimatedTime: 80,
    keyPoints: ['DAC配置', '电压输出', '精度控制']
  },
  '15': {
    urlName: 'dacwave',
    category: 'advanced',
    difficulty: 3,
    prerequisites: ['DAC基础', 'DMA传输'],
    hardware: ['STM32F103开发板', '示波器'],
    estimatedTime: 90,
    keyPoints: ['波形生成', 'DMA应用', '信号合成']
  },

  // 显示类实验 (1个) - 中级难度
  '16': {
    urlName: 'lcd',
    category: 'intermediate',
    difficulty: 2,
    prerequisites: ['并行接口', '时序控制'],
    hardware: ['STM32F103开发板', 'LCD1602', '电位器'],
    estimatedTime: 70,
    keyPoints: ['LCD驱动', '字符显示', '接口时序']
  },

  // 综合项目类实验 (4个) - 高级难度
  '17': {
    urlName: 'smartecowatch',
    category: 'project',
    difficulty: 3,
    prerequisites: ['多传感器', 'I2C通信', '系统集成'],
    hardware: ['STM32F103开发板', '多种传感器', '显示屏'],
    estimatedTime: 120,
    keyPoints: ['系统集成', '多传感器', '智能控制']
  },
  '18': {
    urlName: 'autopark',
    category: 'project',
    difficulty: 3,
    prerequisites: ['电机控制', '传感器融合', '算法设计'],
    hardware: ['STM32F103开发板', '电机', '超声波传感器'],
    estimatedTime: 150,
    keyPoints: ['自动控制', '路径规划', '传感器融合']
  },
  '19': {
    urlName: 'fitband',
    category: 'project',
    difficulty: 3,
    prerequisites: ['生物传感器', '数据处理', '无线通信'],
    hardware: ['STM32F103开发板', '心率传感器', '加速度计'],
    estimatedTime: 140,
    keyPoints: ['生物信号', '数据分析', '健康监测']
  },
  '20': {
    urlName: 'optitracer',
    category: 'project',
    difficulty: 3,
    prerequisites: ['光学传感器', '图像处理', '实时控制'],
    hardware: ['STM32F103开发板', '光学传感器', '执行器'],
    estimatedTime: 130,
    keyPoints: ['光学检测', '轨迹跟踪', '实时处理']
  }
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  pageSize: 12,
  maxRetries: 3,
  retryDelay: 1000,
  requestTimeout: 30000,
} as const;
