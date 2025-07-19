/**
 * 知识点组件
 * 
 * 重构版本，遵循DRY原则和奥卡姆法则
 */

import React, { useState } from 'react';

interface KnowledgePointsProps {
  experimentName: string;
}

// 简化的知识点生成
const getKnowledgePoints = (experimentName: string) => {
  const name = experimentName?.toLowerCase() || '';
  
  // GPIO类实验知识点
  if (name.includes('led')) {
    return {
      prerequisites: [
        { title: "C语言基础", description: "掌握C语言的基本语法、变量、函数等概念" },
        { title: "数字电路基础", description: "了解数字逻辑、二进制、逻辑门等基本概念" }
      ],
      core: [
        { title: "GPIO工作原理", description: "理解STM32 GPIO的配置和控制方法" },
        { title: "HAL库使用", description: "掌握STM32 HAL库的基本函数调用" }
      ],
      extended: [
        { title: "嵌入式系统设计", description: "理解嵌入式系统的设计思想和开发流程" }
      ]
    };
  }
  
  // 按键类实验知识点
  if (name.includes('按键') || name.includes('key')) {
    return {
      prerequisites: [
        { title: "GPIO基础", description: "掌握GPIO输入输出的基本概念" },
        { title: "中断概念", description: "了解中断的基本原理和应用场景" }
      ],
      core: [
        { title: "按键扫描", description: "理解按键扫描的算法和实现方法" },
        { title: "软件消抖", description: "掌握软件消抖的原理和实现" }
      ],
      extended: [
        { title: "人机交互设计", description: "理解用户界面和交互设计的基本原则" }
      ]
    };
  }
  
  // 定时器类实验知识点
  if (name.includes('定时器') || name.includes('tim')) {
    return {
      prerequisites: [
        { title: "时钟系统", description: "了解STM32的时钟树和时钟配置" },
        { title: "寄存器操作", description: "掌握寄存器的读写和位操作" }
      ],
      core: [
        { title: "定时器原理", description: "理解定时器的工作原理和配置方法" },
        { title: "PWM技术", description: "掌握PWM信号的生成和应用" }
      ],
      extended: [
        { title: "信号处理", description: "了解数字信号处理的基本概念" }
      ]
    };
  }
  
  // 串口类实验知识点
  if (name.includes('串口') || name.includes('uart')) {
    return {
      prerequisites: [
        { title: "通信基础", description: "了解串行通信的基本概念" },
        { title: "协议原理", description: "掌握UART通信协议" }
      ],
      core: [
        { title: "串口配置", description: "理解波特率、数据位、停止位等参数" },
        { title: "数据收发", description: "掌握串口数据的发送和接收方法" }
      ],
      extended: [
        { title: "通信协议", description: "了解各种通信协议的设计和应用" }
      ]
    };
  }
  
  // ADC类实验知识点
  if (name.includes('adc') || name.includes('模数')) {
    return {
      prerequisites: [
        { title: "模拟电路", description: "了解模拟信号的基本概念" },
        { title: "采样理论", description: "掌握信号采样的基本原理" }
      ],
      core: [
        { title: "ADC原理", description: "理解模数转换的工作原理" },
        { title: "精度控制", description: "掌握提高转换精度的方法" }
      ],
      extended: [
        { title: "信号处理", description: "了解数字信号处理技术" }
      ]
    };
  }
  
  // 默认知识点
  return {
    prerequisites: [
      { title: "C语言基础", description: "掌握C语言的基本语法和编程概念" },
      { title: "微控制器基础", description: "了解微控制器的基本架构和工作原理" }
    ],
    core: [
      { title: "STM32基础", description: "掌握STM32微控制器的基本特性和开发方法" },
      { title: "HAL库", description: "学会使用STM32 HAL库进行开发" }
    ],
    extended: [
      { title: "嵌入式系统", description: "理解嵌入式系统的设计和开发流程" }
    ]
  };
};

const KnowledgePoints: React.FC<KnowledgePointsProps> = ({ experimentName }) => {
  const [activeSection, setActiveSection] = useState<'prerequisites' | 'core' | 'extended'>('core');
  const knowledgePoints = getKnowledgePoints(experimentName);

  const sections = [
    { key: 'prerequisites', title: '前置知识', icon: '📚', color: 'blue' },
    { key: 'core', title: '核心知识', icon: '🎯', color: 'green' },
    { key: 'extended', title: '扩展知识', icon: '🚀', color: 'purple' }
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <span className="text-2xl mr-2">💡</span>
        相关知识点
      </h2>

      {/* 知识点分类标签 */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeSection === section.key
                ? `bg-${section.color}-600 text-white`
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-1">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* 知识点内容 */}
      <div className="space-y-4">
        {knowledgePoints[activeSection].map((point, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
            <p className="text-sm text-gray-600">{point.description}</p>
          </div>
        ))}
      </div>

      {/* 学习建议 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 学习建议</h3>
        <p className="text-sm text-blue-800">
          建议按照"前置知识 → 核心知识 → 扩展知识"的顺序进行学习，
          确保每个阶段的知识点都能熟练掌握后再进入下一阶段。
        </p>
      </div>
    </div>
  );
};

export default KnowledgePoints;
