/**
 * 通知统计仪表板组件
 * 
 * 为教师和管理员提供通知发送统计和分析
 */

import React, { useState, useEffect } from 'react';
import { NotificationStats } from '../types/Notification';

interface NotificationDashboardProps {
  userRole: 'teacher' | 'admin';
  userId: string;
}

const NotificationDashboard: React.FC<NotificationDashboardProps> = ({
  userRole,
  userId
}) => {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  // 模拟加载统计数据
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟统计数据
        const mockStats: NotificationStats = {
          total: 156,
          unread: 23,
          byType: {
            system: userRole === 'admin' ? 45 : 0,
            achievement: 12,
            reminder: 28,
            assignment: 34,
            announcement: 25,
            grade: 18,
            course: 22,
            experiment: 15,
            discussion: 8,
            deadline: 19,
            maintenance: userRole === 'admin' ? 12 : 0,
            security: userRole === 'admin' ? 8 : 0
          },
          byCategory: {
            academic: 89,
            administrative: 23,
            social: 15,
            technical: userRole === 'admin' ? 29 : 12,
            personal: 8
          },
          byPriority: {
            low: 45,
            normal: 78,
            high: 28,
            urgent: 5
          },
          recentActivity: [
            { date: '2024-01-22', sent: 12, delivered: 12, read: 8, clicked: 5 },
            { date: '2024-01-21', sent: 18, delivered: 17, read: 12, clicked: 8 },
            { date: '2024-01-20', sent: 8, delivered: 8, read: 6, clicked: 3 },
            { date: '2024-01-19', sent: 15, delivered: 15, read: 11, clicked: 7 },
            { date: '2024-01-18', sent: 22, delivered: 21, read: 16, clicked: 12 },
            { date: '2024-01-17', sent: 9, delivered: 9, read: 7, clicked: 4 },
            { date: '2024-01-16', sent: 14, delivered: 14, read: 10, clicked: 6 }
          ]
        };

        setStats(mockStats);
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId, timeRange, userRole]);

  // 获取类型图标
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'system': return '🔧';
      case 'announcement': return '📢';
      case 'assignment': return '📝';
      case 'reminder': return '⏰';
      case 'grade': return '📊';
      case 'course': return '📚';
      case 'experiment': return '🧪';
      case 'maintenance': return '🛠️';
      case 'security': return '🔒';
      default: return '📋';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-6 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-100/30 to-pink-100/30 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>

      {/* 头部 - 更现代化的设计 */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">通知统计</h2>
            <p className="text-gray-600">数据分析与洞察</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="appearance-none bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
              <option value="quarter">最近三月</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 总览统计 - 更现代化的设计 */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* 总通知数卡片 */}
        <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg translate-y-8 -translate-x-8"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">总通知数</p>
              <p className="text-3xl font-bold mb-2">{stats.total}</p>
              <div className="flex items-center text-xs text-blue-200">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>全部通知</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl filter drop-shadow-sm">📋</span>
            </div>
          </div>
        </div>

        {/* 已发送卡片 */}
        <div className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg translate-y-8 -translate-x-8"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">已发送</p>
              <p className="text-3xl font-bold mb-2">
                {stats.recentActivity.reduce((sum, day) => sum + day.sent, 0)}
              </p>
              <div className="flex items-center text-xs text-green-200">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>成功发送</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl filter drop-shadow-sm">✅</span>
            </div>
          </div>
        </div>

        {/* 已阅读卡片 */}
        <div className="group relative bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg translate-y-8 -translate-x-8"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">已阅读</p>
              <p className="text-3xl font-bold mb-2">
                {stats.recentActivity.reduce((sum, day) => sum + day.read, 0)}
              </p>
              <div className="flex items-center text-xs text-orange-200">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>用户阅读</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl filter drop-shadow-sm">👁️</span>
            </div>
          </div>
        </div>

        {/* 点击率卡片 */}
        <div className="group relative bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg translate-y-8 -translate-x-8"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">点击率</p>
              <p className="text-3xl font-bold mb-2">
                {Math.round((stats.recentActivity.reduce((sum, day) => sum + day.clicked, 0) /
                  stats.recentActivity.reduce((sum, day) => sum + day.read, 0)) * 100)}%
              </p>
              <div className="flex items-center text-xs text-purple-200">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>互动率</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl filter drop-shadow-sm">👆</span>
            </div>
          </div>
        </div>
      </div>

      {/* 详细统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 按类型统计 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">按类型分布</h3>
          <div className="space-y-3">
            {Object.entries(stats.byType)
              .filter(([_, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getTypeIcon(type)}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {type === 'system' ? '系统通知' :
                       type === 'announcement' ? '公告通知' :
                       type === 'assignment' ? '作业通知' :
                       type === 'reminder' ? '提醒通知' :
                       type === 'grade' ? '成绩通知' :
                       type === 'course' ? '课程通知' :
                       type === 'experiment' ? '实验通知' :
                       type === 'maintenance' ? '维护通知' :
                       type === 'security' ? '安全通知' : type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          userRole === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按优先级统计 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">按优先级分布</h3>
          <div className="space-y-3">
            {Object.entries(stats.byPriority)
              .sort(([, a], [, b]) => b - a)
              .map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}>
                      {priority === 'urgent' ? '🔥 紧急' :
                       priority === 'high' ? '⚠️ 重要' :
                       priority === 'normal' ? '📌 普通' : '📎 一般'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          priority === 'urgent' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'normal' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDashboard;
