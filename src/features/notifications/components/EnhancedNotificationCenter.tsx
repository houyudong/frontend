/**
 * 增强版通知中心组件
 * 
 * 为教师和管理员提供美观的通知管理界面
 */

import React, { useState, useEffect } from 'react';
import { Notification, NotificationFilter, NotificationStats } from '../types/Notification';
import NotificationSearchFilter from './NotificationSearchFilter';
import NotificationEditor from './NotificationEditor';
import QuickNotificationFab from './QuickNotificationFab';
import NotificationDashboard from './NotificationDashboard';
import BatchDeleteConfirmDialog from '../../../components/common/BatchDeleteConfirmDialog';

interface EnhancedNotificationCenterProps {
  userRole: 'teacher' | 'admin';
  userId: string;
}

const EnhancedNotificationCenter: React.FC<EnhancedNotificationCenterProps> = ({
  userRole,
  userId
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>({
    unreadOnly: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'sent' | 'drafts'>('all');
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'selected' | 'read' | 'all';
    count: number;
  }>({ isOpen: false, type: 'selected', count: 0 });

  // 模拟数据加载
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟通知数据
        const mockNotifications: Notification[] = [
          {
            id: 'notif_001',
            type: 'announcement',
            category: 'academic',
            title: '📢 期末考试安排通知',
            content: '各位同学，期末考试将于下周开始，请做好复习准备。考试时间和地点详见附件。',
            priority: 'high',
            status: 'sent',
            senderName: userRole === 'admin' ? '系统管理员' : '刘教授',
            createdAt: '2024-01-22T16:30:00Z',
            metadata: {
              courseId: 'course_001',
              relatedUrl: '/teacher/courses/course_001'
            }
          },
          {
            id: 'notif_002',
            type: 'assignment',
            category: 'academic',
            title: '📝 作业提交提醒',
            content: '《STM32实验报告》截止时间为明天23:59，请尚未提交的同学抓紧时间。',
            priority: 'urgent',
            status: 'sent',
            senderName: userRole === 'admin' ? '系统管理员' : '刘教授',
            createdAt: '2024-01-22T14:00:00Z',
            metadata: {
              assignmentId: 'assign_001'
            }
          },
          {
            id: 'notif_003',
            type: 'system',
            category: 'technical',
            title: '🔧 系统维护通知',
            content: '系统将于本周六凌晨2:00-4:00进行维护升级，期间可能无法正常访问。',
            priority: 'normal',
            status: 'draft',
            senderName: userRole === 'admin' ? '系统管理员' : '刘教授',
            createdAt: '2024-01-21T18:00:00Z'
          }
        ];

        // 模拟统计数据
        const mockStats: NotificationStats = {
          total: mockNotifications.length,
          unread: 0,
          byType: {
            system: 1,
            achievement: 0,
            reminder: 0,
            assignment: 1,
            announcement: 1,
            grade: 0,
            course: 0,
            experiment: 0,
            discussion: 0,
            deadline: 0,
            maintenance: 0,
            security: 0
          },
          byCategory: {
            academic: 2,
            administrative: 0,
            social: 0,
            technical: 1,
            personal: 0
          },
          byPriority: {
            low: 0,
            normal: 1,
            high: 1,
            urgent: 1
          },
          recentActivity: [
            { date: '2024-01-22', sent: 5, delivered: 5, read: 3, clicked: 2 },
            { date: '2024-01-21', sent: 8, delivered: 8, read: 6, clicked: 4 },
            { date: '2024-01-20', sent: 3, delivered: 3, read: 3, clicked: 1 }
          ]
        };

        setNotifications(mockNotifications);
        setStats(mockStats);
      } catch (error) {
        console.error('加载通知失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userId, filter, userRole]);

  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'unread' && notification.status === 'read') return false;
    if (selectedTab === 'sent' && notification.status !== 'sent') return false;
    if (selectedTab === 'drafts' && notification.status !== 'draft') return false;
    return true;
  });

  // 处理筛选变化
  const handleFilterChange = (newFilter: NotificationFilter) => {
    setFilter(newFilter);
  };

  // 编辑通知
  const editNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setShowEditor(true);
  };

  // 保存通知
  const handleSaveNotification = async (notificationData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('保存通知:', notificationData);
      alert('通知发送成功！');
      window.location.reload();
    } catch (error) {
      console.error('保存通知失败:', error);
      throw error;
    }
  };

  // 删除通知
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // 批量操作
  const handleBatchAction = (action: 'delete' | 'send' | 'markRead' | 'markUnread') => {
    if (selectedNotifications.size === 0) {
      alert('请先选择要操作的通知');
      return;
    }

    const selectedIds = Array.from(selectedNotifications);

    switch (action) {
      case 'delete':
        setDeleteDialog({
          isOpen: true,
          type: 'selected',
          count: selectedIds.length
        });
        break;
      case 'send':
        alert(`批量发送 ${selectedNotifications.size} 条通知`);
        setSelectedNotifications(new Set());
        break;
      case 'markRead':
        setNotifications(prev =>
          prev.map(n =>
            selectedIds.includes(n.id)
              ? { ...n, status: 'read' as const }
              : n
          )
        );
        setSelectedNotifications(new Set());
        break;
      case 'markUnread':
        setNotifications(prev =>
          prev.map(n =>
            selectedIds.includes(n.id)
              ? { ...n, status: 'unread' as const }
              : n
          )
        );
        setSelectedNotifications(new Set());
        break;
    }
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  // 选择/取消选择单个通知
  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // 删除所有已读通知
  const deleteAllRead = () => {
    const readNotifications = filteredNotifications.filter(n => n.status === 'read');
    if (readNotifications.length === 0) {
      alert('没有已读通知可删除');
      return;
    }

    setDeleteDialog({
      isOpen: true,
      type: 'read',
      count: readNotifications.length
    });
  };

  // 删除所有通知（当前筛选条件下）
  const deleteAllFiltered = () => {
    if (filteredNotifications.length === 0) {
      alert('没有通知可删除');
      return;
    }

    setDeleteDialog({
      isOpen: true,
      type: 'all',
      count: filteredNotifications.length
    });
  };

  // 执行删除操作
  const executeDelete = () => {
    switch (deleteDialog.type) {
      case 'selected':
        setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
        setSelectedNotifications(new Set());
        break;
      case 'read':
        setNotifications(prev => prev.filter(n => n.status !== 'read' || !filteredNotifications.includes(n)));
        break;
      case 'all':
        const filteredIds = filteredNotifications.map(n => n.id);
        setNotifications(prev => prev.filter(n => !filteredIds.includes(n.id)));
        setSelectedNotifications(new Set());
        break;
    }
  };

  // 获取优先级样式
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'announcement': return '📢';
      case 'assignment': return '📝';
      case 'system': return '🔧';
      case 'maintenance': return '🛠️';
      case 'security': return '🔒';
      case 'reminder': return '⏰';
      case 'grade': return '📊';
      case 'course': return '📚';
      case 'experiment': return '🧪';
      default: return '📋';
    }
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载通知中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 头部横幅 - 更现代化的设计 */}
      <div className={`relative overflow-hidden ${
        userRole === 'admin'
          ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-600'
          : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600'
      } text-white`}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* 角色头像 */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                userRole === 'admin'
                  ? 'bg-gradient-to-br from-rose-400 to-red-500'
                  : 'bg-gradient-to-br from-blue-400 to-indigo-500'
              }`}>
                <span className="text-2xl">
                  {userRole === 'admin' ? '👨‍💼' : '👨‍🏫'}
                </span>
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {userRole === 'admin' ? '系统通知管理' : '通知中心'}
                </h1>
                <p className="text-blue-100 opacity-90 text-lg">
                  {userRole === 'admin'
                    ? '管理全平台通知，确保信息准确传达'
                    : '管理课程通知，与学生保持有效沟通'}
                </p>
              </div>
            </div>

            {/* 快速统计卡片 */}
            {stats && (
              <div className="hidden lg:flex space-x-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[80px] border border-white border-opacity-20">
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90">总通知</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[80px] border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-yellow-200">{stats.byStatus?.draft || 0}</div>
                  <div className="text-sm opacity-90">草稿</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[80px] border border-white border-opacity-20">
                  <div className="text-3xl font-bold text-green-200">{stats.byStatus?.sent || 0}</div>
                  <div className="text-sm opacity-90">已发送</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 操作栏 - 更现代化的设计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* 新建通知按钮 - 更现代化的设计 */}
            <button
              onClick={() => {
                setEditingNotification(null);
                setShowEditor(true);
              }}
              className={`group inline-flex items-center px-8 py-4 text-sm font-semibold text-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                userRole === 'admin'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 hover:from-rose-600 hover:via-pink-700 hover:to-red-700'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700'
              } relative overflow-hidden`}
            >
              {/* 按钮内部光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className={`w-6 h-6 mr-3 rounded-lg flex items-center justify-center ${
                userRole === 'admin' ? 'bg-white/20' : 'bg-white/20'
              } relative z-10`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="relative z-10">创建新通知</span>

              {/* 按钮右侧装饰 */}
              <div className="ml-2 opacity-70 group-hover:opacity-100 transition-opacity relative z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>

            {/* 批量操作 - 更现代化的设计 */}
            {selectedNotifications.size > 0 && (
              <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userRole === 'admin' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="text-sm font-bold">{selectedNotifications.size}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">项已选择</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBatchAction('markRead')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    标记已读
                  </button>

                  <button
                    onClick={() => handleBatchAction('markUnread')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-xl hover:bg-orange-200 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    标记未读
                  </button>

                  {userRole !== 'student' && (
                    <button
                      onClick={() => handleBatchAction('send')}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-xl hover:bg-emerald-200 transition-all duration-200 hover:scale-105 shadow-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      批量发送
                    </button>
                  )}

                  <button
                    onClick={() => handleBatchAction('delete')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    批量删除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 统计仪表板 */}
        <NotificationDashboard
          userRole={userRole}
          userId={userId}
        />

        {/* 搜索筛选 */}
        <NotificationSearchFilter
          userRole={userRole}
          onFilterChange={handleFilterChange}
          initialFilter={filter}
        />

        {/* 标签页导航 - 更现代化的设计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-6 overflow-hidden">
          <div className="relative">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>

            <nav className="relative flex space-x-2 p-2">
              {[
                { key: 'all', label: '全部通知', count: stats?.total || 0, icon: '📋', gradient: 'from-slate-500 to-gray-600' },
                { key: 'sent', label: '已发送', count: notifications.filter(n => n.status === 'sent').length, icon: '✅', gradient: 'from-emerald-500 to-green-600' },
                { key: 'drafts', label: '草稿箱', count: notifications.filter(n => n.status === 'draft').length, icon: '📝', gradient: 'from-amber-500 to-orange-600' },
                { key: 'unread', label: '未读回复', count: stats?.unread || 0, icon: '💬', gradient: 'from-purple-500 to-indigo-600' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setSelectedTab(tab.key as any);
                    setSelectedNotifications(new Set()); // 切换标签时清空选择
                  }}
                  className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    selectedTab === tab.key
                      ? `bg-gradient-to-r ${userRole === 'admin' ? 'from-rose-500 to-red-600' : 'from-blue-500 to-indigo-600'} text-white shadow-lg`
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
                  <span className="relative z-10">{tab.label}</span>

                  {/* 计数徽章 */}
                  <div className={`relative z-10 inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold rounded-full transition-all duration-300 ${
                    selectedTab === tab.key
                      ? 'bg-white/20 text-white'
                      : `bg-gradient-to-r ${tab.gradient} text-white shadow-sm`
                  }`}>
                    {tab.count}
                  </div>

                  {/* 悬停时的底部指示器 */}
                  {selectedTab !== tab.key && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-8 transition-all duration-300 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* 批量操作工具栏 */}
          {filteredNotifications.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm border-t border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                {/* 左侧：全选和选择统计 */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                        onChange={toggleSelectAll}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0
                          ? userRole === 'admin'
                            ? 'bg-rose-500 border-rose-500'
                            : 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0 && (
                          <svg className="w-3 h-3 text-white m-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      全选 ({filteredNotifications.length})
                    </span>
                  </label>

                  {selectedNotifications.size > 0 && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      userRole === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      已选择 {selectedNotifications.size} 项
                    </div>
                  )}
                </div>

                {/* 右侧：快速删除操作 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={deleteAllRead}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-xl hover:bg-orange-200 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    删除已读
                  </button>

                  <button
                    onClick={deleteAllFiltered}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    删除全部
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 通知列表 */}
          <div className="p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-20 relative">
                {/* 背景装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 rounded-2xl"></div>
                <div className="absolute top-10 left-1/4 w-16 h-16 bg-blue-200/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-1/4 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  {/* 空状态图标 */}
                  <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-6xl filter drop-shadow-sm">
                        {selectedTab === 'drafts' ? '📝' :
                         selectedTab === 'sent' ? '✅' :
                         selectedTab === 'unread' ? '💬' : '📭'}
                      </span>
                    </div>
                  </div>

                  {/* 标题和描述 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedTab === 'drafts' ? '暂无草稿' :
                     selectedTab === 'sent' ? '暂无已发送通知' :
                     selectedTab === 'unread' ? '暂无未读回复' : '暂无通知'}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                    {selectedTab === 'drafts' ? '您还没有保存的草稿，创建一个新通知开始吧' :
                     selectedTab === 'sent' ? '您还没有发送过通知，创建第一个通知吧' :
                     selectedTab === 'unread' ? '目前没有未读的回复消息' :
                     '没有找到符合条件的通知，试试创建一个新的通知'}
                  </p>

                  {/* 创建按钮 */}
                  <button
                    onClick={() => {
                      setEditingNotification(null);
                      setShowEditor(true);
                    }}
                    className={`group inline-flex items-center px-8 py-4 text-sm font-semibold text-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      userRole === 'admin'
                        ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 hover:from-rose-600 hover:via-pink-700 hover:to-red-700'
                        : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700'
                    } relative overflow-hidden`}
                  >
                    {/* 按钮内部光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="w-6 h-6 mr-3 rounded-lg bg-white/20 flex items-center justify-center relative z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="relative z-10">创建第一个通知</span>

                    <div className="ml-2 opacity-70 group-hover:opacity-100 transition-opacity relative z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  >
                    {/* 背景装饰 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/20 to-pink-100/20 rounded-full blur-2xl translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

                    {/* 左侧彩色边框指示器 */}
                    <div className={`absolute left-0 top-0 w-1 h-full rounded-r-full ${
                      notification.priority === 'urgent' ? 'bg-gradient-to-b from-red-500 to-pink-600' :
                      notification.priority === 'high' ? 'bg-gradient-to-b from-orange-500 to-amber-600' :
                      notification.priority === 'normal' ? 'bg-gradient-to-b from-blue-500 to-indigo-600' :
                      'bg-gradient-to-b from-gray-400 to-slate-500'
                    }`}></div>

                    <div className="relative flex items-start space-x-5">
                      {/* 选择框 - 更现代化的设计 */}
                      <div className="flex items-center pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.has(notification.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedNotifications);
                              if (e.target.checked) {
                                newSelected.add(notification.id);
                              } else {
                                newSelected.delete(notification.id);
                              }
                              setSelectedNotifications(newSelected);
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                            selectedNotifications.has(notification.id)
                              ? userRole === 'admin'
                                ? 'bg-gradient-to-br from-rose-500 to-red-600 border-red-500'
                                : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            {selectedNotifications.has(notification.id) && (
                              <svg className="w-3 h-3 text-white m-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* 类型图标 - 更现代化的设计 */}
                      <div className="flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                          notification.type === 'system' ? 'bg-gradient-to-br from-slate-400 to-gray-600' :
                          notification.type === 'announcement' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' :
                          notification.type === 'assignment' ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                          notification.type === 'maintenance' ? 'bg-gradient-to-br from-orange-400 to-amber-600' :
                          notification.type === 'security' ? 'bg-gradient-to-br from-red-400 to-rose-600' :
                          'bg-gradient-to-br from-purple-400 to-indigo-600'
                        }`}>
                          <span className="text-2xl filter drop-shadow-sm">{getTypeIcon(notification.type)}</span>
                        </div>
                      </div>

                      {/* 通知内容 - 更现代化的设计 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-gray-900 text-xl leading-tight pr-4">{notification.title}</h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {/* 优先级标签 - 更现代化的设计 */}
                            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm border-0 ${
                              notification.priority === 'urgent' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
                              notification.priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white' :
                              notification.priority === 'normal' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                              'bg-gradient-to-r from-gray-400 to-slate-500 text-white'
                            }`}>
                              {notification.priority === 'urgent' ? '🔥 紧急' :
                               notification.priority === 'high' ? '⚠️ 重要' :
                               notification.priority === 'normal' ? '📌 普通' : '📎 一般'}
                            </span>

                            {/* 状态标签 - 更现代化的设计 */}
                            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm border-0 ${
                              notification.status === 'sent' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' :
                              notification.status === 'draft' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' :
                              notification.status === 'scheduled' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
                              'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                            }`}>
                              {notification.status === 'sent' ? '✅ 已发送' :
                               notification.status === 'draft' ? '📝 草稿' :
                               notification.status === 'scheduled' ? '⏰ 已安排' : '❌ 失败'}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-5 line-clamp-2 text-base leading-relaxed">{notification.content}</p>

                        {/* 元信息 - 更现代化的设计 */}
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-700">{notification.senderName}</span>
                          </div>

                          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-700">{formatTime(notification.createdAt)}</span>
                          </div>

                          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-700">
                              {notification.category === 'academic' ? '学术' :
                               notification.category === 'administrative' ? '管理' :
                               notification.category === 'technical' ? '技术' : '其他'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 - 更现代化的设计 */}
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => editNotification(notification)}
                          className={`group/btn relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg ${
                            userRole === 'admin'
                              ? 'bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white'
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                          }`}
                          title="编辑通知"
                        >
                          {/* 按钮内部光效 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="group/btn relative p-3 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg"
                          title="删除通知"
                        >
                          {/* 按钮内部光效 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        {/* 更多操作按钮 */}
                        <button
                          className="group/btn relative p-3 bg-gradient-to-br from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg"
                          title="更多操作"
                        >
                          {/* 按钮内部光效 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 通知编辑器对话框 */}
        {showEditor && (
          <NotificationEditor
            userRole={userRole}
            userId={userId}
            editingNotification={editingNotification || undefined}
            onClose={() => {
              setShowEditor(false);
              setEditingNotification(null);
            }}
            onSave={handleSaveNotification}
          />
        )}

        {/* 快速发送通知浮动按钮 */}
        <QuickNotificationFab
          userRole={userRole}
          userId={userId}
          onNotificationSent={() => {
            // 刷新通知列表
            window.location.reload();
          }}
        />

        {/* 批量删除确认对话框 */}
        <BatchDeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, type: 'selected', count: 0 })}
          onConfirm={executeDelete}
          title={
            deleteDialog.type === 'selected' ? '批量删除通知' :
            deleteDialog.type === 'read' ? '删除已读通知' : '删除全部通知'
          }
          message={
            deleteDialog.type === 'selected' ? '您确定要删除选中的通知吗？' :
            deleteDialog.type === 'read' ? '您确定要删除所有已读通知吗？' :
            `您确定要删除当前筛选条件下的所有通知吗？`
          }
          itemCount={deleteDialog.count}
          itemType="通知"
          isDangerous={deleteDialog.type === 'all'}
        />
      </div>
    </div>
  );
};

export default EnhancedNotificationCenter;
