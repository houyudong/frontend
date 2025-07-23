/**
 * 通知提示组件
 * 
 * 显示新通知的弹出提示
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationToastProps {
  notification: {
    id: string;
    type: string;
    title: string;
    content: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    senderName: string;
  } | null;
  userRole: 'student' | 'teacher' | 'admin';
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  userRole,
  onClose,
  onMarkAsRead
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setIsLeaving(false);
      
      // 自动关闭（根据优先级设置不同的显示时间）
      const autoCloseTime = notification.priority === 'urgent' ? 10000 : 
                           notification.priority === 'high' ? 7000 : 5000;
      
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleClick = () => {
    if (notification) {
      onMarkAsRead(notification.id);
      
      // 跳转到通知中心
      const routes = {
        student: '/student/notifications',
        teacher: '/teacher/notifications',
        admin: '/admin/notifications'
      };
      
      navigate(routes[userRole]);
      handleClose();
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'assignment': return '📝';
      case 'announcement': return '📢';
      case 'system': return '🔧';
      case 'grade': return '📊';
      case 'course': return '📚';
      case 'experiment': return '🧪';
      case 'maintenance': return '🛠️';
      case 'security': return '🔒';
      default: return '📋';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-600',
          border: 'border-red-300',
          text: 'text-white'
        };
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-amber-600',
          border: 'border-orange-300',
          text: 'text-white'
        };
      case 'normal':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          border: 'border-blue-300',
          text: 'text-white'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-300',
          text: 'text-gray-900'
        };
    }
  };

  if (!notification || !isVisible) return null;

  const styles = getPriorityStyles(notification.priority);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`max-w-sm w-full ${styles.bg} ${styles.border} border rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isLeaving 
            ? 'translate-x-full opacity-0 scale-95' 
            : 'translate-x-0 opacity-100 scale-100'
        }`}
      >
        {/* 头部 */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* 类型图标 */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                notification.priority === 'low' ? 'bg-gray-100' : 'bg-white/20'
              }`}>
                <span className="text-xl">{getTypeIcon(notification.type)}</span>
              </div>
              
              {/* 标题和发送者 */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm ${styles.text} truncate`}>
                  {notification.title}
                </h4>
                <p className={`text-xs ${
                  notification.priority === 'low' ? 'text-gray-600' : 'text-white/80'
                } mt-1`}>
                  来自 {notification.senderName}
                </p>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className={`ml-2 p-1 rounded-lg transition-colors ${
                notification.priority === 'low' 
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容 */}
          <div className="mt-3">
            <p className={`text-sm ${
              notification.priority === 'low' ? 'text-gray-700' : 'text-white/90'
            } line-clamp-2`}>
              {notification.content}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={handleClick}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-colors ${
                notification.priority === 'low'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              查看详情
            </button>
            
            <button
              onClick={() => {
                onMarkAsRead(notification.id);
                handleClose();
              }}
              className={`py-2 px-3 text-xs font-medium rounded-xl transition-colors ${
                notification.priority === 'low'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white/70 hover:bg-white/20'
              }`}
            >
              标记已读
            </button>
          </div>
        </div>

        {/* 优先级指示器 */}
        {notification.priority === 'urgent' && (
          <div className="h-1 bg-gradient-to-r from-red-400 to-pink-500 animate-pulse"></div>
        )}
        {notification.priority === 'high' && (
          <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationToast;
