import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

/**
 * StudentDashboard - 学生仪表板
 * 
 * 学生角色的主要入口页面，展示学习概览和快捷操作
 * 遵循奥卡姆原则：简洁而实用的仪表板设计
 */
const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 模拟数据
  const stats = {
    coursesCompleted: 3,
    totalCourses: 12,
    experimentsCompleted: 2,
    totalExperiments: 13,
    studyHours: 24,
    currentStreak: 7
  };

  const recentActivities = [
    { id: 1, type: 'course', title: 'STM32基础入门', time: '2小时前', status: 'completed' },
    { id: 2, type: 'experiment', title: 'LED闪烁实验', time: '1天前', status: 'in-progress' },
    { id: 3, type: 'course', title: 'GPIO编程', time: '2天前', status: 'completed' }
  ];

  const quickActions = [
    {
      title: '继续学习',
      description: '继续上次的课程学习',
      icon: '📚',
      action: () => navigate('/student/courses'),
      color: 'bg-blue-500'
    },
    {
      title: '开始实验',
      description: '进入实验编程环境',
      icon: '🧪',
      action: () => navigate('/student/experiments'),
      color: 'bg-green-500'
    },
    {
      title: '学习进度',
      description: '查看详细学习统计',
      icon: '📊',
      action: () => alert('学习进度页面开发中...'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <MainLayout>
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            欢迎回来，{user?.displayName}！
          </h1>
          <p className="text-gray-600">
            继续你的STM32学习之旅，掌握嵌入式AI开发技能
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">课程进度</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.coursesCompleted}/{stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">🧪</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">实验完成</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.experimentsCompleted}/{stats.totalExperiments}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">⏰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">学习时长</p>
                <p className="text-2xl font-bold text-gray-900">{stats.studyHours}h</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">🔥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">连续学习</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}天</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 快捷操作 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-white text-lg">{action.icon}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 最近活动 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">
                        {activity.type === 'course' ? '📚' : '🧪'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status === 'completed' ? '已完成' : '进行中'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default StudentDashboard;
