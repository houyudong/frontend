import React, { useState } from 'react';
import { FiLock, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { MainLayout, PageHeader, ContentContainer } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ChangePasswordPage - 修改密码页面
 * 
 * 允许用户修改自己的密码
 * 
 * @component
 */
const ChangePasswordPage: React.FC = () => {
  const { updatePassword, loading } = useAuth();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // 表单验证
    if (!oldPassword) {
      setError('请输入当前密码');
      return;
    }
    
    if (!newPassword) {
      setError('请输入新密码');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('新密码长度不能少于6个字符');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      await updatePassword(oldPassword, newPassword);
      setSuccess('密码修改成功');
      // 清空表单
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '修改密码过程中发生错误');
    }
  };
  
  return (
    <MainLayout>
      <PageHeader
        title="修改密码"
        description="更新您的账户密码"
        actions={null}
      />
      
      <ContentContainer className="max-w-md mx-auto">
        {/* 成功消息 */}
        {success && (
          <div className="mb-6 bg-green-50 p-4 rounded-md text-green-700 flex items-center">
            <FiCheck className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        
        {/* 错误消息 */}
        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-md text-red-700 flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 当前密码 */}
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              当前密码
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                autoComplete="current-password"
                required
                value={oldPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入当前密码"
              />
            </div>
          </div>
          
          {/* 新密码 */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              新密码
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="请输入新密码"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              密码长度至少为6个字符
            </p>
          </div>
          
          {/* 确认新密码 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              确认新密码
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="请再次输入新密码"
              />
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  提交中...
                </span>
              ) : (
                '修改密码'
              )}
            </button>
          </div>
        </form>
        
        {/* 密码安全提示 */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700">密码安全提示</h3>
          <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
            <li>使用至少6个字符的密码</li>
            <li>不要使用与其他网站相同的密码</li>
            <li>使用字母、数字和特殊字符的组合</li>
            <li>不要使用容易猜到的信息，如生日、姓名等</li>
            <li>定期更换密码以提高安全性</li>
          </ul>
        </div>
      </ContentContainer>
    </MainLayout>
  );
};

export default ChangePasswordPage; 