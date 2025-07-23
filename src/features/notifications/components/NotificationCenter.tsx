/**
 * 通知中心组件
 * 
 * 统一的通知管理界面，支持不同角色的通知功能
 */

import React, { useState, useEffect } from 'react';
import { Notification, NotificationFilter, NotificationStats } from '../types/Notification';
import NotificationSearchFilter from './NotificationSearchFilter';
import NotificationEditor from './NotificationEditor';

interface NotificationCenterProps {
  userRole: 'student' | 'teacher' | 'admin';
  userId: string;
  compact?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userRole,
  userId,
  compact = false
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>({
    unreadOnly: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'sent'>('all');
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);

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
            type: 'achievement',
            category: 'academic',
            title: '🎉 恭喜解锁新成就！',
            content: '您已成功解锁"实验达人"成就，获得250积分！继续保持优秀的学习表现。',
            priority: 'high',
            status: 'delivered',
            senderName: '系统',
            createdAt: '2024-01-22T16:30:00Z',
            metadata: {
              achievementId: 'ach_002',
              iconUrl: '🏆',
              relatedUrl: '/student/achievements'
            },
            actions: [
              {
                id: 'view_achievement',
                label: '查看成就',
                type: 'link',
                url: '/student/achievements',
                style: 'primary'
              }
            ]
          },
          {
            id: 'notif_002',
            type: 'reminder',
            category: 'academic',
            title: '📚 学习提醒',
            content: '您今天还没有进行学习活动，建议完成STM32课程的第4章学习。',
            priority: 'normal',
            status: 'delivered',
            senderName: '学习助手',
            createdAt: '2024-01-22T14:00:00Z',
            metadata: {
              reminderType: 'study',
              courseId: 'course_001',
              courseName: 'STM32嵌入式开发基础',
              relatedUrl: '/student/courses/course_001'
            },
            actions: [
              {
                id: 'start_learning',
                label: '开始学习',
                type: 'link',
                url: '/student/courses/course_001',
                style: 'primary'
              }
            ]
          },
          {
            id: 'notif_003',
            type: 'assignment',
            category: 'academic',
            title: '📝 作业截止提醒',
            content: '《GPIO控制实验报告》将在明天23:59截止提交，请及时完成。',
            priority: 'high',
            status: 'delivered',
            senderName: '刘教授',
            senderRole: 'teacher',
            createdAt: '2024-01-21T18:00:00Z',
            metadata: {
              assignmentId: 'assign_001',
              dueDate: '2024-01-23T23:59:00Z',
              relatedUrl: '/student/assignments/assign_001'
            },
            actions: [
              {
                id: 'view_assignment',
                label: '查看作业',
                type: 'link',
                url: '/student/assignments/assign_001',
                style: 'primary'
              }
            ]
          },
          {
            id: 'notif_004',
            type: 'announcement',
            category: 'administrative',
            title: '📢 系统维护通知',
            content: '系统将于本周六凌晨2:00-4:00进行维护升级，期间可能无法正常访问。',
            priority: 'normal',
            status: 'delivered',
            senderName: '系统管理员',
            senderRole: 'admin',
            createdAt: '2024-01-20T10:00:00Z',
            metadata: {
              maintenanceStart: '2024-01-27T02:00:00Z',
              maintenanceEnd: '2024-01-27T04:00:00Z'
            }
          }
        ];

        // 模拟统计数据
        const mockStats: NotificationStats = {
          total: mockNotifications.length,
          unread: mockNotifications.filter(n => n.status !== 'read').length,
          byType: {
            system: 1,
            achievement: 1,
            reminder: 1,
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
            academic: 3,
            administrative: 1,
            social: 0,
            technical: 0,
            personal: 0
          },
          byPriority: {
            low: 0,
            normal: 2,
            high: 2,
            urgent: 0
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
  }, [userId, filter]);

  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'unread' && notification.status === 'read') return false;
    if (selectedTab === 'sent' && notification.senderName !== '我') return false; // 教师和管理员发送的通知
    return true;
  });

  // 标记为已读
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'read' as const, readAt: new Date().toISOString() }
          : n
      )
    );
  };

  // 删除通知
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  // 批量删除通知
  const batchDeleteNotifications = (notificationIds: string[]) => {
    setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
    setSelectedNotifications(new Set());
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

  // 批量标记为已读
  const batchMarkAsRead = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(n =>
        notificationIds.includes(n.id)
          ? { ...n, status: 'read' as const }
          : n
      )
    );
  };

  // 批量操作处理
  const handleBatchAction = (action: 'delete' | 'markRead' | 'markUnread') => {
    const selectedIds = Array.from(selectedNotifications);

    if (selectedIds.length === 0) {
      alert('请先选择要操作的通知');
      return;
    }

    switch (action) {
      case 'delete':
        if (confirm(`确定要删除选中的 ${selectedIds.length} 条通知吗？`)) {
          batchDeleteNotifications(selectedIds);
        }
        break;
      case 'markRead':
        batchMarkAsRead(selectedIds);
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

  // 删除所有已读通知
  const deleteAllRead = () => {
    const readNotifications = filteredNotifications.filter(n => n.status === 'read');
    if (readNotifications.length === 0) {
      alert('没有已读通知可删除');
      return;
    }

    if (confirm(`确定要删除所有 ${readNotifications.length} 条已读通知吗？`)) {
      batchDeleteNotifications(readNotifications.map(n => n.id));
    }
  };

  // 删除所有通知（当前筛选条件下）
  const deleteAllFiltered = () => {
    if (filteredNotifications.length === 0) {
      alert('没有通知可删除');
      return;
    }

    const tabName = selectedTab === 'all' ? '全部' :
                   selectedTab === 'unread' ? '未读' : '已发送';

    if (confirm(`确定要删除当前筛选条件下的所有 ${filteredNotifications.length} 条${tabName}通知吗？此操作不可撤销！`)) {
      batchDeleteNotifications(filteredNotifications.map(n => n.id));
    }
  };

  // 编辑通知
  const editNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setShowEditor(true);
  };

  // 保存通知
  const handleSaveNotification = async (notificationData: any) => {
    try {
      // 模拟保存通知
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('保存通知:', notificationData);
      alert('通知发送成功！');

      // 刷新通知列表
      window.location.reload();
    } catch (error) {
      console.error('保存通知失败:', error);
      throw error;
    }
  };

  // 处理筛选变化
  const handleFilterChange = (newFilter: NotificationFilter) => {
    setFilter(newFilter);
    // 这里可以触发重新加载数据
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'reminder': return '⏰';
      case 'assignment': return '📝';
      case 'announcement': return '📢';
      case 'grade': return '📊';
      case 'course': return '📚';
      case 'experiment': return '🧪';
      case 'discussion': return '💬';
      case 'deadline': return '⚠️';
      case 'maintenance': return '🔧';
      case 'security': return '🔒';
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载通知中...</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* 头部 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">通知中心</h2>
          <p className="text-gray-600 mt-1">管理您的通知和消息</p>
        </div>
        
        {/* 统计信息 */}
        {stats && (
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-sm text-gray-600">
              总计 {stats.total} 条
            </div>
            <div className="text-sm font-medium text-blue-600">
              未读 {stats.unread} 条
            </div>
          </div>
        )}
      </div>

      {/* 搜索和筛选 */}
      {userRole !== 'student' && (
        <NotificationSearchFilter
          userRole={userRole}
          onFilterChange={handleFilterChange}
          initialFilter={filter}
        />
      )}

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: '全部通知', count: stats?.total || 0 },
            { key: 'unread', label: '未读消息', count: stats?.unread || 0 },
            ...(userRole !== 'student' ? [{ key: 'sent', label: '已发送', count: 0 }] : [])
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedTab(tab.key as any);
                setSelectedNotifications(new Set()); // 切换标签时清空选择
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* 批量操作工具栏 */}
      {filteredNotifications.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧：全选和选择统计 */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  全选 ({filteredNotifications.length})
                </span>
              </label>

              {selectedNotifications.size > 0 && (
                <span className="text-sm text-blue-600 font-medium">
                  已选择 {selectedNotifications.size} 项
                </span>
              )}
            </div>

            {/* 右侧：批量操作按钮 */}
            <div className="flex items-center space-x-2">
              {selectedNotifications.size > 0 && (
                <>
                  <button
                    onClick={() => handleBatchAction('markRead')}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    标记已读
                  </button>

                  <button
                    onClick={() => handleBatchAction('markUnread')}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    标记未读
                  </button>

                  <button
                    onClick={() => handleBatchAction('delete')}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    删除选中
                  </button>
                </>
              )}

              {/* 快速删除按钮 */}
              <div className="relative">
                <button
                  onClick={() => setShowBatchActions(!showBatchActions)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  更多操作
                </button>

                {/* 下拉菜单 */}
                {showBatchActions && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          deleteAllRead();
                          setShowBatchActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        删除所有已读通知
                      </button>

                      <button
                        onClick={() => {
                          deleteAllFiltered();
                          setShowBatchActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        删除当前页面所有通知
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 通知列表 */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="text-6xl">🔔</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
            <p className="text-gray-600">您的通知将在这里显示</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`border-l-4 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
                getPriorityColor(notification.priority)
              } ${notification.status === 'read' ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start justify-between">
                {/* 选择框 */}
                <div className="flex items-center pt-1 mr-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.has(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      selectedNotifications.has(notification.id)
                        ? userRole === 'admin'
                          ? 'bg-red-500 border-red-500'
                          : 'bg-blue-500 border-blue-500'
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

                <div className="flex items-start space-x-4 flex-1">
                  {/* 类型图标 */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xl">{getTypeIcon(notification.type)}</span>
                    </div>
                  </div>

                  {/* 通知内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      {notification.status !== 'read' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          新
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        notification.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.priority === 'urgent' ? '紧急' :
                         notification.priority === 'high' ? '重要' :
                         notification.priority === 'normal' ? '普通' : '一般'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{notification.content}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>👤 {notification.senderName}</span>
                      <span>📅 {formatTime(notification.createdAt)}</span>
                      <span>📂 {notification.category === 'academic' ? '学术' :
                                notification.category === 'administrative' ? '管理' :
                                notification.category === 'social' ? '社交' :
                                notification.category === 'technical' ? '技术' : '个人'}</span>
                    </div>

                    {/* 操作按钮 */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex items-center space-x-2 mt-4">
                        {notification.actions.map(action => (
                          <a
                            key={action.id}
                            href={action.url}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              action.style === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                              action.style === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                              'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            {action.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 操作菜单 */}
                <div className="flex items-center space-x-2 ml-4">
                  {notification.status !== 'read' && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="标记为已读"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}

                  {/* 编辑按钮 - 只有教师和管理员可以编辑自己发送的通知 */}
                  {userRole !== 'student' && notification.senderName === '我' && (
                    <button
                      onClick={() => editNotification(notification)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="编辑通知"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="删除通知"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 教师和管理员的发送通知按钮 */}
      {userRole !== 'student' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              setEditingNotification(null);
              setShowEditor(true);
            }}
            className={`${
              userRole === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105`}
            title="创建通知"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}

      {/* 通知编辑器对话框 */}
      {showEditor && userRole !== 'student' && (
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
    </div>
  );
};

export default NotificationCenter;
