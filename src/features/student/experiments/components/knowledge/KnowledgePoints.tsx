/**
 * 知识点组件
 * 
 * 重构版本，遵循DRY原则和奥卡姆法则
 */

import React, { useState } from 'react';

interface KnowledgePointsProps {
  experimentName: string;
}

interface KnowledgePoint {
  title: string;
  description: string;
}

interface KnowledgePointsData {
  prerequisites: KnowledgePoint[];
  core: KnowledgePoint[];
  extended: KnowledgePoint[];
}

// 简化的知识点生成
const getKnowledgePoints = (experimentName: string): KnowledgePointsData => {
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
  if (name.includes('timer') || name.includes('定时器')) {
    return {
      prerequisites: [
        { title: "时钟系统", description: "理解STM32的时钟树和时钟配置" },
        { title: "中断系统", description: "掌握中断的配置和处理方法" }
      ],
      core: [
        { title: "定时器原理", description: "理解定时器的工作原理和配置方法" },
        { title: "PWM生成", description: "掌握PWM信号的生成和控制" }
      ],
      extended: [
        { title: "实时系统", description: "理解实时系统的设计和时间管理" }
      ]
    };
  }
  
  // 串口类实验知识点
  if (name.includes('uart') || name.includes('串口')) {
    return {
      prerequisites: [
        { title: "通信协议", description: "了解串行通信的基本原理和协议" },
        { title: "中断处理", description: "掌握中断的配置和服务程序编写" }
      ],
      core: [
        { title: "UART配置", description: "理解UART的配置参数和初始化方法" },
        { title: "数据收发", description: "掌握串口数据的发送和接收方法" }
      ],
      extended: [
        { title: "通信协议栈", description: "理解复杂通信协议的设计和实现" }
      ]
    };
  }
  
  // 默认知识点
  return {
    prerequisites: [
      { title: "嵌入式基础", description: "了解嵌入式系统的基本概念和特点" },
      { title: "C语言编程", description: "掌握C语言的基本语法和编程技巧" }
    ],
    core: [
      { title: "STM32基础", description: "理解STM32微控制器的基本架构和特性" },
      { title: "HAL库应用", description: "掌握STM32 HAL库的使用方法" }
    ],
    extended: [
      { title: "系统优化", description: "理解嵌入式系统的性能优化方法" }
    ]
  };
};

const KnowledgePoints: React.FC<KnowledgePointsProps> = ({ experimentName }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const knowledgePoints = getKnowledgePoints(experimentName);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderKnowledgeSection = (
    title: string,
    points: KnowledgePoint[],
    sectionKey: string,
    color: string,
    icon: string
  ) => {
    const isExpanded = expandedSection === sectionKey;
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className={`px-4 py-3 bg-${color}-50 border-b border-gray-200 cursor-pointer`}
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{icon}</span>
              <div>
                <h4 className={`font-semibold text-${color}-900`}>{title}</h4>
                <p className={`text-sm text-${color}-700`}>{points.length} 个知识点</p>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-${color}-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 space-y-3">
            {points.map((point, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 bg-${color}-100 text-${color}-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 mb-1">{point.title}</h5>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">相关知识点</h3>
        <p className="text-sm text-gray-600">
          本实验涉及的前置知识、核心概念和扩展内容
        </p>
      </div>

      <div className="space-y-4">
        {/* 前置知识 */}
        {knowledgePoints.prerequisites.length > 0 && 
          renderKnowledgeSection(
            "前置知识",
            knowledgePoints.prerequisites,
            "prerequisites",
            "blue",
            "📚"
          )
        }

        {/* 核心知识点 */}
        {knowledgePoints.core.length > 0 && 
          renderKnowledgeSection(
            "核心知识点",
            knowledgePoints.core,
            "core",
            "green",
            "🎯"
          )
        }

        {/* 扩展知识 */}
        {knowledgePoints.extended.length > 0 && 
          renderKnowledgeSection(
            "扩展知识",
            knowledgePoints.extended,
            "extended",
            "purple",
            "🚀"
          )
        }
      </div>

      {/* 学习建议 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">学习建议</h4>
            <p className="text-sm text-yellow-800">
              建议按照前置知识 → 核心知识点 → 扩展知识的顺序进行学习，
              确保每个阶段的知识点都能充分理解后再进入下一阶段。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePoints;
