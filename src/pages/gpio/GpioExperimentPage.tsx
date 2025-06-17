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

// 模拟单个 GPIO 实验的详细数据
const getExperimentData = (id: string): ExperimentData | undefined => {
  // 正常通过后端 API 获取数据，这里使用静态数据模拟
  const experiments: Record<string, ExperimentData> = {
    'button-led': {
      id: 'button-led',
      title: '按钮控制 LED',
      description: '学习使用 STM32H7 的 GPIO 实现按钮控制 LED 的基本功能。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/button-led.jpg',
      introduction: `
        STM32H7 系列微控制器提供了丰富的 GPIO（通用输入输出）功能，可用于实现各种输入输出控制。
        本实验将教你如何配置和使用 STM32 的 GPIO，实现按钮控制 LED 的基本功能。
      `,
      objectives: [
        '理解 GPIO 的基本工作原理和特性',
        '学习配置 STM32 的 GPIO 引脚',
        '实现按钮输入检测',
        '掌握 LED 输出控制',
        '学习基本的输入输出编程'
      ],
      materials: [
        'STM32H7 系列开发板',
        '面包板和连接线',
        'LED 指示灯',
        '按钮开关',
        '电阻（220Ω）'
      ],
      theory: `
        <h4>GPIO 基础知识</h4>
        <p>
          STM32 的 GPIO 是一种通用输入输出接口，具有以下特点：
        </p>
        <ul>
          <li>多种工作模式：输入、输出、复用功能、模拟</li>
          <li>可配置的上拉/下拉电阻</li>
          <li>可配置的输出速度</li>
          <li>可配置的输出类型（推挽/开漏）</li>
          <li>支持中断功能</li>
        </ul>

        <h4>GPIO 工作模式</h4>
        <p>
          STM32 GPIO 支持以下主要工作模式：
        </p>
        <ul>
          <li>输入模式：用于读取外部信号</li>
          <li>输出模式：用于控制外部设备</li>
          <li>复用功能：用于外设功能</li>
          <li>模拟模式：用于模拟功能</li>
        </ul>

        <h4>GPIO 配置参数</h4>
        <p>
          配置 GPIO 时需要考虑以下参数：
        </p>
        <ul>
          <li>模式：输入/输出/复用/模拟</li>
          <li>上拉/下拉：是否启用内部上拉或下拉电阻</li>
          <li>速度：输出速度设置</li>
          <li>输出类型：推挽或开漏</li>
          <li>中断：是否启用中断功能</li>
        </ul>
      `,
      steps: [
        {
          title: '配置 GPIO 时钟',
          content: `
            首先配置 GPIO 的时钟源：
          `,
          code: `
// 使能 GPIO 时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;  // 使能 GPIOA 时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOBEN;  // 使能 GPIOB 时钟

// 等待 GPIO 时钟稳定
while (!(RCC->AHB4ENR & RCC_AHB4ENR_GPIOAEN));
while (!(RCC->AHB4ENR & RCC_AHB4ENR_GPIOBEN));
          `
        },
        {
          title: '配置 LED 引脚',
          content: `
            配置 LED 引脚为输出模式：
          `,
          code: `
// 配置 LED 引脚（PA5）为输出模式
GPIOA->MODER &= ~GPIO_MODER_MODE5;    // 清除模式位
GPIOA->MODER |= GPIO_MODER_MODE5_0;   // 设置为输出模式

// 配置输出类型为推挽输出
GPIOA->OTYPER &= ~GPIO_OTYPER_OT5;    // 设置为推挽输出

// 配置输出速度为高速
GPIOA->OSPEEDR &= ~GPIO_OSPEEDR_OSPEED5;
GPIOA->OSPEEDR |= GPIO_OSPEEDR_OSPEED5_0;

// 配置无上拉/下拉
GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD5;    // 无上拉/下拉
          `
        },
        {
          title: '配置按钮引脚',
          content: `
            配置按钮引脚为输入模式：
          `,
          code: `
// 配置按钮引脚（PB0）为输入模式
GPIOB->MODER &= ~GPIO_MODER_MODE0;    // 设置为输入模式

// 配置上拉电阻
GPIOB->PUPDR &= ~GPIO_PUPDR_PUPD0;    // 清除上拉/下拉位
GPIOB->PUPDR |= GPIO_PUPDR_PUPD0_0;   // 设置为上拉
          `
        },
        {
          title: '读取按钮状态',
          content: `
            读取按钮状态并控制 LED：
          `,
          code: `
// 读取按钮状态
uint8_t buttonState = (GPIOB->IDR & GPIO_IDR_ID0) ? 0 : 1;

// 根据按钮状态控制 LED
if (buttonState) {
  GPIOA->BSRR = GPIO_BSRR_BS5;  // 设置 LED 为高电平
} else {
  GPIOA->BSRR = GPIO_BSRR_BR5;  // 设置 LED 为低电平
}
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的按钮控制 LED 示例代码：
          `,
          code: `
#include "stm32h7xx.h"

// 函数声明
void SystemClock_Config(void);
void GPIO_Init(void);
uint8_t ReadButton(void);
void SetLED(uint8_t state);

int main(void)
{
  // 系统时钟配置
  SystemClock_Config();
  
  // 初始化 GPIO
  GPIO_Init();
  
  while (1)
  {
    // 读取按钮状态并控制 LED
    SetLED(ReadButton());
  }
}

void GPIO_Init(void)
{
  // 使能 GPIO 时钟
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOBEN;
  
  // 等待 GPIO 时钟稳定
  while (!(RCC->AHB4ENR & RCC_AHB4ENR_GPIOAEN));
  while (!(RCC->AHB4ENR & RCC_AHB4ENR_GPIOBEN));
  
  // 配置 LED 引脚（PA5）
  GPIOA->MODER &= ~GPIO_MODER_MODE5;
  GPIOA->MODER |= GPIO_MODER_MODE5_0;
  GPIOA->OTYPER &= ~GPIO_OTYPER_OT5;
  GPIOA->OSPEEDR &= ~GPIO_OSPEEDR_OSPEED5;
  GPIOA->OSPEEDR |= GPIO_OSPEEDR_OSPEED5_0;
  GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD5;
  
  // 配置按钮引脚（PB0）
  GPIOB->MODER &= ~GPIO_MODER_MODE0;
  GPIOB->PUPDR &= ~GPIO_PUPDR_PUPD0;
  GPIOB->PUPDR |= GPIO_PUPDR_PUPD0_0;
}

uint8_t ReadButton(void)
{
  // 读取按钮状态（低电平有效）
  return (GPIOB->IDR & GPIO_IDR_ID0) ? 0 : 1;
}

void SetLED(uint8_t state)
{
  if (state) {
    GPIOA->BSRR = GPIO_BSRR_BS5;  // 点亮 LED
  } else {
    GPIOA->BSRR = GPIO_BSRR_BR5;  // 熄灭 LED
  }
}
          `
        }
      ]
    }
  };

  return experiments[id];
};

const GpioExperimentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [experiment, setExperiment] = useState<ExperimentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadExperiment = async () => {
      if (!id) return;

      setIsLoading(true);
      setError('');

      try {
        const data = getExperimentData(id);
        if (data) {
          setExperiment(data);
        } else {
          setError('未找到实验数据');
        }
      } catch (err) {
        setError('加载实验数据失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExperiment();
  }, [id]);

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/experiments" className="text-primary-500 hover:text-primary-600">
          返回实验列表
        </Link>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl mb-4">未找到实验数据</div>
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

export default GpioExperimentPage; 