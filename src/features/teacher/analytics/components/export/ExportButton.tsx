/**
 * 导出按钮组件
 * 
 * 提供多种格式的数据导出功能
 */

import React, { useState } from 'react';

export interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel' | 'csv', options?: ExportOptions) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface ExportOptions {
  includeCharts?: boolean;
  includeRawData?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  selectedStudents?: string[];
  selectedChapters?: string[];
}

const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  loading = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeRawData: false
  });

  // 处理导出
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      await onExport(format, exportOptions);
      setIsOpen(false);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 导出选项
  const exportFormats = [
    {
      key: 'pdf' as const,
      label: 'PDF报告',
      description: '包含图表和分析的完整报告',
      icon: '📄',
      color: 'text-red-600'
    },
    {
      key: 'excel' as const,
      label: 'Excel表格',
      description: '详细数据表格，便于进一步分析',
      icon: '📊',
      color: 'text-green-600'
    },
    {
      key: 'csv' as const,
      label: 'CSV数据',
      description: '纯数据格式，便于导入其他系统',
      icon: '📋',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* 导出按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            导出中...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            导出报告
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* 导出选项下拉菜单 */}
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">导出选项</h3>
              
              {/* 导出格式选择 */}
              <div className="space-y-3 mb-4">
                {exportFormats.map(format => (
                  <button
                    key={format.key}
                    onClick={() => handleExport(format.key)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`text-xl ${format.color}`}>{format.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{format.label}</div>
                        <div className="text-sm text-gray-600">{format.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* 导出选项 */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">包含内容</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCharts}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        includeCharts: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">包含图表</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeRawData}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        includeRawData: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">包含原始数据</span>
                  </label>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
