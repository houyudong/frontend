/**
 * 教师通知页面
 * 
 * 教师可以接收和发送通知，管理班级通知
 */

import React from 'react';
import MainLayout from '../../../pages/layout/MainLayout';
import EnhancedNotificationCenter from '../../notifications/components/EnhancedNotificationCenter';

const TeacherNotificationPage: React.FC = () => {
  // 这里可以从用户上下文或其他地方获取用户ID
  const userId = 'teacher_001'; // 模拟用户ID

  return (
    <MainLayout>
      <EnhancedNotificationCenter userRole="teacher" userId={userId} />
    </MainLayout>
  );
};

export default TeacherNotificationPage;
