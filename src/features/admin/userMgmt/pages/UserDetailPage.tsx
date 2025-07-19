/**
 * 用户详情页面
 * 
 * 显示用户的详细信息和相关统计数据
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  coursesCompleted?: number;
  experimentsCompleted?: number;
  studentsManaged?: number;
  phone?: string;
  department?: string;
  studentId?: string;
  teacherId?: string;
  bio?: string;
}

// 模拟用户详细数据
const mockUserDetail: User = {
  id: '1',
  username: '20250001',
  email: 'zhang.san@student.edu.cn',
  fullName: '张三',
  role: 'student',
  status: 'active',
  lastLogin: '2024-01-15 14:30:00',
  createdAt: '2024-01-01',
  coursesCompleted: 3,
  experimentsCompleted: 2,
  phone: '13800138000',
  department: '计算机科学与技术学院',
  studentId: '20250001',
  bio: '热爱编程，专注于嵌入式系统开发学习。'
};

// 模拟学习记录数据
const mockLearningRecords = [
  {
    id: '1',
    courseName: 'STM32基础入门',
    progress: 100,
    score: 95,
    completedAt: '2024-01-10',
    studyTime: 120
  },
  {
    id: '2',
    courseName: 'STM32中级开发',
    progress: 75,
    score: 88,
    completedAt: null,
    studyTime: 85
  },
  {
    id: '3',
    courseName: 'STM32高级应用',
    progress: 30,
    score: 0,
    completedAt: null,
    studyTime: 25
  }
];

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [learningRecords, setLearningRecords] = useState(mockLearningRecords);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'learning' | 'activity'>('info');

  // 模拟数据加载
  useEffect(() => {
    const loadUserDetail = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUserDetail);
      setLoading(false);
    };

    if (userId) {
      loadUserDetail();
    }
  }, [userId]);

  // 获取角色文本
  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return '学生';
      case 'teacher': return '教师';
      case 'admin': return '管理员';
      default: return '未知';
    }
  };

  // 获取状态文本和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active': return { text: '活跃', color: 'bg-green-100 text-green-800' };
      case 'inactive': return { text: '不活跃', color: 'bg-yellow-100 text-yellow-800' };
      case 'suspended': return { text: '暂停', color: 'bg-red-100 text-red-800' };
      default: return { text: '未知', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 格式化学习时长
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">加载用户信息中...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">用户不存在</h2>
            <p className="text-gray-600 mb-8">找不到指定的用户信息</p>
            <Link
              to="/admin/users"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              返回用户列表
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusInfo = getStatusInfo(user.status);

  return (
    <MainLayout>
      <div className="page-container">
        {/* 面包屑导航 - 响应式优化 */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm">
            <li className="flex items-center">
              <Link to="/admin/dashboard" className="flex items-center font-medium text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                <span className="hidden sm:inline">管理后台</span>
                <span className="sm:hidden">后台</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/admin/users" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">
                <span className="hidden sm:inline">用户管理</span>
                <span className="sm:hidden">用户</span>
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">详情</span>
            </li>
          </ol>
        </nav>

        {/* 用户基本信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {/* 头像 */}
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName.charAt(0)}
                </div>
                
                {/* 基本信息 */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getRoleText(user.role)}
                    </span>
                    <span className="text-sm text-gray-500">
                      最后登录: {formatDate(user.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/admin/users/${userId}/edit`)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑用户
                </button>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  返回列表
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'info', label: '基本信息', icon: '👤' },
              { key: 'learning', label: '学习记录', icon: '📚' },
              { key: 'activity', label: '活动日志', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div className="space-y-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 个人信息 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">个人信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">邮箱</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">手机号</label>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  )}
                  {user.department && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">院系</label>
                      <p className="text-gray-900">{user.department}</p>
                    </div>
                  )}
                  {user.studentId && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">学号</label>
                      <p className="text-gray-900">{user.studentId}</p>
                    </div>
                  )}
                  {user.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">个人简介</label>
                      <p className="text-gray-900">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 账户信息 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">账户信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">创建时间</label>
                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">最后登录</label>
                    <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
                  </div>
                  {user.role === 'student' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">完成课程</label>
                        <p className="text-gray-900">{user.coursesCompleted || 0} 门</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">完成实验</label>
                        <p className="text-gray-900">{user.experimentsCompleted || 0} 个</p>
                      </div>
                    </>
                  )}
                  {user.role === 'teacher' && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">管理学生</label>
                      <p className="text-gray-900">{user.studentsManaged || 0} 人</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && user.role === 'student' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">学习记录</h3>
                <div className="space-y-4">
                  {learningRecords.map(record => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{record.courseName}</h4>
                        <span className="text-sm text-gray-500">
                          学习时长: {formatStudyTime(record.studyTime)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>进度</span>
                            <span>{record.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${record.progress}%` }}
                            />
                          </div>
                        </div>
                        {record.score > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600">成绩</div>
                            <div className="text-lg font-semibold text-green-600">{record.score}</div>
                          </div>
                        )}
                      </div>
                      {record.completedAt && (
                        <p className="text-sm text-gray-500">
                          完成时间: {formatDate(record.completedAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">活动日志</h3>
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">暂无活动记录</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDetailPage;
