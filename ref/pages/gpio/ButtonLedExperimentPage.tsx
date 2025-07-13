import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ExperimentStep {
  title: string;
  content: string;
  code: string;
}

interface ExperimentData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  introduction: string;
  objectives: string[];
  materials: string[];
  theory: string;
  steps: ExperimentStep[];
}

// 模拟按钮 LED 实验的详细数据
const getExperimentData = (): ExperimentData => ({
  id: 'button-led',
  title: '按钮 LED 实验',
  description: '学习使用 STM32H7 的 GPIO 实现按钮控制 LED 的亮灭。',
  difficulty: 'beginner',
  thumbnail: '/images/experiments/button-led.jpg',
  introduction: `
    本实验将带你学习如何通过 STM32H7 的 GPIO 实现按钮控制 LED 的亮灭，掌握按钮输入和 LED 输出的基本操作。
  `,
  objectives: [
    '理解按钮输入和 LED 输出的工作原理',
    '掌握按钮消抖和状态检测',
    '学习使用 GPIO 实现按钮控制 LED',
    '熟悉 LED 的亮灭控制'
  ],
  materials: [
    'STM32H7 系列开发板',
    '面包板和连接线',
    '按钮',
    'LED 指示灯',
    '电阻（220Ω）'
  ],
  theory: `
    <h4>按钮输入工作原理</h4>
    <p>按钮通过按下和释放改变 GPIO 引脚的电平状态，通常使用上拉电阻确保未按下时为高电平。</p>
    <ul>
      <li>按钮按下时，引脚接地，电平为低</li>
      <li>按钮释放时，引脚通过上拉电阻保持高电平</li>
    </ul>
    <h4>LED 输出控制</h4>
    <p>通过控制 GPIO 引脚的高低电平来控制 LED 的亮灭。</p>
  `,
  steps: [
    {
      title: '配置 GPIO 引脚',
      content: '将按钮引脚配置为输入，LED 引脚配置为输出。',
      code: `// 使能 GPIOA 时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;

// 配置按钮引脚（PA0）为输入，启用上拉
GPIOA->MODER &= ~GPIO_MODER_MODE0;
GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD0;
GPIOA->PUPDR |= GPIO_PUPDR_PUPD0_0;

// 配置 LED 引脚（PA1）为输出
GPIOA->MODER &= ~GPIO_MODER_MODE1;
GPIOA->MODER |= GPIO_MODER_MODE1_0;
GPIOA->OTYPER &= ~GPIO_OTYPER_OT1;
GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD1;
`
    },
    {
      title: '按钮消抖处理',
      content: '通过延时消除按钮抖动，确保按钮状态稳定。',
      code: `uint8_t GetButtonState(void) {
  if (!(GPIOA->IDR & (1 << 0))) { // 按钮按下
    HAL_Delay(10); // 消抖延时
    if (!(GPIOA->IDR & (1 << 0))) {
      return 1; // 按钮确实按下
    }
  }
  return 0; // 按钮未按下
}`
    },
    {
      title: 'LED 控制',
      content: '根据按钮状态控制 LED 的亮灭。',
      code: `void ControlLED(uint8_t state) {
  if (state) {
    GPIOA->BSRR = (1 << 1); // 点亮 LED
  } else {
    GPIOA->BSRR = (1 << 17); // 熄灭 LED
  }
}`
    },
    {
      title: '完整示例代码',
      content: '下面是一个按钮 LED 实验的完整示例代码：',
      code: `#include "stm32h7xx.h"

void SystemClock_Config(void);
void GPIO_Init(void);
uint8_t GetButtonState(void);
void ControlLED(uint8_t state);

int main(void) {
  SystemClock_Config();
  GPIO_Init();
  while (1) {
    uint8_t buttonState = GetButtonState();
    ControlLED(buttonState);
  }
}

void GPIO_Init(void) {
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;
  GPIOA->MODER &= ~GPIO_MODER_MODE0;
  GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD0;
  GPIOA->PUPDR |= GPIO_PUPDR_PUPD0_0;
  GPIOA->MODER &= ~GPIO_MODER_MODE1;
  GPIOA->MODER |= GPIO_MODER_MODE1_0;
  GPIOA->OTYPER &= ~GPIO_OTYPER_OT1;
  GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD1;
}

uint8_t GetButtonState(void) {
  if (!(GPIOA->IDR & (1 << 0))) {
    HAL_Delay(10);
    if (!(GPIOA->IDR & (1 << 0))) {
      return 1;
    }
  }
  return 0;
}

void ControlLED(uint8_t state) {
  if (state) {
    GPIOA->BSRR = (1 << 1);
  } else {
    GPIOA->BSRR = (1 << 17);
  }
}`
    }
  ]
});

const ButtonLedExperimentPage: React.FC = () => {
  const [experiment, setExperiment] = useState<ExperimentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    setError('');
    try {
      const data = getExperimentData();
      setExperiment(data);
    } catch (err) {
      setError('加载实验数据失败');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDifficultyBadge = (difficulty: string): JSX.Element => {
    const badges = {
      beginner: { color: 'bg-green-100 text-green-800', text: '入门' },
      intermediate: { color: 'bg-yellow-100 text-yellow-800', text: '中级' },
      advanced: { color: 'bg-red-100 text-red-800', text: '高级' }
    };
    const badge = badges[difficulty as keyof typeof badges] || badges.beginner;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !experiment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error || '未找到实验数据'}</div>
        <Link to="/experiments" className="text-primary-500 hover:text-primary-600">
          返回实验列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 实验标题和难度 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{experiment.title}</h1>
        {getDifficultyBadge(experiment.difficulty)}
      </div>
      {/* 实验描述 */}
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-600">{experiment.description}</p>
      </div>
      {/* 实验内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧内容 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 实验介绍 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">实验介绍</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: experiment.introduction }} />
          </div>
          {/* 实验目标 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">实验目标</h2>
            <ul className="list-disc list-inside space-y-2">
              {experiment.objectives.map((objective, index) => (
                <li key={index} className="text-gray-600">{objective}</li>
              ))}
            </ul>
          </div>
          {/* 实验步骤 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">实验步骤</h2>
            <div className="space-y-6">
              {experiment.steps.map((step, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
                  <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 右侧边栏 */}
        <div className="space-y-8">
          {/* 实验材料 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">实验材料</h2>
            <ul className="list-disc list-inside space-y-2">
              {experiment.materials.map((material, index) => (
                <li key={index} className="text-gray-600">{material}</li>
              ))}
            </ul>
          </div>
          {/* 理论知识 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">理论知识</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: experiment.theory }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonLedExperimentPage; 