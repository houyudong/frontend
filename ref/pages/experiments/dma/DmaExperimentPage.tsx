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

// 模拟单个 DMA 实验的详细数据
const getExperimentData = (id: string): ExperimentData | undefined => {
  // 正常通过后端 API 获取数据，这里使用静态数据模拟
  const experiments: Record<string, ExperimentData> = {
    'dma-basic': {
      id: 'dma-basic',
      title: 'DMA 基础应用',
      description: '学习配置和使用 STM32H7 的 DMA 控制器，实现高效的数据传输。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/dma-basic.jpg',
      introduction: `
        STM32H7 系列微控制器提供了功能强大的 DMA（直接内存访问）控制器，可用于实现高效的数据传输。
        本实验将教你如何配置和使用 STM32 的 DMA，实现内存到外设或外设到内存的数据传输。
      `,
      objectives: [
        '理解 DMA 的基本工作原理和特性',
        '学习配置 STM32 的 DMA 控制器',
        '实现基本的内存到内存传输',
        '掌握 DMA 中断处理',
        '学习使用 DMA 提高系统性能'
      ],
      materials: [
        'STM32H7 系列开发板',
        '示波器（可选）',
        '面包板和连接线',
        'LED 指示灯',
        '电阻（220Ω）'
      ],
      theory: `
        <h4>DMA 基础知识</h4>
        <p>
          STM32 的 DMA 是一种直接内存访问控制器，具有以下特点：
        </p>
        <ul>
          <li>多通道支持：可同时处理多个传输请求</li>
          <li>多种传输模式：内存到内存、内存到外设、外设到内存</li>
          <li>优先级管理：支持不同通道的优先级设置</li>
          <li>中断支持：传输完成、半传输、错误等中断</li>
          <li>循环模式：支持循环传输</li>
        </ul>

        <h4>DMA 工作模式</h4>
        <p>
          STM32 DMA 支持以下主要工作模式：
        </p>
        <ul>
          <li>单次传输：每次请求传输一个数据块</li>
          <li>循环传输：持续传输数据块</li>
          <li>双缓冲模式：使用两个缓冲区交替传输</li>
          <li>突发传输：一次传输多个数据</li>
        </ul>

        <h4>DMA 配置参数</h4>
        <p>
          配置 DMA 时需要考虑以下参数：
        </p>
        <ul>
          <li>传输方向：内存到内存、内存到外设等</li>
          <li>数据宽度：字节、半字、字</li>
          <li>地址增量：是否自动增加源地址和目标地址</li>
          <li>优先级：通道优先级设置</li>
          <li>中断：是否启用传输完成中断</li>
        </ul>
      `,
      steps: [
        {
          title: '配置 DMA 时钟',
          content: `
            首先配置 DMA 的时钟源：
          `,
          code: `
// 使能 DMA 时钟
RCC->AHB1ENR |= RCC_AHB1ENR_DMA1EN;

// 等待 DMA 时钟稳定
while (!(RCC->AHB1ENR & RCC_AHB1ENR_DMA1EN));
          `
        },
        {
          title: '配置 DMA 通道',
          content: `
            配置 DMA 通道 1 的基本参数：
          `,
          code: `
// 禁用 DMA 通道 1
DMA1_Stream0->CR &= ~DMA_SxCR_EN;

// 等待通道禁用完成
while (DMA1_Stream0->CR & DMA_SxCR_EN);

// 清除所有标志位
DMA1->LIFCR = DMA_FLAG_TCIF0_4 | DMA_FLAG_HTIF0_4 | DMA_FLAG_TEIF0_4 | DMA_FLAG_DMEIF0_4 | DMA_FLAG_FEIF0_4;

// 配置 DMA 通道 1
// 设置外设地址
DMA1_Stream0->PAR = (uint32_t)&DAC->DHR12R1;

// 设置内存地址
DMA1_Stream0->M0AR = (uint32_t)buffer;

// 设置传输数量
DMA1_Stream0->NDTR = BUFFER_SIZE;

// 配置 DMA 参数
DMA1_Stream0->CR = DMA_SxCR_CHSEL_0 |    // 选择通道 1
                   DMA_SxCR_MINC |        // 内存地址增量
                   DMA_SxCR_PSIZE_0 |     // 外设数据宽度为 16 位
                   DMA_SxCR_MSIZE_0 |     // 内存数据宽度为 16 位
                   DMA_SxCR_PL_0 |        // 中等优先级
                   DMA_SxCR_DIR_0 |       // 内存到外设
                   DMA_SxCR_TCIE;         // 使能传输完成中断
          `
        },
        {
          title: '配置 DMA 中断',
          content: `
            配置 DMA 中断处理：
          `,
          code: `
// 配置 NVIC
NVIC_SetPriority(DMA1_Stream0_IRQn, 2);
NVIC_EnableIRQ(DMA1_Stream0_IRQn);

// DMA 中断处理函数
void DMA1_Stream0_IRQHandler(void)
{
  if (DMA1->LISR & DMA_FLAG_TCIF0_4)
  {
    // 清除传输完成标志
    DMA1->LIFCR = DMA_FLAG_TCIF0_4;
    
    // 在这里添加传输完成后的处理代码
    LED_Toggle();  // 翻转 LED 状态
  }
}
          `
        },
        {
          title: '启动 DMA 传输',
          content: `
            启动 DMA 传输：
          `,
          code: `
// 使能 DMA 通道
DMA1_Stream0->CR |= DMA_SxCR_EN;

// 等待传输完成
while (!(DMA1->LISR & DMA_FLAG_TCIF0_4));
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的 DMA 示例代码：
          `,
          code: `
#include "stm32h7xx.h"

#define BUFFER_SIZE 1000

// 函数声明
void SystemClock_Config(void);
void LED_Init(void);
void LED_Toggle(void);
void DMA_Init(void);
void DMA_StartTransfer(void);

// 全局变量
uint16_t buffer[BUFFER_SIZE];

int main(void)
{
  // 系统时钟配置
  SystemClock_Config();
  
  // 初始化 LED
  LED_Init();
  
  // 初始化 DMA
  DMA_Init();
  
  // 填充缓冲区数据
  for (int i = 0; i < BUFFER_SIZE; i++)
  {
    buffer[i] = i;
  }
  
  while (1)
  {
    // 启动 DMA 传输
    DMA_StartTransfer();
    
    // 等待传输完成
    while (!(DMA1->LISR & DMA_FLAG_TCIF0_4));
    
    // 清除传输完成标志
    DMA1->LIFCR = DMA_FLAG_TCIF0_4;
    
    // 延时一段时间
    HAL_Delay(1000);
  }
}

void DMA_Init(void)
{
  // 使能 DMA 时钟
  RCC->AHB1ENR |= RCC_AHB1ENR_DMA1EN;
  
  // 等待 DMA 时钟稳定
  while (!(RCC->AHB1ENR & RCC_AHB1ENR_DMA1EN));
  
  // 禁用 DMA 通道
  DMA1_Stream0->CR &= ~DMA_SxCR_EN;
  
  // 等待通道禁用完成
  while (DMA1_Stream0->CR & DMA_SxCR_EN);
  
  // 清除所有标志位
  DMA1->LIFCR = DMA_FLAG_TCIF0_4 | DMA_FLAG_HTIF0_4 | DMA_FLAG_TEIF0_4 | DMA_FLAG_DMEIF0_4 | DMA_FLAG_FEIF0_4;
  
  // 配置 DMA 通道
  DMA1_Stream0->PAR = (uint32_t)&DAC->DHR12R1;
  DMA1_Stream0->M0AR = (uint32_t)buffer;
  DMA1_Stream0->NDTR = BUFFER_SIZE;
  
  // 配置 DMA 参数
  DMA1_Stream0->CR = DMA_SxCR_CHSEL_0 |    // 选择通道 1
                     DMA_SxCR_MINC |        // 内存地址增量
                     DMA_SxCR_PSIZE_0 |     // 外设数据宽度为 16 位
                     DMA_SxCR_MSIZE_0 |     // 内存数据宽度为 16 位
                     DMA_SxCR_PL_0 |        // 中等优先级
                     DMA_SxCR_DIR_0 |       // 内存到外设
                     DMA_SxCR_TCIE;         // 使能传输完成中断
  
  // 配置 NVIC
  NVIC_SetPriority(DMA1_Stream0_IRQn, 2);
  NVIC_EnableIRQ(DMA1_Stream0_IRQn);
}

void DMA_StartTransfer(void)
{
  // 禁用 DMA 通道
  DMA1_Stream0->CR &= ~DMA_SxCR_EN;
  
  // 等待通道禁用完成
  while (DMA1_Stream0->CR & DMA_SxCR_EN);
  
  // 清除所有标志位
  DMA1->LIFCR = DMA_FLAG_TCIF0_4 | DMA_FLAG_HTIF0_4 | DMA_FLAG_TEIF0_4 | DMA_FLAG_DMEIF0_4 | DMA_FLAG_FEIF0_4;
  
  // 设置传输数量
  DMA1_Stream0->NDTR = BUFFER_SIZE;
  
  // 使能 DMA 通道
  DMA1_Stream0->CR |= DMA_SxCR_EN;
}

void DMA1_Stream0_IRQHandler(void)
{
  if (DMA1->LISR & DMA_FLAG_TCIF0_4)
  {
    // 清除传输完成标志
    DMA1->LIFCR = DMA_FLAG_TCIF0_4;
    
    // 翻转 LED 状态
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

const DmaExperimentPage: React.FC = () => {
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

export default DmaExperimentPage; 