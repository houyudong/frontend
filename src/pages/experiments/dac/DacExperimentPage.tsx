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

// 模拟单个 DAC 实验的详细数据
const getExperimentData = (id: string): ExperimentData | undefined => {
  // 正常通过后端 API 获取数据，这里使用静态数据模拟
  const experiments: Record<string, ExperimentData> = {
    'dac-basic': {
      id: 'dac-basic',
      title: 'DAC 基础应用',
      description: '学习配置和使用 STM32H7 的 DAC 外设，实现基本的模拟信号输出。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/dac-basic.jpg',
      introduction: `
        STM32H7 系列微控制器提供了高精度的 DAC（数模转换器）外设，可用于生成模拟信号。
        本实验将教你如何配置和使用 STM32 的 DAC，实现基本的模拟信号输出功能。
      `,
      objectives: [
        '理解 DAC 的基本工作原理和特性',
        '学习配置 STM32 的 DAC 外设',
        '实现基本的模拟信号输出',
        '掌握 DAC 的校准和精度控制',
        '学习使用示波器观察输出信号'
      ],
      materials: [
        'STM32H7 系列开发板',
        '示波器',
        '面包板和连接线',
        '电阻（10kΩ）',
        '电容（0.1μF）'
      ],
      theory: `
        <h4>DAC 基础知识</h4>
        <p>
          STM32 的 DAC 是一种数字到模拟转换器，具有以下特点：
        </p>
        <ul>
          <li>12 位分辨率：可输出 4096 个不同的电压值</li>
          <li>双通道输出：支持两个独立的 DAC 通道</li>
          <li>多种触发源：软件触发、定时器触发等</li>
          <li>DMA 支持：可实现高效的数据传输</li>
          <li>内置缓冲器：提高输出稳定性</li>
        </ul>

        <h4>DAC 工作模式</h4>
        <p>
          STM32 DAC 支持以下主要工作模式：
        </p>
        <ul>
          <li>单次转换模式：每次触发进行一次转换</li>
          <li>连续转换模式：持续进行转换</li>
          <li>噪声生成模式：生成伪随机噪声</li>
          <li>三角波生成模式：生成三角波</li>
        </ul>

        <h4>DAC 配置参数</h4>
        <p>
          配置 DAC 时需要考虑以下参数：
        </p>
        <ul>
          <li>参考电压：决定输出范围</li>
          <li>触发源：选择转换触发方式</li>
          <li>输出缓冲：是否启用输出缓冲器</li>
          <li>DMA 请求：是否启用 DMA 传输</li>
          <li>校准：进行 DAC 校准以提高精度</li>
        </ul>
      `,
      steps: [
        {
          title: '配置 DAC 时钟',
          content: `
            首先配置 DAC 的时钟源：
          `,
          code: `
// 使能 DAC 时钟
RCC->APB1ENR |= RCC_APB1ENR_DACEN;

// 等待 DAC 时钟稳定
while (!(RCC->APB1ENR & RCC_APB1ENR_DACEN));
          `
        },
        {
          title: '配置 DAC 通道',
          content: `
            配置 DAC 通道 1 的基本参数：
          `,
          code: `
// 禁用 DAC 通道 1
DAC->CR &= ~DAC_CR_EN1;

// 配置 DAC 通道 1
// 使能输出缓冲器
DAC->CR |= DAC_CR_BOFF1;

// 选择触发源为软件触发
DAC->CR &= ~DAC_CR_TSEL1;
DAC->CR |= DAC_CR_TEN1;

// 使能 DAC 通道 1
DAC->CR |= DAC_CR_EN1;
          `
        },
        {
          title: 'DAC 校准',
          content: `
            执行 DAC 校准以提高精度：
          `,
          code: `
// 等待校准完成
while (!(DAC->SR & DAC_SR_CAL_FLAG1));

// 清除校准标志
DAC->SR &= ~DAC_SR_CAL_FLAG1;
          `
        },
        {
          title: '输出模拟信号',
          content: `
            通过 DAC 输出模拟信号：
          `,
          code: `
// 设置 DAC 通道 1 的输出值（0-4095）
DAC->DHR12R1 = 2048;  // 输出中间值

// 触发 DAC 转换
DAC->SWTRIGR |= DAC_SWTRIGR_SWTRIG1;
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的 DAC 示例代码：
          `,
          code: `
#include "stm32h7xx.h"

// 函数声明
void SystemClock_Config(void);
void DAC_Init(void);
void DAC_Calibrate(void);
void DAC_SetValue(uint16_t value);

int main(void)
{
  // 系统时钟配置
  SystemClock_Config();
  
  // 初始化 DAC
  DAC_Init();
  
  // 执行 DAC 校准
  DAC_Calibrate();
  
  while (1)
  {
    // 输出不同的电压值
    for (uint16_t i = 0; i < 4096; i += 256)
    {
      DAC_SetValue(i);
      HAL_Delay(100);  // 延时 100ms
    }
  }
}

void DAC_Init(void)
{
  // 使能 DAC 时钟
  RCC->APB1ENR |= RCC_APB1ENR_DACEN;
  
  // 等待 DAC 时钟稳定
  while (!(RCC->APB1ENR & RCC_APB1ENR_DACEN));
  
  // 禁用 DAC 通道 1
  DAC->CR &= ~DAC_CR_EN1;
  
  // 配置 DAC 通道 1
  DAC->CR |= DAC_CR_BOFF1;  // 使能输出缓冲器
  DAC->CR &= ~DAC_CR_TSEL1; // 选择软件触发
  DAC->CR |= DAC_CR_TEN1;   // 使能触发
  
  // 使能 DAC 通道 1
  DAC->CR |= DAC_CR_EN1;
}

void DAC_Calibrate(void)
{
  // 等待校准完成
  while (!(DAC->SR & DAC_SR_CAL_FLAG1));
  
  // 清除校准标志
  DAC->SR &= ~DAC_SR_CAL_FLAG1;
}

void DAC_SetValue(uint16_t value)
{
  // 设置 DAC 输出值
  DAC->DHR12R1 = value & 0xFFF;
  
  // 触发转换
  DAC->SWTRIGR |= DAC_SWTRIGR_SWTRIG1;
}
          `
        }
      ]
    }
  };

  return experiments[id];
};

const DacExperimentPage: React.FC = () => {
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

export default DacExperimentPage; 