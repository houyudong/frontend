import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { LineChart, BarChart, PieChart, DonutChart, RadarChart } from '../../../../components/charts/ChartComponents';

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
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // 图表数据
  const chartData = {
    studentProgress: [
      { label: '1月', value: 78 },
      { label: '2月', value: 82 },
      { label: '3月', value: 85 },
      { label: '4月', value: 88 },
      { label: '5月', value: 92 }
    ],
    courseCompletion: [
      { label: 'STM32基础', value: 35, color: '#3B82F6' },
      { label: 'ARM架构', value: 28, color: '#10B981' },
      { label: 'C语言', value: 22, color: '#F59E0B' },
      { label: '嵌入式系统', value: 18, color: '#EF4444' },
      { label: '其他', value: 12, color: '#8B5CF6' }
    ],
    experimentSuccess: [
      { label: '优秀', value: 15, color: '#10B981' },
      { label: '良好', value: 20, color: '#3B82F6' },
      { label: '一般', value: 8, color: '#F59E0B' },
      { label: '需改进', value: 2, color: '#EF4444' }
    ],
    teachingMetrics: [
      { label: '教学质量', value: 92 },
      { label: '学生满意度', value: 88 },
      { label: '课程完成率', value: 85 },
      { label: '互动参与度', value: 90 },
      { label: '创新程度', value: 86 }
    ],
    weeklyActivity: [
      { label: '周一', value: 25 },
      { label: '周二', value: 32 },
      { label: '周三', value: 28 },
      { label: '周四', value: 35 },
      { label: '周五', value: 30 },
      { label: '周六', value: 15 },
      { label: '周日', value: 18 }
    ]
  };

  // 模拟数据加载
  useEffect(() => {
    const loadAnalytics = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

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
        {/* 页面标题 - 美化版 */}
        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/30 to-cyan-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    教学数据分析
                  </h1>
                  <p className="text-gray-700 text-lg">
                    查看学习数据统计和分析报表，优化教学效果
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
                        ? 'bg-green-500 text-white shadow-md'
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-teal-50/50"></div>

            <nav className="relative flex space-x-2 p-2">
              {[
                { key: 'overview', label: '数据概览', icon: '📈', desc: '核心指标、趋势分析', gradient: 'from-green-500 to-emerald-600' },
                { key: 'courses', label: '课程分析', icon: '📚', desc: '课程完成率、学习进度', gradient: 'from-blue-500 to-cyan-600' },
                { key: 'experiments', label: '实验分析', icon: '🧪', desc: '实验成功率、难度分析', gradient: 'from-purple-500 to-violet-600' },
                { key: 'students', label: '学生分析', icon: '👥', desc: '学生表现、学习行为', gradient: 'from-orange-500 to-red-600' }
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
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:w-8 transition-all duration-300 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 内容区域 */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* 核心指标卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: '总学生数',
                  value: analyticsData?.overview.totalStudents || 0,
                  change: '+5',
                  trend: 'up',
                  icon: '👥',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'from-green-50 to-green-100'
                },
                {
                  title: '课程数量',
                  value: analyticsData?.overview.totalCourses || 0,
                  change: '+2',
                  trend: 'up',
                  icon: '📚',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'from-blue-50 to-blue-100'
                },
                {
                  title: '平均完成率',
                  value: `${analyticsData?.overview.avgCompletionRate || 0}%`,
                  change: '+3.2%',
                  trend: 'up',
                  icon: '✅',
                  color: 'from-emerald-500 to-emerald-600',
                  bgColor: 'from-emerald-50 to-emerald-100'
                },
                {
                  title: '活跃学生',
                  value: analyticsData?.overview.activeStudents || 0,
                  change: '+8',
                  trend: 'up',
                  icon: '🔥',
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
              {/* 学生进度趋势 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <LineChart
                  data={chartData.studentProgress}
                  title="学生进度趋势"
                  color="#10B981"
                  height={250}
                />
              </div>

              {/* 每周活跃度 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <BarChart
                  data={chartData.weeklyActivity.map(item => ({
                    ...item,
                    color: '#3B82F6'
                  }))}
                  title="每周活跃度"
                  height={250}
                />
              </div>

              {/* 课程完成分布 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <PieChart
                  data={chartData.courseCompletion}
                  title="课程完成分布"
                  size={300}
                />
              </div>

              {/* 教学指标雷达图 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <RadarChart
                  data={chartData.teachingMetrics}
                  title="教学综合指标"
                  size={300}
                  maxValue={100}
                />
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'courses' && (
          <div className="space-y-8">
            {/* 课程分析图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 课程完成率分布 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <DonutChart
                  data={chartData.courseCompletion}
                  title="课程完成率分布"
                  size={300}
                  centerText={`${analyticsData?.overview.totalCourses || 0}`}
                />
              </div>

              {/* 学生进度趋势 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <LineChart
                  data={chartData.studentProgress}
                  title="学生进度趋势"
                  color="#3B82F6"
                  height={250}
                />
              </div>
            </div>

            {/* 课程详细列表 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程详细分析</h3>
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
                        <div className="font-medium text-gray-900">{course.value}人</div>
                        <div className="text-sm text-gray-600">已完成</div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(course.value / Math.max(...chartData.courseCompletion.map(c => c.value))) * 100}%`,
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
            {/* 实验分析图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 实验成功率分布 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <PieChart
                  data={chartData.experimentSuccess}
                  title="实验成功率分布"
                  size={300}
                />
              </div>

              {/* 每周实验活跃度 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <BarChart
                  data={chartData.weeklyActivity.map(item => ({
                    ...item,
                    color: '#8B5CF6'
                  }))}
                  title="每周实验活跃度"
                  height={250}
                />
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'students' && (
          <div className="space-y-8">
            {/* 学生分析图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 教学指标雷达图 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <RadarChart
                  data={chartData.teachingMetrics}
                  title="学生表现指标"
                  size={300}
                  maxValue={100}
                />
              </div>

              {/* 学生活跃度趋势 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <LineChart
                  data={chartData.studentProgress}
                  title="学生活跃度趋势"
                  color="#EF4444"
                  height={250}
                />
              </div>
            </div>

            {/* 学生表现排行 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">学生表现排行</h3>
              <div className="space-y-3">
                {[
                  { name: '张三', score: 95, progress: 98, courses: 5 },
                  { name: '李四', score: 92, progress: 95, courses: 4 },
                  { name: '王五', score: 88, progress: 90, courses: 5 },
                  { name: '赵六', score: 85, progress: 88, courses: 3 },
                  { name: '钱七', score: 82, progress: 85, courses: 4 }
                ].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{student.score}</div>
                        <div className="text-gray-600">分数</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{student.progress}%</div>
                        <div className="text-gray-600">进度</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{student.courses}</div>
                        <div className="text-gray-600">课程</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
