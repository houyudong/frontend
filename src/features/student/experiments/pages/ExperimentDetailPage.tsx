import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import STMIDEWrapper from '../../../stmIde/STMIDEWrapper';
import { KnowledgePointSection } from '../components/KnowledgePointCard';
import { EnhancedExperimentDetail } from '../types/experimentTypes';
import { realExperiments } from '../data/realExperiments';
import { experimentApi } from '../../../../api/experimentApi';

// 获取实验数据
const getExperimentData = (experimentId: string): EnhancedExperimentDetail | null => {
  return realExperiments.find(exp => exp.id === experimentId) || null;
};

/**
 * ExperimentDetailPage - 实验详情页面
 *
 * 遵循CourseDetailPage的布局模式，确保一致的用户体验
 * 使用MainLayout的标准滚动机制，避免自定义布局复杂性
 */
const ExperimentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState<EnhancedExperimentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guide' | 'ide'>('guide');

  useEffect(() => {
    const loadExperiment = async () => {
      if (!id) {
        navigate('/student/experiments');
        return;
      }

      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const experimentData = getExperimentData(id);
      if (!experimentData) {
        console.error(`实验 ${id} 未找到`);
        navigate('/student/experiments');
        return;
      }

      setExperiment(experimentData);
      setLoading(false);
    };

    loadExperiment();
  }, [id, navigate]);

  // 开始实验
  const startExperiment = async () => {
    if (!experiment) return;

    try {
      // 调用API拷贝实验项目到用户workspace
      const userId = 1; // TODO: 从认证状态获取真实用户ID
      const result = await experimentApi.startExperiment(userId, experiment.id);

      console.log(`实验启动成功: ${experiment.id}`);
      console.log(`项目路径: ${result.projectPath}`);

      // 跳转到STMIDE
      setActiveTab('ide');
    } catch (error) {
      console.error('启动实验失败:', error);
      alert(`启动实验失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取难度文本
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner h-8 w-8 mr-3"></div>
            <span className="text-gray-600">加载实验详情中...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!experiment) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">实验未找到</h3>
            <p className="text-gray-600 mb-4">请检查实验链接是否正确</p>
            <Link to="/student/experiments" className="btn-primary">
              返回实验列表
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }



  // 当在IDE模式时，不使用MainLayout，直接渲染STMIDEWrapper
  if (activeTab === 'ide') {
    return (
      <div className="h-screen w-full">
        <STMIDEWrapper hideTitle={true} />
      </div>
    );
  }

  return (
    <MainLayout>
      {/* 标签切换 */}
      <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'guide'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📖 实验指导
            </button>
            <button
              onClick={() => setActiveTab('ide')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'ide'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💻 编程环境
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'guide' && (
          <>
            {/* 实验概览区 */}
            <div className="card mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{experiment.name}</h1>
                  <p className="text-gray-700 mb-6">{experiment.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                    <span>⏱️ 预计时间: {experiment.estimatedTime}分钟</span>
                    <span>🔧 芯片: {experiment.chipModel}</span>
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(experiment.difficulty)}`}>
                      {getDifficultyText(experiment.difficulty)}
                    </span>
                  </div>
                </div>

                <div className="lg:w-80 mt-6 lg:mt-0">
                  <button
                    onClick={startExperiment}
                    className="w-full btn-primary mb-4"
                  >
                    🚀 开始实验
                  </button>

                  {/* 实验信息卡片 */}
                  <div className="card">
                    <h4 className="font-medium text-gray-900 mb-3">实验信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">芯片型号</span>
                        <span className="font-medium">{experiment.chipModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">预计时间</span>
                        <span className="font-medium">{experiment.estimatedTime}分钟</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">难度等级</span>
                        <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(experiment.difficulty)}`}>
                          {getDifficultyText(experiment.difficulty)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">实验目录</span>
                        <span className="font-mono text-xs text-blue-600">{experiment.directory}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 实验目标 */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 实验目标</h2>
              <ul className="space-y-2">
                {experiment.purpose.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 知识点准备 */}
            {(experiment.knowledgePoints.prerequisites.length > 0 ||
              experiment.knowledgePoints.core.length > 0) && (
              <div className="card mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📚 知识点准备</h2>
                <div className="space-y-6">
                  {experiment.knowledgePoints.prerequisites.length > 0 && (
                    <KnowledgePointSection
                      title="前置知识点"
                      knowledgePoints={experiment.knowledgePoints.prerequisites}
                      defaultExpanded={false}
                    />
                  )}
                  {experiment.knowledgePoints.core.length > 0 && (
                    <KnowledgePointSection
                      title="核心知识点"
                      knowledgePoints={experiment.knowledgePoints.core}
                      defaultExpanded={true}
                    />
                  )}
                </div>
              </div>
            )}


          </>
        )}
    </MainLayout>
  );
};

export default ExperimentDetailPage;
