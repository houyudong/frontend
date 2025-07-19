/**
 * 课程详细分析页面
 * 
 * 提供课程的全面数据分析和可视化展示
 */

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { useCourseAnalytics } from '../hooks/useCourseAnalytics';
import AnalyticsFilters from '../components/filters/AnalyticsFilters';
import ExportButton from '../components/export/ExportButton';
import type { ExportOptions } from '../components/export/ExportButton';
import {
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  HeatmapChart,
  formatNumber
} from '../components/charts';
import type {
  LineChartDataset,
  BarChartDataset,
  PieChartDataPoint,
  RadarChartDataset,
  HeatmapDataPoint
} from '../components/charts';

const CourseAnalyticsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data, loading, error, refreshData, exportReport } = useCourseAnalytics(courseId);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    studentIds: [] as string[],
    chapterIds: [] as string[]
  });

  // 活跃标签页
  const [activeTab, setActiveTab] = useState<'overview' | 'study-time' | 'scores' | 'behavior' | 'experiments'>('overview');

  // 导出状态
  const [exportLoading, setExportLoading] = useState(false);

  // 处理筛选变化
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setFilters(prev => ({ ...prev, startDate, endDate }));
  };

  const handleStudentFilterChange = (studentIds: string[]) => {
    setFilters(prev => ({ ...prev, studentIds }));
  };

  const handleChapterFilterChange = (chapterIds: string[]) => {
    setFilters(prev => ({ ...prev, chapterIds }));
  };

  // 处理导出
  const handleExport = async (format: 'pdf' | 'excel' | 'csv', options?: ExportOptions) => {
    setExportLoading(true);
    try {
      await exportReport(format);
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // 准备学习时长趋势数据
  const studyTimeTrendData: LineChartDataset[] = useMemo(() => {
    if (!data?.studyTimeAnalytics.dailyStudyTime) return [];

    return [
      {
        label: '每日学习时长',
        data: data.studyTimeAnalytics.dailyStudyTime.map(item => ({
          x: item.date,
          y: item.totalTime
        })),
        color: '#3B82F6',
        type: 'area'
      },
      {
        label: '活跃学生数',
        data: data.studyTimeAnalytics.dailyStudyTime.map(item => ({
          x: item.date,
          y: item.activeStudents
        })),
        color: '#10B981',
        type: 'line'
      }
    ];
  }, [data]);

  // 准备章节学习时长数据
  const chapterStudyTimeData: BarChartDataset[] = useMemo(() => {
    if (!data?.studyTimeAnalytics.chapterStudyTime) return [];

    return [
      {
        label: '章节学习时长',
        data: data.studyTimeAnalytics.chapterStudyTime.map(item => ({
          label: item.chapterName,
          value: item.totalTime,
          color: item.completionRate > 0.8 ? '#10B981' : item.completionRate > 0.6 ? '#F59E0B' : '#EF4444'
        }))
      }
    ];
  }, [data]);

  // 准备成绩分布数据
  const scoreDistributionData: PieChartDataPoint[] = useMemo(() => {
    if (!data?.scoreAnalytics.scoreDistribution) return [];

    return data.scoreAnalytics.scoreDistribution.map(item => ({
      label: item.range,
      value: item.count,
      percentage: item.percentage
    }));
  }, [data]);

  // 准备章节难度雷达图数据
  const chapterDifficultyData: RadarChartDataset[] = useMemo(() => {
    if (!data?.scoreAnalytics.chapterStats) return [];

    return [
      {
        label: '章节难度',
        data: data.scoreAnalytics.chapterStats.map(item => ({
          dimension: item.chapterName,
          value: item.difficulty * 100,
          maxValue: 100
        })),
        color: '#8B5CF6'
      },
      {
        label: '平均分',
        data: data.scoreAnalytics.chapterStats.map(item => ({
          dimension: item.chapterName,
          value: item.averageScore,
          maxValue: 100
        })),
        color: '#3B82F6'
      }
    ];
  }, [data]);

  // 准备学习行为热力图数据
  const learningPatternData: HeatmapDataPoint[] = useMemo(() => {
    if (!data?.learningBehaviorAnalytics.accessPatterns) return [];

    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    return data.learningBehaviorAnalytics.accessPatterns.map(item => ({
      x: `${item.hour}:00`,
      y: weekDays[item.dayOfWeek],
      value: item.accessCount,
      label: `${item.hour}:00 ${weekDays[item.dayOfWeek]}`
    }));
  }, [data]);



  if (loading) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">加载课程分析数据中...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">加载失败</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <button
                    onClick={refreshData}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    重新加载
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="text-center py-12">
            <p className="text-gray-500">暂无课程分析数据</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        {/* 面包屑导航 */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/teacher/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                教师工作台
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/teacher/analytics" className="ml-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ml-2">
                  数据分析
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-900 md:ml-2">课程分析</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {data.courseInfo.name} - 课程分析
              </h1>
              <p className="text-gray-600">
                深入分析课程学习数据，了解学生学习情况和课程效果
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新数据
              </button>
              <ExportButton
                onExport={handleExport}
                loading={exportLoading}
              />
            </div>
          </div>
        </div>

        {/* 课程概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">学习总时长</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(data.studyTimeAnalytics.totalStudyTime, 'time')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">平均分</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {data.scoreAnalytics.overallStats.averageScore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">及格率</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(data.scoreAnalytics.overallStats.passRate, 'percentage')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">实验成功率</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(data.experimentAnalytics.overallStats.successRate, 'percentage')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选器 */}
        <AnalyticsFilters
          onDateRangeChange={handleDateRangeChange}
          onStudentFilterChange={handleStudentFilterChange}
          onChapterFilterChange={handleChapterFilterChange}
          availableStudents={data.studentProgress.map(student => ({
            id: student.studentId,
            name: student.studentName
          }))}
          availableChapters={data.courseInfo.totalChapters ? Array.from({ length: data.courseInfo.totalChapters }, (_, i) => ({
            id: `chapter-${i + 1}`,
            name: `第${i + 1}章`
          })) : []}
          className="mb-8"
        />

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: '概览', icon: '📊' },
              { key: 'study-time', label: '学习时长', icon: '⏱️' },
              { key: 'scores', label: '成绩分析', icon: '📈' },
              { key: 'behavior', label: '学习行为', icon: '👥' },
              { key: 'experiments', label: '实验分析', icon: '🧪' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LineChart
                title="学习时长趋势"
                subtitle="过去30天的学习时长和活跃学生数变化"
                datasets={studyTimeTrendData}
                height={350}
                xAxisLabel="日期"
                yAxisLabel="时长(分钟) / 人数"
                formatTooltip={(value, label) => 
                  label.includes('时长') ? `${label}: ${formatNumber(value, 'time')}` : `${label}: ${value}人`
                }
              />
              
              <PieChart
                title="成绩分布"
                subtitle="学生成绩区间分布情况"
                data={scoreDistributionData}
                height={350}
                doughnut={true}
                formatTooltip={(value, label, percentage) => 
                  `${label}: ${value}人 (${percentage.toFixed(1)}%)`
                }
              />
            </div>
          )}

          {activeTab === 'study-time' && (
            <div className="space-y-8">
              <BarChart
                title="章节学习时长分析"
                subtitle="各章节的学习时长统计，颜色表示完成率"
                datasets={chapterStudyTimeData}
                height={400}
                xAxisLabel="章节"
                yAxisLabel="学习时长(分钟)"
                formatTooltip={(value, label) => `${label}: ${formatNumber(value, 'time')}`}
              />
              
              <HeatmapChart
                title="学习时间热力图"
                subtitle="学生在不同时间段的学习活跃度"
                data={learningPatternData}
                height={300}
                xAxisLabel="时间"
                yAxisLabel="星期"
                colorScheme="blue"
                formatTooltip={(value, x, y) => `${y} ${x}: ${value}次访问`}
              />
            </div>
          )}

          {activeTab === 'scores' && (
            <div className="space-y-8">
              <RadarChart
                title="章节难度与成绩对比"
                subtitle="各章节的难度系数与平均分对比分析"
                datasets={chapterDifficultyData}
                height={400}
                formatTooltip={(value, label, dimension) => 
                  label.includes('难度') ? `${dimension} ${label}: ${value.toFixed(1)}%` : `${dimension} ${label}: ${value.toFixed(1)}分`
                }
              />
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PieChart
                title="会话时长分布"
                subtitle="学生单次学习会话时长分布"
                data={data.learningBehaviorAnalytics.sessionAnalytics.sessionDistribution.map(item => ({
                  label: item.durationRange,
                  value: item.count,
                  percentage: item.percentage
                }))}
                height={350}
                formatTooltip={(value, label, percentage) => 
                  `${label}: ${value}次 (${percentage.toFixed(1)}%)`
                }
              />
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">参与度指标</h3>
                <div className="space-y-4">
                  {[
                    { label: '视频观看完成率', value: data.learningBehaviorAnalytics.engagementMetrics.videoWatchRate, color: 'bg-blue-500' },
                    { label: '练习完成率', value: data.learningBehaviorAnalytics.engagementMetrics.exerciseCompletionRate, color: 'bg-green-500' },
                    { label: '论坛参与率', value: data.learningBehaviorAnalytics.engagementMetrics.forumParticipationRate, color: 'bg-yellow-500' },
                    { label: '提问率', value: data.learningBehaviorAnalytics.engagementMetrics.questionAskingRate, color: 'bg-purple-500' }
                  ].map(metric => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${metric.color}`}
                            style={{ width: `${metric.value * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(metric.value, 'percentage')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experiments' && (
            <div className="space-y-8">
              <BarChart
                title="实验完成情况"
                subtitle="各实验的尝试次数和成功次数对比"
                datasets={[
                  {
                    label: '尝试次数',
                    data: data.experimentAnalytics.experimentDetails.map(exp => ({
                      label: exp.experimentName,
                      value: exp.attemptCount,
                      color: '#3B82F6'
                    }))
                  },
                  {
                    label: '成功次数',
                    data: data.experimentAnalytics.experimentDetails.map(exp => ({
                      label: exp.experimentName,
                      value: exp.successCount,
                      color: '#10B981'
                    }))
                  }
                ]}
                height={400}
                xAxisLabel="实验"
                yAxisLabel="次数"
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseAnalyticsPage;
