/**
 * 实验列表组件
 * 
 * 参考STMIde的列表组件设计
 * 显示实验列表并支持过滤、排序、搜索
 */

import React, { useState } from 'react';
import { ExperimentListItem } from '../types/experimentTypes';
import { EXPERIMENT_CATEGORIES } from '../config';

interface ExperimentListProps {
  experiments: ExperimentListItem[];
  onExperimentClick?: (experiment: ExperimentListItem) => void;
  className?: string;
}

const ExperimentList: React.FC<ExperimentListProps> = ({ 
  experiments, 
  onExperimentClick,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // 过滤实验
  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exp.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      'beginner': 'green',
      'intermediate': 'blue', 
      'advanced': 'orange'
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'gray';
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colorMap = {
      'not_started': 'gray',
      'in_progress': 'blue',
      'completed': 'green'
    };
    return colorMap[status as keyof typeof colorMap] || 'gray';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索和过滤器 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索实验..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 分类过滤 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有分类</option>
            {Object.entries(EXPERIMENT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>

          {/* 难度过滤 */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有难度</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
      </div>

      {/* 实验统计 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>找到 {filteredExperiments.length} 个实验</span>
        <div className="flex items-center space-x-4">
          <span>总计: {experiments.length}</span>
          <span>已完成: {experiments.filter(e => e.status === 'completed').length}</span>
          <span>进行中: {experiments.filter(e => e.status === 'in_progress').length}</span>
        </div>
      </div>

      {/* 实验列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map((experiment) => (
          <div
            key={experiment.id}
            onClick={() => onExperimentClick?.(experiment)}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
          >
            {/* 状态指示器 */}
            <div className={`h-1 bg-${getStatusColor(experiment.status)}-500`}></div>
            
            <div className="p-6">
              {/* 头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {experiment.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {experiment.description}
                  </p>
                </div>
                
                {/* 难度标签 */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getDifficultyColor(experiment.difficulty)}-100 text-${getDifficultyColor(experiment.difficulty)}-800 ml-3`}>
                  {experiment.difficulty === 'beginner' ? '初级' : 
                   experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                </span>
              </div>

              {/* 实验信息 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  预计时间: {experiment.estimatedTime} 分钟
                </div>
                
                {/* 标签 */}
                {experiment.tags && experiment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {experiment.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                    {experiment.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        +{experiment.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* 进度条 */}
                {experiment.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>进度</span>
                      <span>{experiment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${getStatusColor(experiment.status)}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${experiment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* 状态标签 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(experiment.status)}-100 text-${getStatusColor(experiment.status)}-800`}>
                  {experiment.status === 'not_started' ? '未开始' :
                   experiment.status === 'in_progress' ? '进行中' : '已完成'}
                </span>
                
                {experiment.isNew && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    新实验
                  </span>
                )}
                
                {experiment.isPopular && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    热门
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredExperiments.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到实验</h3>
          <p className="mt-1 text-sm text-gray-500">尝试调整搜索条件或过滤器</p>
        </div>
      )}
    </div>
  );
};

export default ExperimentList;
