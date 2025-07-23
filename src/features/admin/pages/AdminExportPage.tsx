/**
 * 管理员导出页面
 * 
 * 管理员可以导出系统报告、用户统计、平台分析等数据
 */

import React from 'react';
import ExportPage from '../../export/pages/ExportPage';

const AdminExportPage: React.FC = () => {
  // 这里可以从用户上下文或其他地方获取用户ID
  const userId = 'admin_001'; // 模拟用户ID
  
  return <ExportPage userRole="admin" userId={userId} />;
};

export default AdminExportPage;
