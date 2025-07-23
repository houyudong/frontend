/**
 * 学生通知页面
 */

import React from 'react';
import MainLayout from '../../../pages/layout/MainLayout';
import NotificationCenter from '../../notifications/components/NotificationCenter';

const StudentNotificationPage: React.FC = () => {
  // 这里可以从用户上下文或其他地方获取用户ID
  const userId = 'student_001'; // 模拟用户ID

  return (
    <MainLayout>
      <NotificationCenter userRole="student" userId={userId} />
    </MainLayout>
  );
};

export default StudentNotificationPage;
