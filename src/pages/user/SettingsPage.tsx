import React, { useState, useEffect } from 'react';
import { FiSave, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { MainLayout, PageHeader, ContentContainer } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../../services';

// API 服务中的 UserPreferences 接口
interface ApiUserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  codeEditorTheme?: string;
  fontSize?: string;
  browserNotifications?: boolean;
  showProgress?: boolean;
  showRecentActivity?: boolean;
  showUpcomingTasks?: boolean;
  [key: string]: any;
}

// 组件中使用的扩展 UserPreferences 接口
interface UserPreferences {
  theme: string;
  language: string;
  codeEditorTheme: 'vs' | 'vs-dark' | 'hc-black';
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    email: boolean;
    browser: boolean;
  };
  dashboard: {
    showProgress: boolean;
    showRecentActivity: boolean;
    showUpcomingTasks: boolean;
  };
}

type TabType = 'appearance' | 'notifications' | 'dashboard';
type PreferenceCategory = 'notifications' | 'dashboard';

/**
 * SettingsPage - 用户设置页面
 * 
 * 用户个性化设置和偏好管理
 * 
 * @component
 */
const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  
  // 加载用户偏好设置
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const preferencesData = await getUserPreferences(user.id);
        // 将 API 返回的数据转换为组件需要的格式
        const formattedPreferences: UserPreferences = {
          ...preferencesData,
          codeEditorTheme: preferencesData.codeEditorTheme || 'vs',
          fontSize: preferencesData.fontSize || 'medium',
          notifications: {
            email: preferencesData.notifications || false,
            browser: preferencesData.browserNotifications || false
          },
          dashboard: {
            showProgress: preferencesData.showProgress || false,
            showRecentActivity: preferencesData.showRecentActivity || false,
            showUpcomingTasks: preferencesData.showUpcomingTasks || false
          }
        };
        setPreferences(formattedPreferences);
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
  const handlePreferenceChange = (
    category: PreferenceCategory | null,
    key: string,
    value: any
  ): void => {
    if (!preferences) return;
    
    if (category) {
      const categoryValue = preferences[category];
      if (typeof categoryValue === 'object' && categoryValue !== null) {
        setPreferences({
          ...preferences,
          [category]: {
            ...categoryValue,
            [key]: value
          }
        });
      }
    } else {
      setPreferences({
        ...preferences,
        [key]: value
      });
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!user || !preferences) return;
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // 将组件中的偏好设置转换为 API 需要的格式
      const apiPreferences: ApiUserPreferences = {
        theme: preferences.theme,
        language: preferences.language,
        notifications: preferences.notifications.email,
        codeEditorTheme: preferences.codeEditorTheme,
        fontSize: preferences.fontSize,
        browserNotifications: preferences.notifications.browser,
        showProgress: preferences.dashboard.showProgress,
        showRecentActivity: preferences.dashboard.showRecentActivity,
        showUpcomingTasks: preferences.dashboard.showUpcomingTasks
      };
      
      const result = await updateUserPreferences(user.id, apiPreferences);
      
      if (result.success) {
        setSuccess('设置已保存');
      } else {
        setError(result.message || '保存设置失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存设置时发生错误');
    } finally {
      setIsSaving(false);
    }
  };
  
  // 渲染外观设置
  const renderAppearanceSettings = (): React.ReactNode => {
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
  const renderNotificationSettings = (): React.ReactNode => {
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
  const renderDashboardSettings = (): React.ReactNode => {
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
              <h3 className="text-sm font-medium text-gray-700">显示最近活动</h3>
              <p className="text-sm text-gray-500">在仪表板上显示您的最近活动</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.dashboard.showRecentActivity}
                  onChange={(e) => handlePreferenceChange('dashboard', 'showRecentActivity', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">显示待办任务</h3>
              <p className="text-sm text-gray-500">在仪表板上显示您的待办任务</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.dashboard.showUpcomingTasks}
                  onChange={(e) => handlePreferenceChange('dashboard', 'showUpcomingTasks', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染当前选中的设置面板
  const renderActiveTab = (): React.ReactNode => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'dashboard':
        return renderDashboardSettings();
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <PageHeader
        title="用户设置"
        description="管理您的个人偏好和设置"
        actions={null}
      />
      
      <ContentContainer>
        <div className="bg-white shadow rounded-lg">
          {/* 设置选项卡 */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                type="button"
                onClick={() => setActiveTab('appearance')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'appearance'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                外观
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'notifications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                通知
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                仪表板
              </button>
            </nav>
          </div>
          
          {/* 设置内容 */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <FiLoader className="animate-spin h-8 w-8 text-primary-500" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {renderActiveTab()}
                
                {/* 错误提示 */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 成功提示 */}
                {success && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiCheck className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{success}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 保存按钮 */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <FiSave className="-ml-1 mr-2 h-5 w-5" />
                        保存设置
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </ContentContainer>
    </MainLayout>
  );
};

export default SettingsPage; 