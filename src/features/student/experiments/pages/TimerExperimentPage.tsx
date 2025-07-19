/**
 * 定时器类实验页面
 * 
 * 包含定时控制类实验：
 * - 定时器基础、定时器PWM
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import ExperimentLayout from '../components/common/ExperimentLayout';
import HardwareConnection from '../components/hardware/HardwareConnection';
import KnowledgePoints from '../components/knowledge/KnowledgePoints';

// 定时器类实验ID列表
const TIMER_EXPERIMENT_IDS = ['8', '11'];

// 实验名称映射
const EXPERIMENT_NAME_MAP: Record<string, string> = {
  'timbase': '定时器基础',
  'timpwm': '定时器PWM'
};

const TimerExperimentPage: React.FC = () => {
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
          category: 'intermediate',
          difficulty: 2,
          estimatedTime: 60,
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
      'timbase': [
        {
          title: '定时器工作原理',
          content: 'STM32定时器是基于计数器的外设，通过预分频器对系统时钟进行分频，然后计数器按照分频后的时钟进行计数。当计数值达到设定的重载值时，产生溢出事件，可以触发中断。'
        },
        {
          title: '中断处理机制',
          content: '定时器溢出时会产生中断请求，CPU响应中断并执行中断服务程序。在中断服务程序中可以执行特定的任务，如LED状态切换、计数器更新等。'
        }
      ],
      'timpwm': [
        {
          title: 'PWM工作原理',
          content: 'PWM（脉宽调制）是一种通过改变脉冲宽度来控制平均功率的技术。STM32定时器可以生成PWM信号，通过调节占空比来控制输出的平均电压。'
        },
        {
          title: '占空比控制',
          content: '占空比是高电平时间占整个周期时间的比例。通过改变比较寄存器的值，可以调节PWM信号的占空比，从而实现对LED亮度、电机速度等的控制。'
        }
      ]
    };
    
    return principles[expName] || [
      {
        title: '定时器基础原理',
        content: '定时器是STM32中重要的外设，可以实现精确定时、PWM输出、输入捕获等多种功能。'
      }
    ];
  };

  // 获取实验目的
  const getExperimentPurposes = (expName: string) => {
    const purposes: Record<string, string[]> = {
      'timbase': [
        '掌握STM32定时器的基本配置方法',
        '理解定时器中断的工作原理',
        '学习精确定时的实现方法',
        '培养实时系统的设计思维'
      ],
      'timpwm': [
        '掌握PWM信号的生成方法',
        '理解占空比控制的原理',
        '学习模拟输出的实现技术',
        '培养信号处理的工程思维'
      ]
    };
    
    return purposes[expName] || [
      '掌握STM32定时器的使用方法',
      '理解时间控制的重要性',
      '培养精确控制的编程能力'
    ];
  };

  // 获取实验步骤
  const getExperimentSteps = (expName: string) => {
    const steps: Record<string, Array<{ title: string; description: string; code?: string; note?: string }>> = {
      'timbase': [
        {
          title: '配置定时器时钟',
          description: '使能定时器时钟，配置预分频器和重载值',
          code: '__HAL_RCC_TIM2_CLK_ENABLE();\nhtim2.Instance = TIM2;\nhtim2.Init.Prescaler = 7199;\nhtim2.Init.Period = 9999;',
          note: '预分频器和重载值决定了定时器的溢出频率'
        },
        {
          title: '配置定时器中断',
          description: '使能定时器中断，配置中断优先级',
          code: 'HAL_NVIC_SetPriority(TIM2_IRQn, 0, 0);\nHAL_NVIC_EnableIRQ(TIM2_IRQn);'
        },
        {
          title: '编写中断服务程序',
          description: '在中断服务程序中处理定时器溢出事件',
          code: 'void TIM2_IRQHandler(void) {\n  HAL_TIM_IRQHandler(&htim2);\n}'
        },
        {
          title: '启动定时器',
          description: '启动定时器并开始计数',
          code: 'HAL_TIM_Base_Start_IT(&htim2);'
        }
      ],
      'timpwm': [
        {
          title: '配置PWM模式',
          description: '将定时器通道配置为PWM输出模式',
          code: 'sConfigOC.OCMode = TIM_OCMODE_PWM1;\nsConfigOC.Pulse = 5000;\nsConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;'
        },
        {
          title: '设置占空比',
          description: '通过比较寄存器设置PWM的占空比',
          code: '__HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, pulse_value);',
          note: 'pulse_value的值决定了占空比的大小'
        },
        {
          title: '启动PWM输出',
          description: '启动定时器PWM输出',
          code: 'HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);'
        }
      ]
    };
    
    return steps[expName] || [
      {
        title: '基础配置',
        description: '配置定时器的基本参数',
        note: '确保时钟配置正确'
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

export default TimerExperimentPage;
