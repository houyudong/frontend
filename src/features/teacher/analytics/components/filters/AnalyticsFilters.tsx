/**
 * 分析过滤器组件
 * 
 * 提供时间范围、学生筛选等过滤功能
 */

import React, { useState } from 'react';

export interface AnalyticsFiltersProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onStudentFilterChange: (studentIds: string[]) => void;
  onChapterFilterChange: (chapterIds: string[]) => void;
  availableStudents?: { id: string; name: string }[];
  availableChapters?: { id: string; name: string }[];
  className?: string;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  onDateRangeChange,
  onStudentFilterChange,
  onChapterFilterChange,
  availableStudents = [],
  availableChapters = [],
  className = ''
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // 处理日期范围变化
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      onDateRangeChange(value, endDate);
    } else {
      setEndDate(value);
      onDateRangeChange(startDate, value);
    }
  };

  // 处理学生筛选变化
  const handleStudentChange = (studentId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedStudents, studentId]
      : selectedStudents.filter(id => id !== studentId);
    
    setSelectedStudents(newSelection);
    onStudentFilterChange(newSelection);
  };

  // 处理章节筛选变化
  const handleChapterChange = (chapterId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedChapters, chapterId]
      : selectedChapters.filter(id => id !== chapterId);
    
    setSelectedChapters(newSelection);
    onChapterFilterChange(newSelection);
  };

  // 重置所有筛选
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedStudents([]);
    setSelectedChapters([]);
    onDateRangeChange('', '');
    onStudentFilterChange([]);
    onChapterFilterChange([]);
  };

  // 快速日期选择
  const handleQuickDateSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    setStartDate(startStr);
    setEndDate(endStr);
    onDateRangeChange(startStr, endStr);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 筛选器标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">数据筛选</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            重置
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 筛选器内容 */}
      <div className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="p-4 space-y-6">
          {/* 时间范围筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">时间范围</label>
            
            {/* 快速选择按钮 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: '最近7天', days: 7 },
                { label: '最近30天', days: 30 },
                { label: '最近90天', days: 90 }
              ].map(option => (
                <button
                  key={option.days}
                  onClick={() => handleQuickDateSelect(option.days)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* 自定义日期选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 学生筛选 */}
          {availableStudents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                学生筛选 ({selectedStudents.length}/{availableStudents.length})
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                <div className="p-2 space-y-2">
                  {availableStudents.map(student => (
                    <label key={student.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => handleStudentChange(student.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{student.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 章节筛选 */}
          {availableChapters.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                章节筛选 ({selectedChapters.length}/{availableChapters.length})
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                <div className="p-2 space-y-2">
                  {availableChapters.map(chapter => (
                    <label key={chapter.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedChapters.includes(chapter.id)}
                        onChange={(e) => handleChapterChange(chapter.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{chapter.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 简化视图（收起状态） */}
      {!isExpanded && (
        <div className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {(startDate || endDate) && (
                <span>
                  📅 {startDate || '开始'} ~ {endDate || '结束'}
                </span>
              )}
              {selectedStudents.length > 0 && (
                <span>👥 {selectedStudents.length} 个学生</span>
              )}
              {selectedChapters.length > 0 && (
                <span>📚 {selectedChapters.length} 个章节</span>
              )}
              {!startDate && !endDate && selectedStudents.length === 0 && selectedChapters.length === 0 && (
                <span className="text-gray-400">点击展开设置筛选条件</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
