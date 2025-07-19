/**
 * 实验辅助工具函数
 * 
 * 从ExperimentDetailPage.tsx中拆分出来，遵循DRY原则
 * 包含实验ID映射、辅助函数等
 */

/**
 * 根据实验名称获取实验ID映射 - 基于真实的19个实验
 */
export const getExperimentIdByName = (name: string): number => {
  const nameToIdMap: { [key: string]: number } = {
    // 基础GPIO类实验 (4个)
    'led': 2,           // STM32F103 LED基础控制
    'ledblink': 3,      // STM32F103 LED闪烁控制
    'ledbanner': 4,     // STM32F103 LED跑马灯
    'ledbreath': 5,     // STM32F103 LED呼吸灯
    
    // 输入处理类实验 (2个)
    'keyscan': 6,       // STM32F103 按键扫描
    'keyint': 7,        // STM32F103 按键中断
    
    // 定时器类实验 (2个)
    'timbase': 8,       // STM32F103 定时器基础
    'timpwm': 9,        // STM32F103 定时器PWM
    
    // 通信类实验 (2个)
    'uart': 10,         // STM32F103 串口通信
    'uart_transrecvint': 11, // STM32F103 串口中断收发
    
    // 模拟信号类实验 (4个)
    'adc': 12,          // STM32F103 ADC模数转换
    'adcmq2': 13,       // STM32F103 ADC气体传感器
    'dacvoltageout': 14, // STM32F103 DAC电压输出
    'dacwave': 15,      // STM32F103 DAC波形生成
    
    // 显示类实验 (1个)
    'lcd': 16,          // STM32F103 LCD显示
    
    // 综合项目类实验 (4个)
    'smartecowatch': 17, // 智能环境监测系统
    'autopark': 18,     // 智能自动泊车系统
    'fitband': 19,      // 智能健身手环
    'optitracer': 20    // 光学追踪器
  };
  return nameToIdMap[name?.toLowerCase()] || 2;
};

/**
 * 获取当前用户ID，优先使用认证用户ID，否则使用配置的默认ID
 */
export const getCurrentUserId = (user: any, defaultUserId: string): string => {
  return user?.id || defaultUserId;
};

/**
 * 格式化实验名称显示
 */
export const formatExperimentName = (experiment: any): string => {
  if (!experiment) return '未知实验';
  return experiment.name || experiment.project_name || '未知实验';
};

/**
 * 检查实验是否为特定类型
 */
export const isExperimentType = (experiment: any, type: string): boolean => {
  if (!experiment) return false;
  const name = experiment.name?.toLowerCase() || '';
  const projectName = experiment.project_name?.toLowerCase() || '';
  return name.includes(type.toLowerCase()) || projectName.includes(type.toLowerCase());
};

/**
 * 获取实验分类
 */
export const getExperimentCategory = (experiment: any): string => {
  if (!experiment) return 'unknown';
  
  const name = experiment.name?.toLowerCase() || '';
  const projectName = experiment.project_name?.toLowerCase() || '';
  
  // GPIO类实验
  if (name.includes('led') || name.includes('gpio')) {
    return 'gpio';
  }
  
  // 输入处理类实验
  if (name.includes('按键') || name.includes('key')) {
    return 'input';
  }
  
  // 定时器类实验
  if (name.includes('定时器') || name.includes('tim')) {
    return 'timer';
  }
  
  // 通信类实验
  if (name.includes('串口') || name.includes('uart')) {
    return 'communication';
  }
  
  // 模拟信号类实验
  if (name.includes('adc') || name.includes('dac') || name.includes('模数') || name.includes('数模')) {
    return 'analog';
  }
  
  // 显示类实验
  if (name.includes('lcd') || name.includes('显示')) {
    return 'display';
  }
  
  // 综合项目类实验
  if (name.includes('智能') || name.includes('smart') || name.includes('auto') || 
      name.includes('fit') || name.includes('opti')) {
    return 'projects';
  }
  
  return 'unknown';
};

/**
 * 获取实验难度级别
 */
export const getExperimentDifficulty = (experiment: any): 'beginner' | 'intermediate' | 'advanced' => {
  const category = getExperimentCategory(experiment);
  
  switch (category) {
    case 'gpio':
    case 'input':
      return 'beginner';
    case 'timer':
    case 'communication':
    case 'analog':
    case 'display':
      return 'intermediate';
    case 'projects':
      return 'advanced';
    default:
      return 'beginner';
  }
};

/**
 * 获取实验预估完成时间（分钟）
 */
export const getEstimatedTime = (experiment: any): number => {
  const difficulty = getExperimentDifficulty(experiment);
  const category = getExperimentCategory(experiment);
  
  // 基础时间
  let baseTime = 30;
  
  // 根据难度调整
  switch (difficulty) {
    case 'beginner':
      baseTime = 30;
      break;
    case 'intermediate':
      baseTime = 60;
      break;
    case 'advanced':
      baseTime = 120;
      break;
  }
  
  // 根据类型微调
  if (category === 'projects') {
    baseTime += 60; // 综合项目额外增加1小时
  }
  
  return baseTime;
};

/**
 * 获取实验所需硬件列表
 */
export const getRequiredHardware = (experiment: any): string[] => {
  const category = getExperimentCategory(experiment);
  const name = experiment.name?.toLowerCase() || '';
  
  const baseHardware = ['STM32F103开发板', 'ST-Link调试器', 'USB数据线'];
  
  switch (category) {
    case 'gpio':
      return [...baseHardware, 'LED灯', '220Ω电阻', '面包板', '杜邦线'];
    case 'input':
      return [...baseHardware, '按键开关', '10kΩ上拉电阻', '面包板', '杜邦线'];
    case 'timer':
      if (name.includes('pwm')) {
        return [...baseHardware, 'LED灯', '220Ω电阻', '示波器（可选）'];
      }
      return [...baseHardware, 'LED灯', '220Ω电阻'];
    case 'communication':
      return [...baseHardware, 'USB转串口模块', '串口调试助手'];
    case 'analog':
      if (name.includes('mq2')) {
        return [...baseHardware, 'MQ2气体传感器', '面包板', '杜邦线'];
      }
      if (name.includes('dac')) {
        return [...baseHardware, '示波器', '万用表'];
      }
      return [...baseHardware, '电位器', '万用表'];
    case 'display':
      return [...baseHardware, 'LCD1602显示屏', '面包板', '杜邦线', '电位器'];
    case 'projects':
      return [...baseHardware, '多种传感器', '执行器', '面包板', '杜邦线', '电源模块'];
    default:
      return baseHardware;
  }
};

/**
 * 获取实验前置知识要求
 */
export const getPrerequisites = (experiment: any): string[] => {
  const difficulty = getExperimentDifficulty(experiment);
  const category = getExperimentCategory(experiment);
  
  const basePrerequisites = ['C语言基础', 'STM32基础知识'];
  
  switch (difficulty) {
    case 'beginner':
      return [...basePrerequisites];
    case 'intermediate':
      return [...basePrerequisites, 'GPIO操作', '中断概念', '定时器原理'];
    case 'advanced':
      return [...basePrerequisites, 'GPIO操作', '中断系统', '定时器应用', '通信协议', '传感器原理'];
    default:
      return basePrerequisites;
  }
};
