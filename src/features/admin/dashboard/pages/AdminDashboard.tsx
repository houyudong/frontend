import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

/**
 * AdminDashboard - 管理员仪表板
 * 
 * 管理员角色的主要入口页面，展示系统概览和管理功能
 * 遵循奥卡姆原则：简洁而强大的系统管理界面
 */
const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 模拟数据
  const stats = {
    totalUsers: 156,
    totalStudents: 120,
    totalTeachers: 15,
    systemHealth: 98
  };

  const systemStatus = [
    { name: '数据库', status: 'healthy', uptime: '99.9%' },
    { name: 'API服务', status: 'healthy', uptime: '99.8%' },
    { name: 'WebIDE', status: 'warning', uptime: '98.5%' },
    { name: '文件存储', status: 'healthy', uptime: '99.9%' }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            系统管理中心
          </h1>
          <p className="text-gray-600">
            管理用户、监控系统、配置平台，确保平台稳定运行
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总用户数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">学生数量</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">教师数量</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">系统健康度</p>
                <p className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 管理功能 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">系统管理</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">👥</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">用户管理</h4>
                <p className="text-sm text-gray-600">管理学生和教师账户</p>
              </button>

              <button className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">📚</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">课程管理</h4>
                <p className="text-sm text-gray-600">管理课程内容和实验</p>
              </button>

              <button
                onClick={() => navigate('/admin/settings')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">⚙️</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">系统配置</h4>
                <p className="text-sm text-gray-600">系统参数和功能配置</p>
              </button>

              <button
                onClick={() => navigate('/admin/reports')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">数据报表</h4>
                <p className="text-sm text-gray-600">生成和导出统计报表</p>
              </button>
            </div>
          </div>

          {/* 系统状态 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">系统状态</h3>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-500' : 
                      service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">运行时间: {service.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
