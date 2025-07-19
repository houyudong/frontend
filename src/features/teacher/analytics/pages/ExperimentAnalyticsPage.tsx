/**
 * 实验分析页面
 * 
 * 提供完整的实验数据分析和可视化功能
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { useExperimentAnalytics } from '../hooks/useExperimentAnalytics';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import RadarChart from '../components/charts/RadarChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import AnalyticsFilters from '../components/filters/AnalyticsFilters';
import ExportButton from '../components/export/ExportButton';

const ExperimentAnalyticsPage: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'errors' | 'trends' | 'suggestions'>('overview');
  
  const {
    analytics,
    suggestions,
    loading,
    suggestionsLoading,
    error,
    fetchAnalytics,
    fetchSuggestions,
    exportReport,
    exportLoading,
    clearError
  } = useExperimentAnalytics();

  // 加载数据
  useEffect(() => {
    if (experimentId) {
      fetchAnalytics({ experimentId, includeDetails: true });
      fetchSuggestions(experimentId);
    }
  }, [experimentId, fetchAnalytics, fetchSuggestions]);

  // 处理导出
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (experimentId) {
      await exportReport(experimentId, format);
    }
  };

  // 错误处理
  if (error) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="btn btn-primary"
            >
              重试
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 加载状态
  if (loading || !analytics) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">加载实验分析数据中...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        {/* 面包屑导航 */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm">
            <li>
              <button
                onClick={() => navigate('/teacher/analytics')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                数据分析
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-900 font-medium">实验分析</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                </svg>
              </div>
              <span>{analytics.experimentInfo.name}</span>
            </h1>
            <p className="page-subtitle mt-2">
              {analytics.experimentInfo.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <ExportButton
              onExport={handleExport}
              loading={exportLoading}
            />
            <button
              onClick={() => navigate('/teacher/analytics')}
              className="btn btn-secondary"
            >
              返回列表
            </button>
          </div>
        </div>

        {/* 实验基本信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{analytics.totalStudents}</div>
            <div className="text-sm font-medium text-gray-600">参与学生</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{analytics.completionRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-gray-600">完成率</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">{analytics.averageScore.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-600">平均分</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{Math.round(analytics.averageTime)}</div>
            <div className="text-sm font-medium text-gray-600">平均时长(分钟)</div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: '概览分析', icon: '📊' },
              { key: 'performance', label: '表现分析', icon: '🎯' },
              { key: 'errors', label: '错误分析', icon: '🐛' },
              { key: 'trends', label: '趋势分析', icon: '📈' },
              { key: 'suggestions', label: '改进建议', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
              {/* 时间分布 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">完成时间分布</h3>
                <PieChart
                  data={{
                    labels: analytics.timeDistribution.map(item => item.range),
                    datasets: [{
                      data: analytics.timeDistribution.map(item => item.count),
                      backgroundColor: [
                        '#10B981',
                        '#3B82F6',
                        '#F59E0B',
                        '#EF4444'
                      ]
                    }]
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>

              {/* 成绩分布 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">成绩分布</h3>
                <BarChart
                  data={{
                    labels: analytics.scoreDistribution.map(item => item.range),
                    datasets: [{
                      label: '学生数量',
                      data: analytics.scoreDistribution.map(item => item.count),
                      backgroundColor: '#3B82F6'
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-8">
              {/* 学习路径分析 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">学习路径完成情况</h3>
                <div className="space-y-4">
                  {analytics.learningPath.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{step.description}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${step.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{step.completionRate.toFixed(1)}%</span>
                          </div>
                          <span className="text-sm text-gray-500">平均 {step.averageTime} 分钟</span>
                        </div>
                        {step.commonIssues.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">常见问题: </span>
                            <span className="text-xs text-red-600">{step.commonIssues.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 代码质量分析 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">代码质量分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.codeQuality.averageLines}</div>
                    <div className="text-sm text-gray-600">平均代码行数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.codeQuality.complexityScore}</div>
                    <div className="text-sm text-gray-600">复杂度评分</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics.codeQuality.bestPracticesScore}</div>
                    <div className="text-sm text-gray-600">最佳实践评分</div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">常见编程模式</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.codeQuality.commonPatterns.map((pattern, index) => (
                      <span
                        key={index}
                        className="badge badge-secondary"
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-8">
              {/* 错误类型分析 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">错误类型分布</h3>
                <div className="space-y-6">
                  {analytics.errorAnalysis.map((error, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{error.type}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{error.count} 次</span>
                          <span className="badge badge-secondary">{error.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${error.percentage}%` }}
                        />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">常见错误信息:</span>
                        <ul className="mt-1 text-sm text-gray-600">
                          {error.commonMessages.map((message, msgIndex) => (
                            <li key={msgIndex} className="ml-4">• {message}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-8">
              {/* 时间趋势分析 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">完成趋势分析</h3>
                <LineChart
                  data={{
                    labels: analytics.timeTrends.map(item => 
                      new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [
                      {
                        label: '尝试次数',
                        data: analytics.timeTrends.map(item => item.attempts),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        yAxisID: 'y'
                      },
                      {
                        label: '完成次数',
                        data: analytics.timeTrends.map(item => item.completions),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        yAxisID: 'y'
                      },
                      {
                        label: '平均分',
                        data: analytics.timeTrends.map(item => item.averageScore),
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        yAxisID: 'y1'
                      }
                    ]
                  }}
                  options={{
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: '次数'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: '分数'
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-8">
              {suggestions ? (
                <>
                  {/* 改进建议 */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">改进建议</h3>
                    <div className="space-y-4">
                      {suggestions.suggestions.map((suggestion, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`badge ${
                                  suggestion.priority === 'high' ? 'badge-danger' :
                                  suggestion.priority === 'medium' ? 'badge-warning' : 'badge-secondary'
                                }`}>
                                  {suggestion.priority === 'high' ? '高优先级' :
                                   suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {suggestion.category === 'difficulty' ? '难度调整' :
                                   suggestion.category === 'content' ? '内容优化' :
                                   suggestion.category === 'instructions' ? '说明改进' :
                                   suggestion.category === 'time_limit' ? '时间限制' : '测试用例'}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2">{suggestion.description}</h4>
                              <p className="text-sm text-gray-600 mb-2">{suggestion.expectedImpact}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-500">
                                  实施难度: 
                                  <span className={`ml-1 ${
                                    suggestion.implementationEffort === 'easy' ? 'text-green-600' :
                                    suggestion.implementationEffort === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {suggestion.implementationEffort === 'easy' ? '简单' :
                                     suggestion.implementationEffort === 'medium' ? '中等' : '困难'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 数据洞察 */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">数据洞察</h3>
                    <div className="space-y-4">
                      {suggestions.insights.map((insight, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${
                          insight.type === 'positive' ? 'border-green-200 bg-green-50' :
                          insight.type === 'negative' ? 'border-red-200 bg-red-50' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                              insight.type === 'positive' ? 'bg-green-500' :
                              insight.type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                            }`}>
                              {insight.type === 'positive' ? '✓' : insight.type === 'negative' ? '!' : 'i'}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-medium mb-1 ${
                                insight.type === 'positive' ? 'text-green-800' :
                                insight.type === 'negative' ? 'text-red-800' : 'text-gray-800'
                              }`}>
                                {insight.title}
                              </h4>
                              <p className={`text-sm ${
                                insight.type === 'positive' ? 'text-green-700' :
                                insight.type === 'negative' ? 'text-red-700' : 'text-gray-700'
                              }`}>
                                {insight.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="card text-center py-12">
                  {suggestionsLoading ? (
                    <div>
                      <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                      <p className="text-gray-600">加载改进建议中...</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">暂无改进建议</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExperimentAnalyticsPage;
