import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

// 数据分析接口
interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    totalCourses: number;
    totalExperiments: number;
    avgCompletionRate: number;
    avgStudyTime: number;
  };
  courseAnalytics: {
    courseId: string;
    courseName: string;
    enrolledStudents: number;
    completedStudents: number;
    completionRate: number;
    avgScore: number;
    difficulty: string;
  }[];
  experimentAnalytics: {
    experimentId: string;
    experimentName: string;
    attemptedStudents: number;
    completedStudents: number;
    successRate: number;
    avgTime: number;
    commonErrors: string[];
  }[];
  studentProgress: {
    excellent: number; // 90分以上
    good: number;      // 80-89分
    average: number;   // 70-79分
    poor: number;      // 70分以下
  };
  timeAnalytics: {
    date: string;
    activeUsers: number;
    studyTime: number;
    completedTasks: number;
  }[];
}

// 模拟分析数据
const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalStudents: 45,
    activeStudents: 38,
    totalCourses: 12,
    totalExperiments: 13,
    avgCompletionRate: 72,
    avgStudyTime: 180 // 分钟
  },
  courseAnalytics: [
    {
      courseId: 'stm32-intro',
      courseName: 'STM32基础入门',
      enrolledStudents: 45,
      completedStudents: 35,
      completionRate: 78,
      avgScore: 85,
      difficulty: 'beginner'
    },
    {
      courseId: 'gpio-programming',
      courseName: 'GPIO编程与LED控制',
      enrolledStudents: 40,
      completedStudents: 32,
      completionRate: 80,
      avgScore: 82,
      difficulty: 'beginner'
    },
    {
      courseId: 'uart-communication',
      courseName: 'UART串口通信',
      enrolledStudents: 35,
      completedStudents: 20,
      completionRate: 57,
      avgScore: 75,
      difficulty: 'intermediate'
    },
    {
      courseId: 'timer-pwm',
      courseName: '定时器与PWM控制',
      enrolledStudents: 30,
      completedStudents: 15,
      completionRate: 50,
      avgScore: 70,
      difficulty: 'intermediate'
    }
  ],
  experimentAnalytics: [
    {
      experimentId: 'led-blink',
      experimentName: 'LED闪烁实验',
      attemptedStudents: 42,
      completedStudents: 38,
      successRate: 90,
      avgTime: 45,
      commonErrors: ['GPIO配置错误', '延时函数使用不当']
    },
    {
      experimentId: 'uart-communication',
      experimentName: '串口通信实验',
      attemptedStudents: 35,
      completedStudents: 25,
      successRate: 71,
      avgTime: 90,
      commonErrors: ['波特率配置错误', '数据格式问题', '中断处理错误']
    },
    {
      experimentId: 'timer-interrupt',
      experimentName: '定时器中断实验',
      attemptedStudents: 28,
      completedStudents: 18,
      successRate: 64,
      avgTime: 120,
      commonErrors: ['中断优先级设置', '定时器配置错误', '中断服务函数编写']
    }
  ],
  studentProgress: {
    excellent: 12,
    good: 18,
    average: 10,
    poor: 5
  },
  timeAnalytics: [
    { date: '2024-01-10', activeUsers: 32, studyTime: 240, completedTasks: 15 },
    { date: '2024-01-11', activeUsers: 35, studyTime: 280, completedTasks: 18 },
    { date: '2024-01-12', activeUsers: 28, studyTime: 200, completedTasks: 12 },
    { date: '2024-01-13', activeUsers: 40, studyTime: 320, completedTasks: 22 },
    { date: '2024-01-14', activeUsers: 38, studyTime: 300, completedTasks: 20 },
    { date: '2024-01-15', activeUsers: 42, studyTime: 350, completedTasks: 25 }
  ]
};

/**
 * AnalyticsPage - 数据分析页面
 *
 * 教师查看学习数据分析和统计报表
 * 提供课程、实验、学生进度等多维度分析
 */
