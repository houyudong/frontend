import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

/**
 * TeacherDashboard - 教师仪表板
 *
 * 简洁、清晰的教师主页设计
 */
const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 教学统计数据
  const stats = {
    totalStudents: 45,
    activeStudents: 38,
    coursesManaged: 8,
    avgProgress: 72
  };

  // 快捷操作
  const quickActions = [
    {
      title: '班级管理',
      description: '管理班级和学生信息',
      icon: '🏫',
      action: () => navigate('/teacher/management/classes'),
      color: 'bg-green-500'
    },
    {
      title: '学生管理',
      description: '查看和管理学生状态',
      icon: '👨‍🎓',
      action: () => navigate('/teacher/management/students'),
      color: 'bg-emerald-500'
    },
    {
      title: '数据分析',
      description: '查看教学效果分析',
      icon: '📊',
      action: () => navigate('/teacher/analytics'),
      color: 'bg-teal-500'
    }
  ];

  // 最近学生活动
  const recentActivities = [
    {
      id: 1,
      student: '张三',
      action: '完成实验：LED闪烁',
      time: '2分钟前',
      type: 'experiment',
      status: 'success'
    },
    {
      id: 2,
      student: '李四',
      action: '提交作业：GPIO控制',
      time: '15分钟前',
      type: 'assignment',
      status: 'pending'
    },
    {
      id: 3,
      student: '王五',
      action: '开始学习：串口通信',
      time: '1小时前',
      type: 'course',
      status: 'in-progress'
    },
    {
      id: 4,
      student: '赵六',
      action: '完成测试：定时器应用',
      time: '2小时前',
      type: 'test',
      status: 'success'
    }
  ];

  // 获取活动图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'experiment': return '🧪';
      case 'assignment': return '📝';
      case 'course': return '📚';
      case 'test': return '📊';
      default: return '📄';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return '已完成';
      case 'pending': return '待审核';
      case 'in-progress': return '进行中';
      case 'error': return '出错';
      default: return '未知';
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
          {/* 欢迎区域 */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mb-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">👨‍🏫</span>
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">教师工作台</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">
                    欢迎回来，{user?.fullName || '老师'}！
                  </h1>
                  <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                    管理您的班级，跟踪学生进度，分析教学效果
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-white/90">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">系统运行正常</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="text-sm">{stats.totalStudents} 名学生</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStudents}</div>
                <div className="text-sm font-medium text-gray-600">管理学生</div>
                <div className="text-xs text-green-600 mt-1">活跃: {stats.activeStudents}</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.coursesManaged}</div>
                <div className="text-sm font-medium text-gray-600">管理课程</div>
                <div className="text-xs text-blue-600 mt-1">进度良好</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.avgProgress}%</div>
                <div className="text-sm font-medium text-gray-600">平均进度</div>
                <div className="text-xs text-purple-600 mt-1">持续提升</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
                <div className="text-sm font-medium text-gray-600">今日活动</div>
                <div className="text-xs text-orange-600 mt-1">比昨日+12%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 快捷操作 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">快捷操作</h3>
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{action.icon}</div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 最近活动 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">最近学生活动</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    查看全部
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{activity.student}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                            {getStatusText(activity.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;
