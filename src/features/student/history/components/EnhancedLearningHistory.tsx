/**
 * 增强的学习历史组件
 * 
 * 包含学习统计图表和更详细的历史记录展示
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, BarChart, PieChart, DonutChart, RadarChart } from '../../../../components/charts/ChartComponents';
import { LearningHistoryItem, LearningStats, ActivitySummary } from '../types/LearningHistory';

interface EnhancedLearningHistoryProps {
  showHeader?: boolean;
  compact?: boolean;
  maxDisplay?: number;
}

const EnhancedLearningHistory: React.FC<EnhancedLearningHistoryProps> = ({
  showHeader = true,
  compact = false,
  maxDisplay = 20
}) => {
  const [history, setHistory] = useState<LearningHistoryItem[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedType, setSelectedType] = useState<'all' | 'course' | 'experiment' | 'assignment'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'experiments' | 'achievements'>('overview');

  // 图表数据
  const chartData = {
    learningProgress: [
      { label: '1月', value: 65 },
      { label: '2月', value: 72 },
      { label: '3月', value: 78 },
      { label: '4月', value: 85 },
      { label: '5月', value: 92 }
    ],
    courseCompletion: [
      { label: 'STM32基础', value: 100, color: '#10B981' },
      { label: 'ARM架构', value: 85, color: '#3B82F6' },
      { label: 'C语言', value: 95, color: '#F59E0B' },
      { label: '嵌入式系统', value: 70, color: '#EF4444' },
      { label: '其他', value: 60, color: '#8B5CF6' }
    ],
    studyTime: [
      { label: '周一', value: 2.5 },
      { label: '周二', value: 3.2 },
      { label: '周三', value: 2.8 },
      { label: '周四', value: 4.1 },
      { label: '周五', value: 3.5 },
      { label: '周六', value: 1.8 },
      { label: '周日', value: 2.2 }
    ],
    skillRadar: [
      { label: '理论知识', value: 88 },
      { label: '实践能力', value: 82 },
      { label: '编程技能', value: 90 },
      { label: '问题解决', value: 85 },
      { label: '创新思维', value: 78 }
    ],
    activityTypes: [
      { label: '视频学习', value: 45, color: '#3B82F6' },
      { label: '实验操作', value: 30, color: '#10B981' },
      { label: '作业完成', value: 15, color: '#F59E0B' },
      { label: '讨论参与', value: 10, color: '#EF4444' }
    ]
  };

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟学习历史数据
        const mockHistory: LearningHistoryItem[] = [
          {
            id: 'hist_001',
            type: 'course',
            itemId: 'course_001',
            title: 'STM32嵌入式开发基础',
            description: '完成了第3章：GPIO控制原理的学习',
            thumbnail: '/images/courses/stm32.jpg',
            category: '嵌入式开发',
            action: 'chapter_completed',
            timestamp: '2024-01-22T14:30:00Z',
            duration: 45,
            progress: 65,
            score: 88,
            metadata: {
              chapterTitle: '第3章：GPIO控制原理',
              instructor: '刘教授'
            }
          },
          {
            id: 'hist_002',
            type: 'experiment',
            itemId: 'exp_001',
            title: 'GPIO控制LED实验',
            description: '成功完成LED控制实验，获得优秀评价',
            thumbnail: '/images/experiments/gpio_led.jpg',
            category: '基础实验',
            action: 'experiment_completed',
            timestamp: '2024-01-22T16:15:00Z',
            duration: 90,
            progress: 100,
            score: 92,
            metadata: {
              difficulty: 'beginner',
              attempts: 1
            }
          },
          {
            id: 'hist_003',
            type: 'assignment',
            itemId: 'assign_001',
            title: '第3章课后作业',
            description: '提交了GPIO控制相关的编程作业',
            category: '课后作业',
            action: 'assignment_submitted',
            timestamp: '2024-01-21T20:45:00Z',
            duration: 60,
            progress: 100,
            score: 85,
            metadata: {
              submissionCount: 1,
              isLate: false
            }
          },
          {
            id: 'hist_004',
            type: 'course',
            itemId: 'course_001',
            title: 'STM32嵌入式开发基础',
            description: '观看了第2章的教学视频',
            thumbnail: '/images/courses/stm32.jpg',
            category: '嵌入式开发',
            action: 'video_watched',
            timestamp: '2024-01-21T15:20:00Z',
            duration: 35,
            progress: 50,
            metadata: {
              videoTitle: '2.2 GPIO配置方法',
              watchProgress: 100
            }
          },
          {
            id: 'hist_005',
            type: 'experiment',
            itemId: 'exp_002',
            title: '串口通信实验',
            description: '开始进行串口通信实验',
            thumbnail: '/images/experiments/uart.jpg',
            category: '通信实验',
            action: 'experiment_started',
            timestamp: '2024-01-20T10:30:00Z',
            duration: 25,
            progress: 30,
            metadata: {
              difficulty: 'intermediate',
              currentStep: 2
            }
          }
        ];

        // 模拟统计数据
        const mockStats: LearningStats = {
          totalStudyTime: 1250, // 分钟
          totalActivities: 45,
          coursesCompleted: 2,
          experimentsCompleted: 8,
          assignmentsSubmitted: 12,
          averageScore: 87.5,
          streakDays: 7,
          mostActiveHour: 14,
          weeklyProgress: [
            { date: '2024-01-16', minutes: 120, activities: 5 },
            { date: '2024-01-17', minutes: 90, activities: 3 },
            { date: '2024-01-18', minutes: 150, activities: 7 },
            { date: '2024-01-19', minutes: 180, activities: 8 },
            { date: '2024-01-20', minutes: 200, activities: 9 },
            { date: '2024-01-21', minutes: 160, activities: 6 },
            { date: '2024-01-22', minutes: 220, activities: 10 }
          ]
        };

        // 模拟活动摘要
        const mockActivitySummary: ActivitySummary[] = [
          {
            date: '2024-01-22',
            totalTime: 220,
            activities: 10,
            coursesStudied: 2,
            experimentsCompleted: 1,
            assignmentsSubmitted: 1,
            averageScore: 90
          },
          {
            date: '2024-01-21',
            totalTime: 160,
            activities: 6,
            coursesStudied: 1,
            experimentsCompleted: 0,
            assignmentsSubmitted: 2,
            averageScore: 85
          },
          {
            date: '2024-01-20',
            totalTime: 200,
            activities: 9,
            coursesStudied: 3,
            experimentsCompleted: 2,
            assignmentsSubmitted: 1,
            averageScore: 88
          }
        ];

        setHistory(mockHistory);
        setStats(mockStats);
        setActivitySummary(mockActivitySummary);
      } catch (error) {
        console.error('加载学习历史失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedPeriod]);

  // 筛选历史记录
  const filteredHistory = history.filter(item => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  }).slice(0, maxDisplay);

  // 获取活动类型图标
  const getActivityIcon = (type: string, action: string): string => {
    if (type === 'course') {
      if (action === 'chapter_completed') return '✅';
      if (action === 'video_watched') return '📺';
      return '📚';
    }
    if (type === 'experiment') {
      if (action === 'experiment_completed') return '🎯';
      if (action === 'experiment_started') return '🧪';
      return '⚗️';
    }
    if (type === 'assignment') {
      if (action === 'assignment_submitted') return '📝';
      return '📋';
    }
    return '📖';
  };

  // 获取活动类型颜色
  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'experiment': return 'bg-green-100 text-green-700 border-green-200';
      case 'assignment': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // 格式化时长
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
  };

  // 格式化时间
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">加载学习历史中...</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {showHeader && (
        <>
          {/* 页面标题 - 美化版 */}
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      学习历史分析
                    </h1>
                    <p className="text-gray-700 text-lg">
                      查看您的学习活动记录和成长轨迹
                    </p>
                  </div>
                </div>

                {/* 快速操作 */}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/student/progress"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    查看进度
                  </Link>
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
                  { key: 'overview', label: '学习概览', icon: '📈', desc: '学习统计、进度分析', gradient: 'from-blue-500 to-indigo-600' },
                  { key: 'courses', label: '课程学习', icon: '📚', desc: '课程完成情况', gradient: 'from-green-500 to-emerald-600' },
                  { key: 'experiments', label: '实验记录', icon: '🧪', desc: '实验操作历史', gradient: 'from-purple-500 to-violet-600' },
                  { key: 'achievements', label: '成就徽章', icon: '🏆', desc: '学习成就展示', gradient: 'from-orange-500 to-red-600' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                      selectedTab === tab.key
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                    }`}
                  >
                    {/* 选中状态的背景光效 */}
                    {selectedTab === tab.key && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                    )}

                    {/* 图标容器 */}
                    <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedTab === tab.key
                        ? 'bg-white/20'
                        : 'bg-gray-100 group-hover:bg-white'
                    } transition-colors duration-300`}>
                      <span className="text-lg">{tab.icon}</span>
                    </div>

                    {/* 标签文字 */}
                    <div className="relative z-10 text-left">
                      <div>{tab.label}</div>
                      <div className={`text-xs mt-1 ${
                        selectedTab === tab.key ? 'text-white/80' : 'text-gray-400'
                      }`}>
                        {tab.desc}
                      </div>
                    </div>

                    {/* 悬停时的底部指示器 */}
                    {selectedTab !== tab.key && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-8 transition-all duration-300 rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* 标签页内容 */}
      {selectedTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '总学习时长',
                value: formatDuration(stats.totalStudyTime),
                change: `连续 ${stats.streakDays} 天`,
                icon: '⏰',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100'
              },
              {
                title: '总活动数',
                value: stats.totalActivities.toString(),
                change: `平均每天 ${Math.round(stats.totalActivities / 7)}`,
                icon: '📊',
                color: 'from-green-500 to-green-600',
                bgColor: 'from-green-50 to-green-100'
              },
              {
                title: '课程完成',
                value: stats.coursesCompleted.toString(),
                change: '门课程',
                icon: '📚',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100'
              },
              {
                title: '平均分数',
                value: `${stats.averageScore}分`,
                change: '综合评分',
                icon: '🎯',
                color: 'from-orange-500 to-orange-600',
                bgColor: 'from-orange-50 to-orange-100'
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
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{metric.title}</div>
                  <div className="text-xs text-gray-500">{metric.change}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 学习进度趋势 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <LineChart
                data={chartData.learningProgress}
                title="学习进度趋势"
                color="#3B82F6"
                height={250}
              />
            </div>

            {/* 每周学习时长 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <BarChart
                data={chartData.studyTime.map(item => ({
                  ...item,
                  color: '#10B981'
                }))}
                title="每周学习时长（小时）"
                height={250}
              />
            </div>

            {/* 学习活动分布 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <PieChart
                data={chartData.activityTypes}
                title="学习活动分布"
                size={300}
              />
            </div>

            {/* 技能雷达图 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <RadarChart
                data={chartData.skillRadar}
                title="技能发展雷达图"
                size={300}
                maxValue={100}
              />
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'courses' && stats && (
        <div className="space-y-8">
          {/* 课程完成情况 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 课程完成分布 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <DonutChart
                data={chartData.courseCompletion}
                title="课程完成情况"
                size={300}
                centerText={stats.coursesCompleted.toString()}
              />
            </div>

            {/* 学习进度趋势 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <LineChart
                data={chartData.learningProgress}
                title="课程学习进度"
                color="#10B981"
                height={250}
              />
            </div>
          </div>

          {/* 课程详细列表 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">课程学习详情</h3>
            <div className="space-y-4">
              {chartData.courseCompletion.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: course.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{course.label}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{course.value}%</div>
                      <div className="text-sm text-gray-600">完成度</div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${course.value}%`,
                          backgroundColor: course.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'experiments' && (
        <div className="space-y-8">
          {/* 实验统计 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 实验活动分布 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <PieChart
                data={chartData.activityTypes.filter(item => item.label === '实验操作' || item.label === '作业完成')}
                title="实验活动分布"
                size={300}
              />
            </div>

            {/* 实验进度趋势 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <BarChart
                data={chartData.studyTime.map(item => ({
                  ...item,
                  color: '#8B5CF6'
                }))}
                title="每周实验时长"
                height={250}
              />
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div className="space-y-8">
          {/* 成就展示 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">学习成就</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: '学习新手', desc: '完成第一个课程', icon: '🌟', earned: true },
                { name: '实验达人', desc: '完成10个实验', icon: '🧪', earned: true },
                { name: '编程高手', desc: '编程作业满分', icon: '💻', earned: true },
                { name: '持续学习', desc: '连续学习7天', icon: '🔥', earned: true },
                { name: '知识探索者', desc: '学习5门课程', icon: '🎓', earned: false },
                { name: '完美主义者', desc: '所有作业满分', icon: '💯', earned: false }
              ].map((achievement, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  achievement.earned
                    ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="text-center">
                    <div className={`text-4xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <h4 className={`font-semibold mb-1 ${
                      achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                    }`}>
                      {achievement.desc}
                    </p>
                    {achievement.earned && (
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        已获得
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 原有的学习统计卡片 - 仅在非概览模式下显示 */}
      {selectedTab !== 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">总学习时长</p>
                <p className="text-2xl font-bold text-blue-700">{formatDuration(stats.totalStudyTime)}</p>
              </div>
              <span className="text-2xl">⏰</span>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              连续学习 {stats.streakDays} 天
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">总活动数</p>
                <p className="text-2xl font-bold text-green-700">{stats.totalActivities}</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
            <div className="mt-2 text-xs text-green-600">
              平均每天 {Math.round(stats.totalActivities / 7)} 个活动
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">平均成绩</p>
                <p className="text-2xl font-bold text-purple-700">{stats.averageScore}</p>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="mt-2 text-xs text-purple-600">
              实验完成 {stats.experimentsCompleted} 个
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">最活跃时段</p>
                <p className="text-2xl font-bold text-orange-700">{stats.mostActiveHour}:00</p>
              </div>
              <span className="text-2xl">🕐</span>
            </div>
            <div className="mt-2 text-xs text-orange-600">
              作业提交 {stats.assignmentsSubmitted} 份
            </div>
          </div>
        </div>
      )}

      {/* 周学习趋势图 */}
      {stats && stats.weeklyProgress && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">本周学习趋势</h3>
            <div className="flex items-center space-x-2">
              {['week', 'month', 'year'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedPeriod === period
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period === 'week' ? '本周' : period === 'month' ? '本月' : '本年'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {stats.weeklyProgress.map((day, index) => {
              const maxMinutes = Math.max(...stats.weeklyProgress.map(d => d.minutes));
              const widthPercentage = (day.minutes / maxMinutes) * 100;

              return (
                <div key={day.date} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{formatDuration(day.minutes)}</span>
                      <span className="text-xs text-gray-500">{day.activities} 个活动</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 活动类型筛选 */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: '全部活动', icon: '📖' },
          { key: 'course', label: '课程学习', icon: '📚' },
          { key: 'experiment', label: '实验练习', icon: '🧪' },
          { key: 'assignment', label: '作业提交', icon: '📝' }
        ].map(type => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key as any)}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedType === type.key
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
            }`}
          >
            <span className="mr-1">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      {/* 学习历史记录 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">最近活动</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-6xl">📚</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无学习记录</h3>
              <p className="text-gray-600">开始学习以记录您的学习轨迹</p>
            </div>
          ) : (
            filteredHistory.map(item => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${getActivityColor(item.type)}`}>
                    <span className="text-lg">{getActivityIcon(item.type, item.action)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📂 {item.category}</span>
                          <span>⏱️ {formatDuration(item.duration)}</span>
                          {item.score && <span>🎯 {item.score}分</span>}
                          {item.progress && <span>📊 {item.progress}%</span>}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm text-gray-900">{formatTime(item.timestamp)}</div>
                        {item.score && (
                          <div className={`text-xs mt-1 ${
                            item.score >= 90 ? 'text-green-600' :
                            item.score >= 80 ? 'text-blue-600' :
                            item.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.score >= 90 ? '优秀' :
                             item.score >= 80 ? '良好' :
                             item.score >= 70 ? '及格' : '需改进'}
                          </div>
                        )}
                      </div>
                    </div>
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

export default EnhancedLearningHistory;
