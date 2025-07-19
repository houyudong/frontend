/**
 * 实验卡片组件
 * 
 * 参考STMIde的组件设计风格
 * 显示单个实验的信息和操作
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ExperimentTemplate, UserExperiment } from '../types/experiment';
import { EXPERIMENTS_CONFIG } from '../config';
import {
  getDifficultyInfo,
  getStatusInfo,
  getExperimentConfig,
  getDifficultyColorClass,
  getStatusColorClass
} from '../utils/experimentUtils';

interface ExperimentCardProps {
  template: ExperimentTemplate;
  userExperiment?: UserExperiment;
  onStart?: (templateId: string) => void;
  onDelete?: (experimentId: number) => void;
  className?: string;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  template,
  userExperiment,
  onStart,
  onDelete,
  className = ''
}) => {
  const config = getExperimentConfig(template.id);
  const difficulty = getDifficultyInfo(template.difficulty || 1);
  const status = userExperiment ? getStatusInfo(userExperiment.status) : null;

  const handleStart = () => {
    if (onStart) {
      onStart(template.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userExperiment && onDelete) {
      onDelete(userExperiment.id);
    }
  };



  // 获取实验类型的渐变背景
  const getExperimentGradient = (category: string) => {
    switch (category) {
      case 'basic':
        return 'from-green-500 to-emerald-600';
      case 'intermediate':
        return 'from-blue-500 to-indigo-600';
      case 'advanced':
        return 'from-purple-500 to-violet-600';
      case 'project':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  // 获取实验类型图标
  const getExperimentIcon = (category: string) => {
    switch (category) {
      case 'basic':
        return '🔧';
      case 'intermediate':
        return '⚙️';
      case 'advanced':
        return '🔬';
      case 'project':
        return '🚀';
      default:
        return '💻';
    }
  };

  return (
    <Link
      to={`/student/experiments/${config?.urlName || template.id}`}
      className={`block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${className}`}
    >
      {/* 实验图片/图标区域 */}
      <div className={`relative h-48 bg-gradient-to-br ${getExperimentGradient(template.category || 'basic')}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-4xl">{getExperimentIcon(template.category || 'basic')}</span>
        </div>

        {/* 难度标签 */}
        {difficulty && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColorClass(template.difficulty || 1)} backdrop-blur-sm`}>
              {difficulty.name}
            </span>
          </div>
        )}

        {/* 状态标签 */}
        {status && (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(userExperiment?.status || '')} backdrop-blur-sm flex items-center`}>
              <span className="mr-1">{status.icon}</span>
              {status.name}
            </span>
          </div>
        )}

        {/* 进度条 */}
        {userExperiment && userExperiment.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-30 h-1">
            <div
              className="bg-white h-1 transition-all duration-300"
              style={{ width: `${userExperiment.progress}%` }}
            />
          </div>
        )}

        {/* 删除按钮 */}
        {userExperiment && onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-3 right-3 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
            title="删除实验"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {template.name}
        </h3>

        {template.project_name && (
          <p className="text-sm text-blue-600 mb-2 font-medium">
            {template.project_name}
          </p>
        )}

        {/* 描述 */}
        {template.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {template.description}
          </p>
        )}

        {/* 实验信息 */}
        <div className="flex items-center text-xs text-gray-500 space-x-4 mb-3">
          {config?.estimatedTime && (
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{config.estimatedTime}分钟</span>
            </div>
          )}

          {config?.hardware && (
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span>{config.hardware.length}个器件</span>
            </div>
          )}
        </div>

        {/* 关键知识点 */}
        {config?.keyPoints && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {config.keyPoints.slice(0, 2).map((point, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                >
                  {point}
                </span>
              ))}
              {config.keyPoints.length > 2 && (
                <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
                  +{config.keyPoints.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 卡片底部操作 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {!userExperiment ? '未开始' :
             userExperiment.status === 'completed' ? '已完成' :
             userExperiment.status === 'in_progress' ? '学习中' : '未开始'}
          </span>

          {/* 开始实验按钮 */}
          {!userExperiment ? (
            <button
              onClick={handleStart}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
            >
              开始实验
            </button>
          ) : userExperiment.status === 'completed' ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
              重新学习
            </span>
          ) : (
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded">
              继续实验
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExperimentCard;
