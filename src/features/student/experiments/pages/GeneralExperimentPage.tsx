/**
 * 通用实验页面
 * 
 * 处理所有类型的实验，包括：
 * - 通信类实验（UART）
 * - 模拟信号类实验（ADC、DAC）
 * - 显示类实验（LCD）
 * - 综合项目类实验
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import ExperimentLayout from '../components/common/ExperimentLayout';
import HardwareConnection from '../components/hardware/HardwareConnection';
import KnowledgePoints from '../components/knowledge/KnowledgePoints';
import { EXPERIMENT_URL_TO_ID } from '../types/experimentTypes';

// 实验名称映射
const EXPERIMENT_NAME_MAP: Record<string, string> = {
  'uart': '串口通信',
  'uart_transrecvint': '串口中断收发',
  'adc': '模数转换',
  'adcmq2': 'ADC气体传感器',
  'dacvoltageout': 'DAC电压输出',
  'dacwave': 'DAC波形生成',
  'lcd': 'LCD显示',
  'smartecowatch': '智能环境监测系统',
  'autopark': '智能自动泊车系统',
  'fitband': '智能健身手环',
  'optitracer': '光学追踪器'
};

// 实验分类映射
const EXPERIMENT_CATEGORY_MAP: Record<string, string> = {
  'uart': 'intermediate',
  'uart_transrecvint': 'intermediate',
  'adc': 'advanced',
  'adcmq2': 'advanced',
  'dacvoltageout': 'advanced',
  'dacwave': 'advanced',
  'lcd': 'intermediate',
  'smartecowatch': 'project',
  'autopark': 'project',
  'fitband': 'project',
  'optitracer': 'project'
};

const GeneralExperimentPage: React.FC = () => {
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
        // 检查实验是否存在
        if (!EXPERIMENT_NAME_MAP[experimentName]) {
          setError('实验不存在');
          return;
        }

        // 模拟加载实验数据
        const category = EXPERIMENT_CATEGORY_MAP[experimentName] || 'basic';
        const difficulty = category === 'project' ? 3 : category === 'advanced' ? 3 : 2;
        const estimatedTime = category === 'project' ? 120 : category === 'advanced' ? 90 : 60;

        const experimentData = {
          id: experimentName,
          name: EXPERIMENT_NAME_MAP[experimentName],
          description: `${EXPERIMENT_NAME_MAP[experimentName]}实验详情`,
          category,
          difficulty,
          estimatedTime,
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
      'uart': [
        {
          title: 'UART通信原理',
          content: 'UART（通用异步收发器）是一种异步串行通信协议。数据以帧的形式传输，每帧包含起始位、数据位、可选的奇偶校验位和停止位。'
        }
      ],
      'adc': [
        {
          title: 'ADC工作原理',
          content: 'ADC（模数转换器）将连续的模拟信号转换为离散的数字信号。STM32的ADC采用逐次逼近型结构，具有12位分辨率。'
        }
      ],
      'lcd': [
        {
          title: 'LCD显示原理',
          content: 'LCD1602是字符型液晶显示器，通过并行接口与MCU通信。需要按照特定的时序发送命令和数据来控制显示内容。'
        }
      ]
    };
    
    return principles[expName] || [
      {
        title: '实验原理',
        content: '本实验基于STM32微控制器，通过相应的外设实现特定功能。'
      }
    ];
  };

  // 获取实验目的
  const getExperimentPurposes = (expName: string) => {
    const purposes: Record<string, string[]> = {
      'uart': [
        '掌握UART通信的配置方法',
        '理解串行通信的工作原理',
        '学习数据收发的实现技术',
        '培养通信协议的设计思维'
      ],
      'adc': [
        '掌握ADC的配置和使用方法',
        '理解模拟信号采集的原理',
        '学习数据转换和处理技术',
        '培养信号处理的工程思维'
      ],
      'lcd': [
        '掌握LCD显示器的驱动方法',
        '理解并行接口的时序控制',
        '学习字符显示的实现技术',
        '培养人机界面的设计思维'
      ]
    };
    
    return purposes[expName] || [
      '掌握相关外设的使用方法',
      '理解硬件工作原理',
      '培养系统设计能力'
    ];
  };

  // 获取实验步骤
  const getExperimentSteps = (expName: string) => {
    const steps: Record<string, Array<{ title: string; description: string; code?: string; note?: string }>> = {
      'uart': [
        {
          title: '配置UART参数',
          description: '设置波特率、数据位、停止位等参数',
          code: 'huart1.Instance = USART1;\nhuart1.Init.BaudRate = 115200;\nhuart1.Init.WordLength = UART_WORDLENGTH_8B;'
        },
        {
          title: '发送数据',
          description: '使用HAL库函数发送数据',
          code: 'HAL_UART_Transmit(&huart1, (uint8_t*)data, strlen(data), HAL_MAX_DELAY);'
        }
      ],
      'adc': [
        {
          title: '配置ADC通道',
          description: '选择ADC通道并配置采样参数',
          code: 'sConfig.Channel = ADC_CHANNEL_0;\nsConfig.Rank = ADC_REGULAR_RANK_1;\nsConfig.SamplingTime = ADC_SAMPLETIME_55CYCLES_5;'
        },
        {
          title: '启动转换',
          description: '启动ADC转换并读取结果',
          code: 'HAL_ADC_Start(&hadc1);\nHAL_ADC_PollForConversion(&hadc1, HAL_MAX_DELAY);\nvalue = HAL_ADC_GetValue(&hadc1);'
        }
      ]
    };
    
    return steps[expName] || [
      {
        title: '基础配置',
        description: '配置相关外设的基本参数',
        note: '确保配置参数正确'
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

export default GeneralExperimentPage;
