/**
 * 综合项目类实验页面
 * 
 * 包含系统集成类实验：
 * - 智能环境监测系统、智能自动泊车系统
 * - 智能健身手环、光学追踪器
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../../pages';
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

// 综合项目类实验ID列表
const PROJECT_EXPERIMENT_IDS = ['17', '18', '19', '20'];

const ExperimentProjectPage: React.FC = () => {
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
        if (template && PROJECT_EXPERIMENT_IDS.includes(template.id)) {
          setExperiment(template);
        } else {
          setError('实验未找到或不属于综合项目类');
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

    const confirmed = window.confirm(`确定要删除项目 "${experiment.name}" 吗？`);
    if (!confirmed) return;

    try {
      await deleteExperiment(user.id, userExperiment.id);
      alert('项目删除成功！');
      navigate('/student/experiments');
    } catch (error) {
      console.error('删除项目失败:', error);
      alert('删除项目失败，请重试');
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
            返回项目
          </button>
        </div>
        <STMIDEWrapper hideTitle={false} />
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <MainLayout showSidebar={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载实验数据中...</span>
        </div>
      </MainLayout>
    );
  }

  // 错误状态
  if (error || !experiment) {
    return (
      <MainLayout showSidebar={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">综合项目未找到</h2>
            <p className="text-gray-600 mb-4">{error || '请检查项目名称是否正确'}</p>
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
                <span className="text-2xl">🚀</span>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">综合项目实验</h1>
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
              {/* 项目目标与要求 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  项目目标与要求
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">项目目标</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        掌握复杂嵌入式系统的整体设计方法
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        学会多传感器数据融合和处理技术
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        理解实时控制系统的设计原理
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        培养系统级问题分析和解决能力
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">技能要求</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-900 font-medium">基础要求</span>
                        <p className="text-blue-800 text-sm mt-1">完成前序基础实验</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <span className="text-green-900 font-medium">进阶技能</span>
                        <p className="text-green-800 text-sm mt-1">算法设计、系统优化</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 系统架构设计 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🏗️</span>
                  系统架构设计
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">系统层次结构</h3>
                    <p className="text-gray-700 leading-relaxed">
                      综合项目采用分层架构设计，包括硬件抽象层（HAL）、驱动层、中间件层和应用层。
                      各层之间通过标准接口通信，确保系统的模块化和可维护性。传感器数据通过统一的
                      数据总线进行传输，控制算法在应用层实现。
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">核心模块</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-900">传感器模块</h4>
                        <p className="text-blue-800 text-sm mt-1">多传感器数据采集与预处理</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h4 className="font-medium text-green-900">控制模块</h4>
                        <p className="text-green-800 text-sm mt-1">实时控制算法与执行器驱动</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h4 className="font-medium text-purple-900">通信模块</h4>
                        <p className="text-purple-800 text-sm mt-1">数据传输与远程监控</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h4 className="font-medium text-orange-900">显示模块</h4>
                        <p className="text-orange-800 text-sm mt-1">人机交互与状态显示</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 开发流程 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔄</span>
                  开发流程
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">项目开发步骤</h3>
                    <ol className="text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                        需求分析与系统设计
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                        硬件选型与电路设计
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                        软件架构设计与模块划分
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                        分模块开发与单元测试
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                        系统集成与联调测试
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">6</span>
                        性能优化与文档编写
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* 关键技术点 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  关键技术点
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">多任务调度</h3>
                    <p className="text-blue-800 text-sm">使用RTOS实现多任务并发处理，合理分配CPU资源</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h3 className="font-semibold text-green-900 mb-2">数据融合算法</h3>
                    <p className="text-green-800 text-sm">卡尔曼滤波、互补滤波等算法处理多传感器数据</p>
                  </div>
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">通信协议</h3>
                    <p className="text-purple-800 text-sm">CAN、Modbus等工业通信协议的实现</p>
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">故障诊断</h3>
                    <p className="text-orange-800 text-sm">系统自检、异常处理和故障恢复机制</p>
                  </div>
                </div>
              </div>

              {/* 硬件配置 */}
              {config?.hardware && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🔧</span>
                    硬件配置
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
              {/* 项目信息卡片 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">项目信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">项目类型:</span>
                    <span className="font-medium text-orange-600">综合项目</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">项目编号:</span>
                    <span className="font-medium">{experiment.id}</span>
                  </div>
                  
                  {difficulty && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">难度等级:</span>
                      <span className={`px-2 py-1 ${getDifficultyColorClass(experiment.difficulty || 3)} rounded text-sm`}>
                        {difficulty.name}
                      </span>
                    </div>
                  )}
                  
                  {config?.estimatedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">预计时间:</span>
                      <span className="font-medium">{Math.floor(config.estimatedTime / 60)}小时{config.estimatedTime % 60 > 0 ? `${config.estimatedTime % 60}分钟` : ''}</span>
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

              {/* 项目进度 */}
              {userExperiment && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">开发进度</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>完成度</span>
                        <span>{userExperiment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all"
                          style={{ width: `${userExperiment.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {userExperiment.started_at && (
                      <div className="text-sm text-gray-600">
                        开始时间: {new Date(userExperiment.started_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                      {isStarting ? '创建中...' : '开始项目'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSTMIDE(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                    >
                      进入开发环境
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

export default ExperimentProjectPage;
