/**
 * 系统数据分析页面 - 美化版
 *
 * 提供完整的学习行为分析和运营数据可视化功能
 * 增强的图表展示和现代化UI设计
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import LearningBehaviorAnalysis from '../components/LearningBehaviorAnalysis';
import EnhancedLearningBehaviorAnalysis from '../components/EnhancedLearningBehaviorAnalysis';
import OperationalDashboard from '../components/OperationalDashboard';
import EnhancedOperationalDashboard from '../components/EnhancedOperationalDashboard';
import RealTimeMonitor from '../components/RealTimeMonitor';
import EnhancedRealTimeMonitor from '../components/EnhancedRealTimeMonitor';
import { LineChart, BarChart, PieChart, DonutChart, RadarChart } from '../../../../components/charts/ChartComponents';

const SystemAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'operational' | 'realtime'>('overview');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // 模拟数据
  const mockData = {
    overview: {
      totalUsers: 1250,
      activeUsers: 892,
      totalCourses: 45,
      completionRate: 78.5,
      systemUptime: 99.8,
      avgSessionTime: 45.2
    },
    userGrowth: [
      { label: '1月', value: 850 },
      { label: '2月', value: 920 },
      { label: '3月', value: 1050 },
      { label: '4月', value: 1180 },
      { label: '5月', value: 1250 }
    ],
    courseDistribution: [
      { label: 'STM32基础', value: 320, color: '#3B82F6' },
      { label: 'ARM架构', value: 280, color: '#10B981' },
      { label: 'C语言', value: 250, color: '#F59E0B' },
      { label: '嵌入式系统', value: 200, color: '#EF4444' },
      { label: '其他', value: 200, color: '#8B5CF6' }
    ],
    departmentStats: [
      { label: '电子信息', value: 450, color: '#3B82F6' },
      { label: '计算机', value: 380, color: '#10B981' },
      { label: '自动化', value: 250, color: '#F59E0B' },
      { label: '通信工程', value: 170, color: '#EF4444' }
    ],
    performanceMetrics: [
      { label: '学习效率', value: 85 },
      { label: '参与度', value: 78 },
      { label: '完成率', value: 82 },
      { label: '满意度', value: 88 },
      { label: '互动性', value: 75 }
    ],
    dailyActivity: [
      { label: '周一', value: 234 },
      { label: '周二', value: 267 },
      { label: '周三', value: 298 },
      { label: '周四', value: 312 },
      { label: '周五', value: 289 },
      { label: '周六', value: 156 },
      { label: '周日', value: 178 }
    ]
  };

  useEffect(() => {
    // 模拟数据加载
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadData();
  }, [timeRange]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">加载系统分析数据中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                管理后台
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">系统数据分析</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题 - 美化版 */}
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    系统数据分析
                  </h1>
                  <p className="text-gray-700 text-lg">
                    全面的学习行为分析、运营数据监控和实时系统状态展示
                  </p>
                </div>
              </div>

              {/* 时间范围选择器 */}
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2">
                {[
                  { key: '7d', label: '7天' },
                  { key: '30d', label: '30天' },
                  { key: '90d', label: '90天' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => setTimeRange(option.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      timeRange === option.key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 - 美化版 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
          <div className="relative">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>

            <nav className="relative flex space-x-2 p-2">
              {[
                { key: 'overview', label: '数据概览', icon: '📈', desc: '核心指标、趋势分析、图表展示', gradient: 'from-blue-500 to-indigo-600' },
                { key: 'behavior', label: '学习行为', icon: '📊', desc: '挂科风险模型、教师评估看板', gradient: 'from-green-500 to-emerald-600' },
                { key: 'operational', label: '运营数据', icon: '📋', desc: '用户活跃度、课程热度分析', gradient: 'from-purple-500 to-violet-600' },
                { key: 'realtime', label: '实时监控', icon: '🖥️', desc: '实时在线人数、热门课程、作业提交率', gradient: 'from-orange-500 to-red-600' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    activeTab === tab.key
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                  }`}
                >
                  {/* 选中状态的背景光效 */}
                  {activeTab === tab.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                  )}

                  {/* 图标容器 */}
                  <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === tab.key
                      ? 'bg-white/20'
                      : 'bg-gray-100 group-hover:bg-white'
                  } transition-colors duration-300`}>
                    <span className="text-lg">{tab.icon}</span>
                  </div>

                  {/* 标签文字 */}
                  <div className="relative z-10 text-left">
                    <div>{tab.label}</div>
                    <div className={`text-xs mt-1 ${
                      activeTab === tab.key ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {tab.desc}
                    </div>
                  </div>

                  {/* 悬停时的底部指示器 */}
                  {activeTab !== tab.key && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-8 transition-all duration-300 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="min-h-screen">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 核心指标卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {[
                  {
                    title: '总用户数',
                    value: mockData.overview.totalUsers.toLocaleString(),
                    change: '+12.5%',
                    trend: 'up',
                    icon: '👥',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'from-blue-50 to-blue-100'
                  },
                  {
                    title: '活跃用户',
                    value: mockData.overview.activeUsers.toLocaleString(),
                    change: '+8.3%',
                    trend: 'up',
                    icon: '🔥',
                    color: 'from-green-500 to-green-600',
                    bgColor: 'from-green-50 to-green-100'
                  },
                  {
                    title: '课程总数',
                    value: mockData.overview.totalCourses.toString(),
                    change: '+3',
                    trend: 'up',
                    icon: '📚',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'from-purple-50 to-purple-100'
                  },
                  {
                    title: '完成率',
                    value: `${mockData.overview.completionRate}%`,
                    change: '+2.1%',
                    trend: 'up',
                    icon: '✅',
                    color: 'from-emerald-500 to-emerald-600',
                    bgColor: 'from-emerald-50 to-emerald-100'
                  },
                  {
                    title: '系统可用性',
                    value: `${mockData.overview.systemUptime}%`,
                    change: '+0.1%',
                    trend: 'up',
                    icon: '⚡',
                    color: 'from-orange-500 to-orange-600',
                    bgColor: 'from-orange-50 to-orange-100'
                  },
                  {
                    title: '平均会话时长',
                    value: `${mockData.overview.avgSessionTime}min`,
                    change: '+5.2%',
                    trend: 'up',
                    icon: '⏱️',
                    color: 'from-pink-500 to-pink-600',
                    bgColor: 'from-pink-50 to-pink-100'
                  }
                ].map((metric, index) => (
                  <div key={index} className={`relative bg-gradient-to-br ${metric.bgColor} rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden group hover:shadow-lg transition-all duration-300`}>
                    {/* 背景装饰 */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl -translate-y-8 translate-x-8"></div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <span className="text-xl">{metric.icon}</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <span>{metric.change}</span>
                          <svg className={`w-4 h-4 ${metric.trend === 'up' ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.title}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 图表区域 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 用户增长趋势 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <LineChart
                    data={mockData.userGrowth}
                    title="用户增长趋势"
                    color="#3B82F6"
                    height={250}
                  />
                </div>

                {/* 每日活跃用户 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <BarChart
                    data={mockData.dailyActivity.map(item => ({
                      ...item,
                      color: '#10B981'
                    }))}
                    title="每日活跃用户"
                    height={250}
                  />
                </div>

                {/* 课程分布 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <PieChart
                    data={mockData.courseDistribution}
                    title="课程分布统计"
                    size={300}
                  />
                </div>

                {/* 院系统计 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <DonutChart
                    data={mockData.departmentStats}
                    title="院系用户分布"
                    size={300}
                    centerText={mockData.overview.totalUsers.toString()}
                  />
                </div>
              </div>

              {/* 性能指标雷达图 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <RadarChart
                  data={mockData.performanceMetrics}
                  title="系统性能指标"
                  size={400}
                  maxValue={100}
                />
              </div>
            </div>
          )}

          {activeTab === 'behavior' && <EnhancedLearningBehaviorAnalysis />}
          {activeTab === 'operational' && <EnhancedOperationalDashboard />}
          {activeTab === 'realtime' && <EnhancedRealTimeMonitor />}
        </div>
      </div>
    </MainLayout>
  );
};

export default SystemAnalyticsPage;
