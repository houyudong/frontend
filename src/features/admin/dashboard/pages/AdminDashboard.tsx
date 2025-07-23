import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

/**
 * AdminDashboard - 管理员仪表板
 *
 * 管理员角色的主要入口页面，展示系统概览和管理功能
 * 现代化设计风格，提供强大的系统管理界面
 */
const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 系统统计数据
  const stats = {
    totalUsers: 156,
    totalStudents: 120,
    totalTeachers: 15,
    totalAdmins: 3,
    systemHealth: 98,
    activeUsers: 89,
    todayLogins: 45,
    systemUptime: 99.8
  };

  // 快捷操作
  const quickActions = [
    {
      title: '用户管理',
      description: '管理系统用户权限',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/admin/users')
    },
    {
      title: '数据分析',
      description: '学习行为分析与实时监控',
      icon: '📈',
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/admin/analytics')
    },
    {
      title: '系统设置',
      description: '配置系统参数',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600',
      action: () => navigate('/admin/settings')
    },
    {
      title: '数据报告',
      description: '查看系统报告',
      icon: '📊',
      color: 'from-green-500 to-green-600',
      action: () => navigate('/admin/reports')
    },
    {
      title: '通知管理',
      description: '发送系统通知和公告',
      icon: '📢',
      color: 'from-orange-500 to-red-600',
      action: () => {
        try {
          navigate('/admin/notifications');
        } catch (error) {
          console.warn('Navigation warning ignored:', error);
          window.location.href = '/admin/notifications';
        }
      }
    },
    {
      title: '数据导出',
      description: '导出系统数据和分析',
      icon: '📤',
      color: 'from-indigo-500 to-purple-600',
      action: () => {
        try {
          navigate('/admin/export');
        } catch (error) {
          console.warn('Navigation warning ignored:', error);
          window.location.href = '/admin/export';
        }
      }
    }
  ];

  // 系统状态监控
  const systemStatus = [
    { name: '数据库', status: 'healthy', uptime: '99.9%', responseTime: '12ms' },
    { name: 'API服务', status: 'healthy', uptime: '99.8%', responseTime: '45ms' },
    { name: '文件存储', status: 'healthy', uptime: '99.7%', responseTime: '23ms' },
    { name: '缓存服务', status: 'warning', uptime: '98.5%', responseTime: '67ms' }
  ];

  // 最近活动
  const recentActivities = [
    { id: 1, title: '新用户注册', time: '5分钟前', type: 'user', icon: '👤' },
    { id: 2, title: '系统备份完成', time: '1小时前', type: 'system', icon: '💾' },
    { id: 3, title: '课程内容更新', time: '2小时前', type: 'content', icon: '📚' },
    { id: 4, title: '系统更新部署', time: '3小时前', type: 'system', icon: '🔄' },
    { id: 5, title: '用户反馈处理完成', time: '4小时前', type: 'support', icon: '💬' }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* 欢迎区域 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 rounded-2xl mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full translate-y-32 -translate-x-32"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 text-sm font-medium rounded-full">系统管理员</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  欢迎回来，{user?.displayName}！
                </h1>
                <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                  全面掌控平台运营，监控系统状态，管理用户权限，确保平台安全稳定运行
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-white font-medium">系统状态</div>
                      <div className="text-green-300 text-sm">运行正常</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">健康度</div>
                      <div className="text-blue-300 text-sm">{stats.systemHealth}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">用户总数</div>
                      <div className="text-purple-300 text-sm">{stats.totalUsers} 人</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <span className="text-7xl">🛡️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* 用户总数卡片 */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-500">总用户</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">平台用户</h3>
              <div className="flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>今日活跃 {stats.activeUsers} 人</span>
              </div>
            </div>
          </div>

          {/* 学生数量卡片 */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🎓</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-500">名学生</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">学生用户</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.totalStudents / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 教师数量卡片 */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">👨‍🏫</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</div>
                  <div className="text-sm text-gray-500">名教师</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">教学团队</h3>
              <div className="flex items-center text-sm text-purple-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>专业师资</span>
              </div>
            </div>
          </div>

          {/* 系统健康度卡片 */}
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</div>
                  <div className="text-sm text-gray-500">健康度</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">系统状态</h3>
              <div className="flex items-center text-sm text-orange-600">
                <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>运行稳定</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 - 三列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 快捷管理操作 */}
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
                  className="group w-full p-4 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
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

          {/* 系统状态 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">系统状态</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {systemStatus.map((service, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                        service.status === 'healthy' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        service.status === 'warning' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-br from-red-500 to-red-600'
                      }`}>
                        <div className={`w-3 h-3 rounded-full bg-white ${
                          service.status === 'healthy' ? 'animate-pulse' : ''
                        }`}></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{service.name}</h4>
                        <span className="text-xs text-gray-500">{service.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-sm ${
                          service.status === 'healthy' ? 'text-green-600' :
                          service.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {service.status === 'healthy' ? '运行正常' : service.status === 'warning' ? '性能警告' : '服务异常'}
                        </span>
                        <span className="text-xs text-gray-500">运行时间 {service.uptime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-green-600 hover:text-green-800 font-medium py-2 hover:bg-green-50 rounded-lg transition-all duration-300">
                查看详细监控
              </button>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">最近活动</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="group relative">
                  <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                        activity.type === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        activity.type === 'system' ? 'bg-gradient-to-br from-gray-500 to-gray-600' :
                        activity.type === 'content' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        <span className="text-white text-sm">{activity.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{activity.title}</p>
                      <p className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">{activity.time}</p>
                    </div>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <div className="absolute left-8 top-12 w-0.5 h-4 bg-gradient-to-b from-gray-200 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-purple-600 hover:text-purple-800 font-medium py-2 hover:bg-purple-50 rounded-lg transition-all duration-300">
                查看全部活动
              </button>
            </div>
          </div>
        </div>

        {/* 数据分析概览 */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">数据分析概览</h2>
              <p className="text-gray-600 mt-1">实时监控系统运行状态和用户学习行为</p>
            </div>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>查看详细分析</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 在线用户数 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold mb-2">{stats.activeUsers}</div>
              <div className="text-blue-100 text-sm">当前在线用户</div>
            </div>

            {/* 挂科风险学生 */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">预警</div>
              </div>
              <div className="text-3xl font-bold mb-2">8</div>
              <div className="text-red-100 text-sm">高风险学生</div>
            </div>

            {/* 热门课程 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">TOP1</div>
              </div>
              <div className="text-lg font-bold mb-2">STM32嵌入式开发</div>
              <div className="text-green-100 text-sm">45人在线学习</div>
            </div>

            {/* 作业提交率 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">今日</div>
              </div>
              <div className="text-3xl font-bold mb-2">78.5%</div>
              <div className="text-purple-100 text-sm">作业提交率</div>
            </div>
          </div>

          {/* 实时数据图表预览 */}
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">实时活动监控</h3>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>实时更新</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 在线用户趋势 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">在线用户趋势 (最近10分钟)</h4>
                <div className="flex items-end space-x-2 h-24">
                  {Array.from({ length: 10 }, (_, i) => {
                    const height = Math.random() * 80 + 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{i + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 课程访问热度 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">课程访问热度</h4>
                <div className="space-y-3">
                  {[
                    { name: 'STM32嵌入式开发', value: 85, color: 'bg-blue-500' },
                    { name: 'ARM架构编程', value: 72, color: 'bg-green-500' },
                    { name: '数字电路设计', value: 58, color: 'bg-purple-500' },
                    { name: 'C语言程序设计', value: 45, color: 'bg-orange-500' }
                  ].map((course, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-20 text-xs text-gray-600 truncate">{course.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${course.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${course.value}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-xs text-gray-500 text-right">{course.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
