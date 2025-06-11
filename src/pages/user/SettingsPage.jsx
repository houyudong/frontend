import React, { useState, useEffect } from 'react';
import { FiSave, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { MainLayout, PageHeader, ContentContainer } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../../services/userService';

/**
 * SettingsPage - 用户设置页面
 * 
 * 用户个性化设置和偏好管理
 * 
 * @component
 */
const SettingsPage = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('appearance');
  
  // 加载用户偏好设置
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const preferencesData = await getUserPreferences(user.id);
        setPreferences(preferencesData);
      } catch (err) {
        setError('获取用户偏好设置失败');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user]);
  
  // 处理偏好设置更新
  const handlePreferenceChange = (category, key, value) => {
    if (!preferences) return;
    
    if (category) {
      setPreferences({
        ...preferences,
        [category]: {
          ...preferences[category],
          [key]: value
        }
      });
    } else {
      setPreferences({
        ...preferences,
        [key]: value
      });
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !preferences) return;
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await updateUserPreferences(user.id, preferences);
      
      if (result.success) {
        setSuccess('设置已保存');
      } else {
        setError(result.message || '保存设置失败');
      }
    } catch (err) {
      setError(err.message || '保存设置时发生错误');
    } finally {
      setIsSaving(false);
    }
  };
  
  // 渲染外观设置
  const renderAppearanceSettings = () => {
    if (!preferences) return null;
    
    return (
      <div className="space-y-6">
        {/* 主题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            界面主题
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handlePreferenceChange(null, 'theme', 'light')}
              className={`p-4 border rounded-md flex flex-col items-center ${
                preferences.theme === 'light'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-full h-24 bg-white border border-gray-200 rounded-md mb-2"></div>
              <div className="flex items-center">
                <span className="text-sm font-medium">浅色主题</span>
                {preferences.theme === 'light' && (
                  <FiCheck className="ml-2 text-primary-500" />
                )}
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handlePreferenceChange(null, 'theme', 'dark')}
              className={`p-4 border rounded-md flex flex-col items-center ${
                preferences.theme === 'dark'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md mb-2"></div>
              <div className="flex items-center">
                <span className="text-sm font-medium">深色主题</span>
                {preferences.theme === 'dark' && (
                  <FiCheck className="ml-2 text-primary-500" />
                )}
              </div>
            </button>
          </div>
        </div>
        
        {/* 代码编辑器主题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            代码编辑器主题
          </label>
          <select
            value={preferences.codeEditorTheme}
            onChange={(e) => handlePreferenceChange(null, 'codeEditorTheme', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="vs">Visual Studio</option>
            <option value="vs-dark">Visual Studio Dark</option>
            <option value="hc-black">High Contrast Black</option>
          </select>
        </div>
        
        {/* 字体大小 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字体大小
          </label>
          <select
            value={preferences.fontSize}
            onChange={(e) => handlePreferenceChange(null, 'fontSize', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>
        
        {/* 语言 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            语言
          </label>
          <select
            value={preferences.language}
            onChange={(e) => handlePreferenceChange(null, 'language', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>
      </div>
    );
  };
  
  // 渲染通知设置
  const renderNotificationSettings = () => {
    if (!preferences) return null;
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">电子邮件通知</h3>
              <p className="text-sm text-gray-500">接收重要更新和通知的电子邮件</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.notifications.email}
                  onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">浏览器通知</h3>
              <p className="text-sm text-gray-500">在浏览器中接收实时通知</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.notifications.browser}
                  onChange={(e) => handlePreferenceChange('notifications', 'browser', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染仪表板设置
  const renderDashboardSettings = () => {
    if (!preferences) return null;
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">显示学习进度</h3>
              <p className="text-sm text-gray-500">在仪表板上显示您的学习进度</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.dashboard.showProgress}
                  onChange={(e) => handlePreferenceChange('dashboard', 'showProgress', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">显示成就</h3>
              <p className="text-sm text-gray-500">在仪表板上显示您获得的成就</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.dashboard.showAchievements}
                  onChange={(e) => handlePreferenceChange('dashboard', 'showAchievements', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">显示最近活动</h3>
              <p className="text-sm text-gray-500">在仪表板上显示您的最近活动</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.dashboard.showRecentActivities}
                  onChange={(e) => handlePreferenceChange('dashboard', 'showRecentActivities', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <PageHeader
        title="设置"
        description="管理您的账户设置和偏好"
      />
      
      <ContentContainer>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin h-8 w-8 text-primary-500" />
          </div>
        ) : error && !preferences ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : preferences ? (
          <div>
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
            
            <div className="flex flex-col md:flex-row">
              {/* 设置选项卡 */}
              <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
                <nav className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('appearance')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'appearance'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    外观
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'notifications'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    通知
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'dashboard'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    仪表板
                  </button>
                </nav>
              </div>
              
              {/* 设置内容 */}
              <div className="md:ml-6 md:flex-1">
                <form onSubmit={handleSubmit}>
                  {activeTab === 'appearance' && renderAppearanceSettings()}
                  {activeTab === 'notifications' && renderNotificationSettings()}
                  {activeTab === 'dashboard' && renderDashboardSettings()}
                  
                  {/* 保存按钮 */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <FiSave className="-ml-1 mr-2 h-4 w-4" />
                          保存设置
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </ContentContainer>
    </MainLayout>
  );
};

export default SettingsPage;
