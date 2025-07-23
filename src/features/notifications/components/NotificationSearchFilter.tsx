/**
 * 通知搜索和筛选组件
 * 
 * 支持教师和管理员对通知进行高级搜索和筛选
 */

import React, { useState, useEffect } from 'react';
import { NotificationFilter, NotificationType, NotificationPriority, NotificationStatus } from '../types/Notification';

interface NotificationSearchFilterProps {
  userRole: 'teacher' | 'admin';
  onFilterChange: (filter: NotificationFilter) => void;
  initialFilter?: NotificationFilter;
}

const NotificationSearchFilter: React.FC<NotificationSearchFilterProps> = ({
  userRole,
  onFilterChange,
  initialFilter = {}
}) => {
  const [filter, setFilter] = useState<NotificationFilter>(initialFilter);
  const [isExpanded, setIsExpanded] = useState(false);

  // 获取通知类型选项
  const getNotificationTypes = (): Array<{value: NotificationType, label: string}> => {
    const commonTypes = [
      { value: 'announcement' as NotificationType, label: '📢 公告通知' },
      { value: 'assignment' as NotificationType, label: '📝 作业通知' },
      { value: 'reminder' as NotificationType, label: '⏰ 学习提醒' },
      { value: 'grade' as NotificationType, label: '📊 成绩通知' },
      { value: 'course' as NotificationType, label: '📚 课程通知' },
      { value: 'experiment' as NotificationType, label: '🧪 实验通知' },
      { value: 'deadline' as NotificationType, label: '⚠️ 截止提醒' }
    ];

    if (userRole === 'admin') {
      return [
        { value: 'system' as NotificationType, label: '🔧 系统通知' },
        { value: 'maintenance' as NotificationType, label: '🛠️ 维护通知' },
        { value: 'security' as NotificationType, label: '🔒 安全提醒' },
        ...commonTypes,
        { value: 'discussion' as NotificationType, label: '💬 讨论通知' }
      ];
    }

    return commonTypes;
  };

  // 获取优先级选项
  const getPriorityOptions = (): Array<{value: NotificationPriority, label: string}> => [
    { value: 'low', label: '低优先级' },
    { value: 'normal', label: '普通' },
    { value: 'high', label: '重要' },
    { value: 'urgent', label: '紧急' }
  ];

  // 获取状态选项
  const getStatusOptions = (): Array<{value: NotificationStatus, label: string}> => [
    { value: 'draft', label: '草稿' },
    { value: 'scheduled', label: '已安排' },
    { value: 'sent', label: '已发送' },
    { value: 'delivered', label: '已送达' },
    { value: 'failed', label: '发送失败' }
  ];

  // 更新筛选条件
  const updateFilter = (newFilter: Partial<NotificationFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  // 清空筛选条件
  const clearFilter = () => {
    const emptyFilter: NotificationFilter = {};
    setFilter(emptyFilter);
    onFilterChange(emptyFilter);
  };

  // 处理多选
  const handleMultiSelect = (
    field: 'types' | 'priorities' | 'status',
    value: string,
    checked: boolean
  ) => {
    const currentValues = filter[field] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    updateFilter({ [field]: newValues.length > 0 ? newValues : undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* 搜索栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索通知标题、内容或发送者..."
              value={filter.search || ''}
              onChange={(e) => updateFilter({ search: e.target.value || undefined })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isExpanded 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>高级筛选</span>
              <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {(filter.search || filter.types || filter.priorities || filter.status || filter.dateRange) && (
            <button
              onClick={clearFilter}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              清空筛选
            </button>
          )}
        </div>
      </div>

      {/* 高级筛选面板 */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 通知类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                通知类型
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getNotificationTypes().map(type => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.types?.includes(type.value) || false}
                      onChange={(e) => handleMultiSelect('types', type.value, e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 优先级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <div className="space-y-2">
                {getPriorityOptions().map(priority => (
                  <label key={priority.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.priorities?.includes(priority.value) || false}
                      onChange={(e) => handleMultiSelect('priorities', priority.value, e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发送状态
              </label>
              <div className="space-y-2">
                {getStatusOptions().map(status => (
                  <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.status?.includes(status.value) || false}
                      onChange={(e) => handleMultiSelect('status', status.value, e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 时间范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                时间范围
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  placeholder="开始日期"
                  value={filter.dateRange?.start || ''}
                  onChange={(e) => updateFilter({
                    dateRange: {
                      ...filter.dateRange,
                      start: e.target.value || undefined
                    }
                  })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  placeholder="结束日期"
                  value={filter.dateRange?.end || ''}
                  onChange={(e) => updateFilter({
                    dateRange: {
                      ...filter.dateRange,
                      end: e.target.value || undefined
                    }
                  })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 排序选项 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">排序方式：</label>
              <select
                value={filter.sortBy || 'createdAt'}
                onChange={(e) => updateFilter({ sortBy: e.target.value as any })}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">创建时间</option>
                <option value="priority">优先级</option>
                <option value="status">状态</option>
              </select>
              
              <select
                value={filter.sortOrder || 'desc'}
                onChange={(e) => updateFilter({ sortOrder: e.target.value as 'asc' | 'desc' })}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSearchFilter;
