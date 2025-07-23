/**
 * 学生导出页面
 */

import React from 'react';
import ExportPage from '../../export/pages/ExportPage';

const StudentExportPage: React.FC = () => {
  // 这里可以从用户上下文或其他地方获取用户ID
  const userId = 'student_001'; // 模拟用户ID
  
  return <ExportPage userRole="student" userId={userId} />;
};

export default StudentExportPage;
