/**
 * 定时器类实验页面
 * 
 * 包含定时控制类实验：
 * - 定时器基础、定时器PWM
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout, LoadingPage } from '../../../pages';
import STMIDEWrapper from '../../stmIde/STMIDEWrapper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useExperiments } from '../stores/experimentStore';
import { experimentService } from '../services/experimentService';
import { EXPERIMENTS_CONFIG, DIFFICULTY_LEVELS, EXPERIMENT_STATUS } from '../config';
import { 
  getDifficultyColorClass, 
  getStatusColorClass,
  getExperimentConfig 
} from '../utils/experimentUtils';

// 定时器类实验ID列表
const TIMER_EXPERIMENT_IDS = ['8', '11'];

const TimerExperimentPage: React.FC = () => {
  const { experimentName } = useParams<{ experimentName: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userExperiments, startExperiment, deleteExperiment, loadUserExperiments } = useExperiments();
  
  const [experiment, setExperiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSTMIDE, setShowSTMIDE] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // 加载实验详情
  useEffect(() => {
    const loadExperiment = async () => {
      if (!experimentName) return;

      setLoading(true);
      setError(null);

      try {
        const template = await experimentService.getExperimentTemplateByUrl(experimentName);
        if (template && TIMER_EXPERIMENT_IDS.includes(template.id)) {
          setExperiment(template);
        } else {
          setError('实验未找到或不属于定时器类');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载实验失败');
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [experimentName]);

  // 加载用户实验数据
  useEffect(() => {
    if (user?.id) {
      loadUserExperiments(user.id);
    }
  }, [user?.id, loadUserExperiments]);

  // 获取实验配置
  const config = experiment ? getExperimentConfig(experiment.id) : null;
  const difficulty = experiment ? DIFFICULTY_LEVELS[experiment.difficulty as keyof typeof DIFFICULTY_LEVELS] : null;
  const userExperiment = experiment ? userExperiments.find(ue => ue.experiment_id === experiment.id) : null;
  const status = userExperiment ? EXPERIMENT_STATUS[userExperiment.status] : null;

  // 处理开始实验
  const handleStartExperiment = async () => {
    if (!experiment || !user?.id) return;

    setIsStarting(true);
    try {
      await startExperiment(user.id, experiment.id);
      setShowSTMIDE(true);
    } catch (error) {
      console.error('开始实验失败:', error);
      alert('开始实验失败，请重试');
    } finally {
      setIsStarting(false);
    }
  };

  // 处理删除实验
  const handleDeleteExperiment = async () => {
    if (!userExperiment || !user?.id) return;

    const confirmed = window.confirm(`确定要删除实验 "${experiment.name}" 吗？`);
    if (!confirmed) return;

    try {
      await deleteExperiment(user.id, userExperiment.id);
      alert('实验删除成功！');
      navigate('/student/experiments');
    } catch (error) {
      console.error('删除实验失败:', error);
      alert('删除实验失败，请重试');
    }
  };

  // 显示STM IDE
  if (showSTMIDE) {
    return (
      <div className="relative h-screen">
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => setShowSTMIDE(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回实验
          </button>
        </div>
        <STMIDEWrapper hideTitle={false} />
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return <LoadingPage message="加载实验数据中..." />;
  }

  // 错误状态
  if (error || !experiment) {
    return (
      <MainLayout showSidebar={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">定时器实验未找到</h2>
            <p className="text-gray-600 mb-4">{error || '请检查实验名称是否正确'}</p>
            <Link
              to="/student/experiments"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              返回实验中心
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSidebar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 头部导航 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">定时器实验</h1>
                  <p className="text-sm text-gray-600">{experiment.name}</p>
                </div>
              </div>
              

            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 实验目的与要求 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  实验目的与要求
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">学习目标</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        掌握STM32定时器的工作原理和配置方法
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        理解PWM信号的生成原理和参数控制
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        学会定时器中断的配置和处理方法
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        熟悉定时器在串口通信中的应用
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">技能要求</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-900 font-medium">基础要求</span>
                        <p className="text-blue-800 text-sm mt-1">C语言、数字信号处理基础</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <span className="text-green-900 font-medium">进阶技能</span>
                        <p className="text-green-800 text-sm mt-1">中断编程、时序分析</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 实验原理 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚙️</span>
                  实验原理
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">定时器工作原理</h3>
                    <p className="text-gray-700 leading-relaxed">
                      STM32F103的定时器是基于计数器的时间测量和控制单元。定时器通过预分频器将系统时钟分频，
                      然后计数器按照设定的频率递增或递减。当计数器达到自动重装载值时，产生更新事件，
                      可以触发中断或其他操作。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">PWM生成机制</h3>
                    <p className="text-gray-700 leading-relaxed">
                      PWM（脉宽调制）信号通过比较计数器值与比较寄存器值来生成。当计数器值小于比较值时，
                      输出高电平；当计数器值大于比较值时，输出低电平。通过调节比较值可以改变占空比，
                      从而实现对输出功率的精确控制。
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">关键寄存器</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><code className="bg-gray-200 px-1 rounded">TIMx_PSC</code> - 预分频寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">TIMx_ARR</code> - 自动重装载寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">TIMx_CCRx</code> - 捕获/比较寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">TIMx_CR1</code> - 控制寄存器1</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 硬件连接 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔧</span>
                  硬件连接
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">器件清单</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">STM32F103开发板</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">示波器或逻辑分析仪</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">舵机或LED（PWM测试）</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">杜邦线</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">连接说明</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>PA6 (TIM3_CH1)</strong> → PWM输出引脚</li>
                        <li><strong>PA7 (TIM3_CH2)</strong> → PWM输出引脚</li>
                        <li><strong>PA1 (USART2_RTS)</strong> → 串口控制引脚</li>
                        <li><strong>示波器探头</strong> → 连接PWM输出引脚观察波形</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 软件设计 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💻</span>
                  软件设计
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">程序流程</h3>
                    <ol className="text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                        初始化系统时钟和定时器时钟
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                        配置定时器工作模式和参数
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                        配置PWM输出通道和GPIO
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                        启动定时器并开始PWM输出
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">关键代码</h3>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                      <pre>{`// HAL库定时器基础配置
TIM_HandleTypeDef htim1;
void MX_TIM1_Init(void) {
    htim1.Instance = TIM1;
    htim1.Init.Prescaler = 72-1;              // 预分频器
    htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim1.Init.Period = 1000-1;               // 自动重装载值
    htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    htim1.Init.RepetitionCounter = 0;
    HAL_TIM_Base_Init(&htim1);
}

// PWM配置（HAL库）
TIM_HandleTypeDef htim4;
TIM_OC_InitTypeDef sConfigOC = {0};
htim4.Instance = TIM4;
htim4.Init.Period = 1000-1;                  // PWM周期
sConfigOC.OCMode = TIM_OCMODE_PWM1;
sConfigOC.Pulse = 500;                       // 占空比50%
sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
HAL_TIM_PWM_ConfigChannel(&htim4, &sConfigOC, TIM_CHANNEL_2);

// 启动定时器和PWM
HAL_TIM_Base_Start_IT(&htim1);               // 启动定时器中断
HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_2);    // 启动PWM输出`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* 硬件要求 */}
              {config?.hardware && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔧</span>
                    硬件要求
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {config.hardware.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧侧边栏 */}
            <div className="space-y-6">
              {/* 实验信息卡片 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实验信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">实验类型:</span>
                    <span className="font-medium text-blue-600">定时控制</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">实验编号:</span>
                    <span className="font-medium">{experiment.id}</span>
                  </div>
                  
                  {difficulty && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">难度等级:</span>
                      <span className={`px-2 py-1 ${getDifficultyColorClass(experiment.difficulty || 2)} rounded text-sm`}>
                        {difficulty.name}
                      </span>
                    </div>
                  )}
                  
                  {config?.estimatedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">预计时间:</span>
                      <span className="font-medium">{config.estimatedTime}分钟</span>
                    </div>
                  )}

                  {status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态:</span>
                      <span className={`px-2 py-1 ${getStatusColorClass(userExperiment?.status || '')} rounded text-sm flex items-center`}>
                        <span className="mr-1">{status.icon}</span>
                        {status.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 快速操作 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
                <div className="space-y-3">
                  {!userExperiment ? (
                    <button
                      onClick={handleStartExperiment}
                      disabled={isStarting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg"
                    >
                      {isStarting ? '创建中...' : '开始实验'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSTMIDE(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                    >
                      进入实验环境
                    </button>
                  )}
                  
                  <Link
                    to="/student/experiments"
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-center block"
                  >
                    返回列表
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimerExperimentPage;
