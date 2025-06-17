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

// 模拟矩阵键盘接口实验的详细数据
const getExperimentData = (): ExperimentData => ({
  id: 'keypad-interfacing',
  title: '矩阵键盘接口',
  description: '学习使用 STM32H7 的 GPIO 实现矩阵键盘的扫描和读取。',
  difficulty: 'advanced',
  thumbnail: '/images/experiments/keypad.jpg',
  introduction: `
    本实验将带你学习如何通过 STM32H7 的 GPIO 实现矩阵键盘的扫描和读取，掌握行列扫描法检测按键输入。
  `,
  objectives: [
    '理解矩阵键盘的工作原理',
    '掌握行列扫描法检测按键',
    '学习使用 GPIO 实现矩阵键盘接口',
    '熟悉按键消抖和状态检测'
  ],
  materials: [
    'STM32H7 系列开发板',
    '面包板和连接线',
    '4x4 矩阵键盘',
    '电阻（10kΩ）'
  ],
  theory: `
    <h4>矩阵键盘工作原理</h4>
    <p>矩阵键盘通过行列交叉点连接按键，通过行列扫描法检测按键状态。</p>
    <ul>
      <li>行引脚配置为输出，列引脚配置为输入</li>
      <li>依次将每行置为低电平，检测列引脚状态</li>
      <li>当检测到列引脚为低电平时，表示该行列交叉点有按键按下</li>
    </ul>
    <h4>按键消抖</h4>
    <p>按键在按下和释放时会产生抖动，需要通过延时或滤波消除抖动影响。</p>
  `,
  steps: [
    {
      title: '配置 GPIO 引脚',
      content: '将行引脚配置为输出，列引脚配置为输入，并启用上拉电阻。',
      code: `// 使能 GPIOA 和 GPIOB 时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOBEN;

// 配置行引脚（PA0~PA3）为输出
GPIOA->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2 | GPIO_MODER_MODE3);
GPIOA->MODER |= (GPIO_MODER_MODE0_0 | GPIO_MODER_MODE1_0 | GPIO_MODER_MODE2_0 | GPIO_MODER_MODE3_0);
GPIOA->OTYPER &= ~(GPIO_OTYPER_OT0 | GPIO_OTYPER_OT1 | GPIO_OTYPER_OT2 | GPIO_OTYPER_OT3);
GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2 | GPIO_PUPDR_PUPD3);

// 配置列引脚（PB0~PB3）为输入，启用上拉
GPIOB->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2 | GPIO_MODER_MODE3);
GPIOB->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2 | GPIO_PUPDR_PUPD3);
GPIOB->PUPDR |= (GPIO_PUPDR_PUPD0_0 | GPIO_PUPDR_PUPD1_0 | GPIO_PUPDR_PUPD2_0 | GPIO_PUPDR_PUPD3_0);
`
    },
    {
      title: '实现行列扫描',
      content: '依次将每行置为低电平，检测列引脚状态，判断按键是否按下。',
      code: `uint8_t ScanKeypad(void) {
  uint8_t row, col;
  for (row = 0; row < 4; row++) {
    // 将当前行置为低电平
    GPIOA->BSRR = (1 << (row + 16));
    // 检测列引脚状态
    for (col = 0; col < 4; col++) {
      if (!(GPIOB->IDR & (1 << col))) {
        // 按键按下，返回按键值
        return row * 4 + col;
      }
    }
    // 恢复当前行为高电平
    GPIOA->BSRR = (1 << row);
  }
  return 0xFF; // 无按键按下
}`
    },
    {
      title: '按键消抖处理',
      content: '通过延时消除按键抖动，确保按键状态稳定。',
      code: `uint8_t GetKey(void) {
  uint8_t key = ScanKeypad();
  if (key != 0xFF) {
    HAL_Delay(10); // 消抖延时
    if (ScanKeypad() == key) {
      return key;
    }
  }
  return 0xFF;
}`
    },
    {
      title: '完整示例代码',
      content: '下面是一个矩阵键盘接口的完整示例代码：',
      code: `#include "stm32h7xx.h"

void SystemClock_Config(void);
void GPIO_Init(void);
uint8_t ScanKeypad(void);
uint8_t GetKey(void);

int main(void) {
  SystemClock_Config();
  GPIO_Init();
  while (1) {
    uint8_t key = GetKey();
    if (key != 0xFF) {
      // 处理按键输入
      // 例如：点亮对应 LED 或发送按键值
    }
  }
}

void GPIO_Init(void) {
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOBEN;
  GPIOA->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2 | GPIO_MODER_MODE3);
  GPIOA->MODER |= (GPIO_MODER_MODE0_0 | GPIO_MODER_MODE1_0 | GPIO_MODER_MODE2_0 | GPIO_MODER_MODE3_0);
  GPIOA->OTYPER &= ~(GPIO_OTYPER_OT0 | GPIO_OTYPER_OT1 | GPIO_OTYPER_OT2 | GPIO_OTYPER_OT3);
  GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2 | GPIO_PUPDR_PUPD3);
  GPIOB->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2 | GPIO_MODER_MODE3);
  GPIOB->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2 | GPIO_PUPDR_PUPD3);
  GPIOB->PUPDR |= (GPIO_PUPDR_PUPD0_0 | GPIO_PUPDR_PUPD1_0 | GPIO_PUPDR_PUPD2_0 | GPIO_PUPDR_PUPD3_0);
}

uint8_t ScanKeypad(void) {
  uint8_t row, col;
  for (row = 0; row < 4; row++) {
    GPIOA->BSRR = (1 << (row + 16));
    for (col = 0; col < 4; col++) {
      if (!(GPIOB->IDR & (1 << col))) {
        return row * 4 + col;
      }
    }
    GPIOA->BSRR = (1 << row);
  }
  return 0xFF;
}

uint8_t GetKey(void) {
  uint8_t key = ScanKeypad();
  if (key != 0xFF) {
    HAL_Delay(10);
    if (ScanKeypad() == key) {
      return key;
    }
  }
  return 0xFF;
}`
    }
  ]
});

const KeypadInterfacingExperimentPage: React.FC = () => {
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

export default KeypadInterfacingExperimentPage; 