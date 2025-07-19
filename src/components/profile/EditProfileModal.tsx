import React, { useState, useEffect } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: any) => void;
  initialProfile: any;
}

/**
 * EditProfileModal - 编辑个人资料模态框
 * 
 * 通用的个人资料编辑组件，支持不同角色的字段显示
 */
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(profile);
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">编辑个人资料</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 显示名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                显示名称
              </label>
              <input
                type="text"
                value={profile.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入显示名称"
              />
            </div>

            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={profile.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入用户名"
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入邮箱地址"
              />
            </div>

            {/* 手机号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号码
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入手机号码"
              />
            </div>

            {/* 学生特有字段 */}
            {user?.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学号
                  </label>
                  <input
                    type="text"
                    value={profile.studentId || ''}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入学号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    专业
                  </label>
                  <input
                    type="text"
                    value={profile.major || ''}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入专业"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    年级
                  </label>
                  <input
                    type="text"
                    value={profile.grade || ''}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入年级"
                  />
                </div>
              </>
            )}

            {/* 教师和管理员特有字段 */}
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    工号
                  </label>
                  <input
                    type="text"
                    value={profile.employeeId || ''}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入工号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    部门
                  </label>
                  <input
                    type="text"
                    value={profile.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入部门"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职称
                  </label>
                  <input
                    type="text"
                    value={profile.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入职称"
                  />
                </div>
              </>
            )}

            {/* 教师特有字段 */}
            {user?.role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  专业领域
                </label>
                <input
                  type="text"
                  value={profile.specialization || ''}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入专业领域"
                />
              </div>
            )}

            {/* 管理员特有字段 */}
            {user?.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  权限级别
                </label>
                <select
                  value={profile.permissions || ''}
                  onChange={(e) => handleInputChange('permissions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择权限级别</option>
                  <option value="超级管理员">超级管理员</option>
                  <option value="系统管理员">系统管理员</option>
                  <option value="普通管理员">普通管理员</option>
                </select>
              </div>
            )}
          </div>

          {/* 个人简介 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              个人简介
            </label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入个人简介"
            />
          </div>
        </div>

        {/* 模态框底部 */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
