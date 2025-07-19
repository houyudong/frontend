/**
 * 实验数据
 * 
 * 基于backend/STM32F103_EXPCODE/experiments.yaml的真实实验数据
 * 融合知识点体系和专业化的实验详情
 */

import { 
  EnhancedExperimentDetail, 
  ExperimentListItem, 
  KnowledgePoint,
  FlowStep 
} from '../types/experimentTypes';

// STM32基础知识点库
export const knowledgePointsLibrary: Record<string, KnowledgePoint> = {
  // GPIO相关知识点
  'gpio-basics': {
    id: 'gpio-basics',
    title: 'GPIO基础原理',
    content: 'GPIO（General Purpose Input/Output）是STM32微控制器的通用输入输出端口。每个GPIO端口都可以配置为输入或输出模式，并且可以设置不同的电气特性。',
    category: 'gpio',
    level: 'basic',
    relatedConcepts: ['数字信号', '上拉下拉电阻', '推挽输出'],
    examples: ['LED控制', '按键检测', '数字传感器接口']
  },
  'gpio-config': {
    id: 'gpio-config',
    title: 'GPIO配置方法',
    content: 'STM32的GPIO配置包括时钟使能、引脚模式设置、输出类型、上拉下拉配置和输出速度设置。使用HAL库可以简化配置过程。',
    category: 'gpio',
    level: 'intermediate',
    relatedConcepts: ['HAL库', '时钟系统', '寄存器配置']
  },
  
  // 中断系统知识点
  'interrupt-basics': {
    id: 'interrupt-basics',
    title: '中断系统原理',
    content: '中断是CPU响应外部事件的机制。STM32使用NVIC（嵌套向量中断控制器）管理中断，支持中断优先级和中断嵌套。',
    category: 'interrupt',
    level: 'intermediate',
    relatedConcepts: ['NVIC', '中断优先级', '中断服务程序']
  },
  
  // 定时器知识点
  'timer-basics': {
    id: 'timer-basics',
    title: '定时器工作原理',
    content: 'STM32定时器是基于计数器的外设，可以实现精确定时、PWM输出、输入捕获等功能。定时器的时钟来源于系统时钟经过预分频器分频。',
    category: 'timer',
    level: 'intermediate',
    relatedConcepts: ['时钟系统', 'PWM', '预分频器']
  },
  
  // HAL库知识点
  'hal-library': {
    id: 'hal-library',
    title: 'STM32 HAL库',
    content: 'HAL（Hardware Abstraction Layer）库是STM32官方提供的硬件抽象层库，提供了统一的API接口，简化了硬件操作。',
    category: 'architecture',
    level: 'basic',
    relatedConcepts: ['硬件抽象', 'API接口', '代码移植性']
  }
};

// LED闪烁实验详情
export const ledBlinkExperiment: EnhancedExperimentDetail = {
  id: 'led_basic',
  name: 'LED闪烁控制',
  description: '学习使用延时函数控制LED闪烁',
  
  purpose: [
    '掌握STM32 GPIO的基本配置方法',
    '学习使用HAL库控制LED',
    '理解延时函数的工作原理',
    '培养嵌入式编程思维'
  ],
  
  principle: {
    theory: '本实验通过配置STM32F103的GPIO端口为输出模式，使用HAL_GPIO_WritePin函数控制LED的亮灭状态，结合HAL_Delay延时函数实现LED的周期性闪烁效果。',
    softwareArchitecture: '程序采用超级循环架构，在主循环中不断切换LED状态并延时，形成闪烁效果。',
    workingMechanism: 'GPIO输出高电平点亮LED，输出低电平熄灭LED，通过周期性改变输出状态实现闪烁。'
  },
  
  knowledgePoints: {
    prerequisites: [
      knowledgePointsLibrary['gpio-basics'],
      knowledgePointsLibrary['hal-library']
    ],
    core: [
      knowledgePointsLibrary['gpio-config']
    ]
  },
  
  steps: [
    '配置开发环境，创建STM32F103项目',
    '使用STM32CubeMX配置GPIO引脚为输出模式',
    '编写主程序，在while循环中控制LED闪烁',
    '编译程序并下载到开发板',
    '观察LED闪烁效果，验证程序正确性'
  ],
  
  directory: 'STM32F103_LED',
  estimatedTime: 45,
  difficulty: 'beginner',
  chipModel: 'STM32F103ZETX',
  
  status: 'not_started',
  progress: 0,
  
  tags: ['GPIO', 'LED', '基础实验'],
  
  theory: '本实验基于STM32F103微控制器，通过GPIO外设控制外部硬件。'
};

// 实验数据数组
export const experimentsData: EnhancedExperimentDetail[] = [
  ledBlinkExperiment,
  // 可以添加更多实验...
];

// 导出实验列表（为了兼容性）
export const realExperiments = experimentsData;

// 获取实验数据的辅助函数
export const getExperimentById = (id: string): EnhancedExperimentDetail | null => {
  return experimentsData.find(exp => exp.id === id) || null;
};

// 获取实验列表项
export const getExperimentListItems = (): ExperimentListItem[] => {
  return experimentsData.map(exp => ({
    id: exp.id,
    name: exp.name,
    description: exp.description,
    difficulty: exp.difficulty,
    estimatedTime: exp.estimatedTime,
    status: exp.status,
    progress: exp.progress,
    tags: exp.tags,
    chipModel: exp.chipModel,
    isNew: true,
    isPopular: true
  }));
};

// 根据分类筛选实验
export const getExperimentsByCategory = (category: string): EnhancedExperimentDetail[] => {
  if (category === 'all') return experimentsData;
  return experimentsData.filter(exp => 
    exp.tags?.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
  );
};

// 根据难度筛选实验
export const getExperimentsByDifficulty = (difficulty: string): EnhancedExperimentDetail[] => {
  if (difficulty === 'all') return experimentsData;
  return experimentsData.filter(exp => exp.difficulty === difficulty);
};
