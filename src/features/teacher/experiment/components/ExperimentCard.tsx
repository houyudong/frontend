/**
 * 实验卡片组件
 * 
 * 支持网格和列表两种显示模式
 */

import React from 'react';
import { Experiment } from '../types/Experiment';

interface ExperimentCardProps {
  experiment: Experiment;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onViewDetails: () => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onTogglePublish,
  onViewDetails
}) => {
  // 获取难度标签颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取难度文本
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return '未知';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    if (type === 'group') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  // 格式化时间
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
        {/* 卡片头部 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {experiment.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{experiment.code}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(experiment.status)}`}>
                {getStatusText(experiment.status)}
              </span>
            </div>
          </div>
        </div>

        {/* 卡片内容 */}
        <div className="p-4">
          <p className="text-gray-700 text-sm line-clamp-3 mb-4">
            {experiment.description}
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">所属课程</span>
              <span className="font-medium text-blue-600">{experiment.courseName}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">实验类别</span>
              <span className="font-medium">{experiment.category}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">难度等级</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(experiment.difficulty)}`}>
                {getDifficultyText(experiment.difficulty)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">预计时长</span>
              <span className="font-medium">{formatDuration(experiment.duration)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">实验类型</span>
              <div className="flex items-center space-x-1">
                {getTypeIcon(experiment.type)}
                <span className="font-medium">{experiment.type === 'group' ? '小组实验' : '个人实验'}</span>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          {experiment.status === 'published' && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{experiment.totalSubmissions}</div>
                  <div className="text-gray-600">总提交</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{experiment.averageScore.toFixed(1)}</div>
                  <div className="text-gray-600">平均分</div>
                </div>
              </div>
            </div>
          )}

          {/* 标签 */}
          {experiment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {experiment.tags.slice(0, 3).map(tag => (
                <span key={tag} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {tag}
                </span>
              ))}
              {experiment.tags.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  +{experiment.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onViewDetails}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看详情
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="编辑"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onTogglePublish}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                experiment.status === 'published'
                  ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100'
                  : 'text-green-600 hover:text-green-800 hover:bg-green-100'
              }`}
              title={experiment.status === 'published' ? '取消发布' : '发布'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
              title="删除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 列表视图
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{experiment.name}</h3>
              <span className="text-sm text-gray-600">({experiment.code})</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(experiment.status)}`}>
                {getStatusText(experiment.status)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(experiment.difficulty)}`}>
                {getDifficultyText(experiment.difficulty)}
              </span>
            </div>
            
            <p className="text-gray-700 text-sm mb-2 line-clamp-2">{experiment.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>课程: {experiment.courseName}</span>
              <span>类别: {experiment.category}</span>
              <span>时长: {formatDuration(experiment.duration)}</span>
              <span>类型: {experiment.type === 'group' ? '小组实验' : '个人实验'}</span>
              {experiment.status === 'published' && (
                <>
                  <span>提交: {experiment.totalSubmissions}</span>
                  <span>平均分: {experiment.averageScore.toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onViewDetails}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看详情
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            编辑
          </button>
          <button
            onClick={onTogglePublish}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              experiment.status === 'published'
                ? 'text-yellow-600 hover:bg-yellow-100'
                : 'text-green-600 hover:bg-green-100'
            }`}
          >
            {experiment.status === 'published' ? '取消发布' : '发布'}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCard;
