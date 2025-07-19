/**
 * 基础控制类实验页面
 * 
 * 包含GPIO控制和输入处理类实验：
 * - LED基础控制、LED闪烁、LED跑马灯、LED呼吸灯
 * - 按键扫描、按键中断
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { EXPERIMENTS_CONFIG, EXPERIMENT_STATUS } from '../config';
import ExperimentLayout from '../components/common/ExperimentLayout';
import HardwareConnection from '../components/hardware/HardwareConnection';
import KnowledgePoints from '../components/knowledge/KnowledgePoints';

// 基础控制类实验ID列表
const BASIC_EXPERIMENT_IDS = ['2', '3', '4', '5', '6', '7'];

// 实验名称映射
const EXPERIMENT_NAME_MAP: Record<string, string> = {
  'led': 'LED基础控制',
  'ledblink': 'LED闪烁控制',
  'ledbanner': 'LED跑马灯',
  'ledbreath': 'LED呼吸灯',
  'keyscan': '按键扫描',
  'keyint': '按键中断'
};

const BasicExperimentPage: React.FC = () => {
  const { experimentName } = useParams<{ experimentName: string }>();
  const navigate = useNavigate();
  
  const [experiment, setExperiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSTMIDE, setShowSTMIDE] = useState(false);

  // 加载实验详情
  useEffect(() => {
    const loadExperiment = async () => {
      if (!experimentName) return;

      setLoading(true);
      setError(null);

      try {
        // 模拟加载实验数据
        const experimentData = {
          id: experimentName,
          name: EXPERIMENT_NAME_MAP[experimentName] || experimentName,
          description: `${EXPERIMENT_NAME_MAP[experimentName] || experimentName}实验详情`,
          category: 'basic',
          difficulty: 1,
          estimatedTime: 45,
          status: 'not_started',
          progress: 0
        };

        setExperiment(experimentData);
      } catch (err) {
        setError('加载实验失败');
        console.error('加载实验失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [experimentName]);

  // 获取实验原理
  const getExperimentPrinciples = (expName: string) => {
    const principles: Record<string, Array<{ title: string; content: string }>> = {
      'led': [
        {
          title: 'GPIO工作原理',
          content: 'STM32的GPIO（通用输入输出）端口可以配置为输入或输出模式。在输出模式下，可以通过软件控制引脚输出高电平或低电平，从而控制外部设备如LED的亮灭。'
        }
      ],
      'ledblink': [
        {
          title: '延时控制原理',
          content: '通过HAL_Delay()函数实现精确延时，结合GPIO状态切换，可以实现LED的周期性闪烁效果。延时时间决定了闪烁的频率。'
        }
      ],
      'keyscan': [
        {
          title: '按键扫描原理',
          content: '通过轮询方式读取GPIO输入状态，检测按键是否被按下。需要考虑按键抖动问题，通常采用软件延时消抖的方法。'
        }
      ]
    };
    
    return principles[expName] || [
      {
        title: '基础原理',
        content: '本实验基于STM32微控制器的GPIO外设，通过软件控制硬件实现预期功能。'
      }
    ];
  };

  // 获取实验目的
  const getExperimentPurposes = (expName: string) => {
    const purposes: Record<string, string[]> = {
      'led': [
        '掌握STM32 GPIO的基本配置方法',
        '学习使用HAL库控制LED',
        '理解数字输出的工作原理',
        '培养嵌入式编程思维'
      ],
      'ledblink': [
        '掌握延时函数的使用方法',
        '理解程序循环结构的应用',
        '学习LED闪烁控制的实现',
        '培养时序控制的概念'
      ],
      'keyscan': [
        '掌握GPIO输入模式的配置',
        '学习按键扫描的实现方法',
        '理解软件消抖的原理',
        '培养人机交互的设计思维'
      ]
    };
    
    return purposes[expName] || [
      '掌握STM32基础开发技能',
      '理解嵌入式系统工作原理',
      '培养硬件控制编程能力'
    ];
  };

  // 获取实验步骤
  const getExperimentSteps = (expName: string) => {
    const steps: Record<string, Array<{ title: string; description: string; code?: string; note?: string }>> = {
      'led': [
        {
          title: '创建项目',
          description: '使用STM32CubeMX创建新项目，选择STM32F103芯片型号',
          note: '确保选择正确的芯片型号和封装'
        },
        {
          title: '配置GPIO',
          description: '将PC13引脚配置为GPIO输出模式，用于控制LED',
          code: 'GPIO_InitStruct.Pin = GPIO_PIN_13;\nGPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;'
        },
        {
          title: '编写控制代码',
          description: '在主函数中编写LED控制代码',
          code: 'HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);'
        },
        {
          title: '编译下载',
          description: '编译程序并下载到开发板，观察LED状态',
          note: '确保开发板连接正常，下载器工作正常'
        }
      ]
    };
    
    return steps[expName] || [
      {
        title: '准备工作',
        description: '准备开发环境和硬件设备',
        note: '确保所有工具和设备正常工作'
      }
    ];
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !experiment) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
            <p className="text-gray-600 mb-4">{error || '实验不存在'}</p>
            <Link
              to="/student/experiments"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回实验中心
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (showSTMIDE) {
    return (
      <MainLayout>
        <div className="h-screen">
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{experiment.name} - 开发环境</h1>
            <button
              onClick={() => setShowSTMIDE(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              返回实验指导
            </button>
          </div>
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">STM32开发环境</h3>
              <p className="text-gray-600">开发环境将在这里加载</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ExperimentLayout
      experiment={experiment}
      principles={getExperimentPrinciples(experimentName || '')}
      purposes={getExperimentPurposes(experimentName || '')}
      steps={getExperimentSteps(experimentName || '')}
    >
      {/* 硬件连接指导 */}
      <div className="mt-8">
        <HardwareConnection experimentName={experimentName || ''} />
      </div>

      {/* 知识点 */}
      <div className="mt-8">
        <KnowledgePoints experimentName={experimentName || ''} />
      </div>

      {/* 开始实验按钮 */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowSTMIDE(true)}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          启动开发环境
        </button>
      </div>
    </ExperimentLayout>
  );
};

export default BasicExperimentPage;
