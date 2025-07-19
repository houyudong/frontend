/**
 * 实验列表组件
 * 
 * 参考STMIde的列表组件设计
 * 显示实验列表并支持过滤、排序、搜索
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useExperiments } from '../stores/experimentStore';
import { ExperimentFilter, ExperimentSort } from '../types/experiment';
import { EXPERIMENT_CATEGORIES, DIFFICULTY_LEVELS } from '../config';
import ExperimentCard from './ExperimentCard';
import { LoadingPage } from '../../../pages';

interface ExperimentListProps {
  className?: string;
}

const ExperimentList: React.FC<ExperimentListProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const {
    templates,
    userExperiments,
    loading,
    error,
    filters,
    sort,
    loadTemplates,
    loadUserExperiments,
    startExperiment,
    deleteExperiment,
    setFilters,
    setSort,
    getFilteredTemplates,
    clearError
  } = useExperiments();

  const [searchTerm, setSearchTerm] = useState('');
  const [isStarting, setIsStarting] = useState<string | null>(null);

  // 初始化数据
  useEffect(() => {
    loadTemplates();
    if (user?.id) {
      loadUserExperiments(user.id);
    }
  }, [user?.id, loadTemplates, loadUserExperiments]);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, setFilters]);

  // 获取过滤后的实验列表
  const filteredTemplates = getFilteredTemplates();

  // 处理开始实验
  const handleStartExperiment = async (templateId: string) => {
    if (!user?.id) {
      alert('请先登录');
      return;
    }

    setIsStarting(templateId);
    try {
      await startExperiment(user.id, templateId);
      alert('实验创建成功！');
    } catch (error) {
      console.error('开始实验失败:', error);
      alert('开始实验失败，请重试');
    } finally {
      setIsStarting(null);
    }
  };

  // 处理删除实验
  const handleDeleteExperiment = async (experimentId: number) => {
    if (!user?.id) return;

    const confirmed = window.confirm('确定要删除这个实验吗？');
    if (!confirmed) return;

    try {
      await deleteExperiment(user.id, experimentId);
      alert('实验删除成功！');
    } catch (error) {
      console.error('删除实验失败:', error);
      alert('删除实验失败，请重试');
    }
  };

  // 处理排序变更
  const handleSortChange = (field: ExperimentSort['field']) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction: newDirection });
  };

  // 获取用户实验状态
  const getUserExperiment = (templateId: string) => {
    return userExperiments.find(ue => ue.experiment_id === templateId);
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载实验数据中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">加载失败</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <button
          onClick={() => {
            clearError();
            loadTemplates();
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索和过滤器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="md:col-span-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="搜索实验..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 分类过滤 */}
          <div>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters({ category: e.target.value as any || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有分类</option>
              {Object.entries(EXPERIMENT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 难度过滤 */}
          <div>
            <select
              value={filters.difficulty || ''}
              onChange={(e) => setFilters({ difficulty: e.target.value ? Number(e.target.value) as any : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有难度</option>
              {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                <option key={key} value={key}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 排序选项 */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">排序：</span>
          <div className="flex items-center space-x-2">
            {[
              { field: 'order_index' as const, label: '默认' },
              { field: 'name' as const, label: '名称' },
              { field: 'difficulty' as const, label: '难度' },
              { field: 'duration' as const, label: '时长' }
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSortChange(field)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  sort.field === field
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
                {sort.field === field && (
                  <span className="ml-1">
                    {sort.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 实验统计 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          共 {filteredTemplates.length} 个实验
          {userExperiments.length > 0 && (
            <span className="ml-2">
              • 已开始 {userExperiments.length} 个
              • 已完成 {userExperiments.filter(ue => ue.status === 'completed').length} 个
            </span>
          )}
        </div>
      </div>

      {/* 实验卡片网格 */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const userExperiment = getUserExperiment(template.id);
            return (
              <ExperimentCard
                key={template.id}
                template={template}
                userExperiment={userExperiment}
                onStart={handleStartExperiment}
                onDelete={handleDeleteExperiment}
                className={isStarting === template.id ? 'opacity-50 pointer-events-none' : ''}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">没有找到实验</p>
            <p className="text-sm text-gray-600 mt-1">尝试调整搜索条件或过滤器</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentList;
