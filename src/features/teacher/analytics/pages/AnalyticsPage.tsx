import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

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
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">数据分析</h1>
          <p className="text-gray-600">查看学习数据统计和分析报表，优化教学效果</p>
        </div>

        {/* 标签导航 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: '总览', icon: '📊' },
                { id: 'courses', name: '课程分析', icon: '📚' },
                { id: 'experiments', name: '实验分析', icon: '🧪' },
                { id: 'students', name: '学生进度', icon: '👥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 内容区域 */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* 总览统计 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600">{analyticsData.overview.totalStudents}</div>
                <div className="text-sm text-gray-600 mt-1">总学生数</div>
                <div className="text-xs text-green-600 mt-1">
                  活跃: {analyticsData.overview.activeStudents} ({Math.round(analyticsData.overview.activeStudents / analyticsData.overview.totalStudents * 100)}%)
                </div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600">{analyticsData.overview.avgCompletionRate}%</div>
                <div className="text-sm text-gray-600 mt-1">平均完成率</div>
                <div className="text-xs text-gray-500 mt-1">课程和实验综合</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(analyticsData.overview.avgStudyTime)}</div>
                <div className="text-sm text-gray-600 mt-1">平均学习时长</div>
                <div className="text-xs text-gray-500 mt-1">每位学生</div>
              </div>
            </div>

            {/* 最近活动趋势 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">最近活动趋势</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analyticsData.timeAnalytics.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900 w-20">
                          {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>👥 {day.activeUsers} 活跃用户</span>
                          <span>⏱️ {formatTime(day.studyTime)} 学习时长</span>
                          <span>✅ {day.completedTasks} 完成任务</span>
                        </div>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(day.activeUsers / analyticsData.overview.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analyticsData.courseAnalytics.map((course) => (
                <div key={course.courseId} className="card">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{course.courseName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}>
                          {getDifficultyText(course.difficulty)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(course.avgScore)}`}>
                          {course.avgScore}分
                        </div>
                        <div className="text-sm text-gray-600">平均分数</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{course.enrolledStudents}</div>
                        <div className="text-sm text-gray-600">报名学生</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{course.completedStudents}</div>
                        <div className="text-sm text-gray-600">完成学生</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{course.completionRate}%</div>
                        <div className="text-sm text-gray-600">完成率</div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
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
