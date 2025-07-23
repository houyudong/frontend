/**
 * 导出管理组件
 * 
 * 支持不同角色的数据导出功能
 */

import React, { useState, useEffect } from 'react';
import { ExportRequest, ExportType, ExportFormat, ExportStatus } from '../types/Export';

interface ExportManagerProps {
  userRole: 'student' | 'teacher' | 'admin';
  userId: string;
  compact?: boolean;
}

const ExportManager: React.FC<ExportManagerProps> = ({
  userRole,
  userId,
  compact = false
}) => {
  const [exportHistory, setExportHistory] = useState<ExportRequest[]>([]);
  const [selectedType, setSelectedType] = useState<ExportType | ''>('');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 根据角色获取可用的导出类型
  const getAvailableExportTypes = (): { value: ExportType; label: string; description: string }[] => {
    switch (userRole) {
      case 'student':
        return [
          { value: 'student_learning_report', label: '学习报告', description: '包含学习进度、成绩、活动记录的综合报告' },
          { value: 'student_progress_report', label: '进度报告', description: '详细的课程和实验进度分析' },
          { value: 'student_achievement_report', label: '成就报告', description: '获得的成就徽章和积分统计' },
          { value: 'student_grade_report', label: '成绩报告', description: '所有课程和实验的成绩汇总' },
          { value: 'student_activity_log', label: '活动日志', description: '学习活动的详细记录' },
          { value: 'student_certificate', label: '学习证书', description: '完成课程的学习证书' }
        ];
      case 'teacher':
        return [
          { value: 'teacher_class_report', label: '班级报告', description: '班级整体学习情况分析' },
          { value: 'teacher_student_analysis', label: '学生分析', description: '学生个体和群体学习分析' },
          { value: 'teacher_course_statistics', label: '课程统计', description: '课程完成率、难度分析等统计' },
          { value: 'teacher_grade_summary', label: '成绩汇总', description: '班级成绩分布和统计分析' },
          { value: 'teacher_attendance_report', label: '出勤报告', description: '学生出勤情况统计' },
          { value: 'teacher_assignment_analysis', label: '作业分析', description: '作业提交和完成情况分析' }
        ];
      case 'admin':
        return [
          { value: 'admin_system_report', label: '系统报告', description: '系统整体运行状况报告' },
          { value: 'admin_user_statistics', label: '用户统计', description: '用户注册、活跃度等统计' },
          { value: 'admin_course_analytics', label: '课程分析', description: '全平台课程数据分析' },
          { value: 'admin_performance_metrics', label: '性能指标', description: '系统性能和使用情况指标' },
          { value: 'admin_audit_log', label: '审计日志', description: '系统操作和安全审计记录' },
          { value: 'admin_financial_report', label: '财务报告', description: '平台收入和成本分析' }
        ];
      default:
        return [];
    }
  };

  // 模拟数据加载
  useEffect(() => {
    const loadExportHistory = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟导出历史数据
        const mockHistory: ExportRequest[] = [
          {
            id: 'export_001',
            type: userRole === 'student' ? 'student_learning_report' : 
                  userRole === 'teacher' ? 'teacher_class_report' : 'admin_system_report',
            format: 'pdf',
            title: userRole === 'student' ? '2024年1月学习报告' : 
                   userRole === 'teacher' ? '嵌入式开发班级报告' : '2024年1月系统报告',
            description: '包含详细的学习数据和分析',
            userId,
            userRole,
            filters: {
              dateRange: {
                start: '2024-01-01',
                end: '2024-01-31'
              }
            },
            options: {
              includeCharts: true,
              includeImages: true,
              includeDetails: true,
              includeSummary: true,
              includeComments: false,
              includeMetadata: true,
              language: 'zh-CN'
            },
            status: 'completed',
            createdAt: '2024-01-22T10:30:00Z',
            completedAt: '2024-01-22T10:35:00Z',
            downloadUrl: '/downloads/export_001.pdf',
            fileSize: 2048576 // 2MB
          },
          {
            id: 'export_002',
            type: userRole === 'student' ? 'student_progress_report' : 
                  userRole === 'teacher' ? 'teacher_student_analysis' : 'admin_user_statistics',
            format: 'excel',
            title: userRole === 'student' ? '学习进度详细报告' : 
                   userRole === 'teacher' ? '学生学习分析报告' : '用户活跃度统计',
            userId,
            userRole,
            filters: {},
            options: {
              includeCharts: false,
              includeImages: false,
              includeDetails: true,
              includeSummary: true,
              includeComments: true,
              includeMetadata: false,
              language: 'zh-CN'
            },
            status: 'processing',
            createdAt: '2024-01-22T14:15:00Z'
          }
        ];

        setExportHistory(mockHistory);
      } catch (error) {
        console.error('加载导出历史失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExportHistory();
  }, [userId, userRole]);

  // 开始导出
  const handleExport = async () => {
    if (!selectedType) return;

    setIsExporting(true);
    try {
      // 模拟导出过程
      const newExport: ExportRequest = {
        id: `export_${Date.now()}`,
        type: selectedType,
        format: selectedFormat,
        title: `${getAvailableExportTypes().find(t => t.value === selectedType)?.label} - ${new Date().toLocaleDateString()}`,
        userId,
        userRole,
        filters: {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        },
        options: {
          includeCharts: true,
          includeImages: true,
          includeDetails: true,
          includeSummary: true,
          includeComments: false,
          includeMetadata: true,
          language: 'zh-CN'
        },
        status: 'processing',
        createdAt: new Date().toISOString()
      };

      setExportHistory(prev => [newExport, ...prev]);

      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 更新状态为完成
      setExportHistory(prev => 
        prev.map(item => 
          item.id === newExport.id 
            ? { 
                ...item, 
                status: 'completed' as ExportStatus,
                completedAt: new Date().toISOString(),
                downloadUrl: `/downloads/${newExport.id}.${selectedFormat}`,
                fileSize: Math.floor(Math.random() * 5000000) + 1000000 // 1-5MB
              }
            : item
        )
      );

      // 重置选择
      setSelectedType('');
    } catch (error) {
      console.error('导出失败:', error);
      // 更新状态为失败
      setExportHistory(prev => 
        prev.map(item => 
          item.id.includes(Date.now().toString()) 
            ? { ...item, status: 'failed' as ExportStatus, errorMessage: '导出失败，请重试' }
            : item
        )
      );
    } finally {
      setIsExporting(false);
    }
  };

  // 下载文件
  const handleDownload = (exportItem: ExportRequest) => {
    if (exportItem.downloadUrl) {
      // 模拟下载
      const link = document.createElement('a');
      link.href = exportItem.downloadUrl;
      link.download = `${exportItem.title}.${exportItem.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: ExportStatus): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // 获取状态文本
  const getStatusText = (status: ExportStatus): string => {
    switch (status) {
      case 'completed': return '已完成';
      case 'processing': return '处理中';
      case 'failed': return '失败';
      case 'pending': return '等待中';
      case 'expired': return '已过期';
      default: return '未知';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化时间
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载导出数据中...</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* 头部 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">数据导出</h2>
          <p className="text-gray-600 mt-1">导出学习数据和报告</p>
        </div>
      </div>

      {/* 新建导出 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">创建新导出</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 导出类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导出类型
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择导出类型</option>
              {getAvailableExportTypes().map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedType && (
              <p className="text-sm text-gray-600 mt-1">
                {getAvailableExportTypes().find(t => t.value === selectedType)?.description}
              </p>
            )}
          </div>

          {/* 导出格式选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导出格式
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF 文档</option>
              <option value="excel">Excel 表格</option>
              <option value="csv">CSV 文件</option>
              <option value="word">Word 文档</option>
              <option value="json">JSON 数据</option>
            </select>
          </div>
        </div>

        {/* 导出按钮 */}
        <div className="mt-6">
          <button
            onClick={handleExport}
            disabled={!selectedType || isExporting}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              !selectedType || isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                导出中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                开始导出
              </>
            )}
          </button>
        </div>
      </div>

      {/* 导出历史 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">导出历史</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {exportHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-6xl">📊</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无导出记录</h3>
              <p className="text-gray-600">您的导出记录将在这里显示</p>
            </div>
          ) : (
            exportHistory.map(item => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {item.format.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📅 创建时间: {formatTime(item.createdAt)}</span>
                      {item.completedAt && (
                        <span>✅ 完成时间: {formatTime(item.completedAt)}</span>
                      )}
                      {item.fileSize && (
                        <span>📁 文件大小: {formatFileSize(item.fileSize)}</span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                    )}

                    {item.errorMessage && (
                      <p className="text-sm text-red-600 mt-2">❌ {item.errorMessage}</p>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-4">
                    {item.status === 'processing' && (
                      <div className="flex items-center text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm">处理中</span>
                      </div>
                    )}

                    {item.status === 'completed' && item.downloadUrl && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        下载
                      </button>
                    )}

                    {item.status === 'failed' && (
                      <button
                        onClick={() => {
                          setSelectedType(item.type);
                          setSelectedFormat(item.format);
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        重试
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportManager;
