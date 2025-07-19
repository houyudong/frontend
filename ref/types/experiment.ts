/**
 * 实验相关类型定义
 * 
 * 基于数据库表结构和19个真实实验的类型定义
 * 参考STMIde的类型管理方式
 */

// 实验模板接口（对应experiment_templates表）
export interface ExperimentTemplate {
  id: string;
  name: string;
  project_name?: string;
  category?: string;
  difficulty?: number;
  duration?: number;
  description?: string;
  learning_objectives?: string[];
  theory?: string;
  key_functions?: string[];
  verification_points?: string[];
  test_cases?: any[];
  hints?: string[];
  challenges?: string[];
  resources?: any[];
  assessment?: any;
  chip_model?: string;
  template_path?: string;
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 用户实验接口（对应user_experiments表）
export interface UserExperiment {
  id: number;
  user_id: string;
  experiment_id: string;
  project_name: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  project_path?: string;
  started_at?: string;
  updated_at?: string;
  created_at?: string;
  score?: number;
  start_time?: string;
  completion_time?: string;
}

// 实验会话接口（对应experiment_sessions表）
export interface ExperimentSession {
  id: string;
  user_id: string;
  experiment_id: string;
  session_data?: any;
  created_at?: string;
  updated_at?: string;
}

// 实验进度信息（对应backend的ExperimentProgress）
export interface ExperimentProgress {
  user_experiment: UserExperiment;
  template: ExperimentTemplate;
  project?: any;
}

// 实验分类枚举
export enum ExperimentCategory {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced',
  PROJECT = 'project'
}

// 实验难度级别（简化为三级）
export enum ExperimentDifficulty {
  BEGINNER = 1,  // 初级
  INTERMEDIATE = 2,  // 中级
  ADVANCED = 3   // 高级
}

// 19个实验的ID映射（基于数据库真实数据）
export const EXPERIMENT_IDS = {
  // GPIO类实验 (4个)
  LED_BASIC: '2',           // STM32F103 LED基础控制
  LED_BLINK: '3',           // STM32F103 LED闪烁控制  
  LED_BANNER: '4',          // STM32F103 LED跑马灯
  LED_BREATH: '5',          // STM32F103 LED呼吸灯
  
  // 输入处理类实验 (2个)
  KEY_SCAN: '7',            // STM32F103 按键扫描
  KEY_INT: '6',             // STM32F103 按键中断
  
  // 定时器类实验 (2个)
  TIMER_BASE: '8',          // STM32F103 定时器基础
  TIMER_PWM: '11',          // STM32F103 定时器PWM
  
  // 通信类实验 (2个)
  UART: '9',                // STM32F103 串口通信
  UART_INT: '10',           // STM32F103 串口中断收发
  
  // 模拟信号类实验 (4个)
  ADC: '12',                // STM32F103 模数转换
  ADC_MQ2: '13',            // STM32F103 ADC气体传感器
  DAC_VOLTAGE: '14',        // STM32F103 DAC电压输出
  DAC_WAVE: '15',           // STM32F103 DAC波形生成
  
  // 显示类实验 (1个)
  LCD: '16',                // STM32F103 LCD显示
  
  // 综合项目类实验 (4个)
  SMART_ECO_WATCH: '17',    // 智能环境监测系统
  AUTO_PARK: '18',          // 智能自动泊车系统
  FIT_BAND: '19',           // 智能健身手环
  OPTI_TRACER: '20'         // 光学追踪器
} as const;

// 实验URL名称到ID的映射
export const EXPERIMENT_URL_TO_ID: Record<string, string> = {
  // GPIO类
  'led': EXPERIMENT_IDS.LED_BASIC,
  'ledblink': EXPERIMENT_IDS.LED_BLINK,
  'ledbanner': EXPERIMENT_IDS.LED_BANNER,
  'ledbreath': EXPERIMENT_IDS.LED_BREATH,
  
  // 输入处理类
  'keyscan': EXPERIMENT_IDS.KEY_SCAN,
  'keyint': EXPERIMENT_IDS.KEY_INT,
  
  // 定时器类
  'timbase': EXPERIMENT_IDS.TIMER_BASE,
  'timpwm': EXPERIMENT_IDS.TIMER_PWM,
  
  // 通信类
  'uart': EXPERIMENT_IDS.UART,
  'uart_transrecvint': EXPERIMENT_IDS.UART_INT,
  
  // 模拟信号类
  'adc': EXPERIMENT_IDS.ADC,
  'adcmq2': EXPERIMENT_IDS.ADC_MQ2,
  'dacvoltageout': EXPERIMENT_IDS.DAC_VOLTAGE,
  'dacwave': EXPERIMENT_IDS.DAC_WAVE,
  
  // 显示类
  'lcd': EXPERIMENT_IDS.LCD,
  
  // 综合项目类
  'smartecowatch': EXPERIMENT_IDS.SMART_ECO_WATCH,
  'autopark': EXPERIMENT_IDS.AUTO_PARK,
  'fitband': EXPERIMENT_IDS.FIT_BAND,
  'optitracer': EXPERIMENT_IDS.OPTI_TRACER
};

// 实验状态
export interface ExperimentState {
  templates: ExperimentTemplate[];
  userExperiments: UserExperiment[];
  currentExperiment?: ExperimentTemplate;
  currentProgress?: ExperimentProgress;
  loading: boolean;
  error?: string;
}

// 实验操作接口
export interface ExperimentActions {
  // 模板管理
  loadTemplates: () => Promise<void>;
  getTemplate: (id: string) => Promise<ExperimentTemplate | null>;
  
  // 用户实验管理
  loadUserExperiments: (userId: string) => Promise<void>;
  startExperiment: (userId: string, templateId: string) => Promise<any>;
  deleteExperiment: (userId: string, experimentId: number) => Promise<void>;
  
  // 进度管理
  updateProgress: (userId: string, experimentId: string, progress: number) => Promise<void>;
  completeExperiment: (userId: string, experimentId: string) => Promise<void>;
  
  // 状态管理
  setCurrentExperiment: (experiment: ExperimentTemplate) => void;
  clearError: () => void;
}

// 实验配置接口
export interface ExperimentConfig {
  apiBaseUrl: string;
  defaultUserId: string;
  enableOfflineMode: boolean;
  cacheTimeout: number;
}

// 实验过滤器
export interface ExperimentFilter {
  category?: ExperimentCategory;
  difficulty?: ExperimentDifficulty;
  status?: UserExperiment['status'];
  search?: string;
}

// 实验排序选项
export interface ExperimentSort {
  field: 'name' | 'difficulty' | 'duration' | 'order_index' | 'created_at';
  direction: 'asc' | 'desc';
}
