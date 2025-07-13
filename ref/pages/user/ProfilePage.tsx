import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiEdit2, FiSave, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { MainLayout, PageHeader, ContentContainer } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/apiService';

interface UserProfileData {
  id: string | number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  school?: string;
  major?: string;
  class?: string;
  avatar?: string;
  role?: string;
  [key: string]: any; // 允许存在其他未显式定义的字段
}

interface FormData {
  fullName: string;
  email: string;
  bio: string;
  school: string;
  major: string;
  class: string;
}

interface UploadResult {
  success: boolean;
  message?: string;
  avatarUrl?: string;
}

/**
 * ProfilePage - 用户资料页面
 *
 * 显示和编辑用户个人资料
 *
 * @component
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    bio: '',
    school: '',
    major: '',
    class: '',
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 加载用户资料
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      setError('');

      try {
        const profileData: UserProfileData = await userAPI.getUserProfile(user.id);
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          school: profileData.school || '',
          major: profileData.major || '',
          class: profileData.class || '',
        });
      } catch (err: any) {
        setError('获取用户资料失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!user) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updateUserProfile(user.id, formData);
      setProfile((prev) => ({
        ...prev!,
        ...formData,
      }));
      setSuccess('资料更新成功');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || '更新资料时发生错误');
    } finally {
      setIsSaving(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('请上传JPG、PNG或GIF格式的图片');
      return;
    }

    // 验证文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      setError('图片大小不能超过2MB');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const result: UploadResult = await userAPI.uploadAvatar(user.id, file, (progress: number) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        setProfile((prev) => ({
          ...prev!,
          avatar: result.avatarUrl,
        }));
        setSuccess('头像上传成功');
      } else {
        setError(result.message || '上传头像失败');
      }
    } catch (err: any) {
      setError(err.message || '上传头像时发生错误');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 获取角色文本
  const getRoleText = (role: string | undefined): string => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'teacher':
        return '教师';
      case 'student':
        return '学生';
      default:
        return '用户';
    }
  };

  return (
    <MainLayout>
      <PageHeader title="个人资料" description="查看和编辑您的个人信息" actions={null} />

      <ContentContainer>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin h-8 w-8 text-primary-500" />
          </div>
        ) : error && !profile ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* 成功消息 */}
            {success && (
              <div className="bg-green-50 p-4 rounded-md text-green-700 flex items-center">
                <FiSave className="mr-2 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* 错误消息 */}
            {error && (
              <div className="bg-red-50 p-4 rounded-md text-red-700 flex items-center">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="md:flex md:items-start">
              {/* 头像部分 */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={profile.avatar || '/images/avatars/default.png'}
                      alt={profile.fullName || profile.username}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 上传进度 */}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="text-white text-sm font-medium">{uploadProgress}%</div>
                    </div>
                  )}

                  {/* 上传按钮 */}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
                  >
                    <FiEdit2 className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.fullName || profile.username}
                  </h3>
                  <p className="text-sm text-gray-500">{getRoleText(profile.role)}</p>
                </div>
              </div>

              {/* 资料表单 */}
              <div className="md:w-2/3 mt-6 md:mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? '编辑资料' : '基本信息'}
                  </h3>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FiEdit2 className="-ml-1 mr-2 h-4 w-4" />
                      编辑
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 邮箱 */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        邮箱
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="您的邮箱地址"
                          required
                        />
                      </div>
                    </div>

                    {/* 姓名 */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        姓名
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="您的姓名"
                      />
                    </div>

                    {/* 简介 */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        个人简介
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="简单介绍一下自己"
                      ></textarea>
                    </div>

                    {/* 学校 */}
                    <div>
                      <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                        学校
                      </label>
                      <input
                        type="text"
                        name="school"
                        id="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="您就读的学校"
                      />
                    </div>

                    {/* 专业 */}
                    <div>
                      <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                        专业
                      </label>
                      <input
                        type="text"
                        name="major"
                        id="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="您的专业"
                      />
                    </div>

                    {/* 班级 */}
                    <div>
                      <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                        班级
                      </label>
                      <input
                        type="text"
                        name="class"
                        id="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="您的班级"
                      />
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // 重置表单数据为当前资料数据
                          if (profile) {
                            setFormData({
                              fullName: profile.fullName || '',
                              email: profile.email || '',
                              bio: profile.bio || '',
                              school: profile.school || '',
                              major: profile.major || '',
                              class: profile.class || '',
                            });
                          }
                          setError('');
                          setSuccess('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <span className="flex items-center">
                            <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            保存中...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FiSave className="-ml-1 mr-2 h-4 w-4" />
                            保存
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <FiMail className="h-5 w-5 text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.fullName && (
                      <div className="flex items-center space-x-2">
                        <FiUser className="h-5 w-5 text-gray-500" />
                        <span>{profile.fullName}</span>
                      </div>
                    )}
                    {profile.bio && <p className="text-sm italic">{profile.bio}</p>}
                    {profile.school && (
                      <p className="text-sm">
                        学校: <span className="font-medium">{profile.school}</span>
                      </p>
                    )}
                    {profile.major && (
                      <p className="text-sm">
                        专业: <span className="font-medium">{profile.major}</span>
                      </p>
                    )}
                    {profile.class && (
                      <p className="text-sm">
                        班级: <span className="font-medium">{profile.class}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </ContentContainer>
    </MainLayout>
  );
};

export default ProfilePage; 