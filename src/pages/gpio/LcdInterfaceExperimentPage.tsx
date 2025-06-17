import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMonitor } from 'react-icons/fi';

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

// 模拟 LCD 接口实验的详细数据
const getExperimentData = (): ExperimentData => ({
  id: 'lcd-interface',
  title: 'LCD 接口',
  description: '学习使用 STM32H7 的 GPIO 实现 LCD 显示器的接口控制。',
  difficulty: 'advanced',
  thumbnail: '/images/experiments/lcd.jpg',
  introduction: `
    本实验将带你学习如何通过 STM32H7 的 GPIO 实现 LCD 显示器的接口控制，掌握 LCD 的初始化、显示和更新方法。
  `,
  objectives: [
    '理解 LCD 显示器的工作原理',
    '掌握 LCD 的初始化方法',
    '学习使用 GPIO 实现 LCD 接口',
    '熟悉 LCD 显示和更新方法'
  ],
  materials: [
    'STM32H7 系列开发板',
    '面包板和连接线',
    'LCD 显示器',
    '电阻（10kΩ）'
  ],
  theory: `
    <h4>LCD 显示器工作原理</h4>
    <p>LCD 显示器通过控制像素的亮灭来显示图像，通常使用 SPI 或 I2C 接口进行通信。</p>
    <ul>
      <li>LCD 初始化：配置 LCD 的显示模式、对比度等参数</li>
      <li>显示数据：将数据写入 LCD 的显示缓冲区</li>
      <li>更新显示：刷新 LCD 显示内容</li>
    </ul>
    <h4>LCD 接口控制</h4>
    <p>通过 GPIO 控制 LCD 的 RS、RW、E 等信号线，实现数据的写入和读取。</p>
  `,
  steps: [
    {
      title: '配置 GPIO 引脚',
      content: '将 LCD 的 RS、RW、E 等信号线配置为输出，数据线配置为输出。',
      code: `// 使能 GPIOA 时钟
RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;

// 配置 RS、RW、E 为输出
GPIOA->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2);
GPIOA->MODER |= (GPIO_MODER_MODE0_0 | GPIO_MODER_MODE1_0 | GPIO_MODER_MODE2_0);
GPIOA->OTYPER &= ~(GPIO_OTYPER_OT0 | GPIO_OTYPER_OT1 | GPIO_OTYPER_OT2);
GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2);

// 配置数据线为输出
GPIOA->MODER &= ~(GPIO_MODER_MODE3 | GPIO_MODER_MODE4 | GPIO_MODER_MODE5 | GPIO_MODER_MODE6);
GPIOA->MODER |= (GPIO_MODER_MODE3_0 | GPIO_MODER_MODE4_0 | GPIO_MODER_MODE5_0 | GPIO_MODER_MODE6_0);
GPIOA->OTYPER &= ~(GPIO_OTYPER_OT3 | GPIO_OTYPER_OT4 | GPIO_OTYPER_OT5 | GPIO_OTYPER_OT6);
GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD3 | GPIO_PUPDR_PUPD4 | GPIO_PUPDR_PUPD5 | GPIO_PUPDR_PUPD6);
`
    },
    {
      title: 'LCD 初始化',
      content: '配置 LCD 的显示模式、对比度等参数。',
      code: `void LCD_Init(void) {
  // 初始化 LCD
  LCD_Command(0x38); // 8 位数据接口，2 行显示，5x7 点阵
  LCD_Command(0x0C); // 显示开，光标关，闪烁关
  LCD_Command(0x06); // 文字不动，地址自动 +1
  LCD_Command(0x01); // 清屏
  HAL_Delay(2);
}`
    },
    {
      title: 'LCD 显示数据',
      content: '将数据写入 LCD 的显示缓冲区。',
      code: `void LCD_WriteData(uint8_t data) {
  GPIOA->BSRR = (1 << 0); // RS = 1
  GPIOA->BSRR = (1 << 1); // RW = 1
  GPIOA->BSRR = (1 << 2); // E = 1
  GPIOA->ODR = (GPIOA->ODR & 0xFFF0) | (data & 0x0F); // 写入数据
  HAL_Delay(1);
  GPIOA->BSRR = (1 << 18); // E = 0
}`
    },
    {
      title: 'LCD 更新显示',
      content: '刷新 LCD 显示内容。',
      code: `void LCD_Update(void) {
  // 更新 LCD 显示
  LCD_Command(0x80); // 设置 DDRAM 地址
  LCD_WriteData(0x41); // 显示字符 'A'
  LCD_WriteData(0x42); // 显示字符 'B'
  LCD_WriteData(0x43); // 显示字符 'C'
}`
    },
    {
      title: '完整示例代码',
      content: '下面是一个 LCD 接口的完整示例代码：',
      code: `#include "stm32h7xx.h"

void SystemClock_Config(void);
void GPIO_Init(void);
void LCD_Init(void);
void LCD_Command(uint8_t cmd);
void LCD_WriteData(uint8_t data);
void LCD_Update(void);

int main(void) {
  SystemClock_Config();
  GPIO_Init();
  LCD_Init();
  while (1) {
    LCD_Update();
    HAL_Delay(1000);
  }
}

void GPIO_Init(void) {
  RCC->AHB4ENR |= RCC_AHB4ENR_GPIOAEN;
  GPIOA->MODER &= ~(GPIO_MODER_MODE0 | GPIO_MODER_MODE1 | GPIO_MODER_MODE2);
  GPIOA->MODER |= (GPIO_MODER_MODE0_0 | GPIO_MODER_MODE1_0 | GPIO_MODER_MODE2_0);
  GPIOA->OTYPER &= ~(GPIO_OTYPER_OT0 | GPIO_OTYPER_OT1 | GPIO_OTYPER_OT2);
  GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD0 | GPIO_PUPDR_PUPD1 | GPIO_PUPDR_PUPD2);
  GPIOA->MODER &= ~(GPIO_MODER_MODE3 | GPIO_MODER_MODE4 | GPIO_MODER_MODE5 | GPIO_MODER_MODE6);
  GPIOA->MODER |= (GPIO_MODER_MODE3_0 | GPIO_MODER_MODE4_0 | GPIO_MODER_MODE5_0 | GPIO_MODER_MODE6_0);
  GPIOA->OTYPER &= ~(GPIO_OTYPER_OT3 | GPIO_OTYPER_OT4 | GPIO_OTYPER_OT5 | GPIO_OTYPER_OT6);
  GPIOA->PUPDR &= ~(GPIO_PUPDR_PUPD3 | GPIO_PUPDR_PUPD4 | GPIO_PUPDR_PUPD5 | GPIO_PUPDR_PUPD6);
}

void LCD_Init(void) {
  LCD_Command(0x38);
  LCD_Command(0x0C);
  LCD_Command(0x06);
  LCD_Command(0x01);
  HAL_Delay(2);
}

void LCD_Command(uint8_t cmd) {
  GPIOA->BSRR = (1 << 0); // RS = 0
  GPIOA->BSRR = (1 << 1); // RW = 0
  GPIOA->BSRR = (1 << 2); // E = 1
  GPIOA->ODR = (GPIOA->ODR & 0xFFF0) | (cmd & 0x0F); // 写入命令
  HAL_Delay(1);
  GPIOA->BSRR = (1 << 18); // E = 0
}

void LCD_WriteData(uint8_t data) {
  GPIOA->BSRR = (1 << 0); // RS = 1
  GPIOA->BSRR = (1 << 1); // RW = 0
  GPIOA->BSRR = (1 << 2); // E = 1
  GPIOA->ODR = (GPIOA->ODR & 0xFFF0) | (data & 0x0F); // 写入数据
  HAL_Delay(1);
  GPIOA->BSRR = (1 << 18); // E = 0
}

void LCD_Update(void) {
  LCD_Command(0x80);
  LCD_WriteData(0x41);
  LCD_WriteData(0x42);
  LCD_WriteData(0x43);
}`
    }
  ]
});

const LcdInterfaceExperimentPage: React.FC = () => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiMonitor className="mr-2" />
        LCD接口实验
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          本实验将展示如何使用STM32的GPIO接口控制LCD显示屏。
        </p>
        {/* 实验内容将在这里实现 */}
      </div>
    </div>
  );
};

export default LcdInterfaceExperimentPage; 