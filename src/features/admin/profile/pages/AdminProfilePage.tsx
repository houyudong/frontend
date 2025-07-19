import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/AuthProvider';
import MainLayout from '../../../../pages/layout/MainLayout';
import EditProfileModal from '../../../../components/profile/EditProfileModal';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  systemUptime: number;
  activeUsers: number;
}

/**
 * AdminProfilePage - 管理员用户中心页面
 * 
 * 管理员专用用户中心，包含：
 * - 个人信息展示
 * - 系统统计数据
 * - 系统管理功能
 * - 账户管理功能
 */
const AdminProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 模拟管理员统计数据
  const [stats] = useState<AdminStats>({
    totalUsers: 1248,
    totalCourses: 56,
    systemUptime: 99.8,
    activeUsers: 342
  });

  // 个人信息编辑状态
  const [profile, setProfile] = useState({
    displayName: user?.displayName || user?.username || '系统管理员',
    username: user?.username || 'admin',
    email: user?.email || 'admin@example.com',
    joinDate: '2023-01-01',
    phone: '138****9999',
    employeeId: 'A2023001',
    department: '信息技术中心',
    title: '系统管理员',
    permissions: '超级管理员'
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedProfile: any) => {
    // TODO: 调用API保存个人信息
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 用户信息头部 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* 用户头像 */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {profile.displayName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                {/* 用户基本信息 */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.displayName}</h1>
                  <p className="text-gray-600 mb-1">@{profile.username}</p>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                      管理员
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                      {profile.permissions}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {profile.department}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 编辑按钮 */}
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>编辑资料</span>
              </button>
            </div>
          </div>

          {/* 系统统计数据卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* 用户总数 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUsers}</div>
              <div className="text-gray-600 text-sm">用户总数</div>
            </div>
            
            {/* 课程总数 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalCourses}</div>
              <div className="text-gray-600 text-sm">课程总数</div>
            </div>
            
            {/* 系统运行时间 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.systemUptime}%</div>
              <div className="text-gray-600 text-sm">系统可用性</div>
            </div>
            
            {/* 活跃用户 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.activeUsers}</div>
              <div className="text-gray-600 text-sm">活跃用户</div>
            </div>
          </div>

          {/* 系统管理功能 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">系统管理</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 用户管理 */}
              <button
                onClick={() => navigate('/admin/users')}
                className="flex flex-col items-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">用户管理</span>
                <span className="text-xs text-gray-500 mt-1">管理系统用户和权限</span>
              </button>

              {/* 课程管理 */}
              <button
                onClick={() => navigate('/admin/courses')}
                className="flex flex-col items-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">课程管理</span>
                <span className="text-xs text-gray-500 mt-1">管理系统课程和内容</span>
              </button>

              {/* 系统监控 */}
              <button
                onClick={() => navigate('/admin/monitoring')}
                className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">系统监控</span>
                <span className="text-xs text-gray-500 mt-1">监控系统运行状态</span>
              </button>

              {/* 日志管理 */}
              <button
                onClick={() => navigate('/admin/logs')}
                className="flex flex-col items-center p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">日志管理</span>
                <span className="text-xs text-gray-500 mt-1">查看系统操作日志</span>
              </button>
            </div>
          </div>

          {/* 数据分析功能 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">数据分析</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 用户行为分析 */}
              <button
                onClick={() => navigate('/admin/analytics/users')}
                className="flex flex-col items-center p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">用户行为分析</span>
                <span className="text-xs text-gray-500 mt-1">分析用户使用行为</span>
              </button>

              {/* 系统性能分析 */}
              <button
                onClick={() => navigate('/admin/analytics/performance')}
                className="flex flex-col items-center p-6 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">系统性能分析</span>
                <span className="text-xs text-gray-500 mt-1">监控系统性能指标</span>
              </button>

              {/* 业务数据分析 */}
              <button
                onClick={() => navigate('/admin/analytics/business')}
                className="flex flex-col items-center p-6 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">业务数据分析</span>
                <span className="text-xs text-gray-500 mt-1">分析业务运营数据</span>
              </button>
            </div>
          </div>

          {/* 账户管理 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">账户管理</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 个人资料 */}
              <button
                onClick={() => navigate('/user-center')}
                className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">个人资料</div>
                    <div className="text-sm text-gray-500">查看和编辑个人信息</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* 系统设置 */}
              <button
                onClick={() => navigate('/admin/settings')}
                className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">系统设置</div>
                    <div className="text-sm text-gray-500">配置系统参数和全局设置</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 安全设置 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">安全设置</h3>
              <button
                onClick={() => navigate('/user-center?tab=password')}
                className="flex items-center justify-between w-full p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">修改密码</div>
                    <div className="text-sm text-gray-500">定期更新密码以保护账户安全</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 编辑个人资料模态框 */}
        <EditProfileModal
          isOpen={isEditing}
          onClose={handleCancelEdit}
          onSave={handleSaveProfile}
          initialProfile={profile}
        />
      </div>
    </MainLayout>
  );
};

export default AdminProfilePage;
