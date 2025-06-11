import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 模拟单个ADC实验的详细数据
const getExperimentData = (id) => {
  // 正常通过后端API获取数据，这里使用静态数据模拟
  const experiments = {
    'temperature-sensor': {
      id: 'temperature-sensor',
      title: '温度传感器数据采集',
      description: '学习使用STM32系列的ADC外设采集模拟量，通过ADC将传感器的模拟信号转换为数字信号，并进行数据处理。',
      difficulty: 'intermediate',
      thumbnail: '/images/experiments/temp-sensor.jpg',
      introduction: `
        模数转换器（ADC）是STM32系列微控制器的重要外设之一，可以将外部的模拟信号转换为微控制器可以处理的数字信号。
        本实验将教你如何使用STM32系列的ADC采集温度传感器数据，并进行简单的数据处理和显示。
      `,
      objectives: [
        '理解ADC的基本工作原理和特性',
        '学习配置STM32系列的ADC外设',
        '实现温度传感器数据的采集和转换',
        '掌握ADC中断和DMA传输方式',
        '学习传感器数据的简单处理和显示方法'
      ],
      materials: [
        'STM32系列开发板（如STM32F4、STM32F1或STM32G0系列）',
        '温度传感器（如LM35、DS18B20或NTC热敏电阻）',
        '连接导线',
        '电阻（根据需要）',
        '串口调试助手（用于数据显示）'
      ],
      theory: `
        <h4>ADC基础知识</h4>
        <p>
          模数转换器（Analog-to-Digital Converter，ADC）是将连续的模拟信号转换为离散的数字信号的器件。
          STM32系列微控制器内置了高性能的ADC模块，具有以下特点：
        </p>
        <ul>
          <li>分辨率：STM32的ADC一般为12位分辨率，可以将模拟信号分成4096级</li>
          <li>采样率：最高可达数兆赫兹的采样速率</li>
          <li>多通道：支持多达16个外部通道和内部通道（如内部温度传感器、参考电压等）</li>
          <li>转换模式：支持单次转换和连续转换</li>
          <li>触发源：软件触发或外部事件触发</li>
          <li>DMA支持：可通过DMA自动传输转换结果，减轻CPU负担</li>
        </ul>

        <h4>温度传感器基础</h4>
        <p>
          在本实验中，我们使用的温度传感器可以是：
        </p>
        <ul>
          <li>LM35：线性温度传感器，输出电压与温度成正比，典型值为每摄氏度10mV</li>
          <li>NTC热敏电阻：阻值随温度变化而变化的电阻，需要通过分压电路转换为电压</li>
          <li>STM32内部温度传感器：某些STM32微控制器内置了温度传感器，可直接使用</li>
        </ul>

        <h4>ADC数据转换</h4>
        <p>
          将ADC读取的数值转换为实际温度需要进行计算：
        </p>
        <pre>
          对于LM35：温度(°C) = ADC读数 × 参考电压 / 4096 × 100
          对于STM32内部温度传感器：温度(°C) = ((V25 - VSENSE) / Avg_Slope) + 25
          其中V25和Avg_Slope是芯片特定的参数，可在数据手册中查找
        </pre>
      `,
      steps: [
        {
          title: '配置GPIO引脚',
          content: `
            <ol>
              <li>使能ADC和GPIO时钟</li>
              <li>配置相应GPIO引脚为模拟输入模式</li>
            </ol>
          `,
          code: `
// 以STM32F1系列为例，使用PA0作为ADC输入引脚
// 使能GPIOA和ADC1时钟
RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_ADC1EN;

// 配置PA0为模拟输入
GPIOA->CRL &= ~(GPIO_CRL_MODE0 | GPIO_CRL_CNF0);  // 清除之前的配置
// 模拟输入模式不需要额外配置，保持为0即可
          `
        },
        {
          title: '配置ADC参数',
          content: `
            配置ADC的工作模式、采样时间、转换序列等：
          `,
          code: `
// 复位ADC校准
ADC1->CR2 |= ADC_CR2_ADON;  // 开启ADC
ADC1->CR2 |= ADC_CR2_RSTCAL;  // 开始复位校准
while(ADC1->CR2 & ADC_CR2_RSTCAL);  // 等待复位校准完成

// 开始ADC校准
ADC1->CR2 |= ADC_CR2_CAL;  // 开始校准
while(ADC1->CR2 & ADC_CR2_CAL);  // 等待校准完成

// 配置ADC工作模式
ADC1->CR1 &= ~ADC_CR1_SCAN;  // 禁用扫描模式（本例只使用一个通道）
ADC1->CR2 &= ~ADC_CR2_CONT;  // 禁用连续转换模式（单次转换）
ADC1->CR2 |= ADC_CR2_EXTSEL;  // 设置外部事件选择为SWSTART
ADC1->CR2 |= ADC_CR2_EXTTRIG;  // 使能外部触发

// 设置采样时间，通道0（PA0）
// 设置为最长采样时间239.5周期，确保温度传感器有足够时间稳定
ADC1->SMPR2 &= ~ADC_SMPR2_SMP0;  // 清除之前的设置
ADC1->SMPR2 |= ADC_SMPR2_SMP0_2 | ADC_SMPR2_SMP0_1 | ADC_SMPR2_SMP0_0;  // 设置为239.5周期

// 设置转换序列
ADC1->SQR1 &= ~ADC_SQR1_L;  // 设置转换序列长度为1（1个通道）
ADC1->SQR3 &= ~ADC_SQR3_SQ1;  // 清除之前的设置
ADC1->SQR3 |= 0;  // 设置通道0为第一个转换
          `
        },
        {
          title: '实现ADC采样函数',
          content: `
            编写函数启动ADC转换并读取转换结果：
          `,
          code: `
// 启动ADC转换并返回结果
uint16_t ADC_GetValue(void)
{
  // 开始转换
  ADC1->CR2 |= ADC_CR2_SWSTART;

  // 等待转换完成
  while(!(ADC1->SR & ADC_SR_EOC));

  // 读取转换结果
  return ADC1->DR;
}
          `
        },
        {
          title: '温度计算和显示',
          content: `
            将ADC原始值转换为温度数据：
          `,
          code: `
// 将ADC值转换为温度（以LM35为例）
float ConvertToTemperature(uint16_t adcValue)
{
  // 参考电压为3.3V，LM35输出为10mV/°C
  float voltage = (float)adcValue * 3.3f / 4096.0f;  // 计算电压
  float temperature = voltage * 100.0f;  // 转换为温度

  return temperature;
}
          `
        },
        {
          title: '配置串口发送温度数据',
          content: `
            配置串口，用于向计算机发送温度数据：
          `,
          code: `
// 串口初始化函数省略，与串口实验相同

// 发送温度数据到串口
void SendTemperatureData(float temperature)
{
  char buffer[50];

  // 格式化温度数据
  sprintf(buffer, "Temperature: %.2f°C\\r\\n", temperature);

  // 发送到串口
  UART_SendString(USART1, buffer);
}
          `
        },
        {
          title: '完整示例代码',
          content: `
            下面是一个完整的ADC温度传感器示例代码：
          `,
          code: `
#include "stm32f10x.h"  // 以STM32F1系列为例
#include <stdio.h>
#include <string.h>

// 函数声明
void SystemClock_Config(void);
void ADC_Init(void);
void UART_Init(void);
uint16_t ADC_GetValue(void);
float ConvertToTemperature(uint16_t adcValue);
void UART_SendChar(USART_TypeDef* USARTx, uint8_t c);
void UART_SendString(USART_TypeDef* USARTx, const char* str);
void Delay_ms(uint32_t ms);

int main(void)
{
  // 系统时钟配置（假设已经配置为72MHz）
  SystemClock_Config();

  // 初始化外设
  ADC_Init();
  UART_Init();

  // 发送欢迎信息
  UART_SendString(USART1, "\\r\\nSTM32 ADC Temperature Sensor Example\\r\\n");
  UART_SendString(USART1, "Reading temperature every second...\\r\\n\\r\\n");

  while (1)
  {
    // 读取ADC值
    uint16_t adcValue = ADC_GetValue();

    // 转换为温度
    float temperature = ConvertToTemperature(adcValue);

    // 发送温度数据
    SendTemperatureData(temperature);

    // 延时1秒
    Delay_ms(1000);
  }
}

void ADC_Init(void)
{
  // 使能GPIOA和ADC1时钟
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_ADC1EN;

  // 配置PA0为模拟输入
  GPIOA->CRL &= ~(GPIO_CRL_MODE0 | GPIO_CRL_CNF0);  // 清除之前的配置

  // 复位ADC校准
  ADC1->CR2 |= ADC_CR2_ADON;  // 开启ADC
  ADC1->CR2 |= ADC_CR2_RSTCAL;  // 开始复位校准
  while(ADC1->CR2 & ADC_CR2_RSTCAL);  // 等待复位校准完成

  // 开始ADC校准
  ADC1->CR2 |= ADC_CR2_CAL;  // 开始校准
  while(ADC1->CR2 & ADC_CR2_CAL);  // 等待校准完成

  // 配置ADC工作模式
  ADC1->CR1 &= ~ADC_CR1_SCAN;  // 禁用扫描模式
  ADC1->CR2 &= ~ADC_CR2_CONT;  // 禁用连续转换模式
  ADC1->CR2 |= ADC_CR2_EXTSEL;  // 设置外部事件选择为SWSTART
  ADC1->CR2 |= ADC_CR2_EXTTRIG;  // 使能外部触发

  // 设置采样时间，通道0（PA0）
  ADC1->SMPR2 &= ~ADC_SMPR2_SMP0;  // 清除之前的设置
  ADC1->SMPR2 |= ADC_SMPR2_SMP0_2 | ADC_SMPR2_SMP0_1 | ADC_SMPR2_SMP0_0;  // 设置为239.5周期

  // 设置转换序列
  ADC1->SQR1 &= ~ADC_SQR1_L;  // 设置转换序列长度为1
  ADC1->SQR3 &= ~ADC_SQR3_SQ1;  // 清除之前的设置
  ADC1->SQR3 |= 0;  // 设置通道0为第一个转换
}

uint16_t ADC_GetValue(void)
{
  // 开始转换
  ADC1->CR2 |= ADC_CR2_SWSTART;

  // 等待转换完成
  while(!(ADC1->SR & ADC_SR_EOC));

  // 读取转换结果
  return ADC1->DR;
}

float ConvertToTemperature(uint16_t adcValue)
{
  // 参考电压为3.3V，LM35输出为10mV/°C
  float voltage = (float)adcValue * 3.3f / 4096.0f;  // 计算电压
  float temperature = voltage * 100.0f;  // 转换为温度

  return temperature;
}

void SendTemperatureData(float temperature)
{
  char buffer[50];

  // 格式化温度数据
  sprintf(buffer, "Temperature: %.2f°C\\r\\n", temperature);

  // 发送到串口
  UART_SendString(USART1, buffer);
}

// 串口初始化和发送函数（与串口实验相同）
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

  // 使能发送和接收
  USART1->CR1 |= USART_CR1_TE | USART_CR1_RE;

  // 使能USART1
  USART1->CR1 |= USART_CR1_UE;
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

// 简单的延时函数
void Delay_ms(uint32_t ms)
{
  uint32_t i;
  for (i = 0; i < ms * 10000; i++) {
    __NOP();  // 空操作
  }
}
          `
        }
      ],
      challenges: [
        '实现多通道ADC采集，同时读取多个传感器数据',
        '使用DMA方式实现ADC数据的自动传输，提高效率',
        '添加滤波算法，如移动平均滤波，提高温度读数的稳定性',
        '实现温度报警功能，当温度超过阈值时触发警报',
        '将温度数据绘制成曲线图，通过LCD或串口显示'
      ],
      resourceLinks: [
        {
          title: 'STM32系列参考手册 - ADC章节',
          url: 'https://www.st.com/resource/en/reference_manual/dm00031020-stm32f405-415-stm32f407-417-stm32f427-437-and-stm32f429-439-advanced-arm-based-32-bit-mcus-stmicroelectronics.pdf',
          type: 'documentation'
        },
        {
          title: 'STM32 ADC编程指南',
          url: 'https://www.st.com/resource/en/application_note/an3116-stm32s-adc-modes-and-their-applications-stmicroelectronics.pdf',
          type: 'tutorial'
        },
        {
          title: 'LM35温度传感器数据手册',
          url: 'https://www.ti.com/lit/ds/symlink/lm35.pdf',
          type: 'documentation'
        }
      ],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-14',
    },
    // 可以添加更多实验...
  };

  return experiments[id] || null;
};

/**
 * AdcExperimentPage - ADC实验详情页面
 *
 * 显示ADC（模数转换器）实验的详细信息，包括实验介绍、学习目标、所需材料、
 * 理论基础、实验步骤、挑战任务和相关资源。支持通过URL参数加载不同的实验。
 *
 * @component
 * @example
 * ```jsx
 * <AdcExperimentPage />
 * ```
 *
 * @returns {ReactElement} AdcExperimentPage组件
 */
function AdcExperimentPage() {
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
        <p className="text-gray-600 mb-6">找不到ID为 "{id}" 的ADC实验</p>
        <Link
          to="/adc/experiments"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          返回ADC实验列表
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
            to="/adc/experiments"
            className="text-primary-600 hover:underline mr-2"
          >
            ADC实验
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
                <p className="text-gray-700 mb-4">完成基本实验后，尝试以下挑战以加深对ADC的理解：</p>
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
              to="/adc/experiments"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回实验列表
            </Link>

            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => window.open(`/code-generator?preset=adc&ref=${experiment.id}`, '_blank')}
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

export default AdcExperimentPage;