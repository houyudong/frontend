/**
 * 实验卡片组件
 * 
 * 参考STMIde的组件设计风格
 * 显示单个实验的信息和操作
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ExperimentTemplate, UserExperiment } from '../types/experimentTypes';
import { EXPERIMENTS_CONFIG } from '../config';

interface ExperimentCardProps {
  template: ExperimentTemplate;
  userExperiment?: UserExperiment;
  onStart?: (templateId: string) => void;
  onDelete?: (experimentId: number) => void;
  className?: string;
}

// 获取难度信息
const getDifficultyInfo = (difficulty: number) => {
  const difficultyMap = {
    1: { name: '初级', color: 'green', description: '适合初学者' },
    2: { name: '中级', color: 'blue', description: '需要一定基础' },
    3: { name: '高级', color: 'orange', description: '需要较多经验' }
  };
  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficultyMap[1];
};

// 获取状态信息
const getStatusInfo = (status: string) => {
  const statusMap = {
    not_started: { name: '未开始', color: 'gray', icon: '⭕' },
    in_progress: { name: '进行中', color: 'blue', icon: '🔄' },
    completed: { name: '已完成', color: 'green', icon: '✅' },
    failed: { name: '失败', color: 'red', icon: '❌' }
  };
  return statusMap[status as keyof typeof statusMap] || statusMap.not_started;
};

// 获取实验配置
const getExperimentConfig = (id: string) => {
  return EXPERIMENTS_CONFIG[id as keyof typeof EXPERIMENTS_CONFIG];
};

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

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${className}`}>
      {/* 实验状态指示器 */}
      {status && (
        <div className={`h-1 bg-${status.color}-500`}></div>
      )}
      
      <div className="p-6">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {template.description}
            </p>
          </div>
          
          {/* 难度标签 */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${difficulty.color}-100 text-${difficulty.color}-800 ml-3`}>
            {difficulty.name}
          </span>
        </div>

        {/* 实验信息 */}
        <div className="space-y-2 mb-4">
          {config && (
            <>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                预计时间: {config.estimatedTime} 分钟
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                芯片: {template.chip_model || 'STM32F103'}
              </div>
            </>
          )}
          
          {/* 进度条 */}
          {userExperiment && userExperiment.progress > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>进度</span>
                <span>{userExperiment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-${status?.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${userExperiment.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {userExperiment ? (
            <div className="flex items-center space-x-2">
              <Link
                to={`/student/experiments/${config?.urlName || template.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
              >
                {status?.name === '已完成' ? '查看实验' : '继续实验'}
              </Link>
              
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="删除实验"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              开始实验
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentCard;
