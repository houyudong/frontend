/**
 * 管理员通知页面
 * 
 * 管理员可以发送系统通知，管理全平台通知
 */

import React from 'react';
import MainLayout from '../../../pages/layout/MainLayout';
import EnhancedNotificationCenter from '../../notifications/components/EnhancedNotificationCenter';

const AdminNotificationPage: React.FC = () => {
  // 这里可以从用户上下文或其他地方获取用户ID
  const userId = 'admin_001'; // 模拟用户ID

  return (
    <MainLayout>
      <EnhancedNotificationCenter userRole="admin" userId={userId} />
    </MainLayout>
  );
};

export default AdminNotificationPage;
