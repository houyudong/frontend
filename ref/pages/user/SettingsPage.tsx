import React, { useState, useEffect } from 'react';
import { FiSave, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { MainLayout, PageHeader, ContentContainer } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../../services';

// 匹配 src/services/apiService.ts 中定义的 API 返回的偏好设置结构
interface ApiUserPreferences {
  theme: string;
  language: string;
  notifications: boolean; // API 中通知偏好是布尔值
  codeEditorTheme?: string;
  fontSize?: string;
  browserNotifications?: boolean; // 假设浏览器通知可能是一个独立的 API 字段
  showProgress?: boolean; // 仪表板学习进度
  showRecentActivity?: boolean; // 仪表板最近活动
  showUpcomingTasks?: boolean; // 仪表板待办任务
  [key: string]: any; // 允许存在其他未显式定义的字段
}

// 客户端组件内部使用的更详细的偏好设置结构
interface ClientNotifications {
  email: boolean;
  browser: boolean;
}

interface ClientDashboard {
  showLearningProgress: boolean;
  showRecentActivity: boolean;
  showUpcomingTasks: boolean;
}

interface ClientUserPreferences {
  theme: 'light' | 'dark';
  codeEditorTheme: string;
  fontSize: 'small' | 'medium' | 'large';
  language: 'zh-CN' | 'en-US';
  notifications: ClientNotifications;
  dashboard: ClientDashboard;
}

/**
 * SettingsPage - 用户设置页面
 *
 * 用户个性化设置和偏好管理
 *
 * @component
 */
const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ClientUserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('appearance');

  // 加载用户偏好设置
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;

      setIsLoading(true);
      setError('');

      try {
        const apiPreferences: ApiUserPreferences = await getUserPreferences(user.id);

        // 将 API 返回的偏好设置转换为客户端使用的结构
        const clientPreferences: ClientUserPreferences = {
          theme: (apiPreferences.theme as 'light' | 'dark') || 'light',
          codeEditorTheme: apiPreferences.codeEditorTheme || 'vs',
          fontSize: (apiPreferences.fontSize as 'small' | 'medium' | 'large') || 'medium',
          language: (apiPreferences.language as 'zh-CN' | 'en-US') || 'zh-CN',
          notifications: {
            email: apiPreferences.notifications || false,
            browser: apiPreferences.browserNotifications || false,
          },
          dashboard: {
            showLearningProgress: apiPreferences.showProgress || false,
            showRecentActivity: apiPreferences.showRecentActivity || false,
            showUpcomingTasks: apiPreferences.showUpcomingTasks || false,
          },
        };
        setPreferences(clientPreferences);
      } catch (err: any) {
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
    category: keyof ClientUserPreferences | null,
    key: string,
    value: any
  ): void => {
    if (!preferences) return;

    setPreferences(prevPreferences => {
      if (!prevPreferences) return null; // 理论上不会发生

      if (category === 'notifications') {
        return {
          ...prevPreferences,
          notifications: {
            ...prevPreferences.notifications,
            [key]: value,
          },
        };
      } else if (category === 'dashboard') {
        return {
          ...prevPreferences,
          dashboard: {
            ...prevPreferences.dashboard,
            [key]: value,
          },
        };
      } else {
        // 处理顶级偏好设置
        return {
          ...prevPreferences,
          [key]: value,
        } as ClientUserPreferences;
      }
    });
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!user || !preferences) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // 将客户端偏好设置转换为 API 期望的结构
      const apiPreferencesToUpdate: Partial<ApiUserPreferences> = {
        theme: preferences.theme,
        language: preferences.language,
        notifications: preferences.notifications.email, // 将客户端的 email 通知作为 API 的主通知布尔值
        codeEditorTheme: preferences.codeEditorTheme,
        fontSize: preferences.fontSize,
        browserNotifications: preferences.notifications.browser, // 传递浏览器通知作为单独的 API 字段
        showProgress: preferences.dashboard.showLearningProgress,
        showRecentActivity: preferences.dashboard.showRecentActivity,
        showUpcomingTasks: preferences.dashboard.showUpcomingTasks,
      };

      await updateUserPreferences(user.id, apiPreferencesToUpdate);
      setSuccess('设置已保存');
    } catch (err: any) {
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePreferenceChange(null, 'codeEditorTheme', e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePreferenceChange(null, 'fontSize', e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePreferenceChange(null, 'language', e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('notifications', 'email', e.target.checked)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('notifications', 'browser', e.target.checked)}
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
                  checked={preferences.dashboard.showLearningProgress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('dashboard', 'showLearningProgress', e.target.checked)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('dashboard', 'showRecentActivity', e.target.checked)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('dashboard', 'showUpcomingTasks', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
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
        title="设置"
        description="管理您的账户和偏好设置"
        actions={null}
      />

      <ContentContainer className="max-w-4xl mx-auto">
        {success && (
          <div className="mb-6 bg-green-50 p-4 rounded-md text-green-700 flex items-center">
            <FiCheck className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-md text-red-700 flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <FiLoader className="animate-spin text-primary-500 text-3xl" />
            <span className="ml-3 text-gray-600">加载设置...</span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            {/* 侧边导航 */}
            <nav className="flex-shrink-0 w-full md:w-48">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'appearance'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  外观
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'notifications'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  通知
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'dashboard'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  仪表板
                </button>
                {/* 可以添加更多设置选项 */}
              </div>
            </nav>

            {/* 设置内容 */}
            <div className="flex-1 bg-white shadow overflow-hidden rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderContent()}
                <div className="mt-8 pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
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
                          保存设置
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </ContentContainer>
    </MainLayout>
  );
};

export default SettingsPage;