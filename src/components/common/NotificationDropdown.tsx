/**
 * 通知下拉菜单组件
 * 
 * 显示最近的通知列表和快速操作
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../app/providers/NotificationProvider';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'unread' | 'read';
  createdAt: string;
  senderName: string;
}

interface NotificationDropdownProps {
  userRole: 'student' | 'teacher' | 'admin';
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userRole,
  userId,
  isOpen,
  onClose,
  className = ''
}) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotification();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟获取最近通知
  useEffect(() => {
    if (isOpen) {
      const fetchRecentNotifications = async () => {
        setLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 模拟不同角色的通知数据
          const mockNotifications: Notification[] = [
            {
              id: 'notif_001',
              type: 'assignment',
              title: '📝 作业提交提醒',
              content: '《STM32实验报告》将于明天23:59截止提交',
              priority: 'urgent',
              status: 'unread',
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
              senderName: userRole === 'student' ? '刘教授' : '系统'
            },
            {
              id: 'notif_002',
              type: 'announcement',
              title: '📢 期末考试安排',
              content: '期末考试将于下周开始，请做好复习准备',
              priority: 'high',
              status: 'unread',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
              senderName: userRole === 'student' ? '教务处' : '系统管理员'
            },
            {
              id: 'notif_003',
              type: 'system',
              title: userRole === 'admin' ? '🔧 系统维护通知' : '📚 课程更新',
              content: userRole === 'admin' ? '系统将于今晚进行维护升级' : '新的课程资料已上传',
              priority: 'normal',
              status: 'read',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4小时前
              senderName: userRole === 'admin' ? '技术团队' : '刘教授'
            },
            {
              id: 'notif_004',
              type: 'grade',
              title: '📊 成绩发布',
              content: '您的实验成绩已发布，请查看',
              priority: 'normal',
              status: 'read',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
              senderName: '系统'
            }
          ];
          
          setNotifications(mockNotifications);
        } catch (error) {
          console.error('获取通知失败:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecentNotifications();
    }
  }, [isOpen, userId, userRole]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 格式化时间
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'assignment': return '📝';
      case 'announcement': return '📢';
      case 'system': return '🔧';
      case 'grade': return '📊';
      case 'course': return '📚';
      default: return '📋';
    }
  };

  // 标记为已读
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'read' as const }
          : notif
      )
    );
    markAsRead(notificationId);
  };

  // 跳转到通知中心
  const goToNotificationCenter = () => {
    const routes = {
      student: '/student/notifications',
      teacher: '/teacher/notifications',
      admin: '/admin/notifications'
    };
    
    navigate(routes[userRole]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden ${className}`}
    >
      {/* 头部 */}
      <div className={`px-6 py-4 border-b border-gray-100 ${
        userRole === 'admin' ? 'bg-gradient-to-r from-red-50 to-pink-50' :
        userRole === 'teacher' ? 'bg-gradient-to-r from-blue-50 to-indigo-50' :
        'bg-gradient-to-r from-green-50 to-emerald-50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">通知中心</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <span className="text-4xl">📭</span>
            </div>
            <p className="text-gray-600">暂无通知</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.status === 'unread' ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* 类型图标 */}
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  </div>
                  
                  {/* 通知内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`text-sm font-medium truncate ${
                        notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {notification.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {notification.senderName} · {formatTime(notification.createdAt)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'urgent' ? '紧急' :
                         notification.priority === 'high' ? '重要' :
                         notification.priority === 'normal' ? '普通' : '一般'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={goToNotificationCenter}
          className={`w-full py-2 px-4 text-sm font-medium text-white rounded-xl transition-colors ${
            userRole === 'admin' ? 'bg-red-600 hover:bg-red-700' :
            userRole === 'teacher' ? 'bg-blue-600 hover:bg-blue-700' :
            'bg-green-600 hover:bg-green-700'
          }`}
        >
          查看所有通知
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
