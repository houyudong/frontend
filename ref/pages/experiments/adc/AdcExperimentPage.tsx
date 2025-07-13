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

// 模拟单个ADC实验的详细数据
const getExperimentData = (id: string): ExperimentData | undefined => {
  // 正常通过后端API获取数据，这里使用静态数据模拟
  const experiments: Record<string, ExperimentData> = {
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
          `
        }
      ]
    }
  };

  return experiments[id];
};

const AdcExperimentPage: React.FC = () => {
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

export default AdcExperimentPage; 