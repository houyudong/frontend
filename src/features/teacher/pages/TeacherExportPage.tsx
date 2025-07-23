/**
 * 教师导出页面
 * 
 * 教师可以导出班级报告、学生分析、课程统计等数据
 */

import React from 'react';
import ExportPage from '../../export/pages/ExportPage';

const TeacherExportPage: React.FC = () => {
  // 这里可以从用户上下文或其他地方获取用户ID
  const userId = 'teacher_001'; // 模拟用户ID
  
  return <ExportPage userRole="teacher" userId={userId} />;
};

export default TeacherExportPage;
