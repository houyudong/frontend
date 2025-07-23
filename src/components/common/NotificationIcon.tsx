/**
 * 通知图标组件
 * 
 * 显示通知图标和未读数量，支持不同用户角色
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../app/providers/NotificationProvider';

interface NotificationIconProps {
  userRole: 'student' | 'teacher' | 'admin';
  userId: string;
  className?: string;
}

interface NotificationStats {
  unreadCount: number;
  hasUrgent: boolean;
  lastUpdate: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  userRole,
  userId,
  className = ''
}) => {
  const navigate = useNavigate();
  const { stats } = useNotification();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  // 监听未读数量变化，触发动画
  useEffect(() => {
    if (stats.unreadCount > prevUnreadCount && prevUnreadCount > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
    setPrevUnreadCount(stats.unreadCount);
  }, [stats.unreadCount, prevUnreadCount]);

  // 处理点击事件
  const handleClick = () => {
    const routes = {
      student: '/student/notifications',
      teacher: '/teacher/notifications',
      admin: '/admin/notifications'
    };
    
    navigate(routes[userRole]);
  };

  // 获取角色对应的颜色主题
  const getThemeColors = () => {
    switch (userRole) {
      case 'admin':
        return {
          bg: 'bg-red-500',
          hover: 'hover:bg-red-600',
          ring: 'ring-red-500',
          urgent: 'bg-red-600'
        };
      case 'teacher':
        return {
          bg: 'bg-blue-500',
          hover: 'hover:bg-blue-600',
          ring: 'ring-blue-500',
          urgent: 'bg-orange-600'
        };
      default:
        return {
          bg: 'bg-green-500',
          hover: 'hover:bg-green-600',
          ring: 'ring-green-500',
          urgent: 'bg-red-600'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.ring} rounded-lg transition-all duration-200 hover:bg-gray-100 ${className}`}
      title={`通知中心 ${stats.unreadCount > 0 ? `(${stats.unreadCount}条未读)` : ''}`}
    >
      {/* 通知图标 */}
      <div className="relative">
        <svg 
          className={`w-6 h-6 transition-all duration-300 ${
            isAnimating ? 'animate-bounce' : ''
          } ${
            stats.hasUrgent ? 'text-red-500' : 'text-gray-600'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>

        {/* 未读数量徽章 */}
        {stats.unreadCount > 0 && (
          <div className={`absolute -top-2 -right-2 min-w-[20px] h-5 ${
            stats.hasUrgent ? colors.urgent : colors.bg
          } text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ${
            isAnimating ? 'animate-pulse' : ''
          }`}>
            {stats.unreadCount > 99 ? '99+' : stats.unreadCount}
          </div>
        )}

        {/* 紧急通知指示器 */}
        {stats.hasUrgent && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        )}
      </div>

      {/* 悬停提示 */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {stats.unreadCount > 0 
          ? `${stats.unreadCount}条未读通知${stats.hasUrgent ? ' (有紧急)' : ''}`
          : '通知中心'
        }
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};

export default NotificationIcon;
