/**
 * 增强的搜索框组件
 * 
 * 提供美观且实用的搜索功能，支持：
 * - 实时搜索建议
 * - 搜索历史
 * - 快捷筛选标签
 * - 高级筛选选项
 * - 搜索结果统计
 */

import React, { useState, useEffect, useRef } from 'react';

export interface SearchFilter {
  key: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
  type: 'select' | 'multiselect' | 'radio';
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'suggestion' | 'popular';
  count?: number;
}

interface EnhancedSearchBoxProps {
  placeholder?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters?: SearchFilter[];
  filterValues?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  resultCount?: number;
  onClear?: () => void;
  className?: string;
  theme?: 'blue' | 'purple' | 'green' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  showAdvancedFilters?: boolean;
  quickFilters?: { label: string; value: string; count?: number }[];
  onQuickFilter?: (value: string) => void;
}

const EnhancedSearchBox: React.FC<EnhancedSearchBoxProps> = ({
  placeholder = "搜索...",
  searchTerm,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  suggestions = [],
  showSuggestions = true,
  resultCount,
  onClear,
  className = "",
  theme = 'blue',
  size = 'md',
  showAdvancedFilters = true,
  quickFilters = [],
  onQuickFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 主题色彩配置
  const themeColors = {
    blue: {
      primary: 'blue-500',
      primaryHover: 'blue-600',
      primaryLight: 'blue-50',
      primaryBorder: 'blue-200',
      ring: 'blue-500'
    },
    purple: {
      primary: 'purple-500',
      primaryHover: 'purple-600',
      primaryLight: 'purple-50',
      primaryBorder: 'purple-200',
      ring: 'purple-500'
    },
    green: {
      primary: 'green-500',
      primaryHover: 'green-600',
      primaryLight: 'green-50',
      primaryBorder: 'green-200',
      ring: 'green-500'
    },
    indigo: {
      primary: 'indigo-500',
      primaryHover: 'indigo-600',
      primaryLight: 'indigo-50',
      primaryBorder: 'indigo-200',
      ring: 'indigo-500'
    }
  };

  const colors = themeColors[theme];

  // 尺寸配置
  const sizeConfig = {
    sm: {
      input: 'py-2 pl-10 pr-4 text-sm',
      icon: 'w-4 h-4',
      button: 'px-3 py-1.5 text-xs'
    },
    md: {
      input: 'py-3 pl-12 pr-4 text-base',
      icon: 'w-5 h-5',
      button: 'px-4 py-2 text-sm'
    },
    lg: {
      input: 'py-4 pl-14 pr-4 text-lg',
      icon: 'w-6 h-6',
      button: 'px-6 py-3 text-base'
    }
  };

  const sizeStyles = sizeConfig[size];

  // 处理搜索输入
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    if (value.trim() && showSuggestions) {
      setShowSuggestionsDropdown(true);
    }
  };

  // 处理搜索提交
  const handleSearchSubmit = (term: string) => {
    if (term.trim()) {
      // 添加到搜索历史
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
    setShowSuggestionsDropdown(false);
  };

  // 清除搜索
  const handleClear = () => {
    onSearchChange('');
    onClear?.();
    setShowSuggestionsDropdown(false);
    inputRef.current?.focus();
  };

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // 合并建议和历史
  const allSuggestions = [
    ...searchHistory.map(h => ({ id: h, text: h, type: 'history' as const })),
    ...suggestions
  ].filter(s => s.text.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 主搜索区域 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* 搜索框标题 */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-${colors.primary} to-${colors.primaryHover} rounded-xl flex items-center justify-center shadow-lg`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">智能搜索</h3>
              <p className="text-sm text-gray-600">快速找到您需要的内容</p>
            </div>
          </div>
          
          {/* 结果统计 */}
          {resultCount !== undefined && (
            <div className={`px-4 py-2 bg-${colors.primaryLight} text-${colors.primary} rounded-lg font-medium`}>
              {resultCount} 个结果
            </div>
          )}
        </div>

        {/* 搜索输入区域 */}
        <div className="px-6 pb-4" ref={searchRef}>
          <div className="relative">
            {/* 主搜索框 */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className={`w-full ${sizeStyles.input} border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-${colors.ring} focus:border-transparent transition-all duration-300 hover:border-${colors.primaryBorder} bg-gray-50 focus:bg-white`}
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => showSuggestions && setShowSuggestionsDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchTerm);
                  }
                  if (e.key === 'Escape') {
                    setShowSuggestionsDropdown(false);
                  }
                }}
              />
              
              {/* 搜索图标 */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className={`${sizeStyles.icon} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* 清除按钮 */}
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className={sizeStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* 搜索建议下拉框 */}
            {showSuggestionsDropdown && allSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {searchHistory.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        搜索历史
                      </div>
                      {searchHistory.slice(0, 3).map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            onSearchChange(term);
                            handleSearchSubmit(term);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 group-hover:text-gray-900">{term}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {suggestions.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        推荐搜索
                      </div>
                      {suggestions.slice(0, 5).map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => {
                            onSearchChange(suggestion.text);
                            handleSearchSubmit(suggestion.text);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-gray-700 group-hover:text-gray-900">{suggestion.text}</span>
                          </div>
                          {suggestion.count && (
                            <span className="text-xs text-gray-500">{suggestion.count}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 快捷筛选标签 */}
        {quickFilters.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600">快捷筛选：</span>
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => onQuickFilter?.(filter.value)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 bg-${colors.primaryLight} text-${colors.primary} hover:bg-${colors.primary} hover:text-white`}
                >
                  {filter.label}
                  {filter.count && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 高级筛选区域 */}
        {showAdvancedFilters && filters.length > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700">高级筛选</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filters.map((filter) => (
                    <div key={filter.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {filter.label}
                      </label>
                      {filter.type === 'select' && (
                        <div className="relative">
                          <select
                            value={filterValues[filter.key] || ''}
                            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                            className={`w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colors.ring} focus:border-transparent appearance-none bg-white`}
                          >
                            {filter.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label} {option.count && `(${option.count})`}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 操作按钮区域 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {(searchTerm || Object.values(filterValues).some(v => v && v !== 'all')) && (
              <button
                onClick={handleClear}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                清除所有筛选
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSearchSubmit(searchTerm)}
              className={`${sizeStyles.button} bg-${colors.primary} hover:bg-${colors.primaryHover} text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md`}
            >
              搜索
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchBox;