const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'experiments' | 'students'>('overview');

  // 模拟数据加载
  useEffect(() => {
    const loadAnalytics = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner h-8 w-8 mr-3"></div>
            <span className="text-gray-600">加载数据分析中...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!analyticsData) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">数据加载失败</h3>
            <p className="text-gray-600">请刷新页面重试</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 - 现代化设计 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 rounded-2xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">数据分析</h1>
                <p className="text-green-100 text-lg mb-6 max-w-2xl">
                  查看学习数据统计和分析报表，优化教学效果
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">数据状态：实时更新</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm">分析 {analyticsData.overview.totalStudents} 名学生数据</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-6xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签导航 - 现代化设计 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">分析维度</h3>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'overview', name: '总览', icon: '📊', color: 'from-green-500 to-green-600' },
              { id: 'courses', name: '课程分析', icon: '📚', color: 'from-emerald-500 to-emerald-600' },
              { id: 'experiments', name: '实验分析', icon: '🧪', color: 'from-teal-500 to-teal-600' },
              { id: 'students', name: '学生进度', icon: '👥', color: 'from-cyan-500 to-cyan-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`group p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedTab === tab.id
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-green-200 hover:shadow-md hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${tab.color} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-lg">{tab.icon}</span>
                  </div>
                  <div>
                    <h4 className={`font-semibold transition-colors ${
                      selectedTab === tab.id ? 'text-green-700' : 'text-gray-900 group-hover:text-green-700'
                    }`}>
                      {tab.name}
                    </h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* 总览统计 - 现代化卡片设计 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white text-2xl">👥</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{analyticsData.overview.totalStudents}</div>
                  <div className="text-lg font-medium text-gray-700 mb-3">总学生数</div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    活跃: {analyticsData.overview.activeStudents} ({Math.round(analyticsData.overview.activeStudents / analyticsData.overview.totalStudents * 100)}%)
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{analyticsData.overview.avgCompletionRate}%</div>
                  <div className="text-lg font-medium text-gray-700 mb-3">平均完成率</div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    课程和实验综合
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/10 to-teal-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white text-2xl">⏰</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{formatTime(analyticsData.overview.avgStudyTime)}</div>
                  <div className="text-lg font-medium text-gray-700 mb-3">平均学习时长</div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    每位学生
                  </div>
                </div>
              </div>
            </div>

            {/* 最近活动趋势 - 现代化设计 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">最近活动趋势</h3>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                {analyticsData.timeAnalytics.slice(-7).map((day, index) => (
                  <div key={day.date} className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-cyan-50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {new Date(day.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors">
                            {new Date(day.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 group-hover:text-cyan-600 transition-colors mt-1">
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              {day.activeUsers} 活跃用户
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              {formatTime(day.studyTime)} 学习时长
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                              {day.completedTasks} 完成任务
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(day.activeUsers / analyticsData.overview.totalStudents) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {Math.round((day.activeUsers / analyticsData.overview.totalStudents) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analyticsData.courseAnalytics.map((course, index) => (
                <div key={course.courseId} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        index % 4 === 0 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        index % 4 === 1 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                        index % 4 === 2 ? 'bg-gradient-to-br from-teal-500 to-teal-600' :
                        'bg-gradient-to-br from-cyan-500 to-cyan-600'
                      }`}>
                        <span className="text-white text-lg">📚</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-2">{course.courseName}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {getDifficultyText(course.difficulty)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(course.avgScore)} mb-1`}>
                        {course.avgScore}
                      </div>
                      <div className="text-sm text-gray-600">平均分数</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-lg">👥</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{course.enrolledStudents}</div>
                      <div className="text-sm text-blue-700 font-medium">报名学生</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-lg">✅</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">{course.completedStudents}</div>
                      <div className="text-sm text-green-700 font-medium">完成学生</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-lg">📊</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">{course.completionRate}%</div>
                      <div className="text-sm text-purple-700 font-medium">完成率</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">课程进度</span>
                      <span className="text-sm font-medium text-gray-900">{course.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/teacher/analytics/course/${course.courseId}`)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      查看详细分析
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'experiments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analyticsData.experimentAnalytics.map((experiment) => (
                <div key={experiment.experimentId} className="card">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{experiment.experimentName}</h3>
                        <div className="text-sm text-gray-600">
                          平均完成时间: {formatTime(experiment.avgTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getSuccessRateColor(experiment.successRate)}`}>
                          {experiment.successRate}%
                        </div>
                        <div className="text-sm text-gray-600">成功率</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{experiment.attemptedStudents}</div>
                        <div className="text-sm text-gray-600">尝试学生</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{experiment.completedStudents}</div>
                        <div className="text-sm text-gray-600">完成学生</div>
                      </div>
                      <div className="text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${experiment.successRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {experiment.commonErrors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">常见错误:</h4>
                        <div className="flex flex-wrap gap-2">
                          {experiment.commonErrors.map((error, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                            >
                              {error}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/teacher/analytics/experiment/${experiment.experimentId}`)}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        查看详细分析
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'students' && (
          <div className="space-y-6">
            {/* 学生成绩分布 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">学生成绩分布</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{analyticsData.studentProgress.excellent}</div>
                    <div className="text-sm text-gray-600">优秀 (90+)</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(analyticsData.studentProgress.excellent / analyticsData.overview.totalStudents * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{analyticsData.studentProgress.good}</div>
                    <div className="text-sm text-gray-600">良好 (80-89)</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(analyticsData.studentProgress.good / analyticsData.overview.totalStudents * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{analyticsData.studentProgress.average}</div>
                    <div className="text-sm text-gray-600">一般 (70-79)</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(analyticsData.studentProgress.average / analyticsData.overview.totalStudents * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{analyticsData.studentProgress.poor}</div>
                    <div className="text-sm text-gray-600">待提高 (&lt;70)</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(analyticsData.studentProgress.poor / analyticsData.overview.totalStudents * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end p-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/teacher/analytics/students')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  查看详细进度分析
                </button>
              </div>
            </div>

            {/* 教学建议 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">教学建议</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-500">⚠️</span>
                    <div>
                      <h4 className="font-medium text-gray-900">需要关注的课程</h4>
                      <p className="text-sm text-gray-600">
                        "定时器与PWM控制" 完成率较低(50%)，建议增加实践环节和答疑时间
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-red-500">🚨</span>
                    <div>
                      <h4 className="font-medium text-gray-900">常见问题</h4>
                      <p className="text-sm text-gray-600">
                        中断配置和定时器设置是学生的主要困难点，建议制作专门的教学视频
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500">✅</span>
                    <div>
                      <h4 className="font-medium text-gray-900">表现良好</h4>
                      <p className="text-sm text-gray-600">
                        基础课程完成率较高，学生对GPIO和LED控制掌握良好
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
