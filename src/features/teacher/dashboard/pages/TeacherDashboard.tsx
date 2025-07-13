import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

/**
 * TeacherDashboard - 教师仪表板
 * 
 * 教师角色的主要入口页面，展示教学概览和学生管理
 * 遵循奥卡姆原则：简洁而实用的教学管理界面
 */
const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 模拟数据
  const stats = {
    totalStudents: 45,
    activeStudents: 38,
    coursesManaged: 8,
    avgProgress: 72
  };

  const recentActivities = [
    { id: 1, student: '张三', activity: '完成了LED实验', time: '10分钟前' },
    { id: 2, student: '李四', activity: '提交了GPIO作业', time: '30分钟前' },
    { id: 3, student: '王五', activity: '开始学习串口通信', time: '1小时前' }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            教师工作台
          </h1>
          <p className="text-gray-600">
            管理学生学习进度，分析教学效果，优化教学方案
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
                <p className="text-sm font-medium text-gray-600">学生总数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">活跃学生</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">管理课程</p>
                <p className="text-2xl font-bold text-gray-900">{stats.coursesManaged}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">平均进度</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 快捷操作 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">教学管理</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/teacher/management')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">👥</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">学生管理</h4>
                <p className="text-sm text-gray-600">查看和管理学生信息</p>
              </button>

              <button
                onClick={() => navigate('/teacher/analytics')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">📈</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">数据分析</h4>
                <p className="text-sm text-gray-600">学习效果统计分析</p>
              </button>

              <button
                onClick={() => alert('作业管理功能开发中...')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">📝</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">作业管理</h4>
                <p className="text-sm text-gray-600">布置和批改作业</p>
              </button>

              <button
                onClick={() => alert('课程管理功能开发中...')}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-lg">📚</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">课程管理</h4>
                <p className="text-sm text-gray-600">管理课程内容和进度</p>
              </button>
            </div>
          </div>

          {/* 学生动态 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">学生动态</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.student} {activity.activity}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
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

export default TeacherDashboard;
