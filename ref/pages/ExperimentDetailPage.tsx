/**
 * 实验详情页面路由分发器
 *
 * 根据实验类型分发到对应的专门页面
 * 按功能拆分为不同的实验详情页面
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { experimentService } from '../services/experimentService';
import { FullScreenLayout } from '../../../pages';

// 导入各类型实验页面
import BasicExperimentPage from './BasicExperimentPage';
import TimerExperimentPage from './TimerExperimentPage';
import ExperimentProjectPage from './ExperimentProjectPage';
import GeneralExperimentPage from './GeneralExperimentPage';
import LcdExperimentPage from './LcdExperimentPage';

// 实验类型映射
const EXPERIMENT_TYPE_MAP: Record<string, string[]> = {
  basic: ['2', '3', '4', '5', '6', '7'], // GPIO和输入处理类
  timer: ['8', '11'], // 定时器类
  communication: ['9', '10'], // 通信类
  signal: ['12', '13', '14', '15'], // 信号处理类
  display: ['16'], // 显示类
  project: ['17', '18', '19', '20'] // 综合项目类
};

const ExperimentDetailPage: React.FC = () => {
  const { experimentName } = useParams<{ experimentName: string }>();
  const [experimentType, setExperimentType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 确定实验类型
  useEffect(() => {
    const determineExperimentType = async () => {
      if (!experimentName) return;

      setLoading(true);
      setError(null);

      try {
        const template = await experimentService.getExperimentTemplateByUrl(experimentName);
        if (template) {
          // 根据实验ID确定类型
          let foundType = null;
          for (const [type, ids] of Object.entries(EXPERIMENT_TYPE_MAP)) {
            if (ids.includes(template.id)) {
              foundType = type;
              break;
            }
          }

          if (foundType) {
            setExperimentType(foundType);
          } else {
            setError('未知的实验类型');
          }
        } else {
          setError('实验未找到');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载实验失败');
      } finally {
        setLoading(false);
      }
    };

    determineExperimentType();
  }, [experimentName]); // 移除experimentType依赖，避免无限循环

  // 根据实验类型渲染对应的页面
  const renderExperimentPage = () => {
    switch (experimentType) {
      case 'basic':
        return <BasicExperimentPage />;
      case 'timer':
        return <TimerExperimentPage />;
      case 'project':
        return <ExperimentProjectPage />;
      case 'display':
        // LCD显示实验使用专门的页面
        return <LcdExperimentPage />;
      case 'communication':
      case 'signal':
        // 使用通用实验页面
        return <GeneralExperimentPage />;
      default:
        return <GeneralExperimentPage />;
    }
  };

  // 加载状态
  if (loading) {
    return (
      <FullScreenLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载实验详情中...</span>
        </div>
      </FullScreenLayout>
    );
  }

  // 错误状态
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">实验未找到</h2>
            <p className="text-gray-600 mb-4">{error}</p>
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

  // 渲染对应的实验页面
  return renderExperimentPage();
};

export default ExperimentDetailPage;
