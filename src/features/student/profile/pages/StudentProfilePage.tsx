import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/AuthProvider';
import MainLayout from '../../../../pages/layout/MainLayout';
import EditProfileModal from '../../../../components/profile/EditProfileModal';

interface StudentStats {
  completedExperiments: number;
  ongoingExperiments: number;
  studyHours: number;
  achievements: number;
}

/**
 * StudentProfilePage - 学生用户中心页面
 * 
 * 参考设计图实现的学生专用用户中心，包含：
 * - 个人信息展示
 * - 学习统计数据
 * - 快捷功能入口
 * - 账户管理功能
 */
const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 模拟学生统计数据
  const [stats] = useState<StudentStats>({
    completedExperiments: 12,
    ongoingExperiments: 28,
    studyHours: 156,
    achievements: 8
  });

  // 个人信息编辑状态
  const [profile, setProfile] = useState({
    displayName: user?.displayName || user?.username || '张同学',
    username: user?.username || 'zhangxuesheng',
    email: user?.email || 'zhang@example.com',
    joinDate: '2024-01-15',
    phone: '138****5678',
    studentId: 'S2024001',
    major: '电子信息工程',
    grade: '2024级'
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
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      学生
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      加入于 {profile.joinDate}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 编辑按钮 */}
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>编辑资料</span>
              </button>
            </div>
          </div>

          {/* 统计数据卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* 完成课程 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.completedExperiments}</div>
              <div className="text-gray-600 text-sm">完成课程</div>
            </div>
            
            {/* 完成实验 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.ongoingExperiments}</div>
              <div className="text-gray-600 text-sm">完成实验</div>
            </div>
            
            {/* 学习时长 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.studyHours}</div>
              <div className="text-gray-600 text-sm">学习时长(小时)</div>
            </div>
            
            {/* 获得成就 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.achievements}</div>
              <div className="text-gray-600 text-sm">获得成就</div>
            </div>
          </div>

          {/* 快捷功能 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">快捷功能</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 学习进度 */}
              <button
                onClick={() => navigate('/student/progress')}
                className="flex flex-col items-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">学习进度</span>
                <span className="text-xs text-gray-500 mt-1">查看学习进度和成绩</span>
              </button>

              {/* 成就徽章 */}
              <button
                onClick={() => navigate('/student/achievements')}
                className="flex flex-col items-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">成就徽章</span>
                <span className="text-xs text-gray-500 mt-1">查看获得的学习成就</span>
              </button>

              {/* 我的收藏 */}
              <button
                onClick={() => navigate('/student/favorites')}
                className="flex flex-col items-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">我的收藏</span>
                <span className="text-xs text-gray-500 mt-1">管理收藏的课程和资料</span>
              </button>

              {/* 学习历史 */}
              <button
                onClick={() => navigate('/student/history')}
                className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">学习历史</span>
                <span className="text-xs text-gray-500 mt-1">查看详细学习记录</span>
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
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                onClick={() => navigate('/student/settings')}
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
                    <div className="text-sm text-gray-500">自定义界面主题、语言等偏好设置</div>
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

export default StudentProfilePage;
