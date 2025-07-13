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

// 模拟多 LED 控制实验的详细数据
const getExperimentData = (): ExperimentData => ({
  id: 'multi-led-control',
  title: '多 LED 控制',
  description: '学习使用 STM32H7 的 GPIO 实现多个 LED 的复杂控制模式。',
  difficulty: 'advanced',
  thumbnail: '/images/experiments/multi-led.jpg',
  introduction: `
    本实验将带你学习如何通过 STM32H7 的 GPIO 控制多个 LED，实现流水灯、闪烁等多种控制效果，掌握多引脚并行控制的编程方法。
  `,
  objectives: [
    '理解多 GPIO 引脚并行控制原理',
    '掌握流水灯、闪烁等多 LED 控制方法',
    '学习使用循环和延时实现动态效果',
    '熟悉位操作和数组控制 GPIO'
  ],
  materials: [
    'STM32H7 系列开发板',
    '面包板和连接线',
    '多颗 LED 指示灯',
    '电阻（220Ω）'
  ],
  theory: `
    <h4>多 GPIO 并行控制</h4>
    <p>通过同时操作多个 GPIO 引脚，可以实现多 LED 的并行控制。常见的控制方式包括流水灯、全部点亮/熄灭、交替闪烁等。</p>
    <ul>
      <li>流水灯：依次点亮每个 LED，形成流动效果</li>
      <li>全部点亮/熄灭：同时控制所有 LED</li>
      <li>交替闪烁：奇偶 LED 交替亮灭</li>
    </ul>
    <h4>位操作与数组控制</h4>
    <p>可以通过数组和循环结构批量控制 GPIO 引脚，提升代码可维护性和扩展性。</p>
  `,
  steps: [
    {
      title: '配置多 GPIO 引脚为输出',
      content: '将用于控制 LED 的多个 GPIO 引脚（如 PA0~PA3）配置为输出模式。',
      code: `// 使能 GPIOA 时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;

// 配置 PA0~PA3 为输出模式
GPIOA->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2 | GPIO_MODER_MODE3);
GPIOA->MODER |= (GPIO_MODER_MODE0_0 | GPIO_MODER_MODE1_0 | GPIO_MODER_MODE2_0 | GPIO_MODER_MODE3_0);

// 配置为推挽输出、无上拉下拉
GPIOA->OTYPER &= ~(GPIO_OTYPER_OT0 | GPIO_OTYPER_OT1 | GPIO_OTYPER_OT2 | GPIO_OTYPER_OT3);
GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2 | GPIO_PUPDR_PUPD3);
`
    },
    {
      title: '实现流水灯效果',
      content: '通过循环依次点亮每个 LED，实现流水灯动态效果。',
      code: `for (int i = 0; i < 4; i++) {
  GPIOA->BSRR = (1 << i);      // 点亮第 i 个 LED
  HAL_Delay(200);              // 延时 200ms
  GPIOA->BSRR = (1 << (i + 16)); // 熄灭第 i 个 LED
}`
    },
    {
      title: '全部点亮与全部熄灭',
      content: '同时点亮或熄灭所有 LED。',
      code: `// 全部点亮
GPIOA->BSRR = 0x000F; // PA0~PA3 置 1
// 全部熄灭
GPIOA->BSRR = 0x000F << 16; // PA0~PA3 置 0
`
    },
    {
      title: '交替闪烁效果',
      content: '实现偶数和奇数 LED 交替闪烁。',
      code: `// 偶数 LED 亮，奇数灭
GPIOA->BSRR = 0x0005;      // PA0, PA2 亮
GPIOA->BSRR = (0x000A << 16); // PA1, PA3 灭
HAL_Delay(300);
// 奇数 LED 亮，偶数灭
GPIOA->BSRR = 0x000A;      // PA1, PA3 亮
GPIOA->BSRR = (0x0005 << 16); // PA0, PA2 灭
HAL_Delay(300);
`
    },
    {
      title: '完整示例代码',
      content: '下面是一个多 LED 控制的完整示例代码：',
      code: `#include "stm32h7xx.h"

void SystemClock_Config(void);
void GPIO_Init(void);
void FlowingLight(void);
void AllOnOff(void);
void AlternateBlink(void);

int main(void)
{
  SystemClock_Config();
  GPIO_Init();
  while (1) {
    FlowingLight();
    AllOnOff();
    AlternateBlink();
  }
}

void GPIO_Init(void)
{
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;
  GPIOA->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2 | GPIO_MODER_MODE3);
  GPIOA->MODER |= (GPIO_MODER_MODE0_0 | GPIO_MODER_MODE1_0 | GPIO_MODER_MODE2_0 | GPIO_MODER_MODE3_0);
  GPIOA->OTYPER &= ~(GPIO_OTYPER_OT0 | GPIO_OTYPER_OT1 | GPIO_OTYPER_OT2 | GPIO_OTYPER_OT3);
  GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2 | GPIO_PUPDR_PUPD3);
}

void FlowingLight(void)
{
  for (int i = 0; i < 4; i++) {
    GPIOA->BSRR = (1 << i);
    HAL_Delay(200);
    GPIOA->BSRR = (1 << (i + 16));
  }
}

void AllOnOff(void)
{
  GPIOA->BSRR = 0x000F; // 全部点亮
  HAL_Delay(500);
  GPIOA->BSRR = (0x000F << 16); // 全部熄灭
  HAL_Delay(500);
}

void AlternateBlink(void)
{
  GPIOA->BSRR = 0x0005;
  GPIOA->BSRR = (0x000A << 16);
  HAL_Delay(300);
  GPIOA->BSRR = 0x000A;
  GPIOA->BSRR = (0x0005 << 16);
  HAL_Delay(300);
}
`
    }
  ]
});

const MultiLedControlExperimentPage: React.FC = () => {
  // 该页面为静态内容，无需参数
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

export default MultiLedControlExperimentPage; 