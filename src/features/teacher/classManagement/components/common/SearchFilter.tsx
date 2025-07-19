/**
 * 搜索过滤组件
 * 
 * 提供统一的搜索和过滤功能
 */

import React, { useState, useEffect } from 'react';
import { debounce } from '../../utils';
import type { FilterConfig } from '../../types';

interface SearchFilterProps {
  // 搜索功能
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // 过滤器配置
  filters?: FilterConfig[];
  filterValues?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  
  // 操作按钮
  actions?: React.ReactNode;
  
  // 样式
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchPlaceholder = '搜索...',
  searchValue = '',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  actions,
  className = ''
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // 防抖搜索
  const debouncedSearch = debounce((value: string) => {
    onSearchChange?.(value);
  }, 300);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    debouncedSearch(value);
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <select
            key={filter.key}
            value={value || ''}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value || undefined)}
            className="input-primary text-sm pr-8 appearance-none bg-white"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">{filter.placeholder || `选择${filter.label}`}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            key={filter.key}
            type="text"
            value={value || ''}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value || undefined)}
            placeholder={filter.placeholder || filter.label}
            className="input-primary text-sm"
          />
        );

      case 'date':
        return (
          <input
            key={filter.key}
            type="date"
            value={value || ''}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value || undefined)}
            className="input-primary text-sm"
          />
        );

      case 'dateRange':
        return (
          <div key={filter.key} className="flex items-center space-x-2">
            <input
              type="date"
              value={value?.start || ''}
              onChange={(e) => onFilterChange?.(filter.key, {
                ...value,
                start: e.target.value || undefined
              })}
              className="input-primary text-sm"
              placeholder="开始日期"
            />
            <span className="text-gray-500">至</span>
            <input
              type="date"
              value={value?.end || ''}
              onChange={(e) => onFilterChange?.(filter.key, {
                ...value,
                end: e.target.value || undefined
              })}
              className="input-primary text-sm"
              placeholder="结束日期"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* 左侧：搜索框和过滤器 */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          {/* 搜索框 */}
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-primary pl-10 text-sm"
              />
              {localSearchValue && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-4 w-4 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* 过滤器 */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <div key={filter.key} className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">
                    {filter.label}
                  </label>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右侧：操作按钮 */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>

      {/* 活跃过滤器显示 */}
      {Object.keys(filterValues).some(key => filterValues[key]) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">当前过滤条件：</span>
            {Object.entries(filterValues).map(([key, value]) => {
              if (!value) return null;
              
              const filter = filters.find(f => f.key === key);
              if (!filter) return null;

              let displayValue = value;
              if (filter.type === 'select' && filter.options) {
                const option = filter.options.find(opt => opt.value === value);
                displayValue = option?.label || value;
              } else if (filter.type === 'dateRange' && typeof value === 'object') {
                displayValue = `${value.start || ''} 至 ${value.end || ''}`;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {filter.label}: {displayValue}
                  <button
                    onClick={() => onFilterChange?.(key, undefined)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              );
            })}
            
            {/* 清除所有过滤器 */}
            <button
              onClick={() => {
                Object.keys(filterValues).forEach(key => {
                  onFilterChange?.(key, undefined);
                });
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              清除所有
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
