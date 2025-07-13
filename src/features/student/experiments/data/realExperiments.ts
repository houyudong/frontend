/**
 * 真实实验数据
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
    relatedConcepts: ['时钟分频', '计数器', '比较寄存器']
  },
  'pwm-principle': {
    id: 'pwm-principle',
    title: 'PWM信号原理',
    content: 'PWM（脉宽调制）通过改变信号的占空比来控制平均功率输出。STM32定时器可以生成精确的PWM信号，用于电机控制、LED调光等应用。',
    category: 'timer',
    level: 'intermediate',
    relatedConcepts: ['占空比', '频率', '分辨率']
  },
  
  // 串口通信知识点
  'uart-basics': {
    id: 'uart-basics',
    title: 'UART通信原理',
    content: 'UART（通用异步收发器）是一种异步串行通信协议。数据以帧的形式传输，包含起始位、数据位、校验位和停止位。',
    category: 'uart',
    level: 'intermediate',
    relatedConcepts: ['波特率', '数据帧', '异步通信']
  },
  
  // ADC知识点
  'adc-basics': {
    id: 'adc-basics',
    title: 'ADC工作原理',
    content: 'ADC（模数转换器）将连续的模拟信号转换为离散的数字信号。STM32的ADC支持多通道采样、DMA传输和多种触发模式。',
    category: 'adc',
    level: 'intermediate',
    relatedConcepts: ['采样率', '分辨率', '参考电压']
  },
  
  // DAC知识点
  'dac-basics': {
    id: 'dac-basics',
    title: 'DAC工作原理',
    content: 'DAC（数模转换器）将数字信号转换为模拟信号。STM32的DAC可以输出精确的模拟电压，用于波形生成和模拟信号输出。',
    category: 'dac',
    level: 'intermediate',
    relatedConcepts: ['分辨率', '输出阻抗', '建立时间']
  }
};

// LED基础控制实验的流程图步骤
const ledBasicFlowSteps: FlowStep[] = [
  {
    id: 'step1',
    title: '硬件连接',
    description: '连接LED到GPIO引脚',
    svgElement: '<circle cx="50" cy="50" r="20" fill="#3B82F6"/>',
    animationDelay: 0,
    duration: 1000,
    interactionType: 'auto',
    position: { x: 50, y: 50 }
  },
  {
    id: 'step2',
    title: 'GPIO初始化',
    description: '配置GPIO为输出模式',
    svgElement: '<rect x="150" y="30" width="40" height="40" fill="#10B981"/>',
    animationDelay: 1200,
    duration: 1000,
    interactionType: 'auto',
    position: { x: 150, y: 50 }
  },
  {
    id: 'step3',
    title: '控制LED',
    description: '通过GPIO控制LED亮灭',
    svgElement: '<polygon points="250,30 290,50 250,70" fill="#F59E0B"/>',
    animationDelay: 2400,
    duration: 1000,
    interactionType: 'auto',
    position: { x: 250, y: 50 }
  }
];

// 真实实验数据（基于experiments.yaml）
export const realExperiments: EnhancedExperimentDetail[] = [
  {
    id: 'led_basic',
    name: 'LED基础控制',
    description: '学习使用GPIO控制LED的基本方法',
    purpose: [
      '理解GPIO的基本工作原理',
      '学习配置STM32的GPIO外设',
      '掌握LED控制的基本方法',
      '理解数字输出的概念'
    ],
    principle: {
      theory: 'GPIO（General Purpose Input/Output）是STM32微控制器的通用输入输出端口。通过配置GPIO为输出模式，可以控制外部设备如LED的状态。',
      softwareArchitecture: '程序通过HAL库函数配置GPIO，然后使用HAL_GPIO_WritePin函数控制GPIO输出高低电平。',
      workingMechanism: '当GPIO输出高电平时，LED点亮；输出低电平时，LED熄灭。通过限流电阻保护LED不被烧坏。'
    },
    knowledgePoints: {
      prerequisites: [knowledgePointsLibrary['gpio-basics']],
      core: [knowledgePointsLibrary['gpio-config']],
      extended: []
    },
    flowchart: ledBasicFlowSteps,
    instructions: [
      {
        id: 'inst1',
        title: '硬件连接',
        content: '将LED的正极通过220Ω限流电阻连接到PC13引脚，负极连接到GND',
        order: 1,
        completed: false,
        tips: ['注意LED的极性', '确保使用限流电阻']
      },
      {
        id: 'inst2',
        title: 'GPIO初始化',
        content: '在bsp.c文件中配置PC13为输出模式',
        code: `// 使能GPIOC时钟
__HAL_RCC_GPIOC_CLK_ENABLE();

// 配置GPIO
GPIO_InitTypeDef GPIO_InitStruct = {0};
GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);`,
        order: 2,
        completed: false
      },
      {
        id: 'inst3',
        title: '控制LED',
        content: '使用HAL函数控制LED状态',
        code: `// 点亮LED
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);

// 熄灭LED  
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);`,
        expectedResult: 'LED应该能够正常点亮和熄灭',
        order: 3,
        completed: false
      }
    ],
    directory: '03-1 STM32F103_LED',
    estimatedTime: 30,
    difficulty: 'beginner',
    chipFamily: 'STM32F1',
    chipModel: 'STM32F103ZET6',
    userFiles: [
      'BSP/Src/bsp.c',
      'BSP/Src/LED_direct.c',
      'BSP/Src/LED_indirect.c',
      'BSP/Inc/bsp.h',
      'BSP/Inc/LED_direct.h',
      'BSP/Inc/LED_indirect.h'
    ],
    status: 'not_started',
    progress: 0,
    resources: [
      {
        title: 'STM32F103数据手册',
        url: '/docs/stm32f103-datasheet.pdf',
        type: 'documentation',
        description: 'STM32F103芯片的详细技术规格'
      },
      {
        title: 'GPIO配置视频教程',
        url: '/videos/gpio-config-tutorial.mp4',
        type: 'video',
        description: 'GPIO配置的视频演示'
      }
    ],
    relatedExperiments: ['led_blink', 'led_banner'],
    tags: ['GPIO', 'LED', '基础实验'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];

// 实验列表数据（简化版，用于列表页面）
export const experimentsList: ExperimentListItem[] = [
  {
    id: 'led_basic',
    name: 'LED基础控制',
    description: '学习使用GPIO控制LED的基本方法',
    difficulty: 'beginner',
    estimatedTime: 30,
    status: 'not_started',
    progress: 0,
    tags: ['GPIO', 'LED', '基础实验'],
    category: 'gpio',
    isPopular: true
  },
  {
    id: 'led_blink',
    name: 'LED闪烁控制',
    description: '学习使用延时函数控制LED闪烁',
    difficulty: 'beginner',
    estimatedTime: 45,
    status: 'not_started',
    progress: 0,
    tags: ['GPIO', 'LED', '延时'],
    category: 'gpio'
  },
  {
    id: 'led_banner',
    name: 'LED流水灯',
    description: '学习控制多个LED实现流水灯效果',
    difficulty: 'beginner',
    estimatedTime: 60,
    status: 'not_started',
    progress: 0,
    tags: ['GPIO', 'LED', '流水灯'],
    category: 'gpio'
  },
  {
    id: 'led_breath',
    name: 'LED呼吸灯',
    description: '学习使用PWM控制LED亮度实现呼吸灯效果',
    difficulty: 'intermediate',
    estimatedTime: 75,
    status: 'not_started',
    progress: 0,
    tags: ['PWM', 'LED', '呼吸灯'],
    category: 'timer'
  },
  {
    id: 'key_scan',
    name: '按键扫描',
    description: '学习使用轮询方式检测按键状态',
    difficulty: 'beginner',
    estimatedTime: 60,
    status: 'not_started',
    progress: 0,
    tags: ['GPIO', '按键', '轮询'],
    category: 'gpio'
  },
  {
    id: 'key_interrupt',
    name: '按键中断',
    description: '学习使用中断方式检测按键状态',
    difficulty: 'intermediate',
    estimatedTime: 75,
    status: 'not_started',
    progress: 0,
    tags: ['中断', '按键', 'NVIC'],
    category: 'interrupt'
  },
  {
    id: 'timer_basic',
    name: '定时器基础',
    description: '学习使用定时器实现精确定时',
    difficulty: 'intermediate',
    estimatedTime: 90,
    status: 'not_started',
    progress: 0,
    tags: ['定时器', '精确定时'],
    category: 'timer'
  },
  {
    id: 'timer_pwm',
    name: 'PWM输出',
    description: '学习使用定时器产生PWM信号',
    difficulty: 'intermediate',
    estimatedTime: 90,
    status: 'not_started',
    progress: 0,
    tags: ['PWM', '定时器', '信号生成'],
    category: 'timer'
  },
  {
    id: 'uart_basic',
    name: '串口通信基础',
    description: '学习使用UART进行串口通信',
    difficulty: 'intermediate',
    estimatedTime: 90,
    status: 'not_started',
    progress: 0,
    tags: ['UART', '串口', '通信'],
    category: 'uart'
  },
  {
    id: 'uart_interrupt',
    name: '串口中断收发',
    description: '学习使用中断方式进行串口通信',
    difficulty: 'advanced',
    estimatedTime: 120,
    status: 'not_started',
    progress: 0,
    tags: ['UART', '中断', '通信'],
    category: 'uart'
  },
  {
    id: 'adc_basic',
    name: 'ADC基础',
    description: '学习使用ADC进行模拟量采集',
    difficulty: 'intermediate',
    estimatedTime: 90,
    status: 'not_started',
    progress: 0,
    tags: ['ADC', '模拟量', '采集'],
    category: 'adc'
  },
  {
    id: 'adc_mq2',
    name: 'MQ2气体传感器',
    description: '学习使用ADC读取MQ2气体传感器数据',
    difficulty: 'advanced',
    estimatedTime: 120,
    status: 'not_started',
    progress: 0,
    tags: ['ADC', '传感器', 'MQ2'],
    category: 'sensor',
    isNew: true
  },
  {
    id: 'dac_voltage',
    name: 'DAC电压输出',
    description: '学习使用DAC输出模拟电压',
    difficulty: 'intermediate',
    estimatedTime: 90,
    status: 'not_started',
    progress: 0,
    tags: ['DAC', '模拟量', '电压输出'],
    category: 'dac'
  },
  {
    id: 'dac_wave',
    name: 'DAC波形输出',
    description: '学习使用DAC输出各种波形',
    difficulty: 'advanced',
    estimatedTime: 120,
    status: 'not_started',
    progress: 0,
    tags: ['DAC', '波形', '信号生成'],
    category: 'dac'
  },
  {
    id: 'lcd_display',
    name: 'LCD显示',
    description: '学习使用LCD显示文字和图形',
    difficulty: 'advanced',
    estimatedTime: 150,
    status: 'not_started',
    progress: 0,
    tags: ['LCD', '显示', '图形'],
    category: 'lcd'
  },
  {
    id: 'smart_eco_watch',
    name: '智能生态监测手表',
    description: '综合项目：开发一个可以监测环境参数的智能手表',
    difficulty: 'advanced',
    estimatedTime: 180,
    status: 'not_started',
    progress: 0,
    tags: ['综合项目', '传感器', '显示'],
    category: 'sensor',
    isNew: true
  }
];
