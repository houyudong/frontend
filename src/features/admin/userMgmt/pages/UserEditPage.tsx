/**
 * 用户编辑页面
 * 
 * 独立的用户编辑页面，提供完整的用户信息编辑功能
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
  phone?: string;
  department?: string;
  studentId?: string;
  teacherId?: string;
  bio?: string;
}

// 模拟用户数据
const mockUser: User = {
  id: '1',
  username: '20250001',
  email: 'zhang.san@student.edu.cn',
  fullName: '张三',
  role: 'student',
  status: 'active',
  phone: '13800138000',
  department: '计算机科学与技术学院',
  studentId: '20250001',
  bio: '热爱编程，专注于嵌入式系统开发学习。'
};

const UserEditPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: '',
    username: '',
    email: '',
    fullName: '',
    role: 'student',
    status: 'active',
    phone: '',
    department: '',
    studentId: '',
    teacherId: '',
    bio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 加载用户数据
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
      setFormData(mockUser);
      setLoading(false);
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = '姓名不能为空';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = '姓名至少2个字符';
    }

    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '手机号格式不正确';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该调用实际的API
      console.log('保存用户数据:', formData);
      
      // 保存成功后跳转到详情页
      navigate(`/admin/users/${userId}`);
    } catch (error) {
      console.error('保存用户失败:', error);
      setErrors({ submit: '保存失败，请重试' });
    } finally {
      setSaving(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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

  return (
    <MainLayout>
      <div className="page-container">
        {/* 面包屑导航 */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                管理后台
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/admin/users" className="ml-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ml-2">
                  用户管理
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to={`/admin/users/${userId}`} className="ml-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ml-2">
                  用户详情
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-900 md:ml-2">编辑用户</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">编辑用户</h1>
          <p className="text-gray-600">修改用户的基本信息和权限设置</p>
        </div>

        {/* 编辑表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 基本信息 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 用户名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入用户名"
                    disabled={saving}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入真实姓名"
                    disabled={saving}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* 邮箱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入邮箱地址"
                    disabled={saving}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* 手机号 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入手机号"
                    disabled={saving}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* 院系 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    院系
                  </label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入院系"
                    disabled={saving}
                  />
                </div>

                {/* 学号/工号 */}
                {formData.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学号
                    </label>
                    <input
                      type="text"
                      value={formData.studentId || ''}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入学号"
                      disabled={saving}
                    />
                  </div>
                )}

                {formData.role === 'teacher' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      工号
                    </label>
                    <input
                      type="text"
                      value={formData.teacherId || ''}
                      onChange={(e) => handleInputChange('teacherId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入工号"
                      disabled={saving}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 权限设置 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">权限设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 角色 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    角色 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    <option value="student">学生</option>
                    <option value="teacher">教师</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">不活跃</option>
                    <option value="suspended">暂停</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 个人简介 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                个人简介
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="请输入个人简介（可选）"
                disabled={saving}
              />
            </div>

            {/* 错误提示 */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to={`/admin/users/${userId}`}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    保存中...
                  </div>
                ) : (
                  '保存修改'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserEditPage;
