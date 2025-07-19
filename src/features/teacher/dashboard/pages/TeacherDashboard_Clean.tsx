import React from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

/**
 * TeacherDashboard - 教师仪表板
 * 
 * 简洁、清晰的教师主页设计
 */
const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 教学统计数据
  const stats = {
    totalStudents: 45,
    activeStudents: 38,
    coursesManaged: 8,
    avgProgress: 72
  };

  // 快捷操作
  const quickActions = [
    {
      title: '班级管理',
      description: '管理班级和学生信息',
      icon: '🏫',
      action: () => navigate('/teacher/management/classes'),
      color: 'bg-green-500'
    },
    {
      title: '学生管理',
      description: '查看和管理学生状态',
      icon: '👨‍🎓',
      action: () => navigate('/teacher/management/students'),
      color: 'bg-emerald-500'
    },
    {
      title: '数据分析',
      description: '查看教学效果分析',
      icon: '📊',
      action: () => navigate('/teacher/analytics'),
      color: 'bg-teal-500'
    }
  ];

  // 最近学生活动
  const recentActivities = [
    { 
      id: 1, 
      title: '张三完成了LED实验', 
      time: '10分钟前',
      type: 'experiment'
    },
    { 
      id: 2, 
      title: '李四提交了GPIO作业', 
      time: '30分钟前',
      type: 'assignment'
    },
    { 
      id: 3, 
      title: '王五开始学习串口通信', 
      time: '1小时前',
      type: 'course'
    }
  ];

  // 课程进度概览
  const courseProgress = [
    { name: 'STM32基础入门', progress: 85, students: 42 },
    { name: 'GPIO控制实践', progress: 72, students: 38 },
    { name: '串口通信开发', progress: 58, students: 35 },
    { name: 'PWM波形控制', progress: 45, students: 32 }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 欢迎区域 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  欢迎回来，{user?.displayName}老师！
                </h1>
                <p className="text-gray-600">
                  管理学生学习进度，分析教学效果，优化教学方案
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>教学状态：活跃</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>管理 {stats.totalStudents} 名学生</span>
                </div>
              </div>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">👥</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-500">名学生</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">学生总数</h3>
              <div className="text-sm text-gray-600">活跃: {stats.activeStudents} 人</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 text-lg">✅</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.activeStudents}</div>
                  <div className="text-sm text-gray-500">活跃中</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">活跃学生</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(stats.activeStudents / stats.totalStudents) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 text-lg">📚</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.coursesManaged}</div>
                  <div className="text-sm text-gray-500">门课程</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">管理课程</h3>
              <div className="text-sm text-gray-600">教学内容</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-600 text-lg">📊</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</div>
                  <div className="text-sm text-gray-500">平均进度</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">平均进度</h3>
              <div className="text-sm text-gray-600">教学效果良好</div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 快捷操作 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-lg">{action.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 最近活动 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">
                        {activity.type === 'course' ? '📚' : activity.type === 'experiment' ? '🧪' : '📝'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 课程进度 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程进度</h3>
              <div className="space-y-4">
                {courseProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{course.name}</h4>
                      <span className="text-sm text-gray-500">{course.students} 人</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;
