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

// 模拟单个UART实验的详细数据
const getExperimentData = (id: string): ExperimentData | undefined => {
  // 正常通过后端API获取数据，这里使用静态数据模拟
  const experiments: Record<string, ExperimentData> = {
    'uart-basic': {
      id: 'uart-basic',
      title: 'UART基础通信',
      description: '学习配置STM32H7的UART进行基本的串口通信，包括数据发送和接收功能。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/uart-basic.jpg',
      introduction: `
        UART（通用异步收发器）是STM32系列微控制器中最常用的通信接口之一，用于与其他设备进行串行通信。
        本实验将教你如何配置和使用STM32的UART外设，实现基本的串口通信功能。
      `,
      objectives: [
        '理解UART的基本工作原理和特性',
        '学习配置STM32的UART外设',
        '实现基本的串口数据发送和接收',
        '掌握串口通信的参数设置',
        '学习使用串口调试助手进行通信测试'
      ],
      materials: [
        'STM32系列开发板（如STM32F4、STM32F1或STM32G0系列）',
        'USB转TTL串口模块',
        '连接导线',
        '串口调试助手软件',
        'LED指示灯（可选）'
      ],
      theory: `
        <h4>UART基础知识</h4>
        <p>
          UART（Universal Asynchronous Receiver/Transmitter）是一种异步串行通信协议，具有以下特点：
        </p>
        <ul>
          <li>异步通信：不需要时钟信号同步</li>
          <li>全双工：可以同时发送和接收数据</li>
          <li>点对点通信：通常用于两个设备之间的通信</li>
          <li>可配置参数：波特率、数据位、停止位、校验位等</li>
        </ul>

        <h4>UART通信参数</h4>
        <p>
          UART通信需要配置以下参数：
        </p>
        <ul>
          <li>波特率：通信速率，常用值有9600、115200等</li>
          <li>数据位：每个字符的位数，通常为8位</li>
          <li>停止位：表示一个字符结束的位数，通常为1位</li>
          <li>校验位：用于错误检测，可选无校验、奇校验或偶校验</li>
        </ul>

        <h4>STM32 UART特性</h4>
        <p>
          STM32系列微控制器的UART外设具有以下特性：
        </p>
        <ul>
          <li>多个UART接口：不同型号支持不同数量的UART</li>
          <li>可编程波特率：支持多种波特率设置</li>
          <li>硬件流控制：支持RTS/CTS流控制</li>
          <li>中断和DMA支持：可通过中断或DMA方式传输数据</li>
          <li>自动波特率检测：支持自动检测通信速率</li>
        </ul>
      `,
      steps: [
        {
          title: '配置GPIO引脚',
          content: `
            <ol>
              <li>使能UART和GPIO时钟</li>
              <li>配置相应GPIO引脚为UART功能</li>
            </ol>
          `,
          code: `
// 以STM32F1系列为例，使用UART1（PA9/PA10）
// 使能GPIOA和UART1时钟
RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_USART1EN;

// 配置PA9为复用推挽输出（UART1_TX）
GPIOA->CRH &= ~(GPIO_CRH_MODE9 | GPIO_CRH_CNF9);
GPIOA->CRH |= GPIO_CRH_MODE9_0 | GPIO_CRH_CNF9_1;

// 配置PA10为浮空输入（UART1_RX）
GPIOA->CRH &= ~(GPIO_CRH_MODE10 | GPIO_CRH_CNF10);
GPIOA->CRH |= GPIO_CRH_CNF10_0;
          `
        },
        {
          title: '配置UART参数',
          content: `
            配置UART的工作模式、波特率、数据格式等：
          `,
          code: `
// 配置UART1
// 复位UART1
USART1->CR1 = 0;
USART1->CR2 = 0;
USART1->CR3 = 0;

// 配置波特率（以115200为例）
// 波特率 = 系统时钟 / (16 * USARTDIV)
// 假设系统时钟为72MHz，则USARTDIV = 72000000 / (16 * 115200) = 39.0625
// 整数部分 = 39，小数部分 = 0.0625 * 16 = 1
USART1->BRR = (39 << 4) | 1;

// 配置数据格式：8位数据位，1位停止位，无校验
USART1->CR1 &= ~USART_CR1_M;  // 8位数据位
USART1->CR2 &= ~USART_CR2_STOP;  // 1位停止位
USART1->CR1 &= ~USART_CR1_PCE;  // 无校验

// 使能UART1
USART1->CR1 |= USART_CR1_UE;
          `
        },
        {
          title: '实现数据发送函数',
          content: `
            编写函数发送单个字符和字符串：
          `,
          code: `
// 发送单个字符
void UART_SendChar(USART_TypeDef* USARTx, uint8_t c)
{
  // 等待发送缓冲区为空
  while(!(USARTx->SR & USART_SR_TXE));
  
  // 发送数据
  USARTx->DR = c;
}

// 发送字符串
void UART_SendString(USART_TypeDef* USARTx, const char* str)
{
  while(*str)
  {
    UART_SendChar(USARTx, *str++);
  }
}
          `
        },
        {
          title: '实现数据接收函数',
          content: `
            编写函数接收单个字符：
          `,
          code: `
// 接收单个字符
uint8_t UART_ReceiveChar(USART_TypeDef* USARTx)
{
  // 等待接收数据
  while(!(USARTx->SR & USART_SR_RXNE));
  
  // 返回接收到的数据
  return (uint8_t)(USARTx->DR & 0xFF);
}
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的UART通信示例代码：
          `,
          code: `
#include "stm32f10x.h"  // 以STM32F1系列为例
#include <stdio.h>
#include <string.h>

// 函数声明
void SystemClock_Config(void);
void UART_Init(void);
void UART_SendChar(USART_TypeDef* USARTx, uint8_t c);
void UART_SendString(USART_TypeDef* USARTx, const char* str);
uint8_t UART_ReceiveChar(USART_TypeDef* USARTx);
void Delay_ms(uint32_t ms);

int main(void)
{
  // 系统时钟配置（假设已经配置为72MHz）
  SystemClock_Config();

  // 初始化UART
  UART_Init();

  // 发送欢迎信息
  UART_SendString(USART1, "\\r\\nSTM32 UART Basic Example\\r\\n");
  UART_SendString(USART1, "Type something and press Enter...\\r\\n");

  while (1)
  {
    // 接收一个字符
    uint8_t received = UART_ReceiveChar(USART1);

    // 回显接收到的字符
    UART_SendChar(USART1, received);

    // 如果收到回车符，发送换行
    if (received == '\\r')
    {
      UART_SendChar(USART1, '\\n');
    }
  }
}

void UART_Init(void)
{
  // 使能GPIOA和UART1时钟
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_USART1EN;

  // 配置PA9为复用推挽输出（UART1_TX）
  GPIOA->CRH &= ~(GPIO_CRH_MODE9 | GPIO_CRH_CNF9);
  GPIOA->CRH |= GPIO_CRH_MODE9_0 | GPIO_CRH_CNF9_1;

  // 配置PA10为浮空输入（UART1_RX）
  GPIOA->CRH &= ~(GPIO_CRH_MODE10 | GPIO_CRH_CNF10);
  GPIOA->CRH |= GPIO_CRH_CNF10_0;

  // 配置UART1
  // 复位UART1
  USART1->CR1 = 0;
  USART1->CR2 = 0;
  USART1->CR3 = 0;

  // 配置波特率（115200）
  USART1->BRR = (39 << 4) | 1;

  // 配置数据格式：8位数据位，1位停止位，无校验
  USART1->CR1 &= ~USART_CR1_M;  // 8位数据位
  USART1->CR2 &= ~USART_CR2_STOP;  // 1位停止位
  USART1->CR1 &= ~USART_CR1_PCE;  // 无校验

  // 使能UART1
  USART1->CR1 |= USART_CR1_UE;
}
          `
        }
      ]
    }
  };

  return experiments[id];
};

const UartExperimentPage: React.FC = () => {
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

export default UartExperimentPage; 