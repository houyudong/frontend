import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 模拟单个串口实验的详细数据
const getExperimentData = (id) => {
  // 正常通过后端API获取数据，这里使用静态数据模拟
  const experiments = {
    'basic-uart': {
      id: 'basic-uart',
      title: '基础串口通信',
      description: '学习配置STM32系列的UART外设，实现与计算机之间的串行通信，掌握串口数据收发和中断处理。',
      difficulty: 'beginner',
      thumbnail: '/images/experiments/uart-comm.jpg',
      introduction: `
        串口通信是嵌入式系统最常用的通信方式之一，通过UART接口可以实现单片机与计算机或其他设备之间的数据交换。
        本实验将教你如何配置STM32系列的UART外设，实现基本的数据收发功能。
      `,
      objectives: [
        '理解STM32系列UART外设的基本结构和工作原理',
        '学习配置UART参数（波特率、数据位、停止位等）',
        '实现串口数据的发送和接收',
        '掌握串口中断处理方法',
        '了解串口通信的常见应用场景'
      ],
      materials: [
        'STM32系列开发板（如STM32F4、STM32F1或STM32G0系列）',
        'USB转TTL串口模块（如无开发板集成）',
        '连接导线',
        'USB线（连接开发板与电脑）',
        '串口调试助手软件'
      ],
      theory: `
        <h4>UART通信基础</h4>
        <p>
          UART（Universal Asynchronous Receiver/Transmitter，通用异步收发器）是一种串行通信协议，
          特点是使用两根线（TX发送和RX接收）进行全双工通信，不需要时钟线，通信双方需预先约定好通信参数。
        </p>
        <ul>
          <li>波特率：通信速率，常用值有9600、115200等，单位为bps</li>
          <li>数据位：每帧数据的位数，通常为8位</li>
          <li>停止位：表示一帧数据结束的位，可以是1位、1.5位或2位</li>
          <li>校验位：用于数据验证，可以是无校验、偶校验或奇校验</li>
        </ul>
        
        <h4>UART帧格式</h4>
        <p>
          一个标准的UART数据帧包含：
        </p>
        <ul>
          <li>起始位：总是一个低电平位，表示数据传输开始</li>
          <li>数据位：5-9位数据，最低位先传输</li>
          <li>校验位（可选）：用于错误检测</li>
          <li>停止位：1-2位高电平，表示数据传输结束</li>
        </ul>
        
        <h4>STM32 UART特性</h4>
        <p>
          STM32系列的UART外设提供了丰富的功能：
        </p>
        <ul>
          <li>可编程的波特率发生器</li>
          <li>支持5-9位数据格式</li>
          <li>可配置的停止位数量</li>
          <li>多种中断源（发送完成、接收完成、空闲检测等）</li>
          <li>DMA支持，实现高效数据传输</li>
          <li>硬件流控制（部分型号支持）</li>
        </ul>
      `,
      steps: [
        {
          title: '配置GPIO引脚',
          content: `
            <ol>
              <li>使能GPIO和UART时钟</li>
              <li>配置TX引脚为复用推挽输出</li>
              <li>配置RX引脚为浮空输入</li>
            </ol>
          `,
          code: `
// 以STM32F1系列为例，USART1使用PA9(TX)和PA10(RX)
// 使能GPIOA和USART1时钟
RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_USART1EN;

// 配置PA9为复用推挽输出（TX引脚）
GPIOA->CRH &= ~(GPIO_CRH_MODE9 | GPIO_CRH_CNF9);
GPIOA->CRH |= GPIO_CRH_MODE9_0 | GPIO_CRH_MODE9_1 | GPIO_CRH_CNF9_1;

// 配置PA10为浮空输入（RX引脚）
GPIOA->CRH &= ~(GPIO_CRH_MODE10 | GPIO_CRH_CNF10);
GPIOA->CRH |= GPIO_CRH_CNF10_0;
          `
        },
        {
          title: '配置UART参数',
          content: `
            配置USART1的波特率、数据位、停止位等参数：
          `,
          code: `
// 设置波特率为115200
// 假设USART1时钟为72MHz
uint32_t baudrate = 115200;
uint32_t usartdiv = (72000000 + baudrate/2) / baudrate;
USART1->BRR = usartdiv;

// 配置USART1参数：8位数据，1位停止位，无校验
USART1->CR1 &= ~(USART_CR1_M | USART_CR1_PCE);  // 8位数据，无校验
USART1->CR2 &= ~USART_CR2_STOP;  // 1位停止位

// 使能发送和接收
USART1->CR1 |= USART_CR1_TE | USART_CR1_RE;

// 使能USART1
USART1->CR1 |= USART_CR1_UE;
          `
        },
        {
          title: '实现串口发送函数',
          content: `
            编写函数实现串口数据发送：
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
          title: '实现串口接收函数',
          content: `
            编写函数实现串口数据接收：
          `,
          code: `
// 接收单个字符（阻塞方式）
uint8_t UART_ReceiveChar(USART_TypeDef* USARTx)
{
  // 等待接收到数据
  while(!(USARTx->SR & USART_SR_RXNE));
  
  // 返回接收到的数据
  return USARTx->DR;
}

// 通过中断方式接收数据
// 首先在初始化代码中添加：
// USART1->CR1 |= USART_CR1_RXNEIE;  // 使能接收中断
// NVIC_EnableIRQ(USART1_IRQn);      // 使能USART1中断
          `
        },
        {
          title: '实现串口中断处理',
          content: `
            编写USART1中断服务函数：
          `,
          code: `
// 定义一个缓冲区存储接收到的数据
#define RX_BUFFER_SIZE 64
uint8_t rxBuffer[RX_BUFFER_SIZE];
uint16_t rxIndex = 0;

// USART1中断服务函数
void USART1_IRQHandler(void)
{
  // 检查是否为接收中断
  if(USART1->SR & USART_SR_RXNE)
  {
    // 读取接收到的数据
    uint8_t data = USART1->DR;
    
    // 存储到缓冲区
    if(rxIndex < RX_BUFFER_SIZE)
    {
      rxBuffer[rxIndex++] = data;
    }
    
    // 回显接收到的字符（可选）
    UART_SendChar(USART1, data);
  }
}
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的串口通信示例，实现数据收发和回显功能：
          `,
          code: `
#include "stm32f10x.h"  // 以STM32F1系列为例
#include <string.h>

// 函数声明
void SystemClock_Config(void);
void UART_Init(void);
void UART_SendChar(USART_TypeDef* USARTx, uint8_t c);
void UART_SendString(USART_TypeDef* USARTx, const char* str);
uint8_t UART_ReceiveChar(USART_TypeDef* USARTx);

// 定义接收缓冲区
#define RX_BUFFER_SIZE 64
uint8_t rxBuffer[RX_BUFFER_SIZE];
uint16_t rxIndex = 0;

int main(void)
{
  // 系统时钟配置（假设已经配置为72MHz）
  SystemClock_Config();
  
  // 初始化UART
  UART_Init();
  
  // 发送欢迎信息
  UART_SendString(USART1, "\\r\\nSTM32 UART Example\\r\\n");
  UART_SendString(USART1, "Type something and press Enter...\\r\\n");
  
  while (1)
  {
    // 主循环中可以处理接收到的数据
    // 此处采用中断方式接收，主循环可以执行其他任务
  }
}

void UART_Init(void)
{
  // 使能GPIOA和USART1时钟
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_USART1EN;
  
  // 配置PA9为复用推挽输出（TX引脚）
  GPIOA->CRH &= ~(GPIO_CRH_MODE9 | GPIO_CRH_CNF9);
  GPIOA->CRH |= GPIO_CRH_MODE9_0 | GPIO_CRH_MODE9_1 | GPIO_CRH_CNF9_1;
  
  // 配置PA10为浮空输入（RX引脚）
  GPIOA->CRH &= ~(GPIO_CRH_MODE10 | GPIO_CRH_CNF10);
  GPIOA->CRH |= GPIO_CRH_CNF10_0;
  
  // 设置波特率为115200
  // 假设USART1时钟为72MHz
  uint32_t baudrate = 115200;
  uint32_t usartdiv = (72000000 + baudrate/2) / baudrate;
  USART1->BRR = usartdiv;
  
  // 配置USART1参数：8位数据，1位停止位，无校验
  USART1->CR1 &= ~(USART_CR1_M | USART_CR1_PCE);  // 8位数据，无校验
  USART1->CR2 &= ~USART_CR2_STOP;  // 1位停止位
  
  // 使能接收中断
  USART1->CR1 |= USART_CR1_RXNEIE;
  
  // 使能发送和接收
  USART1->CR1 |= USART_CR1_TE | USART_CR1_RE;
  
  // 使能USART1
  USART1->CR1 |= USART_CR1_UE;
  
  // 使能USART1中断
  NVIC_SetPriority(USART1_IRQn, NVIC_EncodePriority(NVIC_GetPriorityGrouping(), 1, 0));
  NVIC_EnableIRQ(USART1_IRQn);
}

void UART_SendChar(USART_TypeDef* USARTx, uint8_t c)
{
  // 等待发送缓冲区为空
  while(!(USARTx->SR & USART_SR_TXE));
  
  // 发送数据
  USARTx->DR = c;
}

void UART_SendString(USART_TypeDef* USARTx, const char* str)
{
  while(*str)
  {
    UART_SendChar(USARTx, *str++);
  }
}

uint8_t UART_ReceiveChar(USART_TypeDef* USARTx)
{
  // 等待接收到数据
  while(!(USARTx->SR & USART_SR_RXNE));
  
  // 返回接收到的数据
  return USARTx->DR;
}

// USART1中断服务函数
void USART1_IRQHandler(void)
{
  // 检查是否为接收中断
  if(USART1->SR & USART_SR_RXNE)
  {
    // 读取接收到的数据
    uint8_t data = USART1->DR;
    
    // 存储到缓冲区
    if(rxIndex < RX_BUFFER_SIZE)
    {
      rxBuffer[rxIndex++] = data;
    }
    
    // 回显接收到的字符
    UART_SendChar(USART1, data);
    
    // 如果收到回车符，处理接收到的命令
    if(data == '\\r')
    {
      UART_SendChar(USART1, '\\n');  // 发送换行
      
      // 在缓冲区末尾添加字符串结束符
      if(rxIndex < RX_BUFFER_SIZE)
      {
        rxBuffer[rxIndex] = '\\0';
      }
      else
      {
        rxBuffer[RX_BUFFER_SIZE-1] = '\\0';
      }
      
      // 发送确认信息
      UART_SendString(USART1, "\\r\\nYou typed: ");
      UART_SendString(USART1, (char*)rxBuffer);
      UART_SendString(USART1, "\\r\\n");
      
      // 清空缓冲区，准备接收新的数据
      rxIndex = 0;
      memset(rxBuffer, 0, RX_BUFFER_SIZE);
    }
  }
}
          `
        }
      ],
      challenges: [
        '实现串口命令解析器，识别特定命令并执行相应操作',
        '使用DMA方式实现高效的数据传输，减少CPU占用',
        '实现串口与PC之间的文件传输功能',
        '通过串口控制开发板上的外设（如LED、蜂鸣器等）'
      ],
      resourceLinks: [
        {
          title: 'STM32系列参考手册 - USART章节',
          url: 'https://www.st.com/resource/en/reference_manual/dm00031020-stm32f405-415-stm32f407-417-stm32f427-437-and-stm32f429-439-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf',
          type: 'documentation'
        },
        {
          title: 'STM32 UART通信应用笔记',
          url: 'https://www.st.com/resource/en/application_note/an3156-usart-protocol-used-in-the-stm32-bootloader-stmicroelectronics.pdf',
          type: 'tutorial'
        }
      ],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
    },
    // 可以添加更多实验...
  };
  
  return experiments[id] || null;
};

function UartExperimentPage() {
  const { id } = useParams();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('introduction');
  
  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    setTimeout(() => {
      const data = getExperimentData(id);
      setExperiment(data);
      setLoading(false);
    }, 500);
  }, [id]);
  
  // 获取难度标签
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">实验未找到</h2>
        <p className="text-gray-600 mb-6">找不到ID为 "{id}" 的串口实验</p>
        <Link
          to="/uart/experiments"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          返回串口实验列表
        </Link>
      </div>
    );
  }

  // 难度标签
  const badge = getDifficultyBadge(experiment.difficulty);

  return (
    <div className="py-8">
      {/* 实验标题和基本信息 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/uart/experiments"
            className="text-primary-600 hover:underline mr-2"
          >
            串口实验
          </Link>
          <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span className="text-gray-600">{experiment.title}</span>
        </div>
        
        <h1 className="text-3xl font-bold">{experiment.title}</h1>
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.text}
          </span>
          <span className="text-gray-500 text-sm ml-4">最后更新: {experiment.updatedAt}</span>
        </div>
      </div>
      
      {/* 实验内容和导航 */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧导航 */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <nav className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'introduction' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('introduction')}
              >
                介绍
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'objectives' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('objectives')}
              >
                学习目标
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'materials' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('materials')}
              >
                所需材料
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'theory' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('theory')}
              >
                理论基础
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'steps' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('steps')}
              >
                实验步骤
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'challenges' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('challenges')}
              >
                挑战任务
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'resources' ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                相关资源
              </button>
            </nav>
          </div>
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 内容展示 */}
            {activeTab === 'introduction' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">实验介绍</h2>
                <div className="mb-6 h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={experiment.thumbnail} 
                    alt={experiment.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `
                        <div class="flex items-center justify-center h-full">
                          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
                <p className="text-gray-700 whitespace-pre-line">{experiment.introduction}</p>
              </div>
            )}
            
            {activeTab === 'objectives' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">学习目标</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {experiment.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'materials' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">所需材料</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {experiment.materials.map((material, index) => (
                    <li key={index} className="text-gray-700">{material}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'theory' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">理论基础</h2>
                <div 
                  className="text-gray-700 theory-content"
                  dangerouslySetInnerHTML={{ __html: experiment.theory }}
                />
              </div>
            )}
            
            {activeTab === 'steps' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">实验步骤</h2>
                <div className="space-y-8">
                  {experiment.steps.map((step, index) => (
                    <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-xl font-semibold mb-3">
                        <span className="inline-block w-8 h-8 bg-primary-600 text-white rounded-full text-center leading-8 mr-2">
                          {index + 1}
                        </span>
                        {step.title}
                      </h3>
                      <div 
                        className="text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: step.content }}
                      />
                      {step.code && (
                        <div className="bg-gray-800 rounded-md overflow-hidden">
                          <pre className="p-4 text-gray-100 overflow-x-auto">
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
                <h2 className="text-2xl font-bold mb-4">挑战任务</h2>
                <p className="text-gray-700 mb-4">完成基本实验后，尝试以下挑战以加深对串口通信的理解：</p>
                <ul className="list-disc pl-5 space-y-2">
                  {experiment.challenges.map((challenge, index) => (
                    <li key={index} className="text-gray-700">{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">相关资源</h2>
                <div className="space-y-4">
                  {experiment.resourceLinks.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3">
                        {resource.type === 'documentation' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{resource.title}</h3>
                        <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 底部导航 */}
          <div className="mt-8 flex justify-between">
            <Link
              to="/uart/experiments"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回实验列表
            </Link>
            
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => window.open(`/code-generator?preset=uart&ref=${experiment.id}`, '_blank')}
            >
              生成实验代码
              <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UartExperimentPage; 