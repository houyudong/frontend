import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

/**
 * StudentDashboard - 学生仪表板
 *
 * 学生角色的主要入口页面，展示学习进度和快捷操作
 * 现代化设计风格，提供优秀的用户体验
 */
const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 学习统计数据
  const stats = {
    coursesCompleted: 3,
    totalCourses: 8,
    experimentsCompleted: 12,
    totalExperiments: 20,
    studyHours: 45,
    currentStreak: 7
  };

  // 快捷操作
  const quickActions = [
    {
      title: '继续学习',
      description: '继续上次的课程学习',
      icon: '📚',
      action: () => navigate('/student/courses'),
      color: 'bg-blue-500'
    },
    {
      title: '开始实验',
      description: '进入实验编程环境',
      icon: '🧪',
      action: () => navigate('/student/experiments'),
      color: 'bg-green-500'
    },
    {
      title: '学习进度',
      description: '查看详细学习统计',
      icon: '📊',
      action: () => alert('学习进度页面开发中...'),
      color: 'bg-purple-500'
    }
  ];

  // 最近活动
  const recentActivities = [
    {
      id: 1,
      title: '完成了LED闪烁实验',
      time: '2小时前',
      type: 'experiment'
    },
    {
      id: 2,
      title: '学习了GPIO基础知识',
      time: '昨天',
      type: 'course'
    },
    {
      id: 3,
      title: '提交了定时器作业',
      time: '2天前',
      type: 'assignment'
    }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* 欢迎区域 - 现代化设计 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-2xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  欢迎回来，{user?.displayName}！
                </h1>
                <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                  继续您的STM32学习之旅，掌握嵌入式开发技能
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">学习状态：活跃</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm">连续学习 {stats.currentStreak} 天</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-6xl">🎓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 统计卡片 - 现代化设计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📚</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</div>
                  <div className="text-sm text-gray-500">/ {stats.totalCourses}</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">课程进度</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.coursesCompleted / stats.totalCourses) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🧪</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.experimentsCompleted}</div>
                  <div className="text-sm text-gray-500">/ {stats.totalExperiments}</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">实验完成</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.experimentsCompleted / stats.totalExperiments) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⏰</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.studyHours}</div>
                  <div className="text-sm text-gray-500">小时</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">学习时长</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>本周 +5.2h</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🔥</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-500">天</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">连续学习</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>保持良好习惯</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 - 现代化三列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 快捷操作 - 现代化设计 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">快捷操作</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group w-full p-4 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white text-xl">{action.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{action.title}</h4>
                      <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{action.description}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 最近活动 - 现代化设计 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">最近活动</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="group relative">
                  <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        activity.type === 'course'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : activity.type === 'experiment'
                          ? 'bg-gradient-to-br from-green-500 to-green-600'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        <span className="text-white text-lg">
                          {activity.type === 'course' ? '📚' : activity.type === 'experiment' ? '🧪' : '📝'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{activity.title}</p>
                      <p className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                        ✓ 已完成
                      </span>
                    </div>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <div className="absolute left-10 top-16 w-0.5 h-4 bg-gradient-to-b from-gray-200 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-all duration-300">
                查看全部活动
              </button>
            </div>
          </div>

          {/* 学习排行榜 - 现代化设计 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">学习排行榜</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, name: '张三', avatar: '👨', score: 95, badge: '🥇' },
                { rank: 2, name: '李四', avatar: '👩', score: 88, badge: '🥈' },
                { rank: 3, name: '王五', avatar: '👨', score: 82, badge: '🥉' },
                { rank: 4, name: user?.displayName || '你', avatar: '🎓', score: 78, badge: '' },
                { rank: 5, name: '赵六', avatar: '👩', score: 75, badge: '' }
              ].map((student, index) => (
                <div
                  key={index}
                  className={`group relative flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    student.name === (user?.displayName || '你')
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'
                      : 'border border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-yellow-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      student.rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {student.rank}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-blue-400 to-blue-600">
                      <span className="text-white text-lg">{student.avatar}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold truncate text-gray-900">{student.name}</p>
                      {student.badge && <span className="text-lg">{student.badge}</span>}
                      {student.name === (user?.displayName || '你') && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">你</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">学习积分</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xl font-bold text-gray-900">{student.score}</div>
                    <div className="text-xs text-gray-500">分</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-yellow-600 hover:text-yellow-800 font-medium py-2 hover:bg-yellow-50 rounded-lg transition-all duration-300">
                查看完整排行榜
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
