import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function GpioExperimentPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  
  // 实验数据
  const experiment = {
    id: 'led-blinking',
    title: 'LED闪烁控制',
    description: '学习配置基本GPIO输出模式，调整LED闪烁频率，掌握STM32嵌入式 GPIO编程的基础。',
    difficulty: 'beginner',
    thumbnail: '/images/experiments/led-blinking.jpg',
    introduction: `
      LED闪烁是嵌入式系统中最简单也最常见的应用之一。本实验将教你如何使用STM32嵌入式的GPIO控制
      单个LED的亮灭，并实现不同频率的闪烁效果。通过本实验，你将掌握GPIO的基本配置和操作方法。
    `,
    objectives: [
      '理解STM32嵌入式的GPIO外设结构和工作原理',
      '学习配置GPIO为推挽输出模式',
      '实现LED的基本控制（亮/灭）',
      '实现LED以不同频率闪烁',
      '掌握使用延时函数进行定时的方法'
    ],
    materials: [
      'STM32嵌入式系列开发板（如STM32F4、STM32G0或STM32L4系列）',
      'LED灯（推荐使用不同颜色的LED）',
      '限流电阻（220欧-1k欧）',
      '连接导线',
      '面包板（可选）',
      'USB线（连接开发板与电脑）'
    ],
    theory: `
      <h4>GPIO基础知识</h4>
      <p>
        GPIO（通用输入/输出端口）是微控制器的基础外设，用于控制或获取引脚的电平状态。
        STM32嵌入式的GPIO端口有多种功能模式，包括：
      </p>
      <ul>
        <li>输入模式：用于读取外部信号</li>
        <li>输出模式：用于控制外部设备</li>
        <li>复用功能：将GPIO引脚连接到其他内部外设</li>
        <li>模拟模式：用于模拟信号输入/输出</li>
      </ul>
      
      <h4>GPIO输出模式</h4>
      <p>
        在本实验中，我们将使用GPIO的输出模式。输出模式分为推挽输出和开漏输出：
      </p>
      <ul>
        <li>推挽输出：能够提供高电平（接近VDD）和低电平（接近GND）</li>
        <li>开漏输出：只能提供低电平，高电平需通过外部上拉电阻</li>
      </ul>
      
      <h4>STM32嵌入式 GPIO寄存器</h4>
      <p>
        控制GPIO的主要寄存器包括：
      </p>
      <ul>
        <li>GPIOx_MODER：配置引脚的功能模式（输入、输出、复用或模拟）</li>
        <li>GPIOx_OTYPER：配置输出类型（推挽或开漏）</li>
        <li>GPIOx_OSPEEDR：配置输出速度</li>
        <li>GPIOx_PUPDR：配置上拉/下拉电阻</li>
        <li>GPIOx_ODR：输出数据寄存器，用于控制引脚输出电平</li>
        <li>GPIOx_BSRR：位设置/复位寄存器，允许原子操作设置或清除特定位</li>
      </ul>
    `,
    steps: [
      {
        title: '准备硬件连接',
        content: `
          <ol>
            <li>将LED阳极通过限流电阻连接到开发板GPIO引脚（本实验使用PE1引脚）</li>
            <li>将LED阴极连接到开发板GND引脚</li>
            <li>确保连接正确以防止短路</li>
          </ol>
          <div class="mt-4">
            <img src="/images/experiments/led-connection.png" alt="LED连接图" class="max-w-md mx-auto rounded-lg shadow-md" />
          </div>
        `
      },
      {
        title: '配置时钟和GPIO',
        content: `
          首先需要启用GPIOE的时钟，并配置PE1为推挽输出模式：
        `,
        code: `
// 启用GPIOE时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOEEN;

// 配置PE1为推挽输出模式
// 清除PE1的模式位
GPIOE->MODER &= ~(GPIO_MODER_MODE1);
// 设置PE1为输出模式 (01)
GPIOE->MODER |= GPIO_MODER_MODE1_0;

// 设置为推挽输出（默认，可以不写）
GPIOE->OTYPER &= ~(GPIO_OTYPER_OT1);

// 设置输出速度为高速
GPIOE->OSPEEDR |= GPIO_OSPEEDR_OSPEED1;

// 不使用上拉或下拉电阻
GPIOE->PUPDR &= ~(GPIO_PUPDR_PUPD1);
        `
      },
      {
        title: '控制LED的基本操作',
        content: `
          通过设置输出数据寄存器(ODR)的对应位控制LED亮灭：
        `,
        code: `
// 点亮LED（设置PE1为高电平）
GPIOE->ODR |= GPIO_ODR_ODR1;
// 或者使用BSRR寄存器
// GPIOE->BSRR = GPIO_BSRR_BS1;

// 熄灭LED（设置PE1为低电平）
GPIOE->ODR &= ~(GPIO_ODR_ODR1);
// 或者使用BSRR寄存器
// GPIOE->BSRR = GPIO_BSRR_BR1;
        `
      },
      {
        title: '实现LED闪烁',
        content: `
          通过循环和延时函数实现LED闪烁效果：
        `,
        code: `
void delay_ms(uint32_t ms) {
  // 简单的延时函数，真实项目应使用定时器或系统时钟
  uint32_t i;
  for (i = 0; i < ms * 10000; i++) {
    __NOP(); // 空操作指令
  }
}

int main(void) {
  // 系统初始化代码...
  
  // 启用GPIOE时钟
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOEEN;
  
  // 配置PE1为输出引脚
  GPIOE->MODER &= ~(GPIO_MODER_MODE1);
  GPIOE->MODER |= GPIO_MODER_MODE1_0;
  
  while (1) {
    // 点亮LED
    GPIOE->BSRR = GPIO_BSRR_BS1;
    delay_ms(500); // 延时500ms
    
    // 熄灭LED
    GPIOE->BSRR = GPIO_BSRR_BR1;
    delay_ms(500); // 延时500ms
  }
}
        `
      },
      {
        title: '调整闪烁频率',
        content: `
          通过改变延时时间，可以调整LED闪烁的频率：
        `,
        code: `
// 快速闪烁 (200ms)
void fast_blink(void) {
  GPIOE->BSRR = GPIO_BSRR_BS1;
  delay_ms(100);
  GPIOE->BSRR = GPIO_BSRR_BR1;
  delay_ms(100);
}

// 中速闪烁 (500ms)
void medium_blink(void) {
  GPIOE->BSRR = GPIO_BSRR_BS1;
  delay_ms(250);
  GPIOE->BSRR = GPIO_BSRR_BR1;
  delay_ms(250);
}

// 慢速闪烁 (1000ms)
void slow_blink(void) {
  GPIOE->BSRR = GPIO_BSRR_BS1;
  delay_ms(500);
  GPIOE->BSRR = GPIO_BSRR_BR1;
  delay_ms(500);
}

int main(void) {
  // 初始化代码...
  
  while (1) {
    // 快速闪烁10次
    for (int i = 0; i < 10; i++) {
      fast_blink();
    }
    
    // 中速闪烁5次
    for (int i = 0; i < 5; i++) {
      medium_blink();
    }
    
    // 慢速闪烁3次
    for (int i = 0; i < 3; i++) {
      slow_blink();
    }
  }
}
        `
      },
      {
        title: '使用HAL库简化开发',
        content: `
          使用STM32 HAL库可以大大简化GPIO操作：
        `,
        code: `
#include "main.h"

int main(void) {
  // 系统初始化
  HAL_Init();
  SystemClock_Config();
  
  // 初始化GPIO
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  
  __HAL_RCC_GPIOE_CLK_ENABLE();
  
  GPIO_InitStruct.Pin = GPIO_PIN_1;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);
  
  while (1) {
    // 点亮LED
    HAL_GPIO_WritePin(GPIOE, GPIO_PIN_1, GPIO_PIN_SET);
    HAL_Delay(500);
    
    // 熄灭LED
    HAL_GPIO_WritePin(GPIOE, GPIO_PIN_1, GPIO_PIN_RESET);
    HAL_Delay(500);
  }
}
        `
      }
    ],
    challenges: [
      '修改代码，实现LED的呼吸灯效果（逐渐变亮，再逐渐变暗）',
      '添加多个LED，实现流水灯效果',
      '设计一个特定模式的闪烁序列（如摩尔斯电码）',
      '使用按钮来改变LED闪烁的频率或模式',
      '结合中断实现更精确的LED闪烁时间控制'
    ],
    resourceLinks: [
      {
        title: 'STM32嵌入式参考手册',
        url: 'https://www.st.com/resource/en/reference_manual/dm00176879-stm32h745755-and-stm32h747757-advanced-armbased-32bit-mcus-stmicroelectronics.pdf',
        type: 'documentation'
      },
      {
        title: 'GPIO编程指南',
        url: 'https://www.st.com/content/ccc/resource/technical/document/application_note/a9/86/85/18/49/d7/4c/1f/DM00052151.pdf/files/DM00052151.pdf/jcr:content/translations/en.DM00052151.pdf',
        type: 'documentation'
      },
      {
        title: 'HAL库使用教程',
        url: 'https://www.st.com/resource/en/user_manual/dm00154093-description-of-stm32f7-hal-and-lowlayer-drivers-stmicroelectronics.pdf',
        type: 'tutorial'
      }
    ],
    aiCodingTest: {
      title: 'LED控制模式编程测试',
      description: '使用AI编写一个函数，根据用户输入的模式参数控制LED闪烁方式',
      tasks: [
        '创建一个函数，能够根据参数设置不同的LED闪烁模式',
        '实现至少三种不同的闪烁模式：常亮、闪烁和SOS信号',
        '使用HAL库简化GPIO操作',
        '为代码添加适当的注释和错误处理'
      ],
      functionTemplate: `
/**
 * @brief  设置LED闪烁模式
 * @param  GPIOX: GPIO端口
 * @param  GPIO_Pin: GPIO引脚
 * @param  mode: 闪烁模式 (0:常亮, 1:闪烁, 2:SOS信号)
 * @retval 操作结果 (0:成功, -1:失败)
 */
int32_t LED_SetBlinkMode(GPIO_TypeDef* GPIOX, uint16_t GPIO_Pin, uint8_t mode) {
  // 在此编写实现代码
}
      `,
      hints: [
        'SOS信号为国际通用求救信号，由3短闪烁、3长闪烁、3短闪烁组成',
        '使用HAL_Delay()函数实现延时',
        '使用HAL_GPIO_WritePin()函数控制LED状态',
        '考虑使用switch-case结构处理不同的模式'
      ]
    },
    createdAt: '2023-11-01',
    updatedAt: '2024-03-15',
  };

  // 格式化页面标题
  useEffect(() => {
    document.title = `${experiment.title} - STM32嵌入式 AI辅助学习平台`;
  }, []);

  // 根据难度返回不同的颜色和标签文本
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return { color: 'bg-green-100 text-green-800', text: '初学者' };
      case 'intermediate':
        return { color: 'bg-blue-100 text-blue-800', text: '中级' };
      case 'advanced':
        return { color: 'bg-purple-100 text-purple-800', text: '高级' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: '未知' };
    }
  };
  
  const badge = getDifficultyBadge(experiment.difficulty);
  
  const [aiSolution, setAiSolution] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // 生成AI解决方案
  const generateAiSolution = () => {
    setIsGenerating(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      const solution = `
/**
 * @brief  设置LED闪烁模式
 * @param  GPIOX: GPIO端口
 * @param  GPIO_Pin: GPIO引脚
 * @param  mode: 闪烁模式 (0:常亮, 1:闪烁, 2:SOS信号)
 * @retval 操作结果 (0:成功, -1:失败)
 */
int32_t LED_SetBlinkMode(GPIO_TypeDef* GPIOX, uint16_t GPIO_Pin, uint8_t mode) {
  // 参数检查
  if (GPIOX == NULL || GPIO_Pin == 0) {
    return -1; // 无效的参数
  }
  
  switch (mode) {
    case 0: // 常亮模式
      HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_SET);
      break;
      
    case 1: // 闪烁模式 (500ms间隔)
      for (int i = 0; i < 10; i++) { // 闪烁10次
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_SET);
        HAL_Delay(500);
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_RESET);
        HAL_Delay(500);
      }
      break;
      
    case 2: // SOS信号模式
      // 3短闪 (S)
      for (int i = 0; i < 3; i++) {
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_SET);
        HAL_Delay(200);
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_RESET);
        HAL_Delay(200);
      }
      HAL_Delay(400); // 短暂停顿
      
      // 3长闪 (O)
      for (int i = 0; i < 3; i++) {
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_SET);
        HAL_Delay(600);
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_RESET);
        HAL_Delay(200);
      }
      HAL_Delay(400); // 短暂停顿
      
      // 3短闪 (S)
      for (int i = 0; i < 3; i++) {
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_SET);
        HAL_Delay(200);
        HAL_GPIO_WritePin(GPIOX, GPIO_Pin, GPIO_PIN_RESET);
        HAL_Delay(200);
      }
      break;
      
    default:
      return -1; // 不支持的模式
  }
  
  return 0; // 操作成功
}

// 函数使用示例:
void Example_Usage(void) {
  // 初始化GPIO
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  
  __HAL_RCC_GPIOE_CLK_ENABLE();
  
  GPIO_InitStruct.Pin = GPIO_PIN_1;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);
  
  // 设置为SOS信号模式
  LED_SetBlinkMode(GPIOE, GPIO_PIN_1, 2);
}
      `;
      
      setAiSolution(solution);
      setIsGenerating(false);
    }, 2000);
  };
  
  // 生成实验报告
  const generateReport = () => {
    setReportGenerated(true);
    // 实际应用中，这里可以生成PDF或调用报告生成服务
  };

  return (
    <div className="py-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Link to="/gpio/experiments" className="text-primary-600 hover:underline mr-3">
            &larr; 返回GPIO实验列表
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold">{experiment.title}</h1>
          <span className={`mt-2 md:mt-0 text-sm px-3 py-1 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        </div>
        <p className="text-gray-600 mt-2">{experiment.description}</p>
      </div>
      
      {/* 导航标签 */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('introduction')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'introduction' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            简介
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'theory' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            理论知识
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'steps' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            实验步骤
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'challenges' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            挑战任务
          </button>
          <button
            onClick={() => setActiveTab('ai-test')}
            className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'ai-test' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            AI编程测验
          </button>
        </nav>
      </div>
      
      {/* 内容区域 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'introduction' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">实验介绍</h2>
            <div className="mb-6 text-gray-700">
              {experiment.introduction}
            </div>
            
            <h3 className="text-xl font-semibold mb-3">实验目标</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              {experiment.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">所需材料</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {experiment.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'theory' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">理论知识</h2>
            <div 
              className="prose max-w-none text-gray-700" 
              dangerouslySetInnerHTML={{ __html: experiment.theory }}
            />
          </div>
        )}
        
        {activeTab === 'steps' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">实验步骤</h2>
            <div className="space-y-12">
              {experiment.steps.map((step, index) => (
                <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <div 
                    className="prose max-w-none ml-14 mb-4 text-gray-700" 
                    dangerouslySetInnerHTML={{ __html: step.content }}
                  />
                  {step.code && (
                    <div className="ml-14 bg-gray-800 text-white p-4 rounded-md">
                      <pre className="text-sm overflow-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'challenges' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">挑战任务</h2>
            <p className="mb-4 text-gray-700">
              完成以下挑战任务，巩固和拓展您的知识：
            </p>
            <div className="space-y-4">
              {experiment.challenges.map((challenge, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold">挑战 {index + 1}:</h3>
                  <p className="text-gray-700">{challenge}</p>
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">参考资源</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.resourceLinks.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{resource.title}</div>
                    <div className="text-sm text-gray-500">{resource.type}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'ai-test' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">AI编程测验</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-2">{experiment.aiCodingTest.title}</h3>
              <p className="text-gray-700 mb-4">{experiment.aiCodingTest.description}</p>
              
              <h4 className="font-semibold mb-2">任务要求：</h4>
              <ul className="list-disc pl-6 mb-6 space-y-1 text-gray-700">
                {experiment.aiCodingTest.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              
              <h4 className="font-semibold mb-2">函数模板：</h4>
              <div className="bg-gray-800 text-white p-4 rounded-md mb-4">
                <pre className="text-sm overflow-auto">
                  <code>{experiment.aiCodingTest.functionTemplate}</code>
                </pre>
              </div>
              
              <h4 className="font-semibold mb-2">提示：</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
                {experiment.aiCodingTest.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
              
              <button
                onClick={generateAiSolution}
                disabled={isGenerating || aiSolution}
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                  isGenerating || aiSolution 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isGenerating ? '生成中...' : aiSolution ? '查看AI解决方案' : '使用AI生成解决方案'}
              </button>
            </div>
            
            {aiSolution && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">AI生成的解决方案</h3>
                <div className="bg-gray-800 text-white p-4 rounded-md">
                  <pre className="text-sm overflow-auto">
                    <code>{aiSolution}</code>
                  </pre>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">实验报告</h3>
                  <p className="text-gray-700 mb-4">
                    生成一份包含代码实现和分析的实验报告，可用于课程提交或个人学习记录。
                  </p>
                  <button
                    onClick={generateReport}
                    disabled={reportGenerated}
                    className={`px-4 py-2 rounded-md text-white ${
                      reportGenerated 
                        ? 'bg-green-500' 
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    {reportGenerated ? '报告已生成' : '生成实验报告'}
                  </button>
                  
                  {reportGenerated && (
                    <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        实验报告已生成！您可以在"我的实验报告"页面查看或下载。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 页面底部导航 */}
      <div className="mt-8 flex justify-between">
        <Link 
          to="/gpio/experiments" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回实验列表
        </Link>
        <Link 
          to="/gpio/experiments/button-led" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          下一个实验：按钮控制LED
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default GpioExperimentPage; 