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

// 模拟单个定时器实验的详细数据
const getExperimentData = (id: string): ExperimentData | undefined => {
  // 正常通过后端API获取数据，这里使用静态数据模拟
  const experiments: Record<string, ExperimentData> = {
    'timer-basic': {
      id: 'timer-basic',
      title: '定时器基础应用',
      description: '学习配置STM32H7的定时器进行基本的定时和计数功能，包括定时中断和PWM输出。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/timer-basic.jpg',
      introduction: `
        STM32H7系列微控制器提供了多个功能强大的定时器外设，可用于实现定时、计数、PWM输出等功能。
        本实验将教你如何配置和使用STM32的定时器，实现基本的定时功能。
      `,
      objectives: [
        '理解定时器的基本工作原理和特性',
        '学习配置STM32的定时器外设',
        '实现基本的定时中断功能',
        '掌握定时器的计数模式',
        '学习使用定时器生成PWM波形'
      ],
      materials: [
        'STM32H7系列开发板',
        'LED指示灯',
        '示波器（可选）',
        '面包板和连接线',
        '电阻（220Ω）'
      ],
      theory: `
        <h4>定时器基础知识</h4>
        <p>
          STM32的定时器是一种多功能外设，具有以下特点：
        </p>
        <ul>
          <li>多种工作模式：定时、计数、PWM、输入捕获等</li>
          <li>可编程预分频器：灵活设置定时器时钟</li>
          <li>自动重装载：支持周期性定时</li>
          <li>中断和DMA支持：可实现精确的定时控制</li>
          <li>多通道支持：可同时处理多个定时任务</li>
        </ul>

        <h4>定时器工作模式</h4>
        <p>
          STM32定时器支持以下主要工作模式：
        </p>
        <ul>
          <li>定时模式：产生精确的时间间隔</li>
          <li>计数模式：对外部事件进行计数</li>
          <li>PWM模式：生成可调占空比的方波</li>
          <li>输入捕获：测量脉冲宽度和频率</li>
          <li>输出比较：产生精确的定时输出</li>
        </ul>

        <h4>定时器配置参数</h4>
        <p>
          配置定时器时需要考虑以下参数：
        </p>
        <ul>
          <li>时钟源：内部时钟或外部时钟</li>
          <li>预分频值：决定定时器时钟频率</li>
          <li>计数模式：向上计数、向下计数或中央对齐</li>
          <li>自动重装载值：决定定时周期</li>
          <li>中断优先级：处理定时器中断</li>
        </ul>
      `,
      steps: [
        {
          title: '配置定时器时钟',
          content: `
            首先配置定时器的时钟源和预分频值：
          `,
          code: `
// 使能定时器时钟
RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;

// 配置定时器时钟预分频
// 假设系统时钟为168MHz，目标定时器时钟为1MHz
// 预分频值 = 168MHz / 1MHz - 1 = 167
TIM2->PSC = 167;

// 配置自动重装载值
// 1MHz / 1000 = 1kHz，即1ms定时
TIM2->ARR = 999;
          `
        },
        {
          title: '配置定时器工作模式',
          content: `
            配置定时器为基本定时模式：
          `,
          code: `
// 配置定时器为向上计数模式
TIM2->CR1 &= ~TIM_CR1_DIR;

// 使能自动重装载
TIM2->CR1 |= TIM_CR1_ARPE;

// 使能定时器
TIM2->CR1 |= TIM_CR1_CEN;
          `
        },
        {
          title: '配置定时器中断',
          content: `
            配置定时器中断，实现定时功能：
          `,
          code: `
// 使能更新中断
TIM2->DIER |= TIM_DIER_UIE;

// 配置NVIC
NVIC_SetPriority(TIM2_IRQn, 2);
NVIC_EnableIRQ(TIM2_IRQn);

// 定时器中断处理函数
void TIM2_IRQHandler(void)
{
  if (TIM2->SR & TIM_SR_UIF)
  {
    // 清除更新中断标志
    TIM2->SR &= ~TIM_SR_UIF;
    
    // 在这里添加定时任务代码
    LED_Toggle();  // 翻转LED状态
  }
}
          `
        },
        {
          title: '实现LED控制函数',
          content: `
            编写LED控制函数：
          `,
          code: `
// LED初始化
void LED_Init(void)
{
  // 使能GPIO时钟
  RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
  
  // 配置PA5为输出模式
  GPIOA->MODER &= ~GPIO_MODER_MODER5;
  GPIOA->MODER |= GPIO_MODER_MODER5_0;
  
  // 配置为推挽输出
  GPIOA->OTYPER &= ~GPIO_OTYPER_OT5;
  
  // 配置为高速模式
  GPIOA->OSPEEDR &= ~GPIO_OSPEEDR_OSPEED5;
  GPIOA->OSPEEDR |= GPIO_OSPEEDR_OSPEED5_0;
  
  // 配置为上拉
  GPIOA->PUPDR &= ~GPIO_PUPDR_PUPDR5;
  GPIOA->PUPDR |= GPIO_PUPDR_PUPDR5_0;
}

// LED翻转函数
void LED_Toggle(void)
{
  GPIOA->ODR ^= (1 << 5);
}
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的定时器示例代码：
          `,
          code: `
#include "stm32h7xx.h"

// 函数声明
void SystemClock_Config(void);
void LED_Init(void);
void LED_Toggle(void);
void TIM2_Init(void);

int main(void)
{
  // 系统时钟配置
  SystemClock_Config();
  
  // 初始化LED
  LED_Init();
  
  // 初始化定时器
  TIM2_Init();
  
  while (1)
  {
    // 主循环
  }
}

void TIM2_Init(void)
{
  // 使能定时器时钟
  RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
  
  // 配置定时器时钟预分频
  TIM2->PSC = 167;
  
  // 配置自动重装载值
  TIM2->ARR = 999;
  
  // 配置定时器为向上计数模式
  TIM2->CR1 &= ~TIM_CR1_DIR;
  
  // 使能自动重装载
  TIM2->CR1 |= TIM_CR1_ARPE;
  
  // 使能更新中断
  TIM2->DIER |= TIM_DIER_UIE;
  
  // 配置NVIC
  NVIC_SetPriority(TIM2_IRQn, 2);
  NVIC_EnableIRQ(TIM2_IRQn);
  
  // 使能定时器
  TIM2->CR1 |= TIM_CR1_CEN;
}

void TIM2_IRQHandler(void)
{
  if (TIM2->SR & TIM_SR_UIF)
  {
    // 清除更新中断标志
    TIM2->SR &= ~TIM_SR_UIF;
    
    // 翻转LED状态
    LED_Toggle();
  }
}
          `
        }
      ]
    }
  };

  return experiments[id];
};

const TimerExperimentPage: React.FC = () => {
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

export default TimerExperimentPage; 