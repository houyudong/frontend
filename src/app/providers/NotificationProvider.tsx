/**
 * 通知上下文提供者
 * 
 * 管理全局通知状态和实时更新
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NotificationToast from '../../components/common/NotificationToast';

interface NotificationStats {
  unreadCount: number;
  hasUrgent: boolean;
  lastUpdate: string;
}

interface NotificationContextType {
  stats: NotificationStats;
  refreshStats: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  userId: string;
  userRole: 'student' | 'teacher' | 'admin';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId,
  userRole
}) => {
  const [stats, setStats] = useState<NotificationStats>({
    unreadCount: 0,
    hasUrgent: false,
    lastUpdate: new Date().toISOString()
  });

  const [currentToast, setCurrentToast] = useState<{
    id: string;
    type: string;
    title: string;
    content: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    senderName: string;
  } | null>(null);

  // 获取通知统计
  const fetchNotificationStats = async (): Promise<NotificationStats> => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟不同角色的通知数据
      const mockStats: NotificationStats = {
        unreadCount: userRole === 'student' ? 3 : userRole === 'teacher' ? 5 : 8,
        hasUrgent: userRole === 'admin' ? true : Math.random() > 0.7,
        lastUpdate: new Date().toISOString()
      };
      
      return mockStats;
    } catch (error) {
      console.error('获取通知统计失败:', error);
      return {
        unreadCount: 0,
        hasUrgent: false,
        lastUpdate: new Date().toISOString()
      };
    }
  };

  // 刷新统计数据
  const refreshStats = async () => {
    const newStats = await fetchNotificationStats();
    setStats(newStats);
  };

  // 标记单个通知为已读
  const markAsRead = (notificationId: string) => {
    setStats(prev => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
      lastUpdate: new Date().toISOString()
    }));
  };

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setStats(prev => ({
      ...prev,
      unreadCount: 0,
      hasUrgent: false,
      lastUpdate: new Date().toISOString()
    }));
  };

  // 初始化和定期更新
  useEffect(() => {
    refreshStats();
    
    // 每30秒更新一次统计数据
    const interval = setInterval(refreshStats, 30000);
    
    return () => clearInterval(interval);
  }, [userId, userRole]);

  // WebSocket连接（模拟实时通知）
  useEffect(() => {
    // 模拟WebSocket连接
    const simulateRealTimeUpdates = () => {
      const interval = setInterval(() => {
        // 随机触发新通知（10%概率）
        if (Math.random() < 0.1) {
          const newNotification = {
            id: `notif_${Date.now()}`,
            type: ['assignment', 'announcement', 'system', 'grade'][Math.floor(Math.random() * 4)],
            title: '📢 新通知',
            content: '您有一条新的通知消息',
            priority: (['low', 'normal', 'high', 'urgent'] as const)[Math.floor(Math.random() * 4)],
            senderName: userRole === 'student' ? '教师' : '系统'
          };

          setStats(prev => ({
            ...prev,
            unreadCount: prev.unreadCount + 1,
            hasUrgent: prev.hasUrgent || newNotification.priority === 'urgent',
            lastUpdate: new Date().toISOString()
          }));

          // 显示Toast提示
          setCurrentToast(newNotification);
        }
      }, 60000); // 每分钟检查一次

      return interval;
    };

    const interval = simulateRealTimeUpdates();

    return () => clearInterval(interval);
  }, [userRole]);

  const contextValue: NotificationContextType = {
    stats,
    refreshStats,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* 通知Toast提示 */}
      <NotificationToast
        notification={currentToast}
        userRole={userRole}
        onClose={() => setCurrentToast(null)}
        onMarkAsRead={(id) => {
          markAsRead(id);
          setCurrentToast(null);
        }}
      />
    </NotificationContext.Provider>
  );
};

// 自定义Hook
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
