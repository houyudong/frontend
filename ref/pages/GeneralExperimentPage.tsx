/**
 * 通用实验详情页面
 * 
 * 用于处理通信类、信号处理类、显示类等实验
 * 提供完整的实验详情展示和STM IDE集成
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FullScreenLayout } from '../../../pages';
import STMIDEWrapper from '../../stmIde/STMIDEWrapper';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useExperiments } from '../stores/experimentStore';
import { experimentService } from '../services/experimentService';
import { DIFFICULTY_LEVELS, EXPERIMENT_STATUS } from '../config';
import { 
  getDifficultyColorClass, 
  getStatusColorClass,
  getExperimentConfig 
} from '../utils/experimentUtils';

const GeneralExperimentPage: React.FC = () => {
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
        if (template) {
          setExperiment(template);
        } else {
          setError('实验未找到');
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
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  // 错误状态
  if (error || !experiment) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">实验未找到</h2>
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
                <span className="text-2xl">🔬</span>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">STM32实验</h1>
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
                        掌握STM32F103的ADC/DAC工作原理和配置方法
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        理解模拟信号与数字信号的转换过程
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        学会传感器信号的采集和处理技术
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        熟悉DMA在数据传输中的应用
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">技能要求</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-900 font-medium">基础要求</span>
                        <p className="text-blue-800 text-sm mt-1">模拟电路、信号处理基础</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <span className="text-green-900 font-medium">进阶技能</span>
                        <p className="text-green-800 text-sm mt-1">滤波算法、数据分析</p>
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
                    <h3 className="font-semibold text-gray-900 mb-2">ADC工作原理</h3>
                    <p className="text-gray-700 leading-relaxed">
                      ADC（模数转换器）将连续的模拟信号转换为离散的数字信号。STM32F103的ADC采用逐次逼近型结构，
                      通过采样保持电路、比较器和DAC反馈回路，将0-3.3V的模拟电压转换为12位数字值（0-4095）。
                      转换精度和速度可通过采样时间和时钟频率调节。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">DAC工作原理</h3>
                    <p className="text-gray-700 leading-relaxed">
                      DAC（数模转换器）将数字信号转换为模拟信号。STM32F103的DAC采用R-2R电阻网络结构，
                      通过12位数字输入（0-4095）产生0-3.3V的模拟输出。支持三角波、噪声波等波形生成，
                      可配合DMA实现高速连续输出。
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">关键寄存器</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><code className="bg-gray-200 px-1 rounded">ADC_CR1/CR2</code> - ADC控制寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">ADC_SQR1/2/3</code> - ADC规则序列寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">DAC_CR</code> - DAC控制寄存器</li>
                      <li><code className="bg-gray-200 px-1 rounded">DAC_DHR12R1</code> - DAC数据保持寄存器</li>
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
                        <span className="text-gray-700">传感器（温度、气体等）</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">万用表或示波器</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">面包板和连接线</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">连接说明</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>PA0 (ADC_IN0)</strong> → 传感器信号输出</li>
                        <li><strong>PA4 (DAC_OUT1)</strong> → DAC输出引脚</li>
                        <li><strong>VREF+</strong> → 3.3V参考电压</li>
                        <li><strong>VREF-</strong> → GND</li>
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
                        初始化系统时钟和ADC/DAC时钟
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                        配置ADC通道和采样参数
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                        配置DMA进行数据传输
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                        启动转换并处理数据
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">关键代码</h3>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                      <pre>{`// HAL库ADC初始化
ADC_HandleTypeDef hadc1;
void MX_ADC1_Init(void) {
    hadc1.Instance = ADC1;
    hadc1.Init.ScanConvMode = ADC_SCAN_DISABLE;
    hadc1.Init.ContinuousConvMode = ENABLE;
    hadc1.Init.DiscontinuousConvMode = DISABLE;
    hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
    hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
    hadc1.Init.NbrOfConversion = 1;
    HAL_ADC_Init(&hadc1);

    // 配置ADC通道
    ADC_ChannelConfTypeDef sConfig = {0};
    sConfig.Channel = ADC_CHANNEL_0;
    sConfig.Rank = ADC_REGULAR_RANK_1;
    sConfig.SamplingTime = ADC_SAMPLETIME_55CYCLES_5;
    HAL_ADC_ConfigChannel(&hadc1, &sConfig);
}

// ADC读取函数
void read_adc(void) {
    float voltage;
    HAL_ADC_Start(&hadc1);
    HAL_ADC_PollForConversion(&hadc1, 10);
    uint16_t adc_value = HAL_ADC_GetValue(&hadc1);
    voltage = (float)adc_value / 4096.0f * 3.3f;  // 转换为电压
    printf("当前电压值是%.2fV\\r\\n", voltage);
}

// DAC配置和输出
DAC_HandleTypeDef hdac;
HAL_DAC_SetValue(&hdac, DAC_CHANNEL_1, DAC_ALIGN_12B_R, dac_value);
HAL_DAC_Start(&hdac, DAC_CHANNEL_1);`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧侧边栏 */}
            <div className="space-y-6">
              {/* 实验信息卡片 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实验信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">实验编号:</span>
                    <span className="font-medium">{experiment.id}</span>
                  </div>
                  
                  {experiment.project_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">项目代码:</span>
                      <span className="font-medium">{experiment.project_name}</span>
                    </div>
                  )}
                  
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

export default GeneralExperimentPage;
